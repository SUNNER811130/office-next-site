import { randomBytes } from "crypto";
import { execFileSync } from "child_process";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

import { Pool, type PoolClient } from "pg";

import { loadMigrationFiles } from "../database/migration-files";
import { MigrationRunner } from "../database/migration-runner";

const scopes = [
  "brand", "home", "founder", "services", "cases", "testimonials", "faq",
  "contact", "social", "design", "pageBlocks.home", "pageBlocks.services",
  "pageBlocks.about", "pageBlocks.contact"
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Database schema test failed: ${message}`);
}

function docker(args: readonly string[]): string {
  return execFileSync("docker", [...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

async function expectRejected(action: () => Promise<unknown>, label: string): Promise<void> {
  try {
    await action();
  } catch {
    return;
  }
  throw new Error(`Database schema test failed: ${label} was accepted`);
}

async function resetSchemas(client: PoolClient): Promise<void> {
  await client.query("DROP SCHEMA IF EXISTS office_next_content CASCADE");
  await client.query("DROP SCHEMA IF EXISTS office_next_migrations CASCADE");
  await client.query("DROP SCHEMA IF EXISTS migration_test CASCADE");
}

async function makeMigrationDirectory(files: Record<string, string>): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "office-next-db-schema-"));
  await Promise.all(Object.entries(files).map(([filename, sql]) => fs.writeFile(path.join(directory, filename), sql)));
  return directory;
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
  throw new Error("PostgreSQL readiness timed out");
}

async function run(): Promise<void> {
  const identity = `${Date.now()}-${process.pid}-${randomBytes(4).toString("hex")}`;
  const containerName = `office-next-l8b2-${identity}`;
  const databaseName = `office_next_l8b2_${randomBytes(4).toString("hex")}`;
  const password = randomBytes(24).toString("base64url");
  const temporaryDirectories: string[] = [];
  let pool: Pool | undefined;

  try {
    docker([
      "run", "-d", "--name", containerName,
      "--label", "office-next-l8b2-test",
      "-e", `POSTGRES_PASSWORD=${password}`,
      "-e", `POSTGRES_DB=${databaseName}`,
      "-p", "127.0.0.1::5432",
      "postgres:17-alpine"
    ]);
    await waitForPostgres(containerName);
    const portOutput = docker(["port", containerName, "5432/tcp"]);
    const port = Number.parseInt(portOutput.slice(portOutput.lastIndexOf(":") + 1), 10);
    assert(Number.isInteger(port), "Docker did not return a PostgreSQL host port");

    pool = new Pool({ host: "127.0.0.1", port, user: "postgres", password, database: databaseName });
    const migrationsDirectory = path.resolve(process.cwd(), "database/migrations");
    const runner = new MigrationRunner(pool, migrationsDirectory);
    const client = await pool.connect();
    try {
      const emptyStatus = await runner.status();
      assert(emptyStatus.pending.length === 1, "empty database should have one pending migration");
      assert(emptyStatus.applied.length === 0 && emptyStatus.drifted.length === 0, "empty status counts are incorrect");
      const schemaBefore = await client.query<{ exists: boolean }>(
        "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'office_next_migrations') AS exists"
      );
      assert(schemaBefore.rows[0]?.exists === false, "status mutated the database");

      const first = await runner.up();
      assert(first.applied.length === 1, "initial migration was not applied exactly once");
      const migrationFiles = await loadMigrationFiles(migrationsDirectory);
      const metadataBefore = await client.query<{ checksum_sha256: string; applied_at: Date }>(
        "SELECT checksum_sha256, applied_at FROM office_next_migrations.schema_migrations WHERE version = 1"
      );
      assert(metadataBefore.rows[0]?.checksum_sha256 === migrationFiles[0].checksumSha256, "stored checksum is incorrect");

      const second = await runner.up();
      assert(second.applied.length === 0, "idempotent migration re-run applied work");
      const metadataAfter = await client.query<{ checksum_sha256: string; applied_at: Date }>(
        "SELECT checksum_sha256, applied_at FROM office_next_migrations.schema_migrations WHERE version = 1"
      );
      assert(metadataAfter.rows[0]?.checksum_sha256 === metadataBefore.rows[0]?.checksum_sha256, "checksum changed on re-run");
      assert(metadataAfter.rows[0]?.applied_at.getTime() === metadataBefore.rows[0]?.applied_at.getTime(), "applied_at changed on re-run");
      await runner.verify();

      const published = { brand: { name: "test" } };
      await client.query(
        `INSERT INTO office_next_content.sites
          (site_key, environment, published_content, published_revision, published_updated_at)
         VALUES ('test-site', 'test', $1::jsonb, 1, CURRENT_TIMESTAMP)`,
        [JSON.stringify(published)]
      );
      const roundTrip = await client.query<{ published_content: unknown; published_revision: number }>(
        "SELECT published_content, published_revision FROM office_next_content.sites WHERE site_key = 'test-site' AND environment = 'test'"
      );
      assert(JSON.stringify(roundTrip.rows[0]?.published_content) === JSON.stringify(published), "JSONB round trip changed content");
      assert(roundTrip.rows[0]?.published_revision === 1, "published revision is not one");

      for (const scope of scopes) {
        await client.query(
          `INSERT INTO office_next_content.scope_versions
            (site_key, environment, scope, published_revision, published_updated_at)
           VALUES ('test-site', 'test', $1, 1, CURRENT_TIMESTAMP)`,
          [scope]
        );
      }
      const scopeCount = await client.query<{ count: string; minimum: number }>(
        `SELECT count(*)::text AS count, min(published_revision) AS minimum
         FROM office_next_content.scope_versions WHERE site_key = 'test-site' AND environment = 'test'`
      );
      assert(scopeCount.rows[0]?.count === "14" && scopeCount.rows[0]?.minimum === 1, "scope rows are incorrect");

      await client.query(
        `INSERT INTO office_next_content.drafts
          (site_key, environment, scope, value, revision, based_on_published_revision, updated_at)
         VALUES ('test-site', 'test', 'brand', $1::jsonb, 1, 1, CURRENT_TIMESTAMP)`,
        [JSON.stringify({ name: "draft" })]
      );
      await expectRejected(() => client.query(
        `INSERT INTO office_next_content.drafts
          (site_key, environment, scope, value, revision, based_on_published_revision, updated_at)
         VALUES ('test-site', 'test', 'brand', '{}'::jsonb, 1, 1, CURRENT_TIMESTAMP)`
      ), "duplicate draft");
      await expectRejected(() => client.query(
        `INSERT INTO office_next_content.sites
          (site_key, environment, published_content, published_revision, published_updated_at)
         VALUES ('invalid-environment', 'staging', '{}'::jsonb, 1, CURRENT_TIMESTAMP)`
      ), "invalid environment");
      await expectRejected(() => client.query(
        `INSERT INTO office_next_content.scope_versions
          (site_key, environment, scope, published_revision, published_updated_at)
         VALUES ('test-site', 'test', 'invalid.scope', 1, CURRENT_TIMESTAMP)`
      ), "invalid scope");
      await expectRejected(() => client.query(
        `INSERT INTO office_next_content.sites
          (site_key, environment, published_content, published_revision, published_updated_at)
         VALUES ('invalid-site-revision', 'test', '{}'::jsonb, 0, CURRENT_TIMESTAMP)`
      ), "invalid published revision");
      await expectRejected(() => client.query(
        `INSERT INTO office_next_content.drafts
          (site_key, environment, scope, value, revision, based_on_published_revision, updated_at)
         VALUES ('test-site', 'test', 'home', '{}'::jsonb, 0, 1, CURRENT_TIMESTAMP)`
      ), "invalid draft revision");
      await expectRejected(() => client.query(
        `INSERT INTO office_next_content.drafts
          (site_key, environment, scope, value, revision, based_on_published_revision, updated_at)
         VALUES ('test-site', 'test', 'home', '{}'::jsonb, 1, 0, CURRENT_TIMESTAMP)`
      ), "invalid based-on revision");
      await expectRejected(() => client.query(
        `INSERT INTO office_next_content.sites
          (site_key, environment, published_content, published_revision, published_updated_at)
         VALUES ('invalid-json', 'test', '[]'::jsonb, 1, CURRENT_TIMESTAMP)`
      ), "invalid published JSON shape");
      for (const siteKey of ["", "   "]) {
        await expectRejected(() => client.query(
          `INSERT INTO office_next_content.sites
            (site_key, environment, published_content, published_revision, published_updated_at)
           VALUES ($1, 'test', '{}'::jsonb, 1, CURRENT_TIMESTAMP)`,
          [siteKey]
        ), "blank site key");
      }
      await expectRejected(() => client.query(
        `INSERT INTO office_next_content.drafts
          (site_key, environment, scope, value, revision, based_on_published_revision, updated_at)
         VALUES ('missing-site', 'test', 'brand', '{}'::jsonb, 1, 1, CURRENT_TIMESTAMP)`
      ), "orphan draft");

      await client.query("DELETE FROM office_next_content.sites WHERE site_key = 'test-site' AND environment = 'test'");
      const cascade = await client.query<{ scopes: string; drafts: string }>(
        `SELECT
          (SELECT count(*) FROM office_next_content.scope_versions)::text AS scopes,
          (SELECT count(*) FROM office_next_content.drafts)::text AS drafts`
      );
      assert(cascade.rows[0]?.scopes === "0" && cascade.rows[0]?.drafts === "0", "cascade delete failed");

      await resetSchemas(client);
      const driftDirectory = await makeMigrationDirectory({ "0001_drift.sql": "CREATE SCHEMA migration_test;\n" });
      temporaryDirectories.push(driftDirectory);
      const driftRunner = new MigrationRunner(pool, driftDirectory);
      await driftRunner.up();
      await fs.writeFile(path.join(driftDirectory, "0001_drift.sql"), "CREATE SCHEMA migration_test;\n\n");
      const driftStatus = await driftRunner.status();
      assert(driftStatus.drifted.length === 1, "checksum drift was not reported by status");
      await expectRejected(() => driftRunner.verify(), "checksum drift verification");

      await resetSchemas(client);
      await runner.up();
      await client.query(
        `INSERT INTO office_next_migrations.schema_migrations
          (version, name, checksum_sha256, execution_ms)
         VALUES (9999, 'unknown', $1, 0)`,
        ["a".repeat(64)]
      );
      await expectRejected(() => runner.verify(), "unknown database migration");
      await client.query("DELETE FROM office_next_migrations.schema_migrations WHERE version = 9999");

      await resetSchemas(client);
      const failureDirectory = await makeMigrationDirectory({
        "0001_valid.sql": "CREATE SCHEMA migration_test;\nCREATE TABLE migration_test.valid_table (id integer PRIMARY KEY);\n",
        "0002_failing.sql": "CREATE TABLE migration_test.rolled_back_table (id integer);\nSELECT missing_function();\n"
      });
      temporaryDirectories.push(failureDirectory);
      const failureRunner = new MigrationRunner(pool, failureDirectory);
      await expectRejected(() => failureRunner.up(), "failing migration");
      const failureState = await client.query<{ applied: string; rolled_back_exists: boolean }>(
        `SELECT
          (SELECT count(*) FROM office_next_migrations.schema_migrations)::text AS applied,
          to_regclass('migration_test.rolled_back_table') IS NOT NULL AS rolled_back_exists`
      );
      assert(failureState.rows[0]?.applied === "1", "valid migration was not retained before failure");
      assert(failureState.rows[0]?.rolled_back_exists === false, "failed migration did not roll back");
      await fs.writeFile(
        path.join(failureDirectory, "0002_failing.sql"),
        "CREATE TABLE migration_test.recovered_table (id integer PRIMARY KEY);\n"
      );
      assert((await failureRunner.up()).applied.length === 1, "advisory lock was not released after failure");

      await resetSchemas(client);
      const concurrentOne = new MigrationRunner(pool, migrationsDirectory);
      const concurrentTwo = new MigrationRunner(pool, migrationsDirectory);
      const concurrentResults = await Promise.all([concurrentOne.up(), concurrentTwo.up()]);
      assert(
        concurrentResults.reduce((count, result) => count + result.applied.length, 0) === 1,
        "concurrent runners applied the migration more than once"
      );
      const concurrentState = await client.query<{ count: string }>(
        "SELECT count(*)::text AS count FROM office_next_migrations.schema_migrations"
      );
      assert(concurrentState.rows[0]?.count === "1", "concurrent metadata is incomplete or duplicated");
      await runner.verify();
    } finally {
      client.release();
    }
    console.log("PostgreSQL schema integration tests passed");
  } finally {
    if (pool) await pool.end().catch(() => undefined);
    try {
      docker(["rm", "-f", containerName]);
    } catch {
      // The container may not have been created; the label check gate catches real leftovers.
    }
    await Promise.all(temporaryDirectories.map((directory) => fs.rm(directory, { recursive: true, force: true })));
  }
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown integration test failure";
  console.error(message.slice(0, 500));
  process.exitCode = 1;
});
