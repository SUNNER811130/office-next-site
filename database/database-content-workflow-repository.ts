import type { PoolClient } from "pg";

import {
  createEditorSnapshot,
  createPreviewContent,
  parseContentEnvelopeV1
} from "../lib/content-envelope";
import {
  contentScopes,
  getScopeValue,
  mergeScopeValue,
  normalizeScopeValue
} from "../lib/content-scopes";
import {
  ContentDraftNotFoundError,
  ContentRevisionConflictError
} from "../lib/content-workflow-errors";
import type { SiteContent } from "../types/content";
import type {
  ContentDrafts,
  ContentEnvelopeV1,
  ContentScope,
  ContentWorkflowRepository,
  DiscardDraftInput,
  DraftRecord,
  EditorSnapshot,
  PublishDraftInput,
  PublishedSnapshot,
  SaveDraftInput,
  ScopeValue
} from "../types/content-workflow";

export type DatabaseEnvironment = "development" | "test" | "preview" | "production";

export type DatabaseRepositoryClient = Pick<PoolClient, "query" | "release">;

export type DatabaseRepositoryPool = {
  connect(): Promise<DatabaseRepositoryClient>;
};

export type DatabaseContentWorkflowRepositoryOptions = {
  pool: DatabaseRepositoryPool;
  siteKey: string;
  environment: DatabaseEnvironment;
};

type SiteRow = {
  schema_version: number;
  published_content: unknown;
  published_revision: number;
  published_updated_at: Date | string;
};

type ScopeRow = {
  scope: string;
  published_revision: number;
  published_updated_at: Date | string;
};

type DraftRow = {
  value: unknown;
  revision: number;
  based_on_published_revision: number;
  updated_at: Date | string;
};

const environments: ReadonlySet<string> = new Set([
  "development", "test", "preview", "production"
]);

const requiredContentKeys = [
  "siteUrl", "navigation", "brand", "home", "founder", "services", "cases",
  "testimonials", "faq", "contact", "social", "clientLogos", "design", "pageBlocks"
] as const satisfies readonly (keyof SiteContent)[];

export class DatabaseContentPersistenceError extends Error {
  constructor(message = "Database content persistence operation failed") {
    super(message);
    this.name = "DatabaseContentPersistenceError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function timestamp(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new DatabaseContentPersistenceError("Stored content metadata is invalid");
  return date.toISOString();
}

function safeError(error: unknown): Error {
  if (
    error instanceof ContentRevisionConflictError
    || error instanceof ContentDraftNotFoundError
    || error instanceof DatabaseContentPersistenceError
  ) return error;
  return new DatabaseContentPersistenceError();
}

function validateStoredContent(value: unknown): void {
  if (
    !isRecord(value)
    || requiredContentKeys.some((key) => !(key in value) || value[key] === null)
    || typeof value.siteUrl !== "string"
    || !isRecord(value.navigation)
    || !isRecord(value.brand)
    || !isRecord(value.home)
    || !isRecord(value.founder)
    || !isRecord(value.services)
    || !isRecord(value.cases)
    || !isRecord(value.testimonials)
    || !isRecord(value.faq)
    || !isRecord(value.contact)
    || !isRecord(value.social)
    || !Array.isArray(value.clientLogos)
    || !isRecord(value.design)
    || !isRecord(value.pageBlocks)
  ) {
    throw new DatabaseContentPersistenceError("Stored content is invalid");
  }
}

function draftRecord<TScope extends ContentScope>(row: DraftRow): DraftRecord<ScopeValue<TScope>> {
  return {
    value: row.value as ScopeValue<TScope>,
    revision: row.revision,
    basedOnPublishedRevision: row.based_on_published_revision,
    updatedAt: timestamp(row.updated_at)
  };
}

function createEnvelope(
  site: SiteRow,
  scopeRows: readonly ScopeRow[],
  drafts: ContentDrafts = {}
): ContentEnvelopeV1 {
  if (site.schema_version !== 1) {
    throw new DatabaseContentPersistenceError("Stored content schema version is unsupported");
  }
  validateStoredContent(site.published_content);
  if (scopeRows.length !== contentScopes.length) {
    throw new DatabaseContentPersistenceError("Stored content scope metadata is incomplete");
  }
  const rows = new Map<ContentScope, ScopeRow>();
  for (const row of scopeRows) {
    if (!contentScopes.includes(row.scope as ContentScope) || rows.has(row.scope as ContentScope)) {
      throw new DatabaseContentPersistenceError("Stored content scope metadata is invalid");
    }
    rows.set(row.scope as ContentScope, row);
  }
  const scopeRevisions = {} as Record<ContentScope, number>;
  const scopeUpdatedAt = {} as Record<ContentScope, string>;
  for (const scope of contentScopes) {
    const row = rows.get(scope);
    if (!row || !Number.isInteger(row.published_revision) || row.published_revision < 1) {
      throw new DatabaseContentPersistenceError("Stored content scope metadata is invalid");
    }
    scopeRevisions[scope] = row.published_revision;
    scopeUpdatedAt[scope] = timestamp(row.published_updated_at);
  }
  try {
    return parseContentEnvelopeV1({
      schemaVersion: 1,
      published: {
        content: site.published_content,
        revision: site.published_revision,
        updatedAt: timestamp(site.published_updated_at),
        scopeRevisions,
        scopeUpdatedAt
      },
      drafts
    });
  } catch {
    throw new DatabaseContentPersistenceError("Stored content is invalid");
  }
}

export class DatabaseContentWorkflowRepository implements ContentWorkflowRepository {
  private readonly pool: DatabaseRepositoryPool;
  private readonly siteKey: string;
  private readonly environment: DatabaseEnvironment;

  constructor(options: DatabaseContentWorkflowRepositoryOptions) {
    if (!options?.pool || typeof options.pool.connect !== "function") {
      throw new DatabaseContentPersistenceError("Database pool is required");
    }
    if (typeof options.siteKey !== "string" || options.siteKey.trim() === "" || options.siteKey.length > 128) {
      throw new DatabaseContentPersistenceError("Database site key is invalid");
    }
    if (!environments.has(options.environment)) {
      throw new DatabaseContentPersistenceError("Database environment is invalid");
    }
    this.pool = options.pool;
    this.siteKey = options.siteKey;
    this.environment = options.environment;
  }

  private async connect(): Promise<DatabaseRepositoryClient> {
    try {
      return await this.pool.connect();
    } catch {
      throw new DatabaseContentPersistenceError();
    }
  }

  private async readTransaction<TResult>(
    operation: (client: DatabaseRepositoryClient) => Promise<TResult>
  ): Promise<TResult> {
    const client = await this.connect();
    let began = false;
    try {
      await client.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");
      began = true;
      const result = await operation(client);
      await client.query("COMMIT");
      began = false;
      return result;
    } catch (error: unknown) {
      if (began) {
        try { await client.query("ROLLBACK"); } catch { /* release still closes transaction state */ }
      }
      throw safeError(error);
    } finally {
      client.release();
    }
  }

  private async mutation<TResult>(
    operation: (client: DatabaseRepositoryClient) => Promise<TResult>
  ): Promise<TResult> {
    const client = await this.connect();
    let began = false;
    try {
      await client.query("BEGIN");
      began = true;
      const result = await operation(client);
      await client.query("COMMIT");
      began = false;
      return result;
    } catch (error: unknown) {
      if (began) {
        try { await client.query("ROLLBACK"); } catch { /* release still closes transaction state */ }
      }
      throw safeError(error);
    } finally {
      client.release();
    }
  }

  private async selectSite(client: DatabaseRepositoryClient, forUpdate = false): Promise<SiteRow> {
    const result = await client.query<SiteRow>(
      `SELECT schema_version, published_content, published_revision, published_updated_at
       FROM office_next_content.sites
       WHERE site_key = $1 AND environment = $2${forUpdate ? " FOR UPDATE" : ""}`,
      [this.siteKey, this.environment]
    );
    const row = result.rows[0];
    if (!row) throw new DatabaseContentPersistenceError("Content site is unavailable");
    if (row.schema_version !== 1) {
      throw new DatabaseContentPersistenceError("Stored content schema version is unsupported");
    }
    validateStoredContent(row.published_content);
    return row;
  }

  private async selectScopes(client: DatabaseRepositoryClient): Promise<ScopeRow[]> {
    const result = await client.query<ScopeRow>(
      `SELECT scope, published_revision, published_updated_at
       FROM office_next_content.scope_versions
       WHERE site_key = $1 AND environment = $2
       ORDER BY scope`,
      [this.siteKey, this.environment]
    );
    return result.rows;
  }

  private async selectScopeForUpdate(
    client: DatabaseRepositoryClient,
    scope: ContentScope
  ): Promise<ScopeRow> {
    const result = await client.query<ScopeRow>(
      `SELECT scope, published_revision, published_updated_at
       FROM office_next_content.scope_versions
       WHERE site_key = $1 AND environment = $2 AND scope = $3
       FOR UPDATE`,
      [this.siteKey, this.environment, scope]
    );
    const row = result.rows[0];
    if (!row) throw new DatabaseContentPersistenceError("Content scope is unavailable");
    return row;
  }

  private async selectDraftForUpdate(
    client: DatabaseRepositoryClient,
    scope: ContentScope
  ): Promise<DraftRow | undefined> {
    const result = await client.query<DraftRow>(
      `SELECT value, revision, based_on_published_revision, updated_at
       FROM office_next_content.drafts
       WHERE site_key = $1 AND environment = $2 AND scope = $3
       FOR UPDATE`,
      [this.siteKey, this.environment, scope]
    );
    return result.rows[0];
  }

  private conflict(
    scope: ContentScope,
    expectedDraftRevision: number | null,
    expectedPublishedRevision: number | null,
    currentDraftRevision: number | null,
    currentPublishedRevision: number
  ): ContentRevisionConflictError {
    return new ContentRevisionConflictError({
      scope,
      expectedDraftRevision,
      currentDraftRevision,
      expectedPublishedRevision,
      currentPublishedRevision
    });
  }

  async readPublished(): Promise<PublishedSnapshot> {
    return this.readTransaction(async (client) => {
      const envelope = createEnvelope(await this.selectSite(client), await this.selectScopes(client));
      return envelope.published;
    });
  }

  async readEditor<TScope extends ContentScope>(scope: TScope): Promise<EditorSnapshot<TScope>> {
    return this.readTransaction(async (client) => {
      const [site, scopeRows] = await Promise.all([
        this.selectSite(client),
        this.selectScopes(client)
      ]);
      const draftResult = await client.query<DraftRow>(
        `SELECT value, revision, based_on_published_revision, updated_at
         FROM office_next_content.drafts
         WHERE site_key = $1 AND environment = $2 AND scope = $3`,
        [this.siteKey, this.environment, scope]
      );
      const drafts: ContentDrafts = draftResult.rows[0]
        ? { [scope]: draftRecord<TScope>(draftResult.rows[0]) } as ContentDrafts
        : {};
      return createEditorSnapshot(createEnvelope(site, scopeRows, drafts), scope);
    });
  }

  async readPreview(scope: ContentScope): Promise<SiteContent> {
    return this.readTransaction(async (client) => {
      const [site, scopeRows] = await Promise.all([
        this.selectSite(client),
        this.selectScopes(client)
      ]);
      const draftResult = await client.query<DraftRow>(
        `SELECT value, revision, based_on_published_revision, updated_at
         FROM office_next_content.drafts
         WHERE site_key = $1 AND environment = $2 AND scope = $3`,
        [this.siteKey, this.environment, scope]
      );
      const drafts: ContentDrafts = draftResult.rows[0]
        ? { [scope]: draftRecord(draftResult.rows[0]) } as ContentDrafts
        : {};
      return createPreviewContent(createEnvelope(site, scopeRows, drafts), scope);
    });
  }

  async hasDrafts(): Promise<boolean> {
    const client = await this.connect();
    try {
      const result = await client.query<{ site_exists: boolean; has_drafts: boolean }>(
        `SELECT
           EXISTS (
             SELECT 1 FROM office_next_content.sites
             WHERE site_key = $1 AND environment = $2
           ) AS site_exists,
           EXISTS (
             SELECT 1 FROM office_next_content.drafts
             WHERE site_key = $1 AND environment = $2
           ) AS has_drafts`,
        [this.siteKey, this.environment]
      );
      if (!result.rows[0]?.site_exists) {
        throw new DatabaseContentPersistenceError("Content site is unavailable");
      }
      return result.rows[0].has_drafts;
    } catch (error: unknown) {
      throw safeError(error);
    } finally {
      client.release();
    }
  }

  async saveDraft<TScope extends ContentScope>(
    input: SaveDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return this.mutation(async (client) => {
      await this.selectSite(client);
      const scopeRow = await this.selectScopeForUpdate(client, input.scope);
      const current = await this.selectDraftForUpdate(client, input.scope);
      if (
        (current?.revision ?? null) !== input.expectedDraftRevision
        || scopeRow.published_revision !== input.expectedPublishedRevision
        || (current !== undefined
          && current.based_on_published_revision !== scopeRow.published_revision)
      ) {
        throw this.conflict(
          input.scope,
          input.expectedDraftRevision,
          input.expectedPublishedRevision,
          current?.revision ?? null,
          scopeRow.published_revision
        );
      }
      const value = normalizeScopeValue(input.scope, input.value);
      const result = await client.query<DraftRow>(
        `INSERT INTO office_next_content.drafts
           (site_key, environment, scope, value, revision, based_on_published_revision, updated_at)
         VALUES ($1, $2, $3, $4::jsonb, 1, $5, CURRENT_TIMESTAMP)
         ON CONFLICT (site_key, environment, scope) DO UPDATE SET
           value = EXCLUDED.value,
           revision = office_next_content.drafts.revision + 1,
           updated_at = CURRENT_TIMESTAMP
         RETURNING value, revision, based_on_published_revision, updated_at`,
        [this.siteKey, this.environment, input.scope, JSON.stringify(value), scopeRow.published_revision]
      );
      const saved = result.rows[0];
      if (!saved) throw new DatabaseContentPersistenceError();
      return {
        scope: input.scope,
        data: normalizeScopeValue(input.scope, saved.value),
        source: "draft",
        draftRevision: saved.revision,
        publishedRevision: scopeRow.published_revision,
        draftUpdatedAt: timestamp(saved.updated_at),
        publishedUpdatedAt: timestamp(scopeRow.published_updated_at)
      };
    });
  }

  async publishDraft<TScope extends ContentScope>(
    input: PublishDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return this.mutation(async (client) => {
      const site = await this.selectSite(client, true);
      const scopeRow = await this.selectScopeForUpdate(client, input.scope);
      const draft = await this.selectDraftForUpdate(client, input.scope);
      if (!draft) throw new ContentDraftNotFoundError(input.scope);
      if (
        draft.revision !== input.expectedDraftRevision
        || scopeRow.published_revision !== input.expectedPublishedRevision
        || draft.based_on_published_revision !== scopeRow.published_revision
      ) {
        throw this.conflict(
          input.scope,
          input.expectedDraftRevision,
          input.expectedPublishedRevision,
          draft.revision,
          scopeRow.published_revision
        );
      }
      const value = normalizeScopeValue(input.scope, draft.value);
      const nextContent = mergeScopeValue(
        parseContentEnvelopeV1({
          schemaVersion: 1,
          published: {
            content: site.published_content,
            revision: site.published_revision,
            updatedAt: timestamp(site.published_updated_at),
            scopeRevisions: Object.fromEntries(contentScopes.map((scope) => [scope, 1])),
            scopeUpdatedAt: Object.fromEntries(contentScopes.map((scope) => [scope, timestamp(site.published_updated_at)]))
          },
          drafts: {}
        }).published.content,
        input.scope,
        value
      );
      const siteResult = await client.query<{ published_revision: number; published_updated_at: Date | string }>(
        `UPDATE office_next_content.sites
         SET published_content = $3::jsonb,
             published_revision = published_revision + 1,
             published_updated_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE site_key = $1 AND environment = $2
         RETURNING published_revision, published_updated_at`,
        [this.siteKey, this.environment, JSON.stringify(nextContent)]
      );
      const scopeResult = await client.query<ScopeRow>(
        `UPDATE office_next_content.scope_versions
         SET published_revision = published_revision + 1,
             published_updated_at = CURRENT_TIMESTAMP
         WHERE site_key = $1 AND environment = $2 AND scope = $3
         RETURNING scope, published_revision, published_updated_at`,
        [this.siteKey, this.environment, input.scope]
      );
      await client.query(
        `DELETE FROM office_next_content.drafts
         WHERE site_key = $1 AND environment = $2 AND scope = $3`,
        [this.siteKey, this.environment, input.scope]
      );
      const publishedScope = scopeResult.rows[0];
      if (!siteResult.rows[0] || !publishedScope) throw new DatabaseContentPersistenceError();
      return {
        scope: input.scope,
        data: value,
        source: "published",
        draftRevision: null,
        publishedRevision: publishedScope.published_revision,
        draftUpdatedAt: null,
        publishedUpdatedAt: timestamp(publishedScope.published_updated_at)
      };
    });
  }

  async discardDraft<TScope extends ContentScope>(
    input: DiscardDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return this.mutation(async (client) => {
      const site = await this.selectSite(client);
      const scopeRow = await this.selectScopeForUpdate(client, input.scope);
      const draft = await this.selectDraftForUpdate(client, input.scope);
      if (!draft) throw new ContentDraftNotFoundError(input.scope);
      if (draft.revision !== input.expectedDraftRevision) {
        throw this.conflict(
          input.scope,
          input.expectedDraftRevision,
          null,
          draft.revision,
          scopeRow.published_revision
        );
      }
      await client.query(
        `DELETE FROM office_next_content.drafts
         WHERE site_key = $1 AND environment = $2 AND scope = $3`,
        [this.siteKey, this.environment, input.scope]
      );
      const content = createEnvelope(site, await this.selectScopes(client)).published.content;
      return {
        scope: input.scope,
        data: getScopeValue(content, input.scope),
        source: "published",
        draftRevision: null,
        publishedRevision: scopeRow.published_revision,
        draftUpdatedAt: null,
        publishedUpdatedAt: timestamp(scopeRow.published_updated_at)
      };
    });
  }
}
