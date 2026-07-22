import type { Pool, PoolClient, QueryResult } from "pg";

import {
  loadMigrationFiles,
  validateChecksum,
  type MigrationFile
} from "./migration-files";
import { verifyContentSchema, type SchemaVerification } from "./schema-verifier";

const advisoryLockIdentity = "office-next-content-schema-migrations-v1";

type AppliedMigration = {
  version: number;
  name: string;
  checksumSha256: string;
  appliedAt: Date;
  executionMs: number;
};

export type MigrationStatus = {
  pending: readonly MigrationFile[];
  applied: readonly MigrationFile[];
  drifted: readonly MigrationFile[];
  unknownInDatabase: readonly AppliedMigration[];
};

export type MigrationUpResult = {
  applied: readonly MigrationFile[];
};

export type MigrationVerifyResult = {
  status: MigrationStatus;
  schema: SchemaVerification;
};

export class MigrationRunnerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MigrationRunnerError";
  }
}

export function sanitizeDatabaseError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown database error";
  return message
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[REDACTED_DATABASE_URL]")
    .replace(/password\s*[=:]\s*[^\s,;]+/gi, "password=[REDACTED]")
    .slice(0, 500);
}

function migrationError(action: string, migration: MigrationFile, error: unknown): MigrationRunnerError {
  return new MigrationRunnerError(
    `${action} migration ${migration.version} (${migration.name}) failed: ${sanitizeDatabaseError(error)}`
  );
}

async function metadataExists(client: Pick<PoolClient, "query">): Promise<boolean> {
  const result = await client.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.tables
       WHERE table_schema = 'office_next_migrations'
         AND table_name = 'schema_migrations'
     ) AS exists`
  );
  return result.rows[0]?.exists === true;
}

async function readApplied(client: Pick<PoolClient, "query">): Promise<AppliedMigration[]> {
  if (!(await metadataExists(client))) return [];
  const result = await client.query<{
    version: number;
    name: string;
    checksum_sha256: string;
    applied_at: Date;
    execution_ms: number;
  }>(
    `SELECT version, name, checksum_sha256, applied_at, execution_ms
     FROM office_next_migrations.schema_migrations
     ORDER BY version`
  );
  return result.rows.map((row) => ({
    version: row.version,
    name: row.name,
    checksumSha256: row.checksum_sha256,
    appliedAt: row.applied_at,
    executionMs: row.execution_ms
  }));
}

function compareMigrations(
  repository: readonly MigrationFile[],
  database: readonly AppliedMigration[]
): MigrationStatus {
  const databaseByVersion = new Map(database.map((migration) => [migration.version, migration]));
  const repositoryByVersion = new Map(repository.map((migration) => [migration.version, migration]));
  const pending: MigrationFile[] = [];
  const applied: MigrationFile[] = [];
  const drifted: MigrationFile[] = [];

  for (const migration of database) validateChecksum(migration.checksumSha256);
  for (const migration of repository) {
    const record = databaseByVersion.get(migration.version);
    if (!record) pending.push(migration);
    else if (record.name !== migration.name || record.checksumSha256 !== migration.checksumSha256) {
      drifted.push(migration);
    } else applied.push(migration);
  }

  return {
    pending,
    applied,
    drifted,
    unknownInDatabase: database.filter((migration) => !repositoryByVersion.has(migration.version))
  };
}

function assertNoDrift(status: MigrationStatus): void {
  if (status.drifted.length > 0) {
    const migration = status.drifted[0];
    throw new MigrationRunnerError(
      `Migration checksum drift detected for ${migration.version} (${migration.name})`
    );
  }
  if (status.unknownInDatabase.length > 0) {
    const migration = status.unknownInDatabase[0];
    throw new MigrationRunnerError(
      `Unknown database migration ${migration.version} (${migration.name})`
    );
  }
}

async function bootstrapMetadata(client: Pick<PoolClient, "query">): Promise<void> {
  await client.query("CREATE SCHEMA IF NOT EXISTS office_next_migrations");
  await client.query(`
    CREATE TABLE IF NOT EXISTS office_next_migrations.schema_migrations (
      version integer PRIMARY KEY,
      name text UNIQUE NOT NULL,
      checksum_sha256 char(64) NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      execution_ms integer NOT NULL,
      CONSTRAINT schema_migrations_checksum_sha256_valid
        CHECK (checksum_sha256 ~ '^[a-f0-9]{64}$'),
      CONSTRAINT schema_migrations_execution_ms_nonnegative CHECK (execution_ms >= 0)
    )
  `);
}

export class MigrationRunner {
  constructor(
    private readonly pool: Pick<Pool, "connect">,
    private readonly migrationsDirectory: string
  ) {}

  async status(): Promise<MigrationStatus> {
    const migrations = await loadMigrationFiles(this.migrationsDirectory);
    const client = await this.pool.connect();
    try {
      return compareMigrations(migrations, await readApplied(client));
    } finally {
      client.release();
    }
  }

  async up(): Promise<MigrationUpResult> {
    const migrations = await loadMigrationFiles(this.migrationsDirectory);
    const client = await this.pool.connect();
    const applied: MigrationFile[] = [];
    let lockAcquired = false;
    try {
      await client.query("SELECT pg_advisory_lock(hashtextextended($1, 0))", [advisoryLockIdentity]);
      lockAcquired = true;
      await bootstrapMetadata(client);
      const status = compareMigrations(migrations, await readApplied(client));
      assertNoDrift(status);

      for (const migration of status.pending) {
        const startedAt = Date.now();
        await client.query("BEGIN");
        try {
          await client.query(migration.sql);
          await client.query(
            `INSERT INTO office_next_migrations.schema_migrations
               (version, name, checksum_sha256, execution_ms)
             VALUES ($1, $2, $3, $4)`,
            [migration.version, migration.name, migration.checksumSha256, Date.now() - startedAt]
          );
          await client.query("COMMIT");
          applied.push(migration);
        } catch (error: unknown) {
          await client.query("ROLLBACK");
          throw migrationError("Applying", migration, error);
        }
      }
      return { applied };
    } finally {
      if (lockAcquired) {
        try {
          await client.query("SELECT pg_advisory_unlock(hashtextextended($1, 0))", [advisoryLockIdentity]);
        } catch {
          // The client release below still prevents a leaked session-level lock.
        }
      }
      client.release();
    }
  }

  async verify(): Promise<MigrationVerifyResult> {
    const status = await this.status();
    assertNoDrift(status);
    if (status.pending.length > 0) {
      throw new MigrationRunnerError(`${status.pending.length} pending migration(s)`);
    }
    const client = await this.pool.connect();
    try {
      return { status, schema: await verifyContentSchema(client) };
    } finally {
      client.release();
    }
  }
}

export function validateCliCommand(command: string | undefined): "status" | "up" | "verify" {
  if (command === "status" || command === "up" || command === "verify") return command;
  throw new MigrationRunnerError("Expected exactly one command: status, up, or verify");
}
