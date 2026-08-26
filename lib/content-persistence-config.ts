import { isContentScope } from "@/lib/content-scopes";
import type { ContentScope } from "@/types/content-workflow";

export type ContentRuntimeEnvironment = "development" | "test" | "preview" | "production";

export type ContentPersistenceDriver = "local" | "database";

export type ContentMutationDisabledReason =
  | "MUTATIONS_DISABLED_BY_FLAG"
  | "LOCAL_DRIVER_NOT_DURABLE"
  | "PRODUCTION_CONFIRMATION_REQUIRED"
  | "MUTATION_RUNTIME_NOT_ALLOWED"
  | "MUTATION_CONFIGURATION_INVALID"
  | "MUTATION_OPERATION_DISABLED"
  | "MUTATION_SCOPE_NOT_ALLOWED"
  | "SCOPED_MUTATION_CAPABILITY_REQUIRED";

export type ContentMutationOperation =
  | "save-draft"
  | "discard-draft"
  | "publish"
  | "reset-draft";

export type ContentScopedMutationConfiguration = {
  valid: boolean;
  operations: Readonly<Record<ContentMutationOperation, boolean>>;
  allowedScopes: readonly ContentScope[];
};

export type ContentMutationPolicy =
  | { enabled: true; reason: null }
  | { enabled: false; reason: ContentMutationDisabledReason };

export type ContentDatabaseRuntimeConfig = {
  connectionString: string;
  siteKey: string;
};

export type ContentPersistenceConfig = {
  environment: ContentRuntimeEnvironment;
  driver: ContentPersistenceDriver;
  mutationsEnabled: boolean;
  productionMutationsConfirmed: boolean;
  scopedMutations: ContentScopedMutationConfiguration;
  mutationPolicy: ContentMutationPolicy;
  database: ContentDatabaseRuntimeConfig | null;
};

export type ContentPersistenceConfigurationErrorCode =
  | "INVALID_PERSISTENCE_DRIVER"
  | "INVALID_RUNTIME_ENVIRONMENT"
  | "INVALID_BOOLEAN_FLAG"
  | "MISSING_DATABASE_RUNTIME_URL"
  | "INVALID_DATABASE_RUNTIME_URL"
  | "MISSING_CONTENT_SITE_KEY"
  | "INVALID_CONTENT_SITE_KEY"
  | "DATABASE_DRIVER_REQUIRES_NODE_RUNTIME";

export class ContentPersistenceConfigurationError extends Error {
  readonly code: ContentPersistenceConfigurationErrorCode;
  readonly variableName: string;

  constructor(code: ContentPersistenceConfigurationErrorCode, variableName: string) {
    super(`${code}: ${variableName}`);
    this.name = "ContentPersistenceConfigurationError";
    this.code = code;
    this.variableName = variableName;
  }
}

type RuntimeEnvironment = Readonly<Record<string, string | undefined>>;

const runtimeEnvironments: ReadonlySet<string> = new Set([
  "development",
  "test",
  "preview",
  "production"
]);

function parseRuntimeEnvironment(env: RuntimeEnvironment): ContentRuntimeEnvironment {
  const explicit = env.CONTENT_RUNTIME_ENVIRONMENT;
  if (explicit !== undefined) {
    if (!runtimeEnvironments.has(explicit)) {
      throw new ContentPersistenceConfigurationError(
        "INVALID_RUNTIME_ENVIRONMENT",
        "CONTENT_RUNTIME_ENVIRONMENT"
      );
    }
    return explicit as ContentRuntimeEnvironment;
  }

  if (env.NODE_ENV === "test") return "test";
  if (env.NODE_ENV === "development") return "development";
  if (env.VERCEL_ENV === "preview") return "preview";
  if (env.VERCEL_ENV === "production") return "production";
  if (env.NODE_ENV === "production") return "production";

  throw new ContentPersistenceConfigurationError(
    "INVALID_RUNTIME_ENVIRONMENT",
    "CONTENT_RUNTIME_ENVIRONMENT"
  );
}

function parseDriver(value: string | undefined): ContentPersistenceDriver {
  if (value === undefined) return "local";
  if (value === "local" || value === "database") return value;
  throw new ContentPersistenceConfigurationError(
    "INVALID_PERSISTENCE_DRIVER",
    "CONTENT_PERSISTENCE_DRIVER"
  );
}

function parseBooleanFlag(
  env: RuntimeEnvironment,
  variableName: "CONTENT_MUTATIONS_ENABLED" | "CONTENT_PRODUCTION_MUTATIONS_CONFIRMED",
  defaultValue: boolean
): boolean {
  const value = env[variableName];
  if (value === undefined) return defaultValue;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new ContentPersistenceConfigurationError("INVALID_BOOLEAN_FLAG", variableName);
}

const operationFlagNames = {
  "save-draft": "CONTENT_MUTATIONS_SAVE_DRAFT_ENABLED",
  "discard-draft": "CONTENT_MUTATIONS_DISCARD_DRAFT_ENABLED",
  publish: "CONTENT_MUTATIONS_PUBLISH_ENABLED",
  "reset-draft": "CONTENT_MUTATIONS_RESET_DRAFT_ENABLED"
} as const satisfies Record<ContentMutationOperation, string>;

function parseOperationFlag(value: string | undefined): { valid: boolean; enabled: boolean } {
  if (value === undefined || value === "") return { valid: true, enabled: false };
  if (value === "true") return { valid: true, enabled: true };
  if (value === "false") return { valid: true, enabled: false };
  return { valid: false, enabled: false };
}

function parseAllowedScopes(value: string | undefined): {
  valid: boolean;
  scopes: readonly ContentScope[];
} {
  if (value === undefined || value.trim() === "") {
    return { valid: true, scopes: [] };
  }

  const tokens = value.split(",").map((token) => token.trim());
  if (tokens.some((token) => token === "" || !isContentScope(token))) {
    return { valid: false, scopes: [] };
  }
  return { valid: true, scopes: [...new Set(tokens as ContentScope[])] };
}

function parseScopedMutationConfiguration(
  env: RuntimeEnvironment
): ContentScopedMutationConfiguration {
  const parsedOperations = Object.entries(operationFlagNames).map(([operation, variableName]) => [
    operation as ContentMutationOperation,
    parseOperationFlag(env[variableName])
  ] as const);
  const allowedScopes = parseAllowedScopes(env.CONTENT_MUTATIONS_ALLOWED_SCOPES);

  return {
    valid: allowedScopes.valid && parsedOperations.every(([, parsed]) => parsed.valid),
    operations: Object.fromEntries(
      parsedOperations.map(([operation, parsed]) => [operation, parsed.enabled])
    ) as Record<ContentMutationOperation, boolean>,
    allowedScopes: allowedScopes.scopes
  };
}

function defaultMutationsEnabled(environment: ContentRuntimeEnvironment): boolean {
  return environment === "development" || environment === "test";
}

function parseDatabaseConfig(env: RuntimeEnvironment): ContentDatabaseRuntimeConfig {
  const connectionString = env.CONTENT_DATABASE_RUNTIME_URL;
  if (connectionString === undefined || connectionString.trim() === "") {
    throw new ContentPersistenceConfigurationError(
      "MISSING_DATABASE_RUNTIME_URL",
      "CONTENT_DATABASE_RUNTIME_URL"
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new ContentPersistenceConfigurationError(
      "INVALID_DATABASE_RUNTIME_URL",
      "CONTENT_DATABASE_RUNTIME_URL"
    );
  }
  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    throw new ContentPersistenceConfigurationError(
      "INVALID_DATABASE_RUNTIME_URL",
      "CONTENT_DATABASE_RUNTIME_URL"
    );
  }

  const rawSiteKey = env.CONTENT_SITE_KEY;
  if (rawSiteKey === undefined) {
    throw new ContentPersistenceConfigurationError(
      "MISSING_CONTENT_SITE_KEY",
      "CONTENT_SITE_KEY"
    );
  }
  const trimmedSiteKey = rawSiteKey.trim();
  if (trimmedSiteKey.length === 0 || rawSiteKey.length > 128) {
    throw new ContentPersistenceConfigurationError(
      "INVALID_CONTENT_SITE_KEY",
      "CONTENT_SITE_KEY"
    );
  }

  return { connectionString, siteKey: rawSiteKey };
}

export function resolveContentMutationPolicy(config: Pick<
  ContentPersistenceConfig,
  "environment" | "driver" | "mutationsEnabled" | "productionMutationsConfirmed"
>): ContentMutationPolicy {
  if (
    (config.environment === "preview" || config.environment === "production")
    && config.driver === "local"
  ) {
    return { enabled: false, reason: "LOCAL_DRIVER_NOT_DURABLE" };
  }
  if (!config.mutationsEnabled) {
    return { enabled: false, reason: "MUTATIONS_DISABLED_BY_FLAG" };
  }
  if (config.environment === "production" && !config.productionMutationsConfirmed) {
    return { enabled: false, reason: "PRODUCTION_CONFIRMATION_REQUIRED" };
  }
  return { enabled: true, reason: null };
}

export function resolveScopedContentMutationPolicy(
  config: ContentPersistenceConfig,
  operation: ContentMutationOperation,
  scope: ContentScope
): ContentMutationPolicy {
  if (config.driver === "local") {
    return { enabled: false, reason: "LOCAL_DRIVER_NOT_DURABLE" };
  }
  if (config.environment !== "preview" && config.environment !== "production") {
    return { enabled: false, reason: "MUTATION_RUNTIME_NOT_ALLOWED" };
  }
  if (!config.mutationPolicy.enabled) return config.mutationPolicy;
  if (!config.scopedMutations.valid) {
    return { enabled: false, reason: "MUTATION_CONFIGURATION_INVALID" };
  }
  if (!config.scopedMutations.operations[operation]) {
    return { enabled: false, reason: "MUTATION_OPERATION_DISABLED" };
  }
  if (!config.scopedMutations.allowedScopes.includes(scope)) {
    return { enabled: false, reason: "MUTATION_SCOPE_NOT_ALLOWED" };
  }
  return { enabled: true, reason: null };
}

export function resolveContentPersistenceConfig(
  env: RuntimeEnvironment = process.env
): ContentPersistenceConfig {
  const environment = parseRuntimeEnvironment(env);
  const driver = parseDriver(env.CONTENT_PERSISTENCE_DRIVER);
  const mutationsEnabled = parseBooleanFlag(
    env,
    "CONTENT_MUTATIONS_ENABLED",
    defaultMutationsEnabled(environment)
  );
  const productionMutationsConfirmed = parseBooleanFlag(
    env,
    "CONTENT_PRODUCTION_MUTATIONS_CONFIRMED",
    false
  );
  const scopedMutations = parseScopedMutationConfiguration(env);
  const database = driver === "database" ? parseDatabaseConfig(env) : null;
  const config = {
    environment,
    driver,
    mutationsEnabled,
    productionMutationsConfirmed,
    scopedMutations,
    database
  };
  return { ...config, mutationPolicy: resolveContentMutationPolicy(config) };
}
