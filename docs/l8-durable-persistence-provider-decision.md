# OFFICE NEXT L8 Durable Persistence Provider Decision

> Decision status: recommendation awaiting user architecture approval.
> Research date: 2026-07-21.
> Sources: official provider/product documentation only. No account login, resource creation, trial activation, plan acceptance, or environment change was performed.

## 1. Decision summary

- **Primary recommendation:** Neon Postgres, preferably through a reviewed Vercel Marketplace integration or a directly managed Neon project.
- **Secondary fallback:** Supabase Postgres.
- **Not selected:** Firestore and Cloudflare D1 for this workflow; a generic “Vercel Marketplace Postgres” entry is an integration channel, not a complete provider decision.
- **Client strategy:** portable PostgreSQL schema and direct SQL driver; provider-specific provisioning stays outside the repository contract.

The deciding factor is not generic JSON storage. It is the need to lock and re-read a Draft, a scope revision, and the current full Published snapshot, then update both revision layers and delete the Draft in one transaction. PostgreSQL maps directly to that contract and minimizes migration risk.

## 2. Official sources consulted

### Vercel

- [Postgres on Vercel](https://vercel.com/docs/postgres): Vercel Postgres is no longer offered; new projects use external Marketplace Postgres integrations.
- [Vercel Storage overview](https://vercel.com/docs/storage): Marketplace provides relational databases with ACID transactions and recommends colocating data and Functions.
- [Storage on Vercel Marketplace](https://vercel.com/docs/marketplace-storage): lists Neon, Supabase, and AWS Aurora Postgres; credentials can be injected as environment variables and serverless workloads should use pooling.
- [Neon for Vercel](https://vercel.com/marketplace/neon): documents native integration, branching for Preview deployments, autoscaling, serverless driver, and point-in-time recovery.

### Neon

- [Neon pricing](https://neon.com/pricing): current plan/usage descriptions, branch allowances, and restore-window terms. Exact future bill remains workload- and plan-dependent.
- [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver): HTTP supports one-shot/non-interactive transactions; WebSockets support interactive transactions and node-postgres-compatible clients.
- [Point-in-time restore](https://neon.com/blog/announcing-point-in-time-restore): branch restore from retained history and time-travel verification.

### Supabase

- [Database overview](https://supabase.com/docs/guides/database/overview): each project is full PostgreSQL; managed backups and paid PITR are available.
- [Connect to Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres): transaction-mode pooler is intended for serverless/edge functions; prepared statements are not supported in that mode.
- [Branching](https://supabase.com/docs/guides/deployment/branching): Preview branches are separate ephemeral environments with separate credentials.
- [Database backups](https://supabase.com/docs/guides/platform/backups): paid daily backup retention and PITR behavior/restore downtime.
- [Supabase pricing](https://supabase.com/pricing): current plan overview; exact project total remains Not verified for this workload.

### Firestore

- [Transactions and batched writes](https://firebase.google.com/docs/firestore/manage-data/transactions): atomic multi-document transactions automatically retry after concurrent changes.
- [Usage and limits](https://firebase.google.com/docs/firestore/quotas): documents have a 1 MiB maximum; billing is required for several recovery features.
- [Disaster recovery](https://firebase.google.com/docs/firestore/disaster-recovery): scheduled backups and PITR/clone recovery characteristics.
- [Firestore locations](https://firebase.google.com/docs/firestore/locations): location is selected at provisioning and should be close to users/services.
- [Firestore billing](https://firebase.google.com/docs/firestore/pricing): operation/storage/network billing and free-quota caveats.

### Cloudflare D1

- [D1 limits](https://developers.cloudflare.com/d1/platform/limits/): SQLite-based database limits, per-database single-threaded execution, and Time Travel retention.
- [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/): always-on restore history, in-place destructive restore, and current no-clone limitation.
- [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/): rows-read/rows-written/storage model and scale-to-zero.
- [Access D1 outside Workers](https://developers.cloudflare.com/d1/tutorials/build-an-api-to-access-d1/): outside a Worker/Pages project, a proxy Worker API is required; the administrative REST API is not the application query path.

### PostgreSQL semantics

- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html): row locks and consistent lock ordering.
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/sql-set-transaction.html): `READ COMMITTED`, `REPEATABLE READ`, and `SERIALIZABLE` behavior.

## 3. Candidate matrix

| Candidate | Transaction / CAS | JSON and atomic publish | Vercel connection model | Isolation / backup | Local and CI testing | Portability / lock-in | Cost status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Neon Postgres | Full PostgreSQL transactions, row locks, CAS | `jsonb`; exact L8 publish transaction | Standard pooled Postgres or Neon serverless driver; native Vercel integration | Branches/Preview integration and restore history; separate projects supported | Local PostgreSQL gives high-fidelity contract tests | SQL/schema portable; provisioning/branch APIs provider-specific | Current pricing page verified; actual monthly cost **Not verified** |
| Supabase Postgres | Full PostgreSQL transactions, row locks, CAS | `jsonb`; exact L8 publish transaction | Supavisor transaction pooler targets serverless; direct/session modes for migrations | Separate branch instances/credentials; paid backups/PITR | Local PostgreSQL and Supabase CLI options | Core SQL portable; platform services are optional lock-in | Plan page verified; actual monthly cost **Not verified** |
| Vercel Marketplace Postgres-compatible provider | Depends on selected provider; Postgres category supports ACID | Usually suitable after provider selection | Best Vercel lifecycle/injected configuration | Provider-dependent | Provider-dependent | Marketplace itself is a channel; provider is still required | **Not verified** until provider/plan selected |
| Google Firestore | Atomic multi-document transactions with automatic retry | Document maps; snapshot must stay below 1 MiB and model differs from SQL locks | Server SDK over Google API; Vercel-compatible but no native SQL pooling | Separate DB/projects; backup/PITR require billing | Emulator/integration testing available | High document/API and migration lock-in | Operation-based pricing documented; project total **Not verified** |
| Cloudflare D1 | Atomic SQLite execution/batches; concurrency model differs from PostgreSQL row locks | JSON text/functions possible; transaction control and external access add design work | Natural in Workers; Vercel needs a separately secured proxy Worker | Multiple DBs and Time Travel; restore is in-place, clone not currently available | Local Wrangler D1 is good but provider-specific | SQLite/D1 bindings and proxy architecture increase lock-in | Usage model documented; project total **Not verified** |

### Detailed observations

- **Transaction and concurrency:** Neon and Supabase inherit PostgreSQL transactions, `SELECT ... FOR UPDATE`, constraints, and predictable SQLSTATE retry classes. Firestore can be made correct but its automatic transaction re-execution and document model require a distinct adapter algorithm. D1 could serialize this small workload, but Vercel-to-D1 application access adds another service boundary and less portable failure semantics.
- **Snapshot size:** PostgreSQL JSONB has no Firestore-style 1 MiB document ceiling for the target row. Firestore’s current 1 MiB document maximum makes a single future-growing `SiteContent` document an avoidable architectural limit.
- **Preview isolation:** Neon’s Vercel integration explicitly supports database branches for Preview deployments. Supabase branching also creates isolated instances and credentials. Both still require a policy that Preview never branches from sensitive Production data.
- **Backup and rollback:** Provider recovery features vary by plan and retention. Application-level encrypted snapshots remain mandatory because a provider control-plane restore is not a substitute for migration evidence or a portable backup.
- **Region:** all providers require measured latency and chosen function placement. Exact Taiwan-to-region latency was not measured in L8A. The implementation gate requires a Preview measurement before Production approval.

## 4. Weighted scoring

Scoring is 1 (poor) to 5 (strong). Weights retain the task proposal because integrity and rollback dominate this low-write CMS:

| Criterion | Weight |
| --- | ---: |
| Data integrity / transaction semantics | 25% |
| Vercel / Next.js compatibility | 15% |
| Migration and rollback safety | 15% |
| Operational simplicity | 10% |
| Environment isolation | 10% |
| Testing support | 10% |
| Cost | 10% |
| Vendor portability | 5% |

| Candidate | Integrity | Vercel | Migration | Ops | Isolation | Testing | Cost | Portability | Weighted / 5 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Neon Postgres | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | **4.80** |
| Supabase Postgres | 5 | 4 | 5 | 4 | 4 | 4 | 3 | 5 | **4.35** |
| Marketplace Postgres, provider unspecified | 4 | 5 | 4 | 5 | 4 | 3 | 3 | 4 | **4.10** |
| Google Firestore | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 2 | **3.75** |
| Cloudflare D1 | 3 | 2 | 3 | 3 | 4 | 4 | 5 | 3 | **3.25** |

The generic Marketplace row cannot be approved despite its score because transaction, backup, region, and price are provider-specific. Once Neon is selected through Marketplace it is the Neon row, not a separate architecture.

## 5. Recommendation

### Primary — Neon Postgres

Neon most directly matches the project’s Vercel deployment model and L8 Preview isolation needs while retaining standard PostgreSQL. Its native Vercel integration and Preview branching reduce operational work, and SQL transactions safely implement the current scope revision contract.

Use standard SQL tables and a portable driver boundary. Do not make repository behavior depend on Neon branching APIs, Data API, or console-only features. Use separate Preview and Production projects/credentials; optional PR branches are a deployment concern outside domain code.

### Secondary — Supabase Postgres

Supabase is the fallback because it is also full PostgreSQL, supports serverless pooling and isolated branches, and preserves the same schema/migrations. It is second because OFFICE NEXT currently needs only durable workflow storage; the broader Supabase platform adds little value, and the reviewed backup/PITR plan constraints may add cost/operations. This ranking can change if the user already operates Supabase or its regional/support terms are materially better.

### Not recommended for L8B

- **Firestore:** technically capable, but it requires a separate data model and concurrency contract, adds document-size and provider API constraints, and makes PostgreSQL fallback/migration harder without a project-specific advantage.
- **Cloudflare D1:** attractive cost and local tooling, but the application is on Vercel; a production query proxy Worker becomes another deployable security/reliability component. D1’s transaction and restore model is less direct for the required interactive publish flow.
- **Unspecified Marketplace provider:** cannot be a final architecture decision. Marketplace simplifies provisioning and billing but does not define database guarantees.

## 6. Cost, region, and operational caveats

- Price pages and plan descriptions were checked on 2026-07-21, but no workload, retention window, support tier, tax/currency, egress, branch count, or billing account was inspected. **Actual cost: Not verified.**
- Do not select or accept a paid plan in L8A/L8B without user approval.
- Recovery capability can change by plan. The approved plan must satisfy the runbook’s RPO/RTO and retention gates; a free plan is not automatically Production-acceptable.
- Exact Taiwan latency and the final database/function region pairing are **Not verified**. Measure from the actual Vercel Preview environment with representative read and publish transactions.
- Marketplace credential injection is convenient but environment scoping must be manually verified; Production secrets must never appear in Preview.

## 7. Required user decision

The user must explicitly approve:

1. Neon Postgres primary, or Supabase fallback.
2. Direct provider account versus Vercel Marketplace ownership/billing.
3. Free versus paid plan after current pricing and recovery terms are reviewed.
4. Preview and Production project/database separation and region.
5. Direct `pg` driver and plain SQL migration approach.
6. RPO/RTO, retention, access owners, and restore rehearsal cadence.

Approval of this document authorizes architecture selection only. It does not authorize resource creation, credentials, migration, deployment, or Production mutation.
