import { randomBytes } from "crypto";

import { Pool, type PoolClient } from "pg";

import { siteContentSeed } from "../../data/site-content.seed";
import { createEnvelopeFromLegacy } from "../../lib/content-envelope";
import {
  ContentRevisionConflictError
} from "../../lib/content-workflow-errors";
import { contentScopes } from "../../lib/content-scopes";
import { defineContentWorkflowRepositoryContract } from "../../test-utils/content-workflow-repository-contract";
import {
  DatabaseContentPersistenceError,
  DatabaseContentWorkflowRepository,
  type DatabaseRepositoryClient,
  type DatabaseRepositoryPool
} from "../database-content-workflow-repository";

const connectionString = process.env.CONTENT_DATABASE_TEST_URL;
if (!connectionString) throw new Error("CONTENT_DATABASE_TEST_URL is required");

const pool = new Pool({ connectionString, max: 20 });
const sitePrefix = `l8b3-${process.pid}-${randomBytes(4).toString("hex")}`;
const baseline = createEnvelopeFromLegacy(siteContentSeed, "2026-07-22T00:00:00.000Z").published.content;
const createdTestSiteKeys = new Set<string>();
let sequence = 0;

function nextSiteKey(label = "site"): string {
  sequence += 1;
  return `${sitePrefix}-${label}-${sequence}`;
}

async function bootstrapSite(
  siteKey: string,
  environment: "test" | "preview" = "test"
): Promise<void> {
  if (environment === "test") createdTestSiteKeys.add(siteKey);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO office_next_content.sites
        (site_key, environment, schema_version, published_content, published_revision,
         published_updated_at, created_at, updated_at)
       VALUES ($1, $2, 1, $3::jsonb, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [siteKey, environment, JSON.stringify(baseline)]
    );
    for (const scope of contentScopes) {
      await client.query(
        `INSERT INTO office_next_content.scope_versions
          (site_key, environment, scope, published_revision, published_updated_at)
         VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP)`,
        [siteKey, environment, scope]
      );
    }
    await client.query("COMMIT");
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function deleteSite(siteKey: string, environment: "test" | "preview" = "test"): Promise<void> {
  await pool.query(
    "DELETE FROM office_next_content.sites WHERE site_key = $1 AND environment = $2",
    [siteKey, environment]
  );
}

function createRepository(siteKey: string, environment: "test" | "preview" = "test") {
  return new DatabaseContentWorkflowRepository({ pool, siteKey, environment });
}

defineContentWorkflowRepositoryContract("PostgreSQL", async () => {
  const siteKey = nextSiteKey("contract");
  await bootstrapSite(siteKey);
  return {
    repository: createRepository(siteKey),
    createPeerRepository: () => createRepository(siteKey),
    baselineContent: baseline,
    cleanup: () => deleteSite(siteKey)
  };
});

describe("DatabaseContentWorkflowRepository database safety", () => {
  test("fails closed for a missing site without auto-bootstrap or migration", async () => {
    const siteKey = nextSiteKey("missing");
    const migrationBefore = await pool.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM office_next_migrations.schema_migrations"
    );
    await expect(createRepository(siteKey).readPublished()).rejects.toBeInstanceOf(DatabaseContentPersistenceError);
    const siteCount = await pool.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM office_next_content.sites WHERE site_key = $1 AND environment = 'test'",
      [siteKey]
    );
    const migrationAfter = await pool.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM office_next_migrations.schema_migrations"
    );
    expect(siteCount.rows[0]?.count).toBe("0");
    expect(migrationAfter.rows[0]?.count).toBe(migrationBefore.rows[0]?.count);
  });

  test("rejects unsupported schema versions", async () => {
    const siteKey = nextSiteKey("schema");
    await bootstrapSite(siteKey);
    try {
      await pool.query(
        "UPDATE office_next_content.sites SET schema_version = 2 WHERE site_key = $1 AND environment = 'test'",
        [siteKey]
      );
      await expect(createRepository(siteKey).readPublished()).rejects.toThrow("schema version is unsupported");
    } finally {
      await deleteSite(siteKey);
    }
  });

  test("rejects incomplete scope metadata", async () => {
    const siteKey = nextSiteKey("scope");
    await bootstrapSite(siteKey);
    try {
      await pool.query(
        "DELETE FROM office_next_content.scope_versions WHERE site_key = $1 AND environment = 'test' AND scope = 'brand'",
        [siteKey]
      );
      await expect(createRepository(siteKey).readPublished()).rejects.toThrow("scope metadata is incomplete");
    } finally {
      await deleteSite(siteKey);
    }
  });

  test("rejects malformed stored Published content", async () => {
    const siteKey = nextSiteKey("malformed");
    await bootstrapSite(siteKey);
    try {
      await pool.query(
        `UPDATE office_next_content.sites
         SET published_content = jsonb_set(published_content, '{brand}', 'null'::jsonb)
         WHERE site_key = $1 AND environment = 'test'`,
        [siteKey]
      );
      await expect(createRepository(siteKey).readPublished()).rejects.toThrow("Stored content is invalid");
    } finally {
      await deleteSite(siteKey);
    }
  });

  test("isolates sites and environments", async () => {
    const siteA = nextSiteKey("isolation-a");
    const siteB = nextSiteKey("isolation-b");
    await bootstrapSite(siteA, "test");
    await bootstrapSite(siteB, "test");
    await bootstrapSite(siteA, "preview");
    try {
      const changed = { ...baseline.brand, name: "Isolated Database Draft" };
      await createRepository(siteA, "test").saveDraft({
        scope: "brand", value: changed, expectedDraftRevision: null, expectedPublishedRevision: 1
      });
      await expect(createRepository(siteA, "test").readEditor("brand")).resolves.toEqual(
        expect.objectContaining({ source: "draft", data: changed })
      );
      await expect(createRepository(siteB, "test").hasDrafts()).resolves.toBe(false);
      await expect(createRepository(siteA, "preview").hasDrafts()).resolves.toBe(false);
    } finally {
      await deleteSite(siteA, "test");
      await deleteSite(siteB, "test");
      await deleteSite(siteA, "preview");
    }
  });

  test("treats SQL-like site keys only as parameter values", async () => {
    const siteKey = `${sitePrefix}-'; DELETE FROM office_next_content.sites; --`;
    const countBefore = await pool.query<{ count: string }>("SELECT count(*)::text AS count FROM office_next_content.sites");
    await expect(createRepository(siteKey).readPublished()).rejects.toBeInstanceOf(DatabaseContentPersistenceError);
    const countAfter = await pool.query<{ count: string }>("SELECT count(*)::text AS count FROM office_next_content.sites");
    expect(countAfter.rows[0]?.count).toBe(countBefore.rows[0]?.count);
  });

  test("keeps conflict errors free of Draft payloads", async () => {
    const siteKey = nextSiteKey("conflict");
    await bootstrapSite(siteKey);
    try {
      const repository = createRepository(siteKey);
      await repository.saveDraft({
        scope: "brand",
        value: { ...baseline.brand, name: "server-private-draft-value" },
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      });
      const error = await repository.saveDraft({
        scope: "brand",
        value: { ...baseline.brand, name: "client-private-draft-value" },
        expectedDraftRevision: null,
        expectedPublishedRevision: 1
      }).catch((caught: unknown) => caught);
      expect(error).toBeInstanceOf(ContentRevisionConflictError);
      expect(JSON.stringify(error)).not.toContain("private-draft-value");
    } finally {
      await deleteSite(siteKey);
    }
  });

  test("rolls back a failed Publish and retains its Draft", async () => {
    const siteKey = nextSiteKey("rollback");
    await bootstrapSite(siteKey);
    try {
      await pool.query(
        `UPDATE office_next_content.scope_versions
         SET published_revision = 2147483647
         WHERE site_key = $1 AND environment = 'test' AND scope = 'brand'`,
        [siteKey]
      );
      const repository = createRepository(siteKey);
      const changed = { ...baseline.brand, name: "Rollback Draft" };
      await repository.saveDraft({
        scope: "brand", value: changed,
        expectedDraftRevision: null, expectedPublishedRevision: 2147483647
      });
      const publishedBefore = await pool.query<{ published_content: unknown; published_revision: number }>(
        `SELECT published_content, published_revision FROM office_next_content.sites
         WHERE site_key = $1 AND environment = 'test'`,
        [siteKey]
      );
      await expect(repository.publishDraft({
        scope: "brand", expectedDraftRevision: 1, expectedPublishedRevision: 2147483647
      })).rejects.toBeInstanceOf(DatabaseContentPersistenceError);
      const publishedAfter = await pool.query<{ published_content: unknown; published_revision: number }>(
        `SELECT published_content, published_revision FROM office_next_content.sites
         WHERE site_key = $1 AND environment = 'test'`,
        [siteKey]
      );
      expect(publishedAfter.rows[0]).toEqual(publishedBefore.rows[0]);
      await expect(repository.readEditor("brand")).resolves.toEqual(
        expect.objectContaining({ source: "draft", data: changed })
      );
    } finally {
      await deleteSite(siteKey);
    }
  });

  test("releases clients after success and failure and never ends its pool", async () => {
    const siteKey = nextSiteKey("lifecycle");
    await bootstrapSite(siteKey);
    let releases = 0;
    let endCalls = 0;
    const trackingPool: DatabaseRepositoryPool & { end(): Promise<void> } = {
      connect: async (): Promise<DatabaseRepositoryClient> => {
        const client = await pool.connect();
        return new Proxy(client, {
          get(target, property) {
            if (property === "release") return () => { releases += 1; target.release(); };
            const value = Reflect.get(target, property);
            return typeof value === "function" ? value.bind(target) : value;
          }
        }) as unknown as DatabaseRepositoryClient;
      },
      end: async () => { endCalls += 1; }
    };
    try {
      await new DatabaseContentWorkflowRepository({ pool: trackingPool, siteKey, environment: "test" }).readPublished();
      await expect(new DatabaseContentWorkflowRepository({
        pool: trackingPool, siteKey: nextSiteKey("absent"), environment: "test"
      }).readPublished()).rejects.toBeInstanceOf(DatabaseContentPersistenceError);
      expect(releases).toBe(2);
      expect(endCalls).toBe(0);
    } finally {
      await deleteSite(siteKey);
    }
  });
});

afterAll(async () => {
  if (createdTestSiteKeys.size > 0) {
    await pool.query(
      `DELETE FROM office_next_content.sites
       WHERE environment = $1 AND site_key = ANY($2::text[])`,
      ["test", Array.from(createdTestSiteKeys)]
    );
  }
  await pool.end();
});
