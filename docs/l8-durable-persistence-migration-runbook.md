# OFFICE NEXT L8 Durable Persistence Migration Runbook

> L8A design only. Every command or action below that can create, update, delete, migrate, restore, switch, or deploy data is marked **DO NOT EXECUTE IN L8A**.
> Formal source baseline: commit `47f90815dd7d8f73325dbbde7036054e8db75788`; `data/site-content.json` SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.

## 1. Preconditions and roles

Before any L8B migration stage:

- Architecture, provider, plan, region, RPO/RTO, Preview/Production isolation, and responsible owners are explicitly approved.
- Adapter contract/integration/API tests pass against disposable PostgreSQL.
- Preview and Production use separate databases/projects and separate credentials.
- Runtime, migration, backup, and restore roles are distinct and least-privileged.
- Production mutation is disabled and cannot be enabled by application deployment alone.
- The exact source Git SHA, source JSON hash, target project/database identity, schema migration SHA, timestamp, operator, approver, and evidence directory are recorded.
- No unknown Draft or local atomic temp file exists.
- All commands are run from a dedicated migration tool, not a public API route or build hook.
- Secrets are read from an approved secret store and never printed, copied into reports, shell history, Git, or chat.

Suggested ownership:

- Codex: implementation code/tests only.
- OpenClaw: QA evidence and approved deployment coordination.
- Human owner: provider/plan/resource approval, Production bootstrap approval, read cutover approval, mutation release approval, and restore authorization.

## 2. Global invariants

Every stage must preserve:

1. Formal `data/site-content.json` remains an unchanged Legacy root.
2. No Draft is introduced during bootstrap.
3. Database Published content is semantically equal to normalized Legacy Published content.
4. Initial global revision and all 14 scope revisions are `1`.
5. Preview never writes Production and never receives Production credentials.
6. Public output never contains Draft data.
7. A failed stage leaves the previous read path active and mutation disabled.
8. Evidence contains hashes and metadata, not full sensitive payloads or credentials.

Before and after every stage, run the read-only local checks:

```bash
git diff -- data/site-content.json
sha256sum data/site-content.json
git status --short
```

Stop immediately if the formal file has a diff, wrong hash, Envelope fields, Drafts, or an atomic temp file. Do not reset, restore, or auto-repair it.

## 3. Stage 0 — backup and migration manifest

Create an evidence manifest containing source path, SHA-256, byte count, Git SHA, schema version target, normalized semantic hash, migration tool version, UTC timestamp, operator, approver, and target masked identity.

**DO NOT EXECUTE IN L8A — data-copying action:** copy the original JSON to encrypted backup storage outside the repository, preserving exact bytes.

**DO NOT EXECUTE IN L8A — database backup action:** capture a pre-migration target snapshot/export even when the target is believed empty.

Verification:

- Re-hash the backup after upload and compare with the formal source.
- Confirm encryption at rest and in transit, access-control list, retention/expiry, and restore owner.
- Confirm no dump, backup, or manifest containing secrets is in Git.
- Perform a restore rehearsal into a disposable target before Production bootstrap.

Recommended initial objectives, pending user approval:

- RPO while Production mutation is enabled: 15 minutes or better.
- RTO: 4 hours or better.
- Migration evidence and pre-cutover immutable backup: at least 90 days.
- Daily logical Published snapshot: 30 days; weekly snapshot: 12 weeks.
- Draft backup: include in provider PITR/encrypted database backup because Drafts are user work; do not export Draft content to routine application logs.

If the selected provider/plan cannot satisfy approved recovery objectives, stop and change plan/provider before Production mutation.

## 4. Stage 1 — Preview database bootstrap

Inputs are the exact Legacy bytes and approved schema migration. The importer must parse with the same normalization semantics as `createEnvelopeFromLegacy`, but never rewrite the source.

Initial target state:

- one `content_sites` row for the Preview `(site_key, environment)`;
- `schema_version=1`;
- `published_content` equal to normalized Legacy content;
- `published_revision=1`;
- exactly 14 scope-version rows, each revision `1` and one recorded bootstrap timestamp;
- zero Draft rows.

**DO NOT EXECUTE IN L8A — schema mutation:** apply the reviewed SQL migration to the isolated Preview database.

**DO NOT EXECUTE IN L8A — data mutation:** run the idempotent Preview bootstrap importer with explicit source hash and target identity.

Idempotency rule: first run inserts only into an empty identity. A repeated run with identical source hash and already verified revision-1 state returns a no-op result. Any non-empty, different-hash, revision-above-1, or Draft-containing identity is a hard stop; never upsert over it.

Evidence:

- migration/version table output without credentials;
- source and normalized semantic hashes;
- target row counts and revisions;
- Draft count `0`;
- target environment identity, masked;
- bootstrap transaction ID/timestamp and tool commit.

## 5. Stage 2 — read-only comparison

Keep the active application driver unchanged. Compare Local File and database reads with mutation disabled.

Required comparisons:

- deep equality of complete Published `SiteContent`;
- normalized `design` and all four `pageBlocks` pages;
- global revision `1`, all scope revisions `1`, and documented timestamp policy;
- public render model for `/`, `/services`, `/about`, `/contact`;
- Admin editor fallback when Draft is absent;
- Admin Preview fallback when Draft is absent;
- no Draft leakage in public/raw production-runtime response;
- schema/cardinality/allowlist checks;
- repeated reads are side-effect free.

Fail on any semantic difference. Do not “fix” the formal JSON or accept a lossy normalization silently. Determine whether the importer or existing application normalization is wrong and create a scoped repair task.

## 6. Stage 3 — Preview database read-only cutover

Preconditions: Stage 2 passes, Preview database/schema are backed up, driver and mutation gates are independently tested, and Preview credentials are confirmed not to target Production.

**DO NOT EXECUTE IN L8A — configuration/deployment action:** set the Preview driver to database while keeping mutation disabled, then deploy only to the isolated Preview environment.

Run contract/API/browser read-only QA:

- public pages and site chrome;
- Admin login/dashboard/editor;
- Published-only Editor/Preview fallback;
- no-store/noindex/Vary behavior;
- unknown target/scope safe failures;
- sanitized outage/schema errors;
- build performed without database connection;
- logs contain no payloads, credentials, or connection details.

Keep Local File as a comparison source only. No automatic fallback is permitted; a database outage must be visible, not masked by stale JSON.

## 7. Stage 4 — Preview isolated mutation

Preconditions: read-only Preview QA passes; the target is proven Preview-only; restore rehearsal passes; mutation gate owner gives written Preview authorization.

**DO NOT EXECUTE IN L8A — configuration action:** enable mutations for isolated Preview only.

Exercise in order with unique test markers that contain no sensitive data:

1. first Save Draft and repeated Save Draft;
2. Editor and target-based Preview continuity across refresh/redeploy;
3. public Draft isolation;
4. stale Draft and stale Published conflicts;
5. simultaneous same-scope save;
6. different-scope publish without lost update;
7. Discard and missing Draft;
8. Publish and post-commit page revalidation;
9. injected storage/connection failure rollback;
10. application, driver, and data rollback rehearsal.

**DO NOT EXECUTE IN L8A — Preview data mutation:** clear approved test Drafts and restore the Preview Published baseline through a new, monotonic publish or disposable database rebuild. Never decrement revisions in place.

Record before/after revisions, row counts, operation IDs, timing, error classes, and semantic hashes—not full content.

## 8. Stage 5 — Production bootstrap

This is a separate explicit human gate. Preview approval does not authorize it.

Preconditions:

- current formal source hash is re-approved;
- Production database/role/region/plan and backup retention are reviewed;
- Production target identity is empty and cannot be confused with Preview;
- Production mutations remain disabled at API and repository layers;
- maintenance/rollback owners and communications window are assigned;
- latest build and migration artifacts are immutable and reviewed.

**DO NOT EXECUTE IN L8A — Production schema mutation:** apply the approved migration with the Production migration role.

**DO NOT EXECUTE IN L8A — Production data mutation:** import the exact approved Legacy source in one idempotent transaction.

Verify the same Stage 1 and Stage 2 evidence against Production, without changing the active driver. Any target row, Draft, unknown schema, hash mismatch, partial scope set, or unexpected privilege is a stop condition.

## 9. Stage 6 — Production database read-only

This requires another explicit approval after Production bootstrap comparison passes.

**DO NOT EXECUTE IN L8A — Production configuration/deployment action:** switch Production reads to database with mutations still disabled.

Validate:

- public and Admin Published output equivalence;
- authentication and Preview protection;
- database pool/latency/error metrics;
- no build-time connection;
- no Draft rows and no mutation query;
- rollback version remains available;
- Local JSON remains unchanged but is now a stale bootstrap source, not an active writable store.

Hold the read-only observation window approved by the user. Recommended minimum is one business day including normal traffic; final duration is an open decision.

## 10. Stage 7 — Production mutation release

This is a third Production approval. It must not be coupled to schema migration or read cutover.

Preconditions:

- Production read-only observation passed;
- provider recovery and application snapshot backups are current;
- restore rehearsal evidence is within the approved freshness window;
- on-call/rollback owner is present;
- contract, database integration, API, security, and Browser mutation gates pass on Preview;
- legacy direct Published routes are blocked in database mode;
- monitoring and gate-denial alerts are active.

**DO NOT EXECUTE IN L8A — Production configuration action:** enable Production mutations for the approved release window.

Start with one controlled non-sensitive Draft and verify Save/Preview/Discard before the first controlled Publish. Verify public isolation, revisions, audit metadata, and backup marker. Do not use the formal JSON as a writable rollback target.

## 11. Rollback strategies

### A. Application rollback

First close the mutation gate. Roll back application code only if the previous version can read the active database schema and preserve current data. If the old version reads only JSON, it is safe only before Production database mutation begins, or behind a maintenance response. Showing stale JSON after accepted database mutation is data loss from the user’s perspective.

**DO NOT EXECUTE IN L8A — deployment action:** deploy the approved previous compatible application version after mutation closure and compatibility verification.

### B. Driver rollback

Database → Local is allowed during Preview/read-only Production stages only when database mutation has never accepted a write and semantic equality is freshly verified.

**DO NOT EXECUTE IN L8A — configuration action:** switch the driver back to Local with mutations disabled.

Once Production accepts database mutation, Local JSON cannot be a lossless rollback target. Use a compatible database-reading application or maintenance mode.

### C. Data rollback

Close mutation, capture a forensic snapshot, identify a safe point, and restore to a new recovery database/branch when the provider supports it. Compare before cutover. Prefer restoring Published content as a new monotonically higher revision rather than decrementing current revisions; preserve or explicitly quarantine Drafts based on incident scope.

**DO NOT EXECUTE IN L8A — destructive recovery action:** provider PITR/restore, snapshot import, or revision-repair transaction.

Never restore in place without an additional pre-restore snapshot and explicit destructive-action approval. If provider restore is in-place, record the bookmark/snapshot needed to undo it.

**Critical invariant:** once Production has accepted Database mutations, Local JSON is no longer a direct lossless rollback target.

## 12. Backup and recovery policy

- Capture encrypted immutable source backup before bootstrap and database backup before every Production migration.
- Include Published and Draft tables in provider recovery. Export separate Published snapshots on the approved cadence; Draft exports require the same confidentiality controls as Published content.
- Keep backups outside Git/repository and restrict access to named operators.
- Test restoration into an isolated target at least quarterly and before mutation release.
- If provider PITR is unavailable, restore the latest encrypted logical snapshot to a new database, replay approved append-only evidence if available, assign new monotonic revisions, verify, then cut over.
- A future append-only publish event table may improve RPO/auditability but is not part of initial L8B and must not become an unreviewed full CMS history feature.
- Recovery evidence includes elapsed time, achieved recovery point, semantic comparison, missing operations, revision policy, and approver.

## 13. Stop conditions

Stop without automatic repair when any of these occurs:

- source diff/hash/Legacy-root invariant fails;
- target identity or environment is ambiguous;
- Preview has Production credential or writable data access;
- target is non-empty, has Drafts, or has revisions above bootstrap state;
- schema/cardinality/allowlist mismatch;
- normalized semantic or public output mismatch;
- unknown/malformed content;
- backup hash, restore rehearsal, or access control fails;
- migration is not idempotent;
- test/build/baseline gate fails;
- mutation gate cannot be independently proven closed;
- secret or full content appears in output/logs;
- provider fact or plan limit needed for safety is unverified;
- ambiguous transaction commit, provider outage, pool exhaustion, or repeated transient failure;
- unapproved resource, billing, environment, deployment, or Production change is required.

## 14. Evidence checklist

- [ ] Source branch, commit, bytes, SHA-256, Legacy-root proof.
- [ ] Formal JSON before/after diff empty and hash identical.
- [ ] Provider/project/database/region/plan approved; identity masked in report.
- [ ] Preview/Production role and credential separation verified.
- [ ] Schema migration SHA and reviewed SQL.
- [ ] Pre-stage backup hash, encryption, retention, restore test.
- [ ] Bootstrap row counts, all 14 scopes revision 1, Draft count 0.
- [ ] Full semantic/normalizer/public/editor/preview comparison PASS.
- [ ] Driver gate and mutation gate evidence.
- [ ] Contract, integration, API, security, and browser results.
- [ ] Concurrency and rollback rehearsal results.
- [ ] Logs/error sanitization and observability results.
- [ ] No repository dump, secret, formal mutation, merge, or unauthorized deployment.
- [ ] Separate approval record for Production bootstrap, read cutover, and mutation release.
