export type ContentRuntimeEnvironment = "development" | "test" | "preview" | "production";

export type ContentPersistenceDriver = "local" | "database";

export type ContentMutationDisabledReason =
  | "MUTATIONS_DISABLED_BY_FLAG"
  | "LOCAL_DRIVER_NOT_DURABLE"
  | "PRODUCTION_CONFIRMATION_REQUIRED";

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
  const database = driver === "database" ? parseDatabaseConfig(env) : null;
  const config = {
    environment,
    driver,
    mutationsEnabled,
    productionMutationsConfirmed,
    database
  };
  return { ...config, mutationPolicy: resolveContentMutationPolicy(config) };
}
