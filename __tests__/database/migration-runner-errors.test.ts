import { validateChecksum } from "../../database/migration-files";
import {
  MigrationRunnerError,
  sanitizeDatabaseError,
  validateCliCommand
} from "../../database/migration-runner";
import { requireMigrationUrl } from "../../scripts/content-db";

describe("migration runner error safety", () => {
  test("redacts connection strings and password assignments", () => {
    const raw = new Error(
      "connect postgres://operator:very-secret@db.example.test:5432/content password=very-secret"
    );
    const sanitized = sanitizeDatabaseError(raw);
    expect(sanitized).toContain("[REDACTED_DATABASE_URL]");
    expect(sanitized).toContain("password=[REDACTED]");
    expect(sanitized).not.toContain("very-secret");
    expect(sanitized).not.toContain("db.example.test");
  });

  test("drift and unknown migration errors contain identity but no SQL", () => {
    const drift = new MigrationRunnerError("Migration checksum drift detected for 1 (schema)");
    const unknown = new MigrationRunnerError("Unknown database migration 99 (unexpected)");
    expect(drift.message).toBe("Migration checksum drift detected for 1 (schema)");
    expect(unknown.message).toBe("Unknown database migration 99 (unexpected)");
    expect(`${drift.message}${unknown.message}`).not.toMatch(/CREATE TABLE|SELECT \*/);
  });

  test("rejects invalid checksums", () => {
    expect(() => validateChecksum("not-a-checksum")).toThrow("Invalid migration checksum");
    expect(() => validateChecksum("a".repeat(64))).not.toThrow();
  });

  test("validates CLI arguments without accepting arbitrary commands", () => {
    expect(validateCliCommand("status")).toBe("status");
    expect(validateCliCommand("up")).toBe("up");
    expect(validateCliCommand("verify")).toBe("verify");
    expect(() => validateCliCommand("down")).toThrow("Expected exactly one command");
    expect(() => validateCliCommand(undefined)).toThrow("Expected exactly one command");
  });

  test("requires only the dedicated migration URL variable", () => {
    expect(() => requireMigrationUrl({ DATABASE_URL: "ignored" })).toThrow(
      "CONTENT_DATABASE_MIGRATION_URL is required"
    );
    expect(requireMigrationUrl({ CONTENT_DATABASE_MIGRATION_URL: "test-value" })).toBe("test-value");
  });
});
