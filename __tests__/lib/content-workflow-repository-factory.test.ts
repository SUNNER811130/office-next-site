import path from "path";

import { siteContentSeed } from "@/data/site-content.seed";
import { resolveContentPersistenceConfig } from "@/lib/content-persistence-config";
import {
  authorizeContentMutation,
  ReadOnlyContentWorkflowRepository
} from "@/lib/content-mutation-gate";
import {
  CONTENT_FILE,
  createContentWorkflowRepository,
  createContentWorkflowRepositoryRuntime,
  type ContentWorkflowRepositoryFactoryDependencies
} from "@/lib/content-workflow-repository-factory";
import * as contentWorkflowRepositoryFactory from "@/lib/content-workflow-repository-factory";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import type { ContentWorkflowRepository } from "@/types/content-workflow";

function localRepository() {
  return new LocalFileContentWorkflowRepository({
    persistencePath: path.join("/tmp", "office-next-l8b4-factory.json"),
    seed: siteContentSeed
  });
}

function config(overrides: Record<string, string | undefined> = {}) {
  return resolveContentPersistenceConfig({
    NODE_ENV: "test",
    ...overrides
  });
}

function databaseConfig(overrides: Record<string, string | undefined> = {}) {
  return config({
    CONTENT_PERSISTENCE_DRIVER: "database",
    CONTENT_DATABASE_RUNTIME_URL: "postgresql://runtime_user:fake_password@localhost:5432/office_next",
    CONTENT_SITE_KEY: "office-next",
    CONTENT_MUTATIONS_ENABLED: "true",
    ...overrides
  });
}

function dependencies() {
  const pool = {
    connect: jest.fn(),
    end: jest.fn()
  };
  const localAdapter = localRepository();
  const databaseRepository = localRepository();
  const value: ContentWorkflowRepositoryFactoryDependencies = {
    createLocalRepository: jest.fn(() => localAdapter),
    createDatabasePool: jest.fn(() => pool),
    createDatabaseRepository: jest.fn(() => databaseRepository)
  };
  return { value, pool, localAdapter, databaseRepository };
}

describe("content workflow repository factory", () => {
  it("creates the Local File adapter at the unchanged default path", () => {
    const deps = dependencies();
    const created = createContentWorkflowRepository({ config: config(), dependencies: deps.value });
    expect("localRepository" in created).toBe(false);
    expect("pool" in created).toBe(false);
    expect(created.repository).toBeInstanceOf(ReadOnlyContentWorkflowRepository);
    expect(CONTENT_FILE).toBe(path.join(process.cwd(), "data", "site-content.json"));
    expect(deps.value.createLocalRepository).toHaveBeenCalledTimes(1);
    expect(deps.value.createDatabasePool).not.toHaveBeenCalled();
  });

  it("constructs the database adapter with the runtime site and environment without querying", () => {
    const deps = dependencies();
    const created = createContentWorkflowRepository({
      config: databaseConfig({ CONTENT_RUNTIME_ENVIRONMENT: "preview" }),
      dependencies: deps.value
    });
    expect(created.repository).toBeInstanceOf(ReadOnlyContentWorkflowRepository);
    expect(deps.value.createDatabaseRepository).toHaveBeenCalledWith({
      pool: deps.pool,
      siteKey: "office-next",
      environment: "preview"
    });
    expect(deps.pool.connect).not.toHaveBeenCalled();
    expect(deps.pool.end).not.toHaveBeenCalled();
  });

  it("wraps a disabled repository and delegates reads but not mutations", async () => {
    const deps = dependencies();
    const created = createContentWorkflowRepository({
      config: config({ CONTENT_RUNTIME_ENVIRONMENT: "preview" }),
      dependencies: deps.value
    });
    expect(created.repository).toBeInstanceOf(ReadOnlyContentWorkflowRepository);
    const readPublished = jest.spyOn(deps.localAdapter, "readPublished");
    const saveDraft = jest.spyOn(deps.localAdapter, "saveDraft");
    await created.repository.readPublished();
    await expect(created.repository.saveDraft({
      scope: "home",
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toMatchObject({ code: "CONTENT_MUTATIONS_DISABLED" });
    expect(readPublished).toHaveBeenCalledTimes(1);
    expect(saveDraft).not.toHaveBeenCalled();
  });

  it("fails closed when a database config is incomplete", () => {
    const incomplete = {
      ...config(),
      driver: "database" as const,
      database: null
    };
    expect(() => createContentWorkflowRepository({ config: incomplete })).toThrow(
      expect.objectContaining({ code: "MISSING_DATABASE_RUNTIME_URL" })
    );
  });

  it("fails closed for the database driver in the Edge runtime", () => {
    const previous = process.env.NEXT_RUNTIME;
    process.env.NEXT_RUNTIME = "edge";
    try {
      expect(() => createContentWorkflowRepository({
        config: databaseConfig(),
        dependencies: dependencies().value
      })).toThrow(expect.objectContaining({ code: "DATABASE_DRIVER_REQUIRES_NODE_RUNTIME" }));
    } finally {
      if (previous === undefined) delete process.env.NEXT_RUNTIME;
      else process.env.NEXT_RUNTIME = previous;
    }
  });

  it("reuses one repository and pool for the same runtime config", () => {
    const deps = dependencies();
    const resolved = databaseConfig();
    const runtime = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => resolved,
      dependencies: deps.value
    });
    const first = runtime.getRepository();
    const second = runtime.getRepository();
    expect(second).toBe(first);
    expect(deps.value.createDatabasePool).toHaveBeenCalledTimes(1);
    expect(deps.value.createDatabaseRepository).toHaveBeenCalledTimes(1);
    expect(deps.pool.end).not.toHaveBeenCalled();
  });

  it("keeps separately created test runtimes isolated", () => {
    const firstDependencies = dependencies();
    const secondDependencies = dependencies();
    const resolved = databaseConfig();
    const first = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => resolved,
      dependencies: firstDependencies.value
    });
    const second = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => resolved,
      dependencies: secondDependencies.value
    });
    expect(first.getRepository()).not.toBe(second.getRepository());
    expect(firstDependencies.value.createDatabasePool).toHaveBeenCalledTimes(1);
    expect(secondDependencies.value.createDatabasePool).toHaveBeenCalledTimes(1);
  });

  it("does not create or connect a database pool for a default Local runtime", () => {
    const deps = dependencies();
    const runtime = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => config(),
      dependencies: deps.value
    });
    expect(runtime.getRepository()).toBeInstanceOf(ReadOnlyContentWorkflowRepository);
    expect(deps.value.createDatabasePool).not.toHaveBeenCalled();
    expect(deps.pool.connect).not.toHaveBeenCalled();
  });

  it("keeps generic reads healthy when scoped mutation configuration is invalid", async () => {
    const deps = dependencies();
    const resolved = config({ CONTENT_MUTATIONS_ALLOWED_SCOPES: "home,unknown" });
    const runtime = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => resolved,
      dependencies: deps.value
    });
    expect(resolved.scopedMutations.valid).toBe(false);
    await expect(runtime.getRepository().readPublished()).resolves.toMatchObject({ revision: 1 });
  });

  it("does not expose a raw Local adapter from factory or runtime surfaces", () => {
    const deps = dependencies();
    const runtime = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => config(),
      dependencies: deps.value
    });
    const created = createContentWorkflowRepository({ config: config(), dependencies: deps.value });
    expect("localRepository" in created).toBe(false);
    expect("pool" in created).toBe(false);
    expect("getLocalRepository" in runtime).toBe(false);
    expect("getLocalFileContentWorkflowRepository" in contentWorkflowRepositoryFactory).toBe(false);
  });

  it("never returns an unrestricted writer through the generic repository with master enabled", async () => {
    const deps = dependencies();
    const created = createContentWorkflowRepository({
      config: databaseConfig(),
      dependencies: deps.value
    });
    expect(created.repository).toBeInstanceOf(ReadOnlyContentWorkflowRepository);
    await expect(created.repository.saveDraft({
      scope: "home",
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    })).rejects.toMatchObject({ code: "CONTENT_MUTATIONS_DISABLED" });
  });

  it("creates an exact operation and scope capability only after authorization", async () => {
    const deps = dependencies();
    const resolved = databaseConfig({
      CONTENT_RUNTIME_ENVIRONMENT: "preview",
      CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_ALLOWED_SCOPES: "home"
    });
    const runtime = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => resolved,
      dependencies: deps.value
    });
    const saveDraft = jest.spyOn(deps.databaseRepository, "saveDraft")
      .mockResolvedValue({
        scope: "home",
        data: siteContentSeed.home,
        source: "draft",
        draftRevision: 1,
        publishedRevision: 1,
        draftUpdatedAt: "2026-08-26T00:00:00.000Z",
        publishedUpdatedAt: "2026-08-25T00:00:00.000Z"
      });
    const discardDraft = jest.spyOn(deps.databaseRepository, "discardDraft");
    const authorization = authorizeContentMutation(resolved, "save-draft", "home");
    const capability = runtime.getMutationRepository(authorization);
    await capability.saveDraft({
      scope: "home",
      value: siteContentSeed.home,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    });
    expect(saveDraft).toHaveBeenCalledTimes(1);
    expect(() => capability.discardDraft({
      scope: "home",
      expectedDraftRevision: 1
    })).toThrow(expect.objectContaining({ code: "CONTENT_MUTATIONS_DISABLED" }));
    expect(discardDraft).not.toHaveBeenCalled();
  });

  it("does not construct a mutable repository when policy authorization is denied", () => {
    const deps = dependencies();
    const resolved = databaseConfig({ CONTENT_RUNTIME_ENVIRONMENT: "preview" });
    const runtime = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => resolved,
      dependencies: deps.value
    });
    expect(() => authorizeContentMutation(resolved, "save-draft", "home"))
      .toThrow(expect.objectContaining({ code: "CONTENT_MUTATIONS_DISABLED" }));
    expect(deps.value.createDatabasePool).not.toHaveBeenCalled();
    expect(deps.value.createDatabaseRepository).not.toHaveBeenCalled();
    expect(() => runtime.getRepository()).not.toThrow();
  });
});
