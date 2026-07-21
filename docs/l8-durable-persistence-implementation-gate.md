# OFFICE NEXT L8 Durable Persistence Implementation Gate

> L8A result: design complete and awaiting human architecture approval. This file proposes L8B boundaries; it authorizes no implementation, dependency install, database creation, migration, deployment, or Production mutation.

## 1. L8A results

- Current Local File workflow contract, revisions, conflicts, Preview composition, auth, legacy compatibility, atomic replace, and mutation coordinator were verified at commit `47f90815dd7d8f73325dbbde7036054e8db75788`.
- Candidate A—Published snapshot + scope version rows + Draft rows—is recommended.
- Neon Postgres is primary; Supabase Postgres is fallback.
- Direct PostgreSQL SQL and explicit transaction control are preferred over an ORM/provider Data API.
- Production remains read-only until separate bootstrap, read-cutover, and mutation-release approvals.

## 2. Recommended target

### Provider and schema

- Provider: Neon Postgres, pending user approval.
- Fallback: Supabase Postgres, using the same schema and repository contract.
- Tables: `content_sites`, `content_scope_versions`, `content_drafts`.
- Atomicity: lock the current site snapshot, scope row, and Draft under one PostgreSQL transaction; merge from the latest locked snapshot.
- Initial history: no full Published revision-history feature. Provider recovery plus encrypted snapshots; future event table requires a separate scope.

### Proposed dependencies

Subject to approval and a package security/license check in L8B:

- Runtime: `pg`.
- Types if required by the chosen version: `@types/pg` as development dependency.
- Migration runner: a small repository-owned TypeScript/SQL runner using the same driver, or a separately approved migration-only tool. Do not adopt an ORM merely to run one schema.
- Integration tests: local PostgreSQL supplied by CI/service/container tooling; do not add a provider SDK to domain tests.

No dependency may be installed in L8A. Lockfile changes must be isolated to the approved dependency phase.

## 3. Proposed environment variable names

Names only; values must not be printed or committed:

- `CONTENT_PERSISTENCE_DRIVER`
- `CONTENT_MUTATIONS_ENABLED`
- `CONTENT_DATABASE_URL`
- `CONTENT_SITE_KEY`
- `CONTENT_ENVIRONMENT`
- `CONTENT_DATABASE_SSL_MODE` (only if strictly necessary)
- `CONTENT_DATABASE_POOL_MAX` (optional, bounded and validated)

Unknown/missing driver or mutation values fail closed. Production Local File mutation is always blocked. Preview and Production values/credentials are scoped separately in Vercel.

## 4. L8B staged work breakdown

Each phase is a separate commit, OpenClaw QA cycle, and rollback point. Do not combine coding with database creation, deployment, or traffic promotion.

### L8B-1 — Repository contract extraction

Goal: make the current contract reusable without changing the active driver.

Proposed source allowlist:

- `types/content-workflow.ts`
- `lib/content-store.ts`
- `lib/admin-preview.ts`
- new shared contract-test helper under `__tests__/contracts/`
- necessary existing Local File repository tests only

Forbidden: database dependencies, schema, adapter, environment access, formal JSON, UI, deployment.

Gate: Local File adapter passes the complete reusable contract suite; current API/UI observable behavior and build pass.

### L8B-2 — Database schema and migration tooling

Goal: add reviewed SQL and idempotent tooling for local/test only.

Proposed allowlist:

- `db/migrations/*`
- `scripts/content-persistence/*`
- migration unit/integration tests
- package manifests only for the separately approved direct driver

Forbidden: external resource creation, Preview/Production connection, driver switch, formal JSON mutation, deploy.

Gate: up/down or forward-only strategy is documented; clean migrate, repeated migrate, malformed/unknown input, empty-target enforcement, and rollback-on-failure pass on disposable PostgreSQL.

### L8B-3 — Database repository adapter

Goal: implement `DatabaseContentWorkflowRepository` without selecting it in Production.

Proposed allowlist:

- `lib/database-content-workflow-repository.ts`
- server-only database connection helper
- database error translation helper
- shared contract and database integration tests

Forbidden: UI, legacy direct mutation implementation, active factory switch, Vercel env, Preview/Production database.

Gate: full Local + Database contract suite, real transaction/concurrency/failure tests, lint/type/Jest/build pass.

### L8B-4 — Repository factory and feature flags

Goal: server-only adapter selection and defense-in-depth mutation gate, default closed.

Proposed allowlist:

- `lib/content-workflow-repository-factory.ts`
- `lib/content-mutation-policy.ts`
- `lib/content-store.ts`
- the three workflow mutation routes
- repository/factory/API gate tests

The legacy base PUT route may only be blocked/retired after an exact caller test proves no approved UI dependency. Do not silently implement direct Published writes in database mode.

Gate: unknown config fails closed; database modules never enter client bundle/build path; `database + false` reads and rejects all writes; direct API calls cannot bypass policy; Local on Vercel is read-only.

### L8B-5 — Preview bootstrap and read-only validation

Goal: create/select an isolated Preview resource only after human provider/plan approval, bootstrap from the unchanged Legacy source, compare, and run database reads with mutations disabled.

This phase is operational and must be orchestrated by OpenClaw after code QA. Codex must not provision or deploy.

Gate: migration runbook Stages 0–3 evidence PASS; no Production access; no formal JSON mutation.

### L8B-6 — Preview mutation validation

Goal: enable mutation only in isolated Preview and verify Save, refresh continuity, Preview/public isolation, conflicts, Discard, Publish, concurrent different-scope publish, and rollback rehearsal.

Gate: full Browser/API/database evidence PASS, Draft cleanup verified, no critical logs, recovery rehearsal meets proposed objectives.

### L8B-7 — Production migration gate

Goal: finalize immutable artifacts, evidence templates, and human approvals. No automatic Production execution.

Split actual execution into three separately approved OpenClaw stages:

1. Production bootstrap with active driver unchanged.
2. Production database read-only cutover.
3. Production mutation release after observation.

## 5. Exact test gates

Every coding phase:

- `git diff --check`.
- TypeScript PASS.
- all Jest suites/tests PASS.
- Next.js Production Build PASS.
- formal JSON diff empty and exact SHA unchanged.
- changed-file allowlist PASS; no secrets, dumps, env files, or temp files.

Repository contract minimum:

- Published, Editor with/without Draft, Preview, and `hasDrafts`.
- first/repeated Save.
- stale Draft/Published/base conflicts.
- Publish and missing Draft.
- Discard and missing/stale Draft.
- scope isolation and normalizers.
- concurrent same-scope save and different-scope publish.
- storage failure atomic rollback and safe error metadata.

Database integration minimum:

- real PostgreSQL transaction, not mocked SDK;
- migration from empty and repeated migration;
- unique/FK/check/allowlist constraints;
- canonical lock ordering and retry classification;
- pool reuse/exhaustion behavior;
- ambiguous commit fails closed;
- schema mismatch and provider outage sanitization.

API/security minimum:

- authentication occurs before parsing/repository access;
- existing status/payload/header contracts;
- mutation gate at route and repository;
- public never reads Draft;
- Preview target allowlist and environment identity mismatch fail closed;
- logs/errors/client bundles contain no credentials or content payloads.

Migration minimum:

- exact Legacy import and normalized semantic equality;
- formal source hash unchanged;
- revisions initialized to 1 and zero Drafts;
- non-empty target/refusal and idempotent identical retry;
- unknown/malformed content rejection;
- backup/restore and rollback evidence.

## 6. Required human approvals

- [ ] Provider: Neon primary or Supabase fallback.
- [ ] Direct provider ownership versus Vercel Marketplace billing/integration.
- [ ] Plan, current price, spend limit, region, recovery retention, and support tier.
- [ ] Direct `pg` dependency and SQL migration strategy.
- [ ] Separate Preview and Production projects/databases/credentials.
- [ ] RPO, RTO, backup retention, access owners, and restore cadence.
- [ ] L8B implementation branch and exact phase allowlist before each phase.
- [ ] Preview resource creation and Preview deployment.
- [ ] Production database resource creation.
- [ ] Production bootstrap.
- [ ] Production read-only cutover.
- [ ] Production mutation release after observation.

## 7. Production prohibitions

Until the relevant explicit approval and preceding gates pass:

- no Production database/resource/integration creation;
- no Vercel environment changes;
- no Production migration or data write;
- no Production mutation;
- no merge, deploy, or promote by Codex;
- no automatic driver fallback to Local JSON;
- no legacy direct Published mutation in database mode;
- no use of Production data in Preview/test;
- no secret, dump, content payload, or credential in Git/report/chat;
- no revision decrement or in-place destructive restore without a new explicit incident approval.

## 8. Go / No-Go checklist

### Architecture Go

- [ ] Four L8A documents reviewed.
- [ ] Provider/schema/driver/isolation approved.
- [ ] Open decisions resolved or explicitly deferred without affecting safety.

### L8B coding Go

- [ ] One phase only, exact allowed/forbidden files and commit message defined.
- [ ] Baseline clean and formal SHA correct.
- [ ] No simultaneous OpenClaw modification of the same files.
- [ ] Tests and rollback defined before edits.

### Preview Go

- [ ] Code QA PASS and resource/plan approval recorded.
- [ ] Isolated Preview identity/credential verified.
- [ ] Backup and bootstrap comparison PASS.
- [ ] Mutation remains false for first cutover.

### Production bootstrap Go

- [ ] All Preview read/mutation/rollback gates PASS.
- [ ] Current provider facts, plan, recovery, and cost reviewed.
- [ ] Formal source and target preconditions re-verified.
- [ ] Explicit bootstrap approval recorded.

### Production mutation Go

- [ ] Production read-only observation PASS.
- [ ] Fresh backup and restore rehearsal PASS.
- [ ] Monitoring/on-call/rollback owners present.
- [ ] Legacy routes blocked and gates proven.
- [ ] Separate mutation-release approval recorded.

Any unchecked safety item is **NO-GO**. Approval of L8A means only “ready to begin the selected L8B coding phase”; it does not mean database implementation, migration, Production readiness, or mutation readiness.

## 9. Recommended first implementation phase

After user architecture approval, start only with **L8B-1 Repository contract extraction** on a new user-approved branch based on the accepted L8A commit. It changes no provider, schema, runtime driver, data, resource, or deployment and creates the test boundary needed to prove later adapters are behaviorally equivalent.
