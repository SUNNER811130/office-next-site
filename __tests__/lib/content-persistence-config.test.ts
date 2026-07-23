import {
  ContentPersistenceConfigurationError,
  resolveContentPersistenceConfig
} from "@/lib/content-persistence-config";

const databaseEnv = {
  CONTENT_PERSISTENCE_DRIVER: "database",
  CONTENT_DATABASE_RUNTIME_URL: "postgresql://runtime_user:fake_password@localhost:5432/office_next",
  CONTENT_SITE_KEY: "office-next"
} as const;

function resolve(overrides: Record<string, string | undefined> = {}) {
  return resolveContentPersistenceConfig({
    NODE_ENV: "test",
    ...overrides
  });
}

describe("content persistence runtime configuration", () => {
  it.each([
    ["development", true],
    ["test", true],
    ["preview", false],
    ["production", false]
  ] as const)("defaults %s to Local File with the safe mutation policy", (environment, enabled) => {
    const config = resolve({ CONTENT_RUNTIME_ENVIRONMENT: environment });
    expect(config.driver).toBe("local");
    expect(config.mutationPolicy.enabled).toBe(enabled);
  });

  it("derives the runtime environment from safe metadata in priority order", () => {
    expect(resolveContentPersistenceConfig({ NODE_ENV: "test", VERCEL_ENV: "production" }).environment).toBe("test");
    expect(resolveContentPersistenceConfig({ NODE_ENV: "development", VERCEL_ENV: "preview" }).environment).toBe("development");
    expect(resolveContentPersistenceConfig({ NODE_ENV: "production", VERCEL_ENV: "preview" }).environment).toBe("preview");
    expect(resolveContentPersistenceConfig({ NODE_ENV: "production" }).environment).toBe("production");
  });

  it.each([
    [{ CONTENT_PERSISTENCE_DRIVER: "sqlite" }, "INVALID_PERSISTENCE_DRIVER"],
    [{ CONTENT_RUNTIME_ENVIRONMENT: "staging" }, "INVALID_RUNTIME_ENVIRONMENT"],
    [{ CONTENT_MUTATIONS_ENABLED: "1" }, "INVALID_BOOLEAN_FLAG"],
    [{ CONTENT_MUTATIONS_ENABLED: "TRUE" }, "INVALID_BOOLEAN_FLAG"],
    [{ CONTENT_MUTATIONS_ENABLED: "" }, "INVALID_BOOLEAN_FLAG"],
    [{ CONTENT_PRODUCTION_MUTATIONS_CONFIRMED: "yes" }, "INVALID_BOOLEAN_FLAG"]
  ])("rejects an unknown explicit value without a permissive fallback", (env, code) => {
    expect(() => resolve(env)).toThrow(expect.objectContaining({ code }));
  });

  it("does not silently choose development when runtime metadata is unknown", () => {
    expect(() => resolveContentPersistenceConfig({ NODE_ENV: "staging" })).toThrow(
      expect.objectContaining({ code: "INVALID_RUNTIME_ENVIRONMENT" })
    );
  });

  it.each([
    [{ ...databaseEnv, CONTENT_DATABASE_RUNTIME_URL: undefined }, "MISSING_DATABASE_RUNTIME_URL"],
    [{ ...databaseEnv, CONTENT_DATABASE_RUNTIME_URL: "not-a-url" }, "INVALID_DATABASE_RUNTIME_URL"],
    [{ ...databaseEnv, CONTENT_DATABASE_RUNTIME_URL: "https://localhost/db" }, "INVALID_DATABASE_RUNTIME_URL"],
    [{ ...databaseEnv, CONTENT_SITE_KEY: undefined }, "MISSING_CONTENT_SITE_KEY"],
    [{ ...databaseEnv, CONTENT_SITE_KEY: "   " }, "INVALID_CONTENT_SITE_KEY"],
    [{ ...databaseEnv, CONTENT_SITE_KEY: "x".repeat(129) }, "INVALID_CONTENT_SITE_KEY"]
  ])("fails closed for incomplete database runtime config", (env, code) => {
    expect(() => resolve(env)).toThrow(expect.objectContaining({ code }));
  });

  it("enables Preview database mutations only with an explicit true flag", () => {
    const disabled = resolve({
      ...databaseEnv,
      CONTENT_RUNTIME_ENVIRONMENT: "preview"
    });
    const enabled = resolve({
      ...databaseEnv,
      CONTENT_RUNTIME_ENVIRONMENT: "preview",
      CONTENT_MUTATIONS_ENABLED: "true"
    });
    expect(disabled.mutationPolicy.enabled).toBe(false);
    expect(enabled.mutationPolicy.enabled).toBe(true);
  });

  it("requires both Production mutation flags for the database driver", () => {
    const unconfirmed = resolve({
      ...databaseEnv,
      CONTENT_RUNTIME_ENVIRONMENT: "production",
      CONTENT_MUTATIONS_ENABLED: "true"
    });
    const confirmed = resolve({
      ...databaseEnv,
      CONTENT_RUNTIME_ENVIRONMENT: "production",
      CONTENT_MUTATIONS_ENABLED: "true",
      CONTENT_PRODUCTION_MUTATIONS_CONFIRMED: "true"
    });
    expect(unconfirmed.mutationPolicy).toEqual({
      enabled: false,
      reason: "PRODUCTION_CONFIRMATION_REQUIRED"
    });
    expect(confirmed.mutationPolicy.enabled).toBe(true);
  });

  it.each(["preview", "production"] as const)(
    "keeps the Local File driver read-only in %s even when both flags are true",
    (environment) => {
      const config = resolve({
        CONTENT_RUNTIME_ENVIRONMENT: environment,
        CONTENT_PERSISTENCE_DRIVER: "local",
        CONTENT_MUTATIONS_ENABLED: "true",
        CONTENT_PRODUCTION_MUTATIONS_CONFIRMED: "true"
      });
      expect(config.mutationPolicy).toEqual({
        enabled: false,
        reason: "LOCAL_DRIVER_NOT_DURABLE"
      });
    }
  );

  it("never falls back to the migration URL", () => {
    expect(() => resolve({
      CONTENT_PERSISTENCE_DRIVER: "database",
      CONTENT_DATABASE_MIGRATION_URL: databaseEnv.CONTENT_DATABASE_RUNTIME_URL,
      CONTENT_SITE_KEY: "office-next"
    })).toThrow(expect.objectContaining({ code: "MISSING_DATABASE_RUNTIME_URL" }));
  });

  it("does not include a rejected URL, password, or value in configuration errors", () => {
    const rejected = "https://runtime_user:highly_private@private.example/db";
    let error: unknown;
    try {
      resolve({ ...databaseEnv, CONTENT_DATABASE_RUNTIME_URL: rejected });
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(ContentPersistenceConfigurationError);
    const serialized = JSON.stringify(error) + String(error);
    expect(serialized).not.toContain(rejected);
    expect(serialized).not.toContain("highly_private");
    expect(serialized).not.toContain("private.example");
  });
});
