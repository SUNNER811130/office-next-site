import path from "path";

import { siteContentSeed } from "@/data/site-content.seed";
import { resolveContentPersistenceConfig } from "@/lib/content-persistence-config";
import { ReadOnlyContentWorkflowRepository } from "@/lib/content-mutation-gate";
import {
  CONTENT_FILE,
  createContentWorkflowRepository,
  createContentWorkflowRepositoryRuntime,
  type ContentWorkflowRepositoryFactoryDependencies
} from "@/lib/content-workflow-repository-factory";
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
  const databaseRepository = localRepository();
  const value: ContentWorkflowRepositoryFactoryDependencies = {
    createLocalRepository: jest.fn(localRepository),
    createDatabasePool: jest.fn(() => pool),
    createDatabaseRepository: jest.fn(() => databaseRepository)
  };
  return { value, pool, databaseRepository };
}

describe("content workflow repository factory", () => {
  it("creates the Local File adapter at the unchanged default path", () => {
    const deps = dependencies();
    const created = createContentWorkflowRepository({ config: config(), dependencies: deps.value });
    expect(created.localRepository).toBeInstanceOf(LocalFileContentWorkflowRepository);
    expect(created.repository).toBe(created.localRepository);
    expect(CONTENT_FILE).toBe(path.join(process.cwd(), "data", "site-content.json"));
    expect(deps.value.createDatabasePool).not.toHaveBeenCalled();
  });

  it("constructs the database adapter with the runtime site and environment without querying", () => {
    const deps = dependencies();
    const created = createContentWorkflowRepository({
      config: databaseConfig({ CONTENT_RUNTIME_ENVIRONMENT: "preview" }),
      dependencies: deps.value
    });
    expect(created.repository).toBe(deps.databaseRepository);
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
    const readPublished = jest.spyOn(created.localRepository!, "readPublished");
    const saveDraft = jest.spyOn(created.localRepository!, "saveDraft");
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
    expect(runtime.getRepository()).toBeInstanceOf(LocalFileContentWorkflowRepository);
    expect(deps.value.createDatabasePool).not.toHaveBeenCalled();
    expect(deps.pool.connect).not.toHaveBeenCalled();
  });

  it("does not expose a database repository as a legacy Local adapter", () => {
    const deps = dependencies();
    const runtime = createContentWorkflowRepositoryRuntime({
      resolveConfig: () => databaseConfig(),
      dependencies: deps.value
    });
    expect(() => runtime.getLocalRepository()).toThrow(
      expect.objectContaining({ code: "INVALID_PERSISTENCE_DRIVER" })
    );
  });

  it("returns a writable repository when the resolved policy is enabled", () => {
    const deps = dependencies();
    const created = createContentWorkflowRepository({ config: config(), dependencies: deps.value });
    expect(created.repository).toBe(created.localRepository as ContentWorkflowRepository);
    expect(created.repository).not.toBeInstanceOf(ReadOnlyContentWorkflowRepository);
  });
});
