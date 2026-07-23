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
import { applyContentMutationPolicy } from "@/lib/content-mutation-gate";
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
  localRepository: LocalFileContentWorkflowRepository | null;
  pool: DatabaseRepositoryPool | null;
};

export function createContentWorkflowRepository({
  config,
  dependencies = defaultDependencies
}: CreateContentWorkflowRepositoryOptions): CreatedContentWorkflowRepository {
  if (config.driver === "local") {
    const localRepository = dependencies.createLocalRepository();
    return {
      repository: applyContentMutationPolicy(localRepository, config),
      localRepository,
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
    repository: applyContentMutationPolicy(databaseRepository, config),
    localRepository: null,
    pool
  };
}

type RuntimeRepositoryState = CreatedContentWorkflowRepository & {
  fingerprint: string;
};

function configFingerprint(config: ContentPersistenceConfig): string {
  return JSON.stringify([
    config.environment,
    config.driver,
    config.mutationsEnabled,
    config.productionMutationsConfirmed,
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

  function getState(): RuntimeRepositoryState {
    const config = resolveConfig();
    const fingerprint = configFingerprint(config);
    if (state?.fingerprint === fingerprint) return state;
    state = {
      ...createContentWorkflowRepository({
        config,
        dependencies: options.dependencies
      }),
      fingerprint
    };
    return state;
  }

  return {
    getRepository(): ContentWorkflowRepository {
      return getState().repository;
    },
    getLocalRepository(): LocalFileContentWorkflowRepository {
      const current = getState();
      if (!current.localRepository) {
        throw new ContentPersistenceConfigurationError(
          "INVALID_PERSISTENCE_DRIVER",
          "CONTENT_PERSISTENCE_DRIVER"
        );
      }
      return current.localRepository;
    }
  };
}

const runtime = createContentWorkflowRepositoryRuntime();

export function getContentWorkflowRepository(): ContentWorkflowRepository {
  return runtime.getRepository();
}

export function getLocalFileContentWorkflowRepository(): LocalFileContentWorkflowRepository {
  return runtime.getLocalRepository();
}
