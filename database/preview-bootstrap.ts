import { isDeepStrictEqual } from "util";
import path from "path";

import type {
  DatabaseRepositoryClient,
  DatabaseRepositoryPool
} from "./database-content-workflow-repository";
import type { ContentRuntimeEnvironment } from "../lib/content-persistence-config";
import type { SiteContent } from "../types/content";

type NodeModuleResolver = (
  request: string,
  parent: NodeModule | undefined,
  isMain: boolean,
  options?: unknown
) => string;

type ModuleInternals = typeof import("module") & {
  _resolveFilename: NodeModuleResolver;
  __officeNextAliasResolverInstalled?: boolean;
};

const moduleInternals = require("module") as ModuleInternals;
if (!moduleInternals.__officeNextAliasResolverInstalled) {
  const originalResolveFilename = moduleInternals._resolveFilename;
  moduleInternals._resolveFilename = function resolveOfficeNextAlias(
    request,
    parent,
    isMain,
    options
  ) {
    const resolvedRequest = request.startsWith("@/")
      ? path.resolve(process.cwd(), request.slice(2))
      : request;
    return originalResolveFilename.call(this, resolvedRequest, parent, isMain, options);
  };
  moduleInternals.__officeNextAliasResolverInstalled = true;
}

const { DatabaseContentWorkflowRepository } = require("./database-content-workflow-repository") as typeof import("./database-content-workflow-repository");
const { createEnvelopeFromLegacy } = require("../lib/content-envelope") as typeof import("../lib/content-envelope");
const { contentScopes, isContentScope } = require("../lib/content-scopes") as typeof import("../lib/content-scopes");

export const OFFICE_NEXT_FORMAL_CONTENT_SHA256 =
  "2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939";

export type ContentBootstrapEnvironment = Extract<
  ContentRuntimeEnvironment,
  "test" | "preview"
>;

export type ContentBootstrapClient = DatabaseRepositoryClient;

export type ContentBootstrapPool = DatabaseRepositoryPool;

export type ContentSiteBootstrapInput = {
  pool: ContentBootstrapPool;
  siteKey: string;
  environment: ContentRuntimeEnvironment;
  content: SiteContent;
  sourceSha256: string;
  expectedSourceSha256: string;
  timestamp?: Date;
};

export type ContentSiteVerifyInput = {
  pool: ContentBootstrapPool;
  siteKey: string;
  environment: ContentRuntimeEnvironment;
  content: SiteContent;
};

export type ContentBootstrapInputErrorCode =
  | "INVALID_BOOTSTRAP_POOL"
  | "INVALID_BOOTSTRAP_SITE_KEY"
  | "INVALID_BOOTSTRAP_ENVIRONMENT"
  | "INVALID_SOURCE_SHA256"
  | "SOURCE_SHA256_MISMATCH"
  | "INVALID_BOOTSTRAP_CONTENT"
  | "INVALID_BOOTSTRAP_TIMESTAMP";

export class ContentBootstrapInputError extends Error {
  readonly code: ContentBootstrapInputErrorCode;

  constructor(code: ContentBootstrapInputErrorCode) {
    super(code);
    this.name = "ContentBootstrapInputError";
    this.code = code;
  }
}

export type ContentBootstrapConflictCategory =
  | "ORPHANED_STATE"
  | "SCHEMA_VERSION"
  | "PUBLISHED_REVISION"
  | "PUBLISHED_CONTENT"
  | "PUBLISHED_TIMESTAMP"
  | "SCOPE_SET"
  | "SCOPE_REVISION"
  | "SCOPE_TIMESTAMP"
  | "EXISTING_DRAFT";

export class ContentBootstrapConflictError extends Error {
  readonly code = "CONTENT_BOOTSTRAP_CONFLICT" as const;
  readonly environment: ContentBootstrapEnvironment;
  readonly category: ContentBootstrapConflictCategory;

  constructor(
    environment: ContentBootstrapEnvironment,
    category: ContentBootstrapConflictCategory
  ) {
    super(`CONTENT_BOOTSTRAP_CONFLICT: ${category}`);
    this.name = "ContentBootstrapConflictError";
    this.environment = environment;
    this.category = category;
  }
}

export class ContentBootstrapDatabaseError extends Error {
  readonly code = "CONTENT_BOOTSTRAP_DATABASE_ERROR" as const;

  constructor() {
    super("Content bootstrap database operation failed");
    this.name = "ContentBootstrapDatabaseError";
  }
}

type SiteRow = {
  schema_version: number;
  published_content: unknown;
  published_revision: number;
  published_updated_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
};

type ScopeRow = {
  scope: string;
  published_revision: number;
  published_updated_at: Date | string;
};

type DatabaseState = {
  site: SiteRow | undefined;
  scopes: ScopeRow[];
  draftCount: number;
};

type ValidatedCommonInput = {
  pool: ContentBootstrapPool;
  siteKey: string;
  environment: ContentBootstrapEnvironment;
  content: SiteContent;
};

function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function validatePool(pool: ContentBootstrapPool): void {
  if (!pool || typeof pool.connect !== "function") {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_POOL");
  }
}

function validateEnvironment(
  environment: ContentRuntimeEnvironment
): ContentBootstrapEnvironment {
  if (environment !== "test" && environment !== "preview") {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_ENVIRONMENT");
  }
  return environment;
}

function normalizeContent(content: SiteContent): SiteContent {
  if (
    typeof content !== "object"
    || content === null
    || Array.isArray(content)
    || hasOwn(content, "schemaVersion")
    || hasOwn(content, "published")
    || hasOwn(content, "drafts")
  ) {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_CONTENT");
  }
  try {
    return createEnvelopeFromLegacy(content).published.content;
  } catch {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_CONTENT");
  }
}

function validateCommonInput(input: ContentSiteVerifyInput): ValidatedCommonInput {
  validatePool(input.pool);
  if (
    typeof input.siteKey !== "string"
    || input.siteKey.trim().length === 0
    || input.siteKey.length > 128
  ) {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_SITE_KEY");
  }
  return {
    pool: input.pool,
    siteKey: input.siteKey,
    environment: validateEnvironment(input.environment),
    content: normalizeContent(input.content)
  };
}

function validateBootstrapInput(input: ContentSiteBootstrapInput): ValidatedCommonInput & {
  timestamp: Date;
} {
  const common = validateCommonInput(input);
  if (!/^[a-f0-9]{64}$/.test(input.sourceSha256)) {
    throw new ContentBootstrapInputError("INVALID_SOURCE_SHA256");
  }
  if (!/^[a-f0-9]{64}$/.test(input.expectedSourceSha256)) {
    throw new ContentBootstrapInputError("INVALID_SOURCE_SHA256");
  }
  if (input.sourceSha256 !== input.expectedSourceSha256) {
    throw new ContentBootstrapInputError("SOURCE_SHA256_MISMATCH");
  }
  const timestamp = input.timestamp ?? new Date();
  if (!(timestamp instanceof Date) || Number.isNaN(timestamp.getTime())) {
    throw new ContentBootstrapInputError("INVALID_BOOTSTRAP_TIMESTAMP");
  }
  return { ...common, timestamp };
}

function validTimestamp(value: Date | string): boolean {
  const timestamp = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(timestamp.getTime());
}

async function readState(
  client: ContentBootstrapClient,
  siteKey: string,
  environment: ContentBootstrapEnvironment
): Promise<DatabaseState> {
  const siteResult = await client.query<SiteRow>(
    `SELECT schema_version, published_content, published_revision,
            published_updated_at, created_at, updated_at
     FROM office_next_content.sites
     WHERE site_key = $1 AND environment = $2`,
    [siteKey, environment]
  );
  const scopeResult = await client.query<ScopeRow>(
    `SELECT scope, published_revision, published_updated_at
     FROM office_next_content.scope_versions
     WHERE site_key = $1 AND environment = $2
     ORDER BY scope`,
    [siteKey, environment]
  );
  const draftResult = await client.query<{ count: string }>(
    `SELECT count(*)::text AS count
     FROM office_next_content.drafts
     WHERE site_key = $1 AND environment = $2`,
    [siteKey, environment]
  );
  const draftCount = Number.parseInt(draftResult.rows[0]?.count ?? "0", 10);
  if (!Number.isSafeInteger(draftCount) || draftCount < 0) {
    throw new ContentBootstrapDatabaseError();
  }
  return {
    site: siteResult.rows[0],
    scopes: scopeResult.rows,
    draftCount
  };
}

function conflict(
  environment: ContentBootstrapEnvironment,
  category: ContentBootstrapConflictCategory
): never {
  throw new ContentBootstrapConflictError(environment, category);
}

function assertExistingState(
  state: DatabaseState,
  expectedContent: SiteContent,
  environment: ContentBootstrapEnvironment
): void {
  const site = state.site;
  if (!site) conflict(environment, "ORPHANED_STATE");
  if (site.schema_version !== 1) conflict(environment, "SCHEMA_VERSION");
  if (site.published_revision !== 1) conflict(environment, "PUBLISHED_REVISION");
  if (!validTimestamp(site.published_updated_at)) conflict(environment, "PUBLISHED_TIMESTAMP");

  let normalizedStored: SiteContent;
  try {
    normalizedStored = normalizeContent(site.published_content as SiteContent);
  } catch {
    conflict(environment, "PUBLISHED_CONTENT");
  }
  if (
    !isDeepStrictEqual(site.published_content, normalizedStored)
    || !isDeepStrictEqual(normalizedStored, expectedContent)
  ) {
    conflict(environment, "PUBLISHED_CONTENT");
  }

  if (state.scopes.length !== contentScopes.length) conflict(environment, "SCOPE_SET");
  const seen = new Set<string>();
  for (const row of state.scopes) {
    if (!isContentScope(row.scope) || seen.has(row.scope)) conflict(environment, "SCOPE_SET");
    seen.add(row.scope);
    if (row.published_revision !== 1) conflict(environment, "SCOPE_REVISION");
    if (!validTimestamp(row.published_updated_at)) conflict(environment, "SCOPE_TIMESTAMP");
  }
  if (contentScopes.some((scope) => !seen.has(scope))) conflict(environment, "SCOPE_SET");
  if (state.draftCount !== 0) conflict(environment, "EXISTING_DRAFT");
}

function knownError(error: unknown): boolean {
  return error instanceof ContentBootstrapInputError
    || error instanceof ContentBootstrapConflictError
    || error instanceof ContentBootstrapDatabaseError;
}

async function rollback(client: ContentBootstrapClient): Promise<void> {
  try {
    await client.query("ROLLBACK");
  } catch {
    // Releasing the client still prevents a transaction or lock leak.
  }
}

export async function bootstrapContentSite(
  input: ContentSiteBootstrapInput
): Promise<{ status: "created" | "unchanged" }> {
  const validated = validateBootstrapInput(input);
  let client: ContentBootstrapClient;
  try {
    client = await validated.pool.connect();
  } catch {
    throw new ContentBootstrapDatabaseError();
  }

  let began = false;
  try {
    await client.query("BEGIN");
    began = true;
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
      [JSON.stringify([
        "office-next-content-bootstrap-v1",
        validated.siteKey,
        validated.environment
      ])]
    );
    const state = await readState(client, validated.siteKey, validated.environment);

    if (state.site) {
      assertExistingState(state, validated.content, validated.environment);
      await client.query("COMMIT");
      began = false;
      return { status: "unchanged" };
    }
    if (state.scopes.length !== 0 || state.draftCount !== 0) {
      conflict(validated.environment, "ORPHANED_STATE");
    }

    await client.query(
      `INSERT INTO office_next_content.sites
        (site_key, environment, schema_version, published_content,
         published_revision, published_updated_at, created_at, updated_at)
       VALUES ($1, $2, 1, $3::jsonb, 1, $4, $4, $4)`,
      [
        validated.siteKey,
        validated.environment,
        JSON.stringify(validated.content),
        validated.timestamp
      ]
    );
    for (const scope of contentScopes) {
      await client.query(
        `INSERT INTO office_next_content.scope_versions
          (site_key, environment, scope, published_revision, published_updated_at)
         VALUES ($1, $2, $3, 1, $4)`,
        [validated.siteKey, validated.environment, scope, validated.timestamp]
      );
    }
    await client.query("COMMIT");
    began = false;
    return { status: "created" };
  } catch (error: unknown) {
    if (began) await rollback(client);
    if (knownError(error)) throw error;
    throw new ContentBootstrapDatabaseError();
  } finally {
    client.release();
  }
}

export async function verifyBootstrappedContentSite(
  input: ContentSiteVerifyInput
): Promise<{ status: "verified" }> {
  const validated = validateCommonInput(input);
  let client: ContentBootstrapClient;
  try {
    client = await validated.pool.connect();
  } catch {
    throw new ContentBootstrapDatabaseError();
  }
  try {
    const state = await readState(client, validated.siteKey, validated.environment);
    assertExistingState(state, validated.content, validated.environment);
  } catch (error: unknown) {
    if (knownError(error)) throw error;
    throw new ContentBootstrapDatabaseError();
  } finally {
    client.release();
  }

  try {
    const repository = new DatabaseContentWorkflowRepository({
      pool: validated.pool,
      siteKey: validated.siteKey,
      environment: validated.environment
    });
    const published = await repository.readPublished();
    if (
      published.revision !== 1
      || !isDeepStrictEqual(published.content, validated.content)
      || contentScopes.some((scope) => published.scopeRevisions[scope] !== 1)
    ) {
      conflict(validated.environment, "PUBLISHED_CONTENT");
    }
    if (await repository.hasDrafts()) conflict(validated.environment, "EXISTING_DRAFT");
    return { status: "verified" };
  } catch (error: unknown) {
    if (knownError(error)) throw error;
    throw new ContentBootstrapDatabaseError();
  }
}
