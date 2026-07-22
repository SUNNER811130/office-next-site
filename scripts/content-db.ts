import path from "path";

import { Pool } from "pg";

import {
  MigrationRunner,
  sanitizeDatabaseError,
  validateCliCommand,
  type MigrationStatus
} from "../database/migration-runner";

export function requireMigrationUrl(
  environment: Readonly<Record<string, string | undefined>>
): string {
  const value = environment.CONTENT_DATABASE_MIGRATION_URL;
  if (!value) throw new Error("CONTENT_DATABASE_MIGRATION_URL is required");
  return value;
}

function printStatus(status: MigrationStatus): void {
  for (const migration of status.applied) console.log(`${migration.version} ${migration.name} applied`);
  for (const migration of status.pending) console.log(`${migration.version} ${migration.name} pending`);
  for (const migration of status.drifted) console.log(`${migration.version} ${migration.name} drifted`);
  for (const migration of status.unknownInDatabase) {
    console.log(`${migration.version} ${migration.name} unknown-in-database`);
  }
  console.log(
    `${status.pending.length} pending, ${status.applied.length} applied, `
      + `${status.drifted.length} drifted, ${status.unknownInDatabase.length} unknown`
  );
}

export async function runCli(args: readonly string[], environment: NodeJS.ProcessEnv): Promise<void> {
  if (args.length !== 1) validateCliCommand(undefined);
  const command = validateCliCommand(args[0]);
  const pool = new Pool({ connectionString: requireMigrationUrl(environment) });
  const runner = new MigrationRunner(pool, path.resolve(process.cwd(), "database/migrations"));
  try {
    if (command === "status") printStatus(await runner.status());
    if (command === "up") {
      const result = await runner.up();
      for (const migration of result.applied) console.log(`${migration.version} ${migration.name} applied`);
      console.log(`${result.applied.length} migration(s) applied`);
    }
    if (command === "verify") {
      const result = await runner.verify();
      printStatus(result.status);
      console.log("Schema verification passed");
    }
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runCli(process.argv.slice(2), process.env).catch((error: unknown) => {
    console.error(`Database migration command failed: ${sanitizeDatabaseError(error)}`);
    process.exitCode = 1;
  });
}
