import type { PoolClient, QueryResult, QueryResultRow } from "pg";

import {
  bootstrapContentSite,
  ContentBootstrapConflictError,
  ContentBootstrapDatabaseError,
  ContentBootstrapInputError,
  verifyBootstrappedContentSite,
  type ContentBootstrapPool
} from "../../database/preview-bootstrap";
import { contentScopes } from "../../lib/content-scopes";
import { siteContentSeed } from "../../data/site-content.seed";
import type { SiteContent } from "../../types/content";

function result<TRow extends QueryResultRow>(rows: TRow[] = []): QueryResult<TRow> {
  return { command: "SELECT", rowCount: rows.length, oid: 0, fields: [], rows };
}

type FakeSite = {
  schema_version: number;
  published_content: unknown;
  published_revision: number;
  published_updated_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
};

type FakeScope = {
  scope: string;
  published_revision: number;
  published_updated_at: Date | string;
};

type FakeState = {
  site?: FakeSite;
  scopes: FakeScope[];
  draftCount: number;
};

function existingState(): FakeState {
  const timestamp = new Date("2026-07-23T00:00:00.000Z");
  return {
    site: {
      schema_version: 1,
      published_content: siteContentSeed,
      published_revision: 1,
      published_updated_at: timestamp,
      created_at: timestamp,
      updated_at: timestamp
    },
    scopes: contentScopes.map((scope) => ({
      scope,
      published_revision: 1,
      published_updated_at: timestamp
    })),
    draftCount: 0
  };
}

function fakeDatabase(initial: FakeState = { scopes: [], draftCount: 0 }) {
  const state = initial;
  const queries: Array<{ sql: string; values: readonly unknown[] | undefined }> = [];
  let released = 0;
  let failScopeInsert = false;

  const queryImplementation = async (sql: string, values?: unknown[]) => {
    queries.push({ sql, values });
    if (failScopeInsert && sql.includes("INSERT INTO office_next_content.scope_versions")) {
      throw new Error("postgresql://operator:private@internal.example/db password=private");
    }
    if (sql.includes("INSERT INTO office_next_content.sites")) {
      const timestamp = values?.[3] as Date;
      state.site = {
        schema_version: 1,
        published_content: JSON.parse(String(values?.[2])) as unknown,
        published_revision: 1,
        published_updated_at: timestamp,
        created_at: timestamp,
        updated_at: timestamp
      };
      return result();
    }
    if (sql.includes("INSERT INTO office_next_content.scope_versions")) {
      state.scopes.push({
        scope: String(values?.[2]),
        published_revision: 1,
        published_updated_at: values?.[3] as Date
      });
      return result();
    }
    if (sql.includes("AS site_exists") && sql.includes("AS has_drafts")) {
      return result([{
        site_exists: state.site !== undefined,
        has_drafts: state.draftCount > 0
      }]);
    }
    if (sql.includes("FROM office_next_content.sites")) {
      return result(state.site ? [state.site] : []);
    }
    if (sql.includes("FROM office_next_content.scope_versions")) {
      return result(state.scopes);
    }
    if (sql.includes("count(*)::text AS count") && sql.includes("drafts")) {
      return result([{ count: String(state.draftCount) }]);
    }
    if (sql.includes("FROM office_next_content.drafts")) return result();
    return result();
  };

  const client = {
    query: jest.fn(queryImplementation) as unknown as PoolClient["query"],
    release: () => { released += 1; }
  };
  const end = jest.fn(async () => undefined);
  const pool: ContentBootstrapPool & { end: () => Promise<void> } = {
    connect: async () => client,
    end
  };
  return {
    state,
    queries,
    client,
    pool,
    end,
    released: () => released,
    failNextScopeInsert: () => { failScopeInsert = true; }
  };
}

const sha = "a".repeat(64);

function bootstrapInput(pool: ContentBootstrapPool) {
  return {
    pool,
    siteKey: "preview-site",
    environment: "test" as const,
    content: siteContentSeed,
    sourceSha256: sha,
    expectedSourceSha256: sha,
    timestamp: new Date("2026-07-23T00:00:00.000Z")
  };
}

describe("preview content bootstrap core", () => {
  test("rejects an invalid pool before any database operation", async () => {
    await expect(bootstrapContentSite({
      ...bootstrapInput(undefined as unknown as ContentBootstrapPool),
      pool: undefined as unknown as ContentBootstrapPool
    })).rejects.toMatchObject({ code: "INVALID_BOOTSTRAP_POOL" });
  });

  test.each(["", "   ", "x".repeat(129)])("rejects invalid site key %#", async (siteKey) => {
    const db = fakeDatabase();
    await expect(bootstrapContentSite({ ...bootstrapInput(db.pool), siteKey })).rejects.toBeInstanceOf(
      ContentBootstrapInputError
    );
    expect(db.client.query).not.toHaveBeenCalled();
  });

  test.each(["development", "production"] as const)("rejects the %s environment", async (environment) => {
    const db = fakeDatabase();
    await expect(bootstrapContentSite({
      ...bootstrapInput(db.pool),
      environment
    })).rejects.toMatchObject({ code: "INVALID_BOOTSTRAP_ENVIRONMENT" });
  });

  test("rejects malformed and mismatched SHA values", async () => {
    const db = fakeDatabase();
    await expect(bootstrapContentSite({
      ...bootstrapInput(db.pool), sourceSha256: "ABC"
    })).rejects.toMatchObject({ code: "INVALID_SOURCE_SHA256" });
    await expect(bootstrapContentSite({
      ...bootstrapInput(db.pool), expectedSourceSha256: "b".repeat(64)
    })).rejects.toMatchObject({ code: "SOURCE_SHA256_MISMATCH" });
  });

  test.each(["schemaVersion", "published", "drafts"])("rejects workflow field %s in source content", async (field) => {
    const db = fakeDatabase();
    const content = { ...siteContentSeed, [field]: {} } as SiteContent;
    await expect(bootstrapContentSite({
      ...bootstrapInput(db.pool), content
    })).rejects.toMatchObject({ code: "INVALID_BOOTSTRAP_CONTENT" });
  });

  test("creates a fresh site and all scopes in one committed transaction", async () => {
    const db = fakeDatabase();
    await expect(bootstrapContentSite(bootstrapInput(db.pool))).resolves.toEqual({ status: "created" });
    expect(db.state.site).toMatchObject({ schema_version: 1, published_revision: 1 });
    expect(db.state.scopes).toHaveLength(14);
    expect(db.state.scopes.every((row) => row.published_revision === 1)).toBe(true);
    expect(db.state.draftCount).toBe(0);
    expect(db.queries[0]?.sql).toBe("BEGIN");
    expect(db.queries.at(-1)?.sql).toBe("COMMIT");
    expect(db.released()).toBe(1);
    expect(db.end).not.toHaveBeenCalled();
  });

  test("rolls back, releases, and sanitizes an unexpected database failure", async () => {
    const db = fakeDatabase();
    db.failNextScopeInsert();
    const error = await bootstrapContentSite(bootstrapInput(db.pool)).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ContentBootstrapDatabaseError);
    expect(String(error)).not.toContain("private");
    expect(String(error)).not.toContain("internal.example");
    expect(db.queries.some(({ sql }) => sql === "ROLLBACK")).toBe(true);
    expect(db.released()).toBe(1);
    expect(db.end).not.toHaveBeenCalled();
  });

  test("returns unchanged for exact existing state without writes", async () => {
    const db = fakeDatabase(existingState());
    await expect(bootstrapContentSite(bootstrapInput(db.pool))).resolves.toEqual({ status: "unchanged" });
    expect(db.queries.some(({ sql }) => /\bINSERT\b|\bUPDATE\b|\bDELETE\b/.test(sql))).toBe(false);
    expect(db.queries.at(-1)?.sql).toBe("COMMIT");
  });

  test("fails closed when existing Published content differs without leaking it", async () => {
    const state = existingState();
    state.site!.published_content = {
      ...siteContentSeed,
      brand: { ...siteContentSeed.brand, name: "PRIVATE_DIFFERENCE" }
    };
    const db = fakeDatabase(state);
    const error = await bootstrapContentSite(bootstrapInput(db.pool)).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ContentBootstrapConflictError);
    expect(error).toMatchObject({ category: "PUBLISHED_CONTENT" });
    expect(String(error)).not.toContain("PRIVATE_DIFFERENCE");
    expect(db.queries.some(({ sql }) => sql === "ROLLBACK")).toBe(true);
  });

  test.each([
    ["global revision", (state: FakeState) => { state.site!.published_revision = 2; }, "PUBLISHED_REVISION"],
    ["schema version", (state: FakeState) => { state.site!.schema_version = 2; }, "SCHEMA_VERSION"],
    ["scope revision", (state: FakeState) => { state.scopes[0].published_revision = 2; }, "SCOPE_REVISION"],
    ["missing scope", (state: FakeState) => { state.scopes.pop(); }, "SCOPE_SET"],
    ["unknown scope", (state: FakeState) => { state.scopes[0].scope = "unknown"; }, "SCOPE_SET"],
    ["existing Draft", (state: FakeState) => { state.draftCount = 1; }, "EXISTING_DRAFT"]
  ] as const)("fails closed on %s conflict", async (_label, mutate, category) => {
    const state = existingState();
    mutate(state);
    const db = fakeDatabase(state);
    await expect(bootstrapContentSite(bootstrapInput(db.pool))).rejects.toMatchObject({ category });
    expect(db.queries.some(({ sql }) => /\bINSERT\b|\bUPDATE\b|\bDELETE\b/.test(sql))).toBe(false);
  });

  test("uses a parameterized transaction advisory lock scoped by site and environment", async () => {
    const db = fakeDatabase();
    await bootstrapContentSite(bootstrapInput(db.pool));
    const lock = db.queries.find(({ sql }) => sql.includes("pg_advisory_xact_lock"));
    expect(lock?.sql).toContain("$1");
    expect(lock?.sql).not.toContain("preview-site");
    expect(lock?.values).toEqual([
      '["office-next-content-bootstrap-v1","preview-site","test"]'
    ]);
  });

  test("verify is read-only and checks the existing repository result", async () => {
    const db = fakeDatabase(existingState());
    await expect(verifyBootstrappedContentSite({
      pool: db.pool,
      siteKey: "preview-site",
      environment: "test",
      content: siteContentSeed
    })).resolves.toEqual({ status: "verified" });
    expect(db.queries.some(({ sql }) => /\bINSERT\b|\bUPDATE\b|\bDELETE\b/.test(sql))).toBe(false);
    expect(db.released()).toBe(3);
    expect(db.end).not.toHaveBeenCalled();
  });

  test("verify fails closed for an existing Draft without attempting repair", async () => {
    const state = existingState();
    state.draftCount = 1;
    const db = fakeDatabase(state);
    await expect(verifyBootstrappedContentSite({
      pool: db.pool,
      siteKey: "preview-site",
      environment: "test",
      content: siteContentSeed
    })).rejects.toMatchObject({ category: "EXISTING_DRAFT" });
    expect(db.queries.some(({ sql }) => /\bINSERT\b|\bUPDATE\b|\bDELETE\b/.test(sql))).toBe(false);
  });
});
