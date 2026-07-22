# PostgreSQL schema and migration tooling

This directory contains the provider-neutral, forward-only PostgreSQL schema migrations for OFFICE NEXT. PostgreSQL 17 in an isolated local Docker container is the current validation baseline. Runtime persistence remains the Local File adapter; a Database Repository Adapter is deferred to L8B-3. No Neon resource exists, and formal JSON content has not been migrated.

Migration files use `NNNN_lowercase_snake_case.sql`, are immutable after application, and are applied in numeric order. The runner records a SHA-256 checksum, rejects drift and unknown database migrations, holds a PostgreSQL advisory lock, and wraps each migration and its metadata record in one transaction. Migration files must not contain transaction-control statements.

Commands:

- `npm run db:status` — read migration status without creating metadata.
- `npm run db:migrate` — apply pending repository migrations.
- `npm run db:verify` — verify migration parity and schema metadata without mutation.
- `npm run test:db-schema` — run the isolated local PostgreSQL 17 integration gate.

The CLI reads only `CONTENT_DATABASE_MIGRATION_URL`. Never commit its value or any connection string. Migration credentials must remain separate from future runtime credentials, and these commands must not target Production.

Migrations are forward-only. There is no automatic down migration. Production rollback must use reviewed backups, point-in-time recovery, and an application gate. Local test cleanup removes the ephemeral container.

## Database repository adapter

L8B-3 adds `DatabaseContentWorkflowRepository` and validates it against the shared repository contract with `npm run test:db-repository`. The test creates an ephemeral local PostgreSQL 17 container, reads no formal JSON, needs no external database, and must never be run against Production.

The adapter owns neither its pool nor database lifecycle: it does not run migrations, bootstrap sites, or close the caller-provided pool. Runtime has not switched; Local File remains the formal driver. No Neon resource exists. Repository factory selection and feature flags are deferred to L8B-4.
