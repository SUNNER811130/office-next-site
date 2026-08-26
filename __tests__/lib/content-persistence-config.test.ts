import {
  ContentPersistenceConfigurationError,
  resolveContentPersistenceConfig,
  resolveScopedContentMutationPolicy,
  type ContentMutationOperation
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

function previewPolicy(
  operation: ContentMutationOperation,
  scope: "home" | "contact" = "home",
  overrides: Record<string, string | undefined> = {}
) {
  const config = resolve({
    ...databaseEnv,
    CONTENT_RUNTIME_ENVIRONMENT: "preview",
    CONTENT_MUTATIONS_ENABLED: "true",
    CONTENT_MUTATIONS_ALLOWED_SCOPES: "home",
    ...overrides
  });
  return { config, policy: resolveScopedContentMutationPolicy(config, operation, scope) };
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

  it("keeps all scoped operations off when only the master flag is true", () => {
    const config = resolve({
      ...databaseEnv,
      CONTENT_RUNTIME_ENVIRONMENT: "preview",
      CONTENT_MUTATIONS_ENABLED: "true"
    });
    for (const operation of ["save-draft", "discard-draft", "publish", "reset-draft"] as const) {
      expect(resolveScopedContentMutationPolicy(config, operation, "home").enabled).toBe(false);
    }
  });

  it("denies all operations when the master flag is false", () => {
    const config = resolve({
      ...databaseEnv,
      CONTENT_RUNTIME_ENVIRONMENT: "preview",
      CONTENT_MUTATIONS_ENABLED: "false",
      CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_DISCARD_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_PUBLISH_ENABLED: "true",
      CONTENT_MUTATIONS_RESET_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_ALLOWED_SCOPES: "home"
    });
    for (const operation of ["save-draft", "discard-draft", "publish", "reset-draft"] as const) {
      expect(resolveScopedContentMutationPolicy(config, operation, "home").enabled).toBe(false);
    }
  });

  it("denies an enabled operation when the scope allowlist is empty", () => {
    const { config, policy } = previewPolicy("save-draft", "home", {
      CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_ALLOWED_SCOPES: "   "
    });
    expect(config.scopedMutations).toMatchObject({ valid: true, allowedScopes: [] });
    expect(policy).toEqual({ enabled: false, reason: "MUTATION_SCOPE_NOT_ALLOWED" });
  });

  it("treats missing and empty operation flags as false", () => {
    const missing = previewPolicy("save-draft");
    const empty = previewPolicy("save-draft", "home", {
      CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: ""
    });
    expect(missing.config.scopedMutations.operations["save-draft"]).toBe(false);
    expect(empty.config.scopedMutations).toMatchObject({ valid: true });
    expect(empty.policy.enabled).toBe(false);
  });

  it.each(["TRUE", "1", "yes", " false "]) (
    "fails closed without breaking config resolution for invalid operation boolean %p",
    (value) => {
      const { config, policy } = previewPolicy("save-draft", "home", {
        CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: value
      });
      expect(config.scopedMutations.valid).toBe(false);
      expect(policy).toEqual({ enabled: false, reason: "MUTATION_CONFIGURATION_INVALID" });
    }
  );

  it.each([
    "unknown",
    "Home",
    "home,unknown",
    "home,,contact",
    ",home",
    "home,"
  ])("fails the entire scoped policy for invalid allowlist %p", (value) => {
    const { config, policy } = previewPolicy("save-draft", "home", {
      CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_ALLOWED_SCOPES: value
    });
    expect(config.scopedMutations).toMatchObject({ valid: false, allowedScopes: [] });
    expect(policy.enabled).toBe(false);
  });

  it("trims and deduplicates valid canonical scopes", () => {
    const { config, policy } = previewPolicy("save-draft", "contact", {
      CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_ALLOWED_SCOPES: " home, contact ,home "
    });
    expect(config.scopedMutations).toMatchObject({
      valid: true,
      allowedScopes: ["home", "contact"]
    });
    expect(policy.enabled).toBe(true);
  });

  it("authorizes only the exact operation and exact scope", () => {
    const { config } = previewPolicy("save-draft", "home", {
      CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: "true"
    });
    expect(resolveScopedContentMutationPolicy(config, "save-draft", "home").enabled).toBe(true);
    expect(resolveScopedContentMutationPolicy(config, "discard-draft", "home").enabled).toBe(false);
    expect(resolveScopedContentMutationPolicy(config, "publish", "home").enabled).toBe(false);
    expect(resolveScopedContentMutationPolicy(config, "reset-draft", "home").enabled).toBe(false);
    expect(resolveScopedContentMutationPolicy(config, "save-draft", "contact").enabled).toBe(false);
  });

  it.each([
    ["save-draft", "CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED"],
    ["discard-draft", "CONTENT_MUTATIONS_DISCARD_DRAFT_ENABLED"],
    ["publish", "CONTENT_MUTATIONS_PUBLISH_ENABLED"],
    ["reset-draft", "CONTENT_MUTATIONS_RESET_DRAFT_ENABLED"]
  ] as const)("isolates the %s operation flag", (enabledOperation, variableName) => {
    const { config } = previewPolicy(enabledOperation, "home", { [variableName]: "true" });
    for (const operation of ["save-draft", "discard-draft", "publish", "reset-draft"] as const) {
      expect(resolveScopedContentMutationPolicy(config, operation, "home").enabled)
        .toBe(operation === enabledOperation);
    }
  });

  it("denies every scoped operation for the Local driver", () => {
    const config = resolve({
      CONTENT_RUNTIME_ENVIRONMENT: "test",
      CONTENT_MUTATIONS_ENABLED: "true",
      CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_DISCARD_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_PUBLISH_ENABLED: "true",
      CONTENT_MUTATIONS_RESET_DRAFT_ENABLED: "true",
      CONTENT_MUTATIONS_ALLOWED_SCOPES: "home"
    });
    for (const operation of ["save-draft", "discard-draft", "publish", "reset-draft"] as const) {
      expect(resolveScopedContentMutationPolicy(config, operation, "home"))
        .toEqual({ enabled: false, reason: "LOCAL_DRIVER_NOT_DURABLE" });
    }
  });

  it("allows Preview without Production confirmation and requires it in Production", () => {
    const preview = previewPolicy("publish", "home", {
      CONTENT_MUTATIONS_PUBLISH_ENABLED: "true"
    });
    const productionBase = {
      ...databaseEnv,
      CONTENT_RUNTIME_ENVIRONMENT: "production",
      CONTENT_MUTATIONS_ENABLED: "true",
      CONTENT_MUTATIONS_PUBLISH_ENABLED: "true",
      CONTENT_MUTATIONS_ALLOWED_SCOPES: "home"
    };
    const unconfirmed = resolve(productionBase);
    const confirmed = resolve({
      ...productionBase,
      CONTENT_PRODUCTION_MUTATIONS_CONFIRMED: "true"
    });
    expect(preview.policy.enabled).toBe(true);
    expect(resolveScopedContentMutationPolicy(unconfirmed, "publish", "home"))
      .toEqual({ enabled: false, reason: "PRODUCTION_CONFIRMATION_REQUIRED" });
    expect(resolveScopedContentMutationPolicy(confirmed, "publish", "home").enabled).toBe(true);
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
