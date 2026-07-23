import { createHash, randomBytes } from "crypto";
import { execFileSync } from "child_process";
import { promises as fs } from "fs";
import { isDeepStrictEqual } from "util";
import path from "path";

import { Client, Pool, type PoolClient } from "pg";

import {
  bootstrapContentSite,
  ContentBootstrapConflictError,
  OFFICE_NEXT_FORMAL_CONTENT_SHA256,
  verifyBootstrappedContentSite,
  type ContentBootstrapPool
} from "../database/preview-bootstrap";
import { DatabaseContentWorkflowRepository } from "../database/database-content-workflow-repository";
import { MigrationRunner } from "../database/migration-runner";
import { verifyContentSchema } from "../database/schema-verifier";
import { contentScopes } from "../lib/content-scopes";
import type { SiteContent } from "../types/content";

let integrationPhase = "startup";

class PreviewBootstrapIntegrationError extends Error {
  constructor(message: string) {
    super(`Preview bootstrap integration failed: ${message}`);
    this.name = "PreviewBootstrapIntegrationError";
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new PreviewBootstrapIntegrationError(message);
}

function docker(args: readonly string[]): string {
  return execFileSync("docker", [...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

async function waitForPostgres(containerName: string): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      docker(["exec", containerName, "pg_isready", "-U", "postgres"]);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new PreviewBootstrapIntegrationError("container readiness timed out");
}

async function waitForHost(connectionString: string): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const client = new Client({ connectionString, connectionTimeoutMillis: 1_500 });
    try {
      await client.connect();
      await client.query("SELECT 1");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      await client.end().catch(() => undefined);
    }
  }
  throw new PreviewBootstrapIntegrationError("host readiness timed out");
}

async function expectConflict(
  operation: () => Promise<unknown>,
  category: ContentBootstrapConflictError["category"]
): Promise<void> {
  try {
    await operation();
  } catch (error: unknown) {
    if (error instanceof ContentBootstrapConflictError && error.category === category) return;
    throw new PreviewBootstrapIntegrationError(`unexpected conflict category for ${category}`);
  }
  throw new PreviewBootstrapIntegrationError(`missing conflict ${category}`);
}

async function expectDenied(operation: () => Promise<unknown>, label: string): Promise<void> {
  try {
    await operation();
  } catch {
    return;
  }
  throw new PreviewBootstrapIntegrationError(`${label} was not denied`);
}

async function loadFormalSource(): Promise<{ bytes: Buffer; content: SiteContent; sha256: string }> {
  const sourcePath = path.resolve(process.cwd(), "data/site-content.json");
  const bytes = await fs.readFile(sourcePath);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  assert(sha256 === OFFICE_NEXT_FORMAL_CONTENT_SHA256, "formal source SHA mismatch");
  let parsed: unknown;
  try {
    parsed = JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new PreviewBootstrapIntegrationError("formal source JSON invalid");
  }
  assert(
    typeof parsed === "object"
      && parsed !== null
      && !Array.isArray(parsed)
      && !("schemaVersion" in parsed)
      && !("published" in parsed)
      && !("drafts" in parsed),
    "formal source is not Legacy root"
  );
  return { bytes, content: parsed as SiteContent, sha256 };
}

function bootstrapInput(
  pool: ContentBootstrapPool,
  source: { content: SiteContent; sha256: string },
  siteKey: string,
  environment: "test" | "preview" = "test"
) {
  return {
    pool,
    siteKey,
    environment,
    content: source.content,
    sourceSha256: source.sha256,
    expectedSourceSha256: OFFICE_NEXT_FORMAL_CONTENT_SHA256,
    timestamp: new Date("2026-07-23T02:00:00.000Z")
  };
}

async function snapshotState(client: PoolClient, siteKey: string, environment: string) {
  const site = await client.query<{
    schema_version: number;
    published_content: unknown;
    published_revision: number;
    published_updated_at: Date;
    created_at: Date;
    updated_at: Date;
  }>(
    `SELECT schema_version, published_content, published_revision,
            published_updated_at, created_at, updated_at
     FROM office_next_content.sites
     WHERE site_key = $1 AND environment = $2`,
    [siteKey, environment]
  );
  const scopes = await client.query<{
    scope: string;
    published_revision: number;
    published_updated_at: Date;
  }>(
    `SELECT scope, published_revision, published_updated_at
     FROM office_next_content.scope_versions
     WHERE site_key = $1 AND environment = $2 ORDER BY scope`,
    [siteKey, environment]
  );
  const drafts = await client.query<{ count: string }>(
    `SELECT count(*)::text AS count FROM office_next_content.drafts
     WHERE site_key = $1 AND environment = $2`,
    [siteKey, environment]
  );
  return { site: site.rows, scopes: scopes.rows, drafts: drafts.rows[0]?.count };
}

async function runRuntimeRoleChecks(
  adminPool: Pool,
  port: number,
  databaseName: string,
  source: { content: SiteContent; sha256: string },
  suffix: string
): Promise<void> {
  const siteKey = `runtime-role-${suffix}`;
  await bootstrapContentSite(bootstrapInput(adminPool, source, siteKey));
  const roleName = `office_next_runtime_${suffix}`;
  assert(/^[a-z0-9_]+$/.test(roleName), "runtime role name unsafe");
  const rolePassword = randomBytes(24).toString("hex");
  const admin = await adminPool.connect();
  try {
    await admin.query(
      `CREATE ROLE ${roleName} LOGIN PASSWORD '${rolePassword}'
       NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS`
    );
    await admin.query(`GRANT CONNECT ON DATABASE ${databaseName} TO ${roleName}`);
    await admin.query(`GRANT USAGE ON SCHEMA office_next_content TO ${roleName}`);
    await admin.query(
      `GRANT SELECT ON office_next_content.sites,
                       office_next_content.scope_versions,
                       office_next_content.drafts TO ${roleName}`
    );
    await admin.query(
      `INSERT INTO office_next_content.drafts
        (site_key, environment, scope, value, revision,
         based_on_published_revision, updated_at)
       VALUES ($1, 'test', 'brand', $2::jsonb, 1, 1, CURRENT_TIMESTAMP)`,
      [siteKey, JSON.stringify(source.content.brand)]
    );
  } finally {
    admin.release();
  }

  const runtimeUrl = `postgresql://${roleName}:${rolePassword}@127.0.0.1:${port}/${databaseName}`;
  const runtimePool = new Pool({ connectionString: runtimeUrl, max: 2 });
  try {
    const repository = new DatabaseContentWorkflowRepository({
      pool: runtimePool,
      siteKey,
      environment: "test"
    });
    await repository.readPublished();
    await repository.readEditor("brand");
    await repository.readPreview("brand");
    await repository.hasDrafts();

    const beforeClient = await adminPool.connect();
    const before = await snapshotState(beforeClient, siteKey, "test");
    beforeClient.release();

    await expectDenied(() => repository.saveDraft({
      scope: "brand",
      value: source.content.brand,
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    }), "runtime Save Draft");
    await expectDenied(() => repository.publishDraft({
      scope: "brand",
      expectedDraftRevision: 1,
      expectedPublishedRevision: 1
    }), "runtime Publish");
    await expectDenied(() => repository.discardDraft({
      scope: "brand",
      expectedDraftRevision: 1
    }), "runtime Discard");

    const runtimeClient = await runtimePool.connect();
    try {
      await expectDenied(() => runtimeClient.query(
        `INSERT INTO office_next_content.sites
          (site_key, environment, published_content, published_revision, published_updated_at)
         VALUES ('denied', 'test', '{}'::jsonb, 1, CURRENT_TIMESTAMP)`
      ), "runtime direct INSERT");
      await expectDenied(() => runtimeClient.query(
        `UPDATE office_next_content.sites SET published_revision = 2
         WHERE site_key = $1 AND environment = 'test'`,
        [siteKey]
      ), "runtime direct UPDATE");
      await expectDenied(() => runtimeClient.query(
        `DELETE FROM office_next_content.drafts
         WHERE site_key = $1 AND environment = 'test'`,
        [siteKey]
      ), "runtime direct DELETE");
    } finally {
      runtimeClient.release();
    }

    const afterClient = await adminPool.connect();
    const after = await snapshotState(afterClient, siteKey, "test");
    afterClient.release();
    assert(isDeepStrictEqual(after, before), "denied runtime mutations changed database state");
  } finally {
    await runtimePool.end().catch(() => undefined);
  }
}

async function run(): Promise<void> {
  const suffix = randomBytes(5).toString("hex");
  const containerName = `office-next-l8b5a-${Date.now()}-${suffix}`;
  const databaseName = `office_next_l8b5a_${suffix}`;
  const password = randomBytes(24).toString("hex");
  let pool: Pool | undefined;
  let anonymousVolumes: string[] = [];
  const source = await loadFormalSource();

  try {
    integrationPhase = "container-create";
    docker([
      "run", "-d", "--name", containerName,
      "--label", "office-next-l8b5a-test",
      "-e", `POSTGRES_PASSWORD=${password}`,
      "-e", `POSTGRES_DB=${databaseName}`,
      "-p", "127.0.0.1::5432",
      "postgres:17-alpine"
    ]);
    integrationPhase = "container-readiness";
    await waitForPostgres(containerName);
    anonymousVolumes = docker([
      "inspect", "--format",
      "{{range .Mounts}}{{if eq .Type \"volume\"}}{{println .Name}}{{end}}{{end}}",
      containerName
    ]).split(/\s+/).filter(Boolean);
    const portOutput = docker(["port", containerName, "5432/tcp"]);
    const port = Number.parseInt(portOutput.slice(portOutput.lastIndexOf(":") + 1), 10);
    assert(Number.isInteger(port), "Docker did not return host port");
    const adminUrl = `postgresql://postgres:${password}@127.0.0.1:${port}/${databaseName}`;
    integrationPhase = "host-readiness";
    await waitForHost(adminUrl);
    pool = new Pool({ connectionString: adminUrl, max: 8 });

    integrationPhase = "migration";
    const runner = new MigrationRunner(pool, path.resolve(process.cwd(), "database/migrations"));
    await runner.up();
    const schemaClient = await pool.connect();
    try {
      await verifyContentSchema(schemaClient);
    } finally {
      schemaClient.release();
    }

    integrationPhase = "fresh-bootstrap";
    const mainSite = `preview-bootstrap-${suffix}`;
    const created = await bootstrapContentSite(bootstrapInput(pool, source, mainSite));
    assert(created.status === "created", "fresh bootstrap did not create");
    integrationPhase = "fresh-verify";
    await verifyBootstrappedContentSite({
      pool,
      siteKey: mainSite,
      environment: "test",
      content: source.content
    });

    integrationPhase = "conflict-cases";
    const client = await pool.connect();
    try {
      const fresh = await snapshotState(client, mainSite, "test");
      assert(fresh.site.length === 1, "fresh site row count incorrect");
      assert(fresh.site[0]?.schema_version === 1, "fresh schema version incorrect");
      assert(fresh.site[0]?.published_revision === 1, "fresh global revision incorrect");
      assert(isDeepStrictEqual(fresh.site[0]?.published_content, source.content), "fresh content differs");
      assert(fresh.scopes.length === 14, "fresh scope count incorrect");
      assert(fresh.scopes.every((row) => row.published_revision === 1), "fresh scope revision incorrect");
      assert(fresh.drafts === "0", "fresh Draft count incorrect");

      const unchanged = await bootstrapContentSite(bootstrapInput(pool, source, mainSite));
      assert(unchanged.status === "unchanged", "idempotent bootstrap was not unchanged");
      assert(
        isDeepStrictEqual(await snapshotState(client, mainSite, "test"), fresh),
        "idempotent bootstrap changed database state"
      );

      const changedContent = {
        ...source.content,
        brand: { ...source.content.brand, name: "isolated conflict marker" }
      };
      await expectConflict(() => bootstrapContentSite({
        ...bootstrapInput(pool!, source, mainSite),
        content: changedContent
      }), "PUBLISHED_CONTENT");
      assert(isDeepStrictEqual(await snapshotState(client, mainSite, "test"), fresh), "content conflict changed state");

      await client.query(
        `UPDATE office_next_content.sites SET published_revision = 2
         WHERE site_key = $1 AND environment = 'test'`, [mainSite]
      );
      await expectConflict(() => bootstrapContentSite(bootstrapInput(pool!, source, mainSite)), "PUBLISHED_REVISION");
      await client.query(
        `UPDATE office_next_content.sites SET published_revision = 1
         WHERE site_key = $1 AND environment = 'test'`, [mainSite]
      );

      await client.query(
        `UPDATE office_next_content.scope_versions SET published_revision = 2
         WHERE site_key = $1 AND environment = 'test' AND scope = 'brand'`, [mainSite]
      );
      await expectConflict(() => bootstrapContentSite(bootstrapInput(pool!, source, mainSite)), "SCOPE_REVISION");
      await client.query(
        `UPDATE office_next_content.scope_versions SET published_revision = 1
         WHERE site_key = $1 AND environment = 'test' AND scope = 'brand'`, [mainSite]
      );

      const removedScope = fresh.scopes[0];
      await client.query(
        `DELETE FROM office_next_content.scope_versions
         WHERE site_key = $1 AND environment = 'test' AND scope = $2`,
        [mainSite, removedScope.scope]
      );
      await expectConflict(() => bootstrapContentSite(bootstrapInput(pool!, source, mainSite)), "SCOPE_SET");
      await client.query(
        `INSERT INTO office_next_content.scope_versions
          (site_key, environment, scope, published_revision, published_updated_at)
         VALUES ($1, 'test', $2, 1, $3)`,
        [mainSite, removedScope.scope, removedScope.published_updated_at]
      );

      await client.query(
        `INSERT INTO office_next_content.drafts
          (site_key, environment, scope, value, revision,
           based_on_published_revision, updated_at)
         VALUES ($1, 'test', 'brand', $2::jsonb, 1, 1, CURRENT_TIMESTAMP)`,
        [mainSite, JSON.stringify(source.content.brand)]
      );
      await expectConflict(() => bootstrapContentSite(bootstrapInput(pool!, source, mainSite)), "EXISTING_DRAFT");
      await client.query(
        `DELETE FROM office_next_content.drafts
         WHERE site_key = $1 AND environment = 'test'`, [mainSite]
      );

      await client.query(
        `UPDATE office_next_content.sites SET schema_version = 2
         WHERE site_key = $1 AND environment = 'test'`, [mainSite]
      );
      await expectConflict(() => bootstrapContentSite(bootstrapInput(pool!, source, mainSite)), "SCHEMA_VERSION");
      await client.query(
        `UPDATE office_next_content.sites SET schema_version = 1
         WHERE site_key = $1 AND environment = 'test'`, [mainSite]
      );
    } finally {
      client.release();
    }

    integrationPhase = "concurrent-bootstrap";
    const concurrentSite = `concurrent-${suffix}`;
    const concurrent = await Promise.all([
      bootstrapContentSite(bootstrapInput(pool, source, concurrentSite)),
      bootstrapContentSite(bootstrapInput(pool, source, concurrentSite))
    ]);
    assert(
      concurrent.filter((result) => result.status === "created").length === 1
        && concurrent.filter((result) => result.status === "unchanged").length === 1,
      "concurrent bootstrap results unsafe"
    );

    integrationPhase = "rollback-bootstrap";
    const rollbackSite = `rollback-${suffix}`;
    const failingPool: ContentBootstrapPool = {
      connect: async () => {
        const realClient = await pool!.connect();
        let scopeInserts = 0;
        const query = (async (sql: string, values?: unknown[]) => {
          if (sql.includes("INSERT INTO office_next_content.scope_versions")) {
            scopeInserts += 1;
            if (scopeInserts === 3) throw new Error("injected scope failure");
          }
          return realClient.query(sql, values);
        }) as unknown as PoolClient["query"];
        return { query, release: () => realClient.release() };
      }
    };
    await expectDenied(
      () => bootstrapContentSite(bootstrapInput(failingPool, source, rollbackSite)),
      "injected rollback bootstrap"
    );
    const rollbackClient = await pool.connect();
    const rollbackState = await snapshotState(rollbackClient, rollbackSite, "test");
    rollbackClient.release();
    assert(
      rollbackState.site.length === 0 && rollbackState.scopes.length === 0 && rollbackState.drafts === "0",
      "transaction rollback left partial state"
    );

    integrationPhase = "site-isolation";
    const isolatedA = `isolated-a-${suffix}`;
    const isolatedB = `isolated-b-${suffix}`;
    await bootstrapContentSite(bootstrapInput(pool, source, isolatedA));
    await bootstrapContentSite(bootstrapInput(pool, source, isolatedB));
    const isolationClient = await pool.connect();
    const isolatedCount = await isolationClient.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM office_next_content.sites
       WHERE site_key = ANY($1::text[]) AND environment = 'test'`,
      [[isolatedA, isolatedB]]
    );
    isolationClient.release();
    assert(isolatedCount.rows[0]?.count === "2", "site isolation failed");

    integrationPhase = "environment-isolation";
    const environmentSite = `environment-${suffix}`;
    await bootstrapContentSite(bootstrapInput(pool, source, environmentSite, "test"));
    await bootstrapContentSite(bootstrapInput(pool, source, environmentSite, "preview"));
    const environmentClient = await pool.connect();
    const environmentCount = await environmentClient.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM office_next_content.sites
       WHERE site_key = $1`, [environmentSite]
    );
    environmentClient.release();
    assert(environmentCount.rows[0]?.count === "2", "environment isolation failed");

    integrationPhase = "runtime-role";
    await runRuntimeRoleChecks(pool, port, databaseName, source, suffix);
    const finalBytes = await fs.readFile(path.resolve(process.cwd(), "data/site-content.json"));
    assert(source.bytes.equals(finalBytes), "formal source changed during integration");
    console.log("Preview bootstrap integration tests passed");
  } finally {
    if (pool) await pool.end().catch(() => undefined);
    try {
      docker(["rm", "-f", "-v", containerName]);
    } catch {
      // A container that was never created has no resource to remove.
    }
    for (const volume of anonymousVolumes) {
      try {
        docker(["volume", "inspect", volume]);
        throw new PreviewBootstrapIntegrationError("anonymous volume remained after cleanup");
      } catch (error: unknown) {
        if (error instanceof PreviewBootstrapIntegrationError) throw error;
      }
    }
  }
}

run().catch((error: unknown) => {
  if (error instanceof PreviewBootstrapIntegrationError) {
    console.error(error.message);
  } else if (error instanceof ContentBootstrapConflictError) {
    console.error(`Preview bootstrap integration failed: ${error.code} ${error.category}`);
  } else {
    const code = typeof error === "object"
      && error !== null
      && "code" in error
      && typeof error.code === "string"
      && /^[A-Z0-9_]{2,32}$/.test(error.code)
      ? error.code
      : "NONE";
    const name = error instanceof Error && /^[A-Za-z][A-Za-z0-9]{0,63}$/.test(error.name)
      ? error.name
      : "Unknown";
    console.error(
      `Preview bootstrap integration failed: SAFE_UNCLASSIFIED_ERROR phase=${integrationPhase} name=${name} code=${code}`
    );
  }
  process.exitCode = 1;
});
