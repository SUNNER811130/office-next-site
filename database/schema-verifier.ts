import type { PoolClient } from "pg";

export type SchemaVerification = Readonly<{
  schemas: readonly string[];
  tables: readonly string[];
  migrationCount: number;
}>;

type QueryClient = Pick<PoolClient, "query">;

const expectedColumns: Record<string, Record<string, { type: string; nullable: boolean; defaulted?: boolean }>> = {
  "office_next_content.sites": {
    site_key: { type: "text", nullable: false },
    environment: { type: "text", nullable: false },
    schema_version: { type: "smallint", nullable: false, defaulted: true },
    published_content: { type: "jsonb", nullable: false },
    published_revision: { type: "integer", nullable: false },
    published_updated_at: { type: "timestamp with time zone", nullable: false },
    created_at: { type: "timestamp with time zone", nullable: false, defaulted: true },
    updated_at: { type: "timestamp with time zone", nullable: false, defaulted: true }
  },
  "office_next_content.scope_versions": {
    site_key: { type: "text", nullable: false },
    environment: { type: "text", nullable: false },
    scope: { type: "text", nullable: false },
    published_revision: { type: "integer", nullable: false },
    published_updated_at: { type: "timestamp with time zone", nullable: false }
  },
  "office_next_content.drafts": {
    site_key: { type: "text", nullable: false },
    environment: { type: "text", nullable: false },
    scope: { type: "text", nullable: false },
    value: { type: "jsonb", nullable: false },
    revision: { type: "integer", nullable: false },
    based_on_published_revision: { type: "integer", nullable: false },
    updated_at: { type: "timestamp with time zone", nullable: false }
  },
  "office_next_migrations.schema_migrations": {
    version: { type: "integer", nullable: false },
    name: { type: "text", nullable: false },
    checksum_sha256: { type: "character", nullable: false },
    applied_at: { type: "timestamp with time zone", nullable: false, defaulted: true },
    execution_ms: { type: "integer", nullable: false }
  }
};

const expectedConstraints = [
  "sites_pkey",
  "sites_site_key_valid",
  "sites_environment_valid",
  "sites_schema_version_positive",
  "sites_published_content_object",
  "sites_published_revision_positive",
  "scope_versions_pkey",
  "scope_versions_site_fkey",
  "scope_versions_scope_valid",
  "scope_versions_published_revision_positive",
  "drafts_pkey",
  "drafts_scope_version_fkey",
  "drafts_scope_valid",
  "drafts_revision_positive",
  "drafts_based_on_published_revision_positive",
  "schema_migrations_pkey",
  "schema_migrations_name_key",
  "schema_migrations_checksum_sha256_valid",
  "schema_migrations_execution_ms_nonnegative"
] as const;

function fail(message: string): never {
  throw new Error(`Schema verification failed: ${message}`);
}

export async function verifyContentSchema(client: QueryClient): Promise<SchemaVerification> {
  const schemaResult = await client.query<{ schema_name: string }>(
    `SELECT schema_name FROM information_schema.schemata
     WHERE schema_name = ANY($1::text[]) ORDER BY schema_name`,
    [["office_next_content", "office_next_migrations"]]
  );
  const schemas = schemaResult.rows.map((row) => row.schema_name);
  if (schemas.join(",") !== "office_next_content,office_next_migrations") fail("required schemas are missing");

  const columnResult = await client.query<{
    table_schema: string;
    table_name: string;
    column_name: string;
    data_type: string;
    is_nullable: "YES" | "NO";
    column_default: string | null;
  }>(
    `SELECT table_schema, table_name, column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_schema = ANY($1::text[])
     ORDER BY table_schema, table_name, ordinal_position`,
    [["office_next_content", "office_next_migrations"]]
  );
  const actualColumns = new Map(columnResult.rows.map((row) => [
    `${row.table_schema}.${row.table_name}.${row.column_name}`,
    row
  ]));
  for (const [table, columns] of Object.entries(expectedColumns)) {
    for (const [column, expected] of Object.entries(columns)) {
      const actual = actualColumns.get(`${table}.${column}`);
      if (!actual) fail(`missing column ${table}.${column}`);
      if (actual.data_type !== expected.type) fail(`wrong type for ${table}.${column}`);
      if ((actual.is_nullable === "YES") !== expected.nullable) fail(`wrong nullability for ${table}.${column}`);
      if (expected.defaulted && actual.column_default === null) fail(`missing default for ${table}.${column}`);
    }
  }

  const constraintResult = await client.query<{ conname: string; contype: string; delete_action: string }>(
    `SELECT c.conname, c.contype,
            CASE c.confdeltype WHEN 'c' THEN 'CASCADE' ELSE c.confdeltype::text END AS delete_action
     FROM pg_constraint c
     JOIN pg_namespace n ON n.oid = c.connamespace
     WHERE n.nspname = ANY($1::text[])`,
    [["office_next_content", "office_next_migrations"]]
  );
  const constraints = new Map(constraintResult.rows.map((row) => [row.conname, row]));
  for (const name of expectedConstraints) if (!constraints.has(name)) fail(`missing constraint ${name}`);
  for (const name of ["scope_versions_site_fkey", "drafts_scope_version_fkey"]) {
    if (constraints.get(name)?.delete_action !== "CASCADE") fail(`foreign key ${name} is not cascading`);
  }

  const primaryIndexResult = await client.query<{ count: string }>(
    `SELECT count(*)::text AS count
     FROM pg_index i
     JOIN pg_class t ON t.oid = i.indrelid
     JOIN pg_namespace n ON n.oid = t.relnamespace
     WHERE i.indisprimary
       AND (n.nspname, t.relname) IN (
         ('office_next_content', 'sites'),
         ('office_next_content', 'scope_versions'),
         ('office_next_content', 'drafts'),
         ('office_next_migrations', 'schema_migrations')
       )`
  );
  if (primaryIndexResult.rows[0]?.count !== "4") fail("primary key indexes are incomplete");

  const migrationResult = await client.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM office_next_migrations.schema_migrations"
  );
  if (migrationResult.rows[0]?.count !== "1") fail("expected exactly one applied migration");

  return Object.freeze({
    schemas: Object.freeze(schemas),
    tables: Object.freeze(Object.keys(expectedColumns)),
    migrationCount: 1
  });
}
