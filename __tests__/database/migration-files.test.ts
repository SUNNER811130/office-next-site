import { promises as fs } from "fs";
import os from "os";
import path from "path";

import {
  loadMigrationFiles,
  migrationChecksum,
  parseMigrationFilename
} from "../../database/migration-files";

async function temporaryDirectory(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "office-next-migrations-"));
}

describe("migration file loading", () => {
  const directories: string[] = [];

  afterEach(async () => {
    await Promise.all(directories.splice(0).map((directory) => fs.rm(directory, { recursive: true })));
  });

  async function directoryWith(files: Record<string, string>): Promise<string> {
    const directory = await temporaryDirectory();
    directories.push(directory);
    await Promise.all(Object.entries(files).map(([name, content]) => fs.writeFile(path.join(directory, name), content)));
    return directory;
  }

  test("parses versions, sorts numerically, and computes stable checksums", async () => {
    const directory = await directoryWith({
      "0010_later.sql": "SELECT 10;\n",
      "0002_earlier.sql": "SELECT 2;\n"
    });
    const migrations = await loadMigrationFiles(directory);
    expect(migrations.map(({ version, name }) => ({ version, name }))).toEqual([
      { version: 2, name: "earlier" },
      { version: 10, name: "later" }
    ]);
    expect(migrations[0].checksumSha256).toBe(migrationChecksum("SELECT 2;\n"));
    expect(parseMigrationFilename("0042_valid_name.sql")).toEqual({ version: 42, name: "valid_name" });
  });

  test("rejects duplicate versions", async () => {
    const directory = await directoryWith({
      "0001_first.sql": "SELECT 1;",
      "0001_second.sql": "SELECT 2;"
    });
    await expect(loadMigrationFiles(directory)).rejects.toThrow("Duplicate migration version: 1");
  });

  test("rejects duplicate names", async () => {
    const directory = await directoryWith({
      "0001_same.sql": "SELECT 1;",
      "0002_same.sql": "SELECT 2;"
    });
    await expect(loadMigrationFiles(directory)).rejects.toThrow("Duplicate migration name: same");
  });

  test("rejects empty migrations without exposing content", async () => {
    const directory = await directoryWith({ "0001_empty.sql": "  \n" });
    await expect(loadMigrationFiles(directory)).rejects.toThrow("Empty migration: 0001_empty.sql");
  });

  test.each(["BEGIN; SELECT 1;", "SELECT 1; COMMIT;", "ROLLBACK;"])(
    "rejects transaction control: %s",
    async (sql) => {
      const directory = await directoryWith({ "0001_control.sql": sql });
      await expect(loadMigrationFiles(directory)).rejects.toThrow("Transaction control is forbidden");
    }
  );

  test("fails closed for invalid SQL filenames and ignores non-SQL files", async () => {
    const invalid = await directoryWith({ "migration.sql": "SELECT 1;" });
    await expect(loadMigrationFiles(invalid)).rejects.toThrow("Invalid migration filename: migration.sql");

    const valid = await directoryWith({
      "0001_valid.sql": "SELECT 1;",
      "notes.txt": "not a migration"
    });
    await expect(loadMigrationFiles(valid)).resolves.toHaveLength(1);
  });

  test("does not include SQL or absolute home paths in validation errors", async () => {
    const secretSql = "BEGIN; SELECT 'do-not-print-this';";
    const directory = await directoryWith({ "0001_secret.sql": secretSql });
    try {
      await loadMigrationFiles(directory);
      throw new Error("Expected migration validation to fail");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      expect(message).not.toContain("do-not-print-this");
      expect(message).not.toContain(os.homedir());
    }
  });
});
