import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type MigrationFile = Readonly<{
  version: number;
  name: string;
  filename: string;
  absolutePath: string;
  sql: string;
  checksumSha256: string;
}>;

const migrationFilenamePattern = /^([0-9]{4})_([a-z0-9_]+)\.sql$/;
const transactionControlPattern = /(^|[;\s])(BEGIN|COMMIT|ROLLBACK)(?=\s|;|$)/im;
const forbiddenStatementPattern = /(^|[;\s])(DROP\s+DATABASE|CREATE\s+DATABASE|ALTER\s+SYSTEM)(?=\s|;|$)/im;

export class MigrationFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MigrationFileError";
  }
}

export function parseMigrationFilename(filename: string): { version: number; name: string } {
  const match = migrationFilenamePattern.exec(filename);
  if (!match) throw new MigrationFileError(`Invalid migration filename: ${path.basename(filename)}`);
  return { version: Number.parseInt(match[1], 10), name: match[2] };
}

export function migrationChecksum(sql: string): string {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

export function validateChecksum(checksum: string): void {
  if (!/^[a-f0-9]{64}$/.test(checksum)) {
    throw new MigrationFileError("Invalid migration checksum");
  }
}

function validateSql(filename: string, sql: string): void {
  if (sql.trim() === "") throw new MigrationFileError(`Empty migration: ${filename}`);
  if (transactionControlPattern.test(sql)) {
    throw new MigrationFileError(`Transaction control is forbidden in migration: ${filename}`);
  }
  if (forbiddenStatementPattern.test(sql)) {
    throw new MigrationFileError(`Unsafe statement is forbidden in migration: ${filename}`);
  }
}

export async function loadMigrationFiles(directory: string): Promise<readonly MigrationFile[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const sqlEntries = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".sql"));
  const migrations: MigrationFile[] = [];
  const versions = new Set<number>();
  const names = new Set<string>();

  for (const entry of sqlEntries) {
    const { version, name } = parseMigrationFilename(entry.name);
    if (versions.has(version)) throw new MigrationFileError(`Duplicate migration version: ${version}`);
    if (names.has(name)) throw new MigrationFileError(`Duplicate migration name: ${name}`);
    versions.add(version);
    names.add(name);

    const absolutePath = path.resolve(directory, entry.name);
    const sql = await fs.readFile(absolutePath, "utf8");
    validateSql(entry.name, sql);
    migrations.push(Object.freeze({
      version,
      name,
      filename: entry.name,
      absolutePath,
      sql,
      checksumSha256: migrationChecksum(sql)
    }));
  }

  return Object.freeze(migrations.sort((left, right) => left.version - right.version));
}
