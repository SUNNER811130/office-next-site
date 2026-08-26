import path from "path";

import { Pool } from "pg";

import {
  DatabaseContentWorkflowRepository,
  type DatabaseContentWorkflowRepositoryOptions,
  type DatabaseRepositoryPool
} from "@/database/database-content-workflow-repository";
import { siteContentSeed } from "@/data/site-content.seed";
import {
  ContentPersistenceConfigurationError,
  resolveContentPersistenceConfig,
  type ContentPersistenceConfig
} from "@/lib/content-persistence-config";
import {
  applyContentMutationPolicy,
  createScopedContentMutationRepositoryCapability,
  getAuthorizedContentMutationDetails,
  type AuthorizedContentMutation,
  type ScopedContentMutationRepositoryCapability
} from "@/lib/content-mutation-gate";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import type { ContentWorkflowRepository } from "@/types/content-workflow";

export const CONTENT_FILE = path.join(process.cwd(), "data", "site-content.json");

export type ContentWorkflowRepositoryFactoryDependencies = {
  createLocalRepository: () => LocalFileContentWorkflowRepository;
  createDatabasePool: (connectionString: string) => DatabaseRepositoryPool;
  createDatabaseRepository: (
    options: DatabaseContentWorkflowRepositoryOptions
  ) => ContentWorkflowRepository;
};

const defaultDependencies: ContentWorkflowRepositoryFactoryDependencies = {
  createLocalRepository: () => new LocalFileContentWorkflowRepository({
    persistencePath: CONTENT_FILE,
    seed: siteContentSeed
  }),
  createDatabasePool: (connectionString) => new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000
  }),
  createDatabaseRepository: (options) => new DatabaseContentWorkflowRepository(options)
};

export type CreateContentWorkflowRepositoryOptions = {
  config: ContentPersistenceConfig;
  dependencies?: ContentWorkflowRepositoryFactoryDependencies;
};

export type CreatedContentWorkflowRepository = {
  repository: ContentWorkflowRepository;
};

type CreatedRepositoryAdapters = {
  sourceRepository: ContentWorkflowRepository;
  pool: DatabaseRepositoryPool | null;
};

function createRepositoryAdapters({
  config,
  dependencies = defaultDependencies
}: CreateContentWorkflowRepositoryOptions): CreatedRepositoryAdapters {
  if (config.driver === "local") {
    const localRepository = dependencies.createLocalRepository();
    return {
      sourceRepository: localRepository,
      pool: null
    };
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    throw new ContentPersistenceConfigurationError(
      "DATABASE_DRIVER_REQUIRES_NODE_RUNTIME",
      "NEXT_RUNTIME"
    );
  }
  if (!config.database) {
    throw new ContentPersistenceConfigurationError(
      "MISSING_DATABASE_RUNTIME_URL",
      "CONTENT_DATABASE_RUNTIME_URL"
    );
  }

  const pool = dependencies.createDatabasePool(config.database.connectionString);
  const databaseRepository = dependencies.createDatabaseRepository({
    pool,
    siteKey: config.database.siteKey,
    environment: config.environment
  });
  return {
    sourceRepository: databaseRepository,
    pool
  };
}

export function createContentWorkflowRepository(
  options: CreateContentWorkflowRepositoryOptions
): CreatedContentWorkflowRepository {
  const adapters = createRepositoryAdapters(options);
  return {
    repository: applyContentMutationPolicy(adapters.sourceRepository, options.config)
  };
}

type RuntimeRepositoryState = CreatedContentWorkflowRepository & {
  sourceRepository: ContentWorkflowRepository;
  pool: DatabaseRepositoryPool | null;
  fingerprint: string;
};

function configFingerprint(config: ContentPersistenceConfig): string {
  return JSON.stringify([
    config.environment,
    config.driver,
    config.mutationsEnabled,
    config.productionMutationsConfirmed,
    config.scopedMutations.valid,
    config.scopedMutations.operations,
    config.scopedMutations.allowedScopes,
    config.database?.connectionString ?? null,
    config.database?.siteKey ?? null
  ]);
}

export function createContentWorkflowRepositoryRuntime(options: {
  resolveConfig?: () => ContentPersistenceConfig;
  dependencies?: ContentWorkflowRepositoryFactoryDependencies;
} = {}) {
  const resolveConfig = options.resolveConfig ?? resolveContentPersistenceConfig;
  let state: RuntimeRepositoryState | null = null;

  function getState(config: ContentPersistenceConfig = resolveConfig()): RuntimeRepositoryState {
    const fingerprint = configFingerprint(config);
    if (state?.fingerprint === fingerprint) return state;
    const adapters = createRepositoryAdapters({ config, dependencies: options.dependencies });
    state = {
      repository: applyContentMutationPolicy(adapters.sourceRepository, config),
      sourceRepository: adapters.sourceRepository,
      pool: adapters.pool,
      fingerprint
    };
    return state;
  }

  return {
    getRepository(): ContentWorkflowRepository {
      return getState().repository;
    },
    getMutationRepository(
      authorization: AuthorizedContentMutation
    ): ScopedContentMutationRepositoryCapability {
      const details = getAuthorizedContentMutationDetails(authorization);
      const current = getState(details.config);
      return createScopedContentMutationRepositoryCapability(
        current.sourceRepository,
        authorization
      );
    }
  };
}

const runtime = createContentWorkflowRepositoryRuntime();

export function getContentWorkflowRepository(): ContentWorkflowRepository {
  return runtime.getRepository();
}

export function getContentWorkflowMutationRepository(
  authorization: AuthorizedContentMutation
): ScopedContentMutationRepositoryCapability {
  return runtime.getMutationRepository(authorization);
}
