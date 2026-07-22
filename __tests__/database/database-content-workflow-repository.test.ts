import type { QueryResult, QueryResultRow } from "pg";

import {
  DatabaseContentPersistenceError,
  DatabaseContentWorkflowRepository,
  type DatabaseRepositoryClient,
  type DatabaseRepositoryPool
} from "../../database/database-content-workflow-repository";
import { ContentRevisionConflictError } from "../../lib/content-workflow-errors";
import { siteContentSeed } from "../../data/site-content.seed";

function result<T extends QueryResultRow>(rows: T[] = []): QueryResult<T> {
  return { command: "SELECT", rowCount: rows.length, oid: 0, fields: [], rows };
}

function repository(pool: DatabaseRepositoryPool): DatabaseContentWorkflowRepository {
  return new DatabaseContentWorkflowRepository({ pool, siteKey: "unit-site", environment: "test" });
}

describe("DatabaseContentWorkflowRepository safety", () => {
  const unusedPool = { connect: async () => { throw new Error("unused"); } };

  test("rejects invalid constructor inputs before querying", () => {
    expect(() => new DatabaseContentWorkflowRepository({
      pool: unusedPool, siteKey: "   ", environment: "test"
    })).toThrow(DatabaseContentPersistenceError);
    expect(() => new DatabaseContentWorkflowRepository({
      pool: unusedPool, siteKey: "x".repeat(129), environment: "test"
    })).toThrow(DatabaseContentPersistenceError);
    expect(() => new DatabaseContentWorkflowRepository({
      pool: unusedPool, siteKey: "site", environment: "staging" as "test"
    })).toThrow(DatabaseContentPersistenceError);
    expect(() => new DatabaseContentWorkflowRepository({
      pool: undefined as unknown as DatabaseRepositoryPool,
      siteKey: "site",
      environment: "test"
    })).toThrow(DatabaseContentPersistenceError);
  });

  test("sanitizes connection failures", async () => {
    const pool: DatabaseRepositoryPool = {
      connect: async () => {
        throw new Error("postgres://operator:secret@internal.example/content password=secret");
      }
    };
    const error = await repository(pool).readPublished().catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(DatabaseContentPersistenceError);
    expect(String(error)).not.toContain("secret");
    expect(String(error)).not.toContain("internal.example");
  });

  test("rolls back, releases, and sanitizes SQL failures", async () => {
    const queries: string[] = [];
    let released = 0;
    const client = {
      query: jest.fn(async (sql: string) => {
        queries.push(sql);
        if (sql === "BEGIN") return result();
        if (sql === "ROLLBACK") return result();
        throw new Error("SELECT private_payload FROM secret_table password=secret");
      }),
      release: () => { released += 1; }
    } as unknown as DatabaseRepositoryClient;
    const error = await repository({ connect: async () => client }).saveDraft({
      scope: "brand",
      value: siteContentSeed.brand,
      expectedDraftRevision: null,
      expectedPublishedRevision: 1
    }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(DatabaseContentPersistenceError);
    expect(error).not.toBeInstanceOf(ContentRevisionConflictError);
    expect(String(error)).not.toContain("private_payload");
    expect(String(error)).not.toContain("secret");
    expect(queries).toContain("ROLLBACK");
    expect(released).toBe(1);
  });

  test("releases successful clients and never closes the caller pool", async () => {
    let released = 0;
    let endCalls = 0;
    const client = {
      query: jest.fn(async () => result([{ site_exists: true, has_drafts: false }])),
      release: () => { released += 1; }
    } as unknown as DatabaseRepositoryClient;
    const pool = {
      connect: async () => client,
      end: async () => { endCalls += 1; }
    };
    await expect(repository(pool).hasDrafts()).resolves.toBe(false);
    expect(released).toBe(1);
    expect(endCalls).toBe(0);
  });
});
