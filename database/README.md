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

## L8B-4 runtime repository factory

The server runtime now has a repository factory for the `local` and `database`
drivers. Local File persistence remains the default when
`CONTENT_PERSISTENCE_DRIVER` is not set. Runtime configuration uses only:

- `CONTENT_PERSISTENCE_DRIVER`
- `CONTENT_MUTATIONS_ENABLED`
- `CONTENT_PRODUCTION_MUTATIONS_CONFIRMED`
- `CONTENT_DATABASE_RUNTIME_URL`
- `CONTENT_SITE_KEY`
- `CONTENT_RUNTIME_ENVIRONMENT`

`CONTENT_DATABASE_RUNTIME_URL` is intentionally separate from the migration
credential. The factory does not fall back to a migration URL, run migrations,
or bootstrap database content. Preview and production default to read-only;
the Local File driver is always read-only there. Production database mutations
also require the explicit production confirmation flag.

No Neon resource or Preview database connection is configured in L8B-4. L8B-5
will provision the Neon Preview resource and perform a read-only bootstrap.
Never commit real runtime URLs, site identifiers, or secrets.

## L8B-5A Preview bootstrap tooling

L8B-5A adds safe tooling for bootstrapping the read-only formal Legacy JSON into
a previously migrated Preview content site. The source file is read-only and is
accepted only when its SHA-256 equals the reviewed fixed checksum. Bootstrap is
transactional and idempotent: an exact existing state is unchanged, while any
content, revision, scope, schema, or Draft drift fails closed without repair,
overwrite, or force support. Production is not supported.

Commands:

- `npm run db:preview-bootstrap` uses only the migration URL to bootstrap and verify.
- `npm run db:preview-verify` uses only the runtime URL for read-only verification.
- `npm run test:db-preview-bootstrap` validates the complete flow against an isolated PostgreSQL 17 container.

Migration and runtime credentials remain separate. The intended runtime role has
only `CONNECT`, schema `USAGE`, and table `SELECT` privileges. The tooling neither
runs migrations automatically nor enables runtime bootstrap. L8B-5A creates no
Neon resource and changes no Vercel configuration; external Preview provisioning
is deferred to L8B-5B. Never commit a real database URL or password.
