# Codex Handoff

## Final — L7 Conditional Release Closeout — 2026-07-21

### 1. Summary

**L7 Conditional PASS — intermittent recoverable React #418 remains a monitored known issue.** Server-Shell architecture and all deterministic workflow/security gates passed. The `58/58` focused production matrix and `160/160` paired document-start matrix passed. Historical supported #418 evidence remains preserved; no stable reproducer or product branch was localized, and React #418 is not declared eradicated. Additional random localhost load testing is closed due to diminishing diagnostic value.

### 2. Files changed

- Server-Shell product files and corresponding route moves.
- Preview authentication／shell-separation regression tests.
- Draft／Publish workflow guide and L7 release-gate documentation.
- This handoff and `.agent_runs/l7-validation-report.md`.

### 3. Tests run

- Fresh isolated source copy with no inherited `.next` or `.swc` state.
- `L7_MIGRATION_DIR=<dedicated /tmp fixture> npm run anti:check`: TypeScript PASS; Jest `25/25` suites and `345/345` tests PASS.
- `npm run build`: PASS; production compile/type checks, Middleware／instrumentation, Dynamic Admin Preview, traces, and static generation `45/45` PASS.
- Generated types stale/nonexistent route paths: `0`. Migration atomic temp files: `0`.
- No new Browser load matrix and no workflow mutation were run during closeout.

### 4. Commit

- Message: `refactor: move published site chrome to server shell`.
- The final immutable SHA is reported after commit creation; no push, deploy, merge, PR, or migration is authorized in this handoff.

### 5. Needs OpenClaw QA

- Yes. Verify the allowlisted commit and perform the normal post-commit safety review without rerunning random hydration matrices.

### 6. Needs deploy

- Push: No.
- Deploy: No.
- Real mutation deployment remains blocked until durable external persistence exists.

### 7. Needs manual verification

- Confirm the commit and restricted-file exclusion, then authorize Push separately if desired.
- After Push, only read-only Preview evaluation may proceed.

### 8. Risks / notes

- Historical intermittent recoverable React #418 remains monitored. Historical FAIL reports are retained and not rewritten.
- Read-only Preview evaluation may proceed; Draft／Publish mutation deployment may not.
- Formal `data/site-content.json` remains an unchanged Legacy root with SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.

## Latest — L7 Paired Clean-Profile Document-Start Capture Gate — 2026-07-21

- **D — 160/160 PASS.** Strict alternating matrix completed: Legacy `80/80`, Envelope `80/80`; no new supported React #418, and no loads were added beyond the ceiling.
- Four runtime lifecycles covered Pairs 01–20, 21–40, 41–60, and 61–80 with exact port release after each 20-pair boundary. Lifecycle 3 retained exact launch-shell/listener/cwd evidence, but its intermediate npm/Next-shell PIDs were not separately sampled and are reported as unavailable.
- Every formal navigation used a distinct clean profile and document-start synchronous capture. Exact Document bodies/request IDs/SHA/bytes/headers, nine JS body hashes, Cookie/RSC booleans, and final snapshots are retained; all 160 used reduced-motion=false and no cache/service worker.
- Classification text: **Paired capture did not reproduce / Historical supported FAIL remains / No product repair or Commit authorized.** No FAIL diff or new root-cause candidate is available.
- Both QA runtimes stopped. Formal Legacy SHA, QA Legacy/Envelope baselines, empty Draft scopes, package/staging/temp safety all PASS. No product/test/persistence/workflow/build/package mutation; no commit/push/deploy/merge/PR/migration.
- Report: `.agent_runs/l7-hydration-paired-document-start-capture.md`.

## Latest — L7 Legacy／Envelope Hydration Isolation Gate — 2026-07-20

- **FAIL / inconclusive.** Identical Build ID and isolated state confirmed. Corrected 2×2: Legacy clean `39/40` (one new #418 at LCA16), Legacy auth `10/10`, Envelope clean `40/40`, Envelope auth `10/10`.
- agent-browser 0.31.1 `errors --clear` retained the error buffer; post-LCA16 raw counts were corrected by buffer deltas and are not 25 independent failures.
- LCA01 PASS/LCA16 FAIL shared the same measured response SHA, chunks, headers, Page Blocks, normalized BODY style, and Chrome. FAIL post-recovery alone lacked trailing `$`/`/$` comments.
- The matrix matches none of A–E; do not falsely blame Envelope, auth, Shell, or repository. Only paired clean-profile replication with document-start capture is authorized next; no product-code scope is authorized.
- Both runtimes stopped; persistence/formal/package/staging/temp safety PASS. Patch remains applied/uncommitted; no commit/push/deploy/merge/migration.
- Report: `.agent_runs/l7-hydration-legacy-envelope-isolation.md`.

## Latest — L7 v3 Authenticated Resume Completed, Hydration FAIL — 2026-07-20

- Authentication succeeded in the exact headed session/profile. Authenticated `/admin`, `/admin/home`, `/admin/design`, and initial Published-fallback Preview passed shell separation, security headers, console/error, and Chrome checks.
- Minimal UI Save Draft PASS: one Home Draft revision 1, Published deep-equal baseline, Draft Preview marker visible, public content/fresh HTML remained Published-only, PUT 200, temp files 0; Publish not used.
- Discard dialog accessibility PASS: modal semantics, inert/scroll lock, initial focus, bidirectional focus trap, Escape/focus restore. Reopened Confirm sent one DELETE 200; Draft scopes empty, Editor/Preview Published, marker absent, Published baseline preserved.
- **Hydration FAIL:** public Home during Draft produced one React #418; after cleanup, Published Preview produced one #418 and public Home produced two #418 records. Warnings/console errors/overlay stayed 0 and no Draft serialization leaked.
- Formal persistence/package/staging/temp safety PASS. No product/test/manifest/formal persistence change, commit, push, deploy, merge, PR, or formal migration. Hydration blocker not repaired; not ready for L7 Commit.
- Detailed evidence: `.agent_runs/l7-hydration-server-shell-repair-validation-v3.md`.

## Latest — L7 v3 Authenticated Resume — 2026-07-20

- **FAIL / login still unavailable in required persistent profile.** Retained runtime/PID/cwd, Home 200, and Legacy byte-identical QA baseline all passed preflight; no prior gate was rerun.
- With profile `/home/usersun/.agent-browser/profiles/office-next-admin-qa` and new session `office-next-l7-server-shell-v3-auth-resume`, direct `/admin` still redirected to `/admin/login`.
- Stopped immediately per task. No Cookie/session/token read, credential input, bypass, Admin/Preview checks, Draft/Discard mutation, product/test/manifest/persistence change, commit, push, deploy, merge, or PR.
- QA remains baseline-identical with no marker/temp files; listener `21378` remains on port `3011`. Next: log in within the exact persistent profile, then request the same restricted resume.
- Updated report: `.agent_runs/l7-hydration-server-shell-repair-validation-v3.md`.

## Latest — L7 Server-Shell Repair Validation v3 — 2026-07-20

- **FAIL / awaiting Admin login.** Correct fixture `/tmp/office-next-l7-migration-cylR0N`; TypeScript PASS; Jest `25/25` suites and `345/345` tests PASS; migration cleanup/temp gate PASS.
- Clean production build PASS: `45/45`, Middleware/instrumentation, Dynamic Preview, Page Block CSS, and generated-type target checks; stale old-route imports `0`.
- Hydration matrix PASS: Phase A `29/29`, exact cold restart, Phase B `29/29`; combined `58/58`, React #418/page errors/warnings/errors/overlay all `0`. Public Chrome, 390 px overflow, and unauthenticated Preview 307/no-store/noindex passed.
- Existing Admin QA profile redirected `/admin` to `/admin/login`; per task rule, authenticated Preview and Draft/Discard smoke stopped. QA remains Legacy/baseline-identical with no marker/temp files. Current retained QA listener: port `3011`, PID `21378`, exact v3 validation cwd.
- No product/test/manifest/persistence mutation, commit, push, deploy, merge, PR, or formal migration. Next: user logs in to the existing Admin QA profile, then resume only authenticated Chrome and Draft/Discard smoke.
- Detailed report: `.agent_runs/l7-hydration-server-shell-repair-validation-v3.md`.

## Latest — L7 Server-Shell Repair Clean Generated-State Validation v2 — 2026-07-20

- **FAIL at Automatic Gate; build and Browser QA were not run.** Clean validation copy: `/home/usersun/qa-workspaces/office-next-l7-server-shell-validation-20260720-201931`; it initially had no `.next` or `.swc`, and its Legacy persistence SHA matched formal.
- TypeScript PASS, proving the previous stale `.next/types` failure did not recur. Jest: `24/25` suites, `342/342` executed tests PASS; `__tests__/lib/l7-migration-gate.test.ts` failed at load because the task-required `/tmp/office-next-l7-server-shell-migration-*` prefix is rejected by the test's `/tmp/office-next-l7-migration-*` invariant. Exit `1`.
- No product/test/manifest/persistence change, build, Browser QA, server start, commit, push, deploy, merge, PR, or migration. Needs OpenClaw QA: issue a minimal fixture-prefix contract repair only, then rerun from a new clean generated-state copy.
- Detailed report: `.agent_runs/l7-hydration-server-shell-repair-validation-v2.md`.

## Latest — L7 Hydration #418 Corrected Cold-Restart Reproduction Gate — 2026-07-19

- **78 PASS / 2 supported FAIL**: Phase A `39/1` (A12), exact mandatory cold restart, Phase B `39/1` (B10).
- Canonical PASS MAIN is `SCRIPT` + nine ordered Page Block DIVs + `$`/`/$` = 12 raw children. Historical 11 is a SCRIPT canonicalizer-count difference, not whitespace or a missing block.
- Cold restart PASS: `6936/6952/6953` stopped by exact-PID SIGTERM; port released; new `11335/11347/11348`; exact QA cwd, unchanged Build ID/QA SHA, Home 200.
- A12/B10 have different exact response SHAs, but identical server MAIN, first difference, missing comment hashes, error-time structure, later snapshots, and Fiber branch. Each FAIL SHA also produced PASS loads.
- No observer record proves marker removal before the synchronous error/recovery point. **Boundary removal classified as React recovery; hydration root cause remains unlocalized.** Controlled variant/repair not authorized.
- Persistence/restricted checks remain safe. No product change, Workflow mutation, commit, push, deploy, merge, PR, or migration.
- Detailed report: `.agent_runs/l7-hydration-corrected-cold-restart.md`.

## Latest — L7 Hydration #418 Error-time DOM／Client Render Localization Gate — 2026-07-17

- **E — Hydration evidence仍不足；不得進行猜測性 repair。** The passive unmodified-scheduling runner reached its 20-load limit with 19 PASS / 1 FAIL, so the required two-FAIL consistency gate was not met.
- FAIL load 5 is linked to server PID 37834, one Document requestId, and exact response SHA `12823d8e677b7b8c6af3ff8db0347885723d5154366ccdecc153fd730095675e`; synchronous error-time, exact server-parsed, and post-recovery snapshots are preserved.
- First difference: MAIN has 11 canonical children in exact server-parsed DOM but 9 at error-time/post-recovery; the removed nodes are trailing React/Suspense `$` and `/$` comment markers. PASS final DOM retains both markers.
- BODY raw style changes only in serialization; the normalized ten-property map is identical. Post-error Hero filter change is normal motion completion.
- MAIN Fiber safely maps to the RootSiteShell children insertion point; adjacent FAQ maps through PageBlockFrame and a Next Suspense/loading boundary. Comment nodes have no own Fiber, and one FAIL cannot assign a unique causal branch.
- Formal/QA Legacy SHA remains correct; restricted checks pass. No product change, controlled variant, commit, push, deploy, merge, migration, clasp push, or Cloud Run deploy.
- Detailed report: `.agent_runs/l7-hydration-error-time-localization.md`.

## Latest — L7 Hydration #418 Pre-hydration Evidence Gate — 2026-07-17

- **E — Hydration evidence仍不足；不得進行猜測性 repair。** Profile B reproduced 3/3; cache-enabled failed load 4/6; cache-disabled failed load 5/6; mutation trace failed load 6/6.
- Raw bytes/Flight ordering vary, but visible/pre-hydration structure and chunk versions are stable. The same document SHA passes/fails; three cold clean cycles passed 9/9.
- Simple cache/resource mixing is ruled out. Eight paused-JS pre-DOM snapshots were structurally identical and nesting-valid, but pausing suppressed the race.
- Trace shows #418 before React root recovery, not the first causal node/attribute. RootSiteShell pathname and PageBlockFrame/motion reduced-motion branches remain unproven candidates only.
- Restricted checks pass; formal/QA Legacy SHA remains `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`. No product change, commit, push, deploy, merge, migration, clasp push, or Cloud Run deploy.
- Detailed report: `.agent_runs/l7-hydration-preload-evidence.md`.

## Latest — L7 Hydration Stability Soak Gate — 2026-07-17

- **FAIL — Supported production reproduction confirmed.** Fresh Profile A passed 21/21 loads, but after an exact cold restart, fresh supported default-motion Profile B produced #418 on Home load 2.
- The same Profile B session reproduced #418 on Services, About, Contact, and three additional Home confirmations: seven supported reproductions total. `matchMedia` was false; extensions were disabled; no forbidden media token was used.
- Every failure retained Published shell structure `A/HEADER/MAIN/DIV/DIV/FOOTER`, chrome counts `1/1/1` plus CTA `2`, console warning/error `0`, and overlay `0`. Raw error, DOM summaries, Browser batches, and server HTML SHA are preserved in the fresh QA evidence directory.
- The 68-load PASS matrix stopped: Profile A `21/21` PASS; Profile B attempted 5 matrix loads with 4 #418 failures; 3/3 separate confirmation loads failed. Existing and reduced-motion phases were not run.
- Fresh QA_DIR: `/home/usersun/qa-workspaces/office-next-l7-hydration-soak-qa-20260717-201458`; current listener PID `14562`, exact QA cwd. Persistence remains byte-identical Legacy; no Draft/Envelope/temp files or mutations.
- Automated checks: TypeScript PASS; Jest 25/25 suites, 344/344 tests PASS; build 45/45 PASS; restricted checks PASS.
- No product code change, variant, commit, push, deploy, merge, PR, or formal migration. Product repair remains blocked pending exact pre-hydration evidence. Detailed report: `.agent_runs/l7-hydration-stability-soak.md`.

## Latest — L7 Production Hydration #418 Root-Cause Gate — 2026-07-17

- **FAIL / Hydration root cause尚未定位.** Existing authenticated profile passed 0/3 errors; two independent clean default/no-preference profiles passed 0/3 and 0/8; documented reduced-motion passed 0/2. No extension-injected DOM was found.
- #418 appeared only twice after an unsupported runner media token (`reduce`) that did not activate `matchMedia`; that contaminated session is not accepted as proof of a product defect or normal profile contamination.
- Server/existing/clean structure matched: identical html/body attributes, RootSiteShell `A/HEADER/MAIN/DIV/DIV/FOOTER`, Header/main/Footer `1/1/1`, CTA `2`; only Next's route announcer was added live. HTML nesting checks passed.
- RootSiteShell Variant 1 passed 0/8 in an isolated production copy, but an unmodified fresh control also passed 0/8, so the variant is non-discriminating and no formal product change was made. Motion Variant 2 was not run.
- Safe final checks: `anti:check` 25/25 suites and 344/344 tests PASS using a dedicated `/tmp` migration gate; formal build 45/45 PASS; `git diff --check` PASS. Formal Legacy SHA and restricted diffs remain correct.
- Detailed evidence: `.agent_runs/l7-hydration-root-cause.md`. Commit/push/deploy/merge/formal migration: not performed. Needs OpenClaw QA: obtain a supported repeatable baseline reproduction with pre-hydration evidence before issuing any repair task.

## Latest — L7 Production Full Browser QA Ready — 2026-07-17

- **Ready for final production-runtime L7 Browser QA.** The complete authenticated Browser mutation checklist remains pending and was not run in this preparation step.
- The preserved diagnostic result is unchanged: `next dev` serializes Draft／Envelope data only in React Flight development debug records, while all three fresh `next start` production responses passed with no Draft／Envelope／revision leakage. No product repair is required. Do not expose the development server to an untrusted network; final release/security QA must use `next build` + `next start`.
- Historical evidence was preserved, including `.agent_runs/l7-production-serialization-gate.md` and all existing L7 Browser reports. The old production QA PIDs `91692`／`91698`／`91710` were already absent and port `3011` was free, so no signal was sent and the old QA directory/logs/baselines/evidence were not deleted.
- Fresh QA_DIR: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347`; it is not a Git repository. Port: `3011`.
- Runtime: shell PID `4683`; npm PID `4689`; `next start` shell PID `4700`; Next listener PID `4701`. All four cwd values resolve exactly to the fresh QA_DIR; port `3011` remains LISTEN and the runtime is not `next dev`.
- QA_BUILD_LOG: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347/qa-production-build.log`. Build exit `0`: compile/type validation, static generation `45/45`, finalization/traces, Middleware `33.9 kB`, Dynamic `/admin/preview/[target]`, and generated Page Block CSS selectors passed.
- QA_LOG: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347/qa-production-server.log`. Runtime/Fatal/`require is not defined` scan: `0`.
- QA_BASELINE: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347/qa-baseline.json`; QA_MIGRATION_BASELINE: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347/qa-migration-baseline.json`.
- Initial QA persistence and both baselines are byte-identical Legacy roots with no `schemaVersion`, Draft, or Envelope. All three SHA-256 values are `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`; workflow temp files: `0`.
- Read-only smoke: `/`, `/services`, `/about`, `/contact`, `/manifest.webmanifest`, and `/admin/login` returned `200`. Unauthenticated `/admin/preview/home` returned `307` to `/admin/login` with a 12-byte body, `private, no-store`, `Pragma: no-cache`, `X-Robots-Tag: noindex, nofollow`, and `Vary: Cookie`; the body contained no Published Site Chrome, Draft, Envelope, or `__next_f`. Public `Vary` retained framework tokens and did not gain `Cookie`.
- Persistence remained byte-identical to the Legacy baseline after smoke. Authenticated Preview/header verification and the complete Browser mutation QA remain for OpenClaw in this isolated runtime.
- No product source, public page, RootLayout, repository, package manifest, formal persistence, or secret was changed. Commit/push/deploy/merge/PR/formal migration: **not performed**.

## Latest — L7 Public RSC Serialization Production Gate — 2026-07-17

- **PASS — Dev-only React Flight debug serialization.** The prior `next dev` fresh-response leak remains a valid development-runtime failure, but three fresh `next start` production checks contained zero Draft marker, `drafts.home`, Envelope schema/revision metadata, or `Object.readFile` record.
- Production QA_DIR: `/home/usersun/qa-workspaces/office-next-l7-production-serialization-qa-20260717-154624`; initial persistence and both baselines were byte-identical Legacy roots with SHA `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Production build exit 0: compile/type validation, 45/45 pages, Middleware/instrumentation, build traces, and Dynamic `/admin/preview/[target]` passed.
- `next start` runtime: shell PID 91692, npm PID 91698, listener PID 91710; npm/Next cwd exactly equals QA_DIR; port 3011 remains running.
- First Home Save Draft returned 200 and created Envelope v1 with only Home Draft revision 1 over Published revision 1. Published content deep-equaled baseline; Draft Preview showed the marker while public visible content remained Published.
- Production fresh evidence: no-Cookie raw HTML, authenticated no-store fetch, and a completely fresh public Browser document each had marker/Envelope/revision/`Object.readFile` counts of 0. Normal production `self.__next_f.push` scripts remained but did not contain Draft/Envelope data.
- UI Discard returned 200. Final QA Draft scopes empty, Published deep-equal baseline, marker 0, temp files 0. Formal JSON remains Legacy, SHA-correct, diff-clean; restricted files unchanged.
- No product repair is required for this production serialization gate. Do not expose `next dev` to untrusted networks or use it for release security QA; use `next build` + `next start`.
- Full evidence: `.agent_runs/l7-production-serialization-gate.md`. Complete L7 Browser Gate remains pending and is not marked PASS.
- Commit/push/deploy/merge/PR/formal migration: not performed. Needs OpenClaw QA: review this gate report and start a fresh production-runtime full L7 Browser QA only as a separate authorized step.

## Latest — L7 Vary Contract Correction／QA False Blocker — 2026-07-17

- The earlier “Middleware redirect has only `Vary: Cookie`, therefore FAIL” result is **Historical／Superseded — QA contract false blocker** and is not a product issue.
- For a Middleware-generated unauthenticated Preview redirect, the contract is: 307 to login; private/no-store; pragma no-cache; noindex/nofollow; Cookie in Vary; and no Site Chrome, Preview, Draft, or Envelope serialization. RSC/router tokens are not required because App Router rendering is bypassed; Accept-Encoding is required only when actual encoding negotiation occurs.
- Authenticated App Router Preview responses retain Next's actual framework Vary output plus Cookie and remain no-store/noindex. Public App Router responses retain normal framework Vary and must not gain Cookie.
- No middleware, instrumentation, session, Vary helper, Preview route, Root Layout, public route, workflow, persistence, or package code was changed for this contract correction.

## Latest — L7 Preview Pre-render Auth／Serialization Repair — 2026-07-17

### Final determination

- **Ready for corrected full L7 Browser QA**.
- The original L7 Browser Gate stopped after confirming that unauthenticated `GET /admin/preview/home` returned a correct 307 and security headers but serialized Published site content in the raw redirect body.
- The separate public Draft concern remains **unconfirmed at the raw-response layer**: the marker was found only in Browser DOM script history after Admin navigation. No public page, `readContent`, repository, cache, or rendering code was changed without the required fresh-response evidence.

### Root cause and repair

- `RootLayout` reads Published content and creates Header／Footer／Floating CTA React nodes before the Preview page-level `requireAdminUser()` redirect completes. `RootSiteShell` is a Client Component receiving those nodes, so page-level auth was too late to prevent the Published RSC payload from being serialized.
- Added `lib/admin-session.ts`, an Edge-compatible Web Crypto verifier for the existing `<base64url JSON>.<base64url HMAC-SHA256>` token and the existing `office_next_admin_session` cookie name. It rejects missing, malformed, invalid-signature, incomplete, and expired sessions without logging token or payload data and has no Node crypto, Buffer, headers, fs, or path dependency.
- `middleware.ts` is now async and validates the session only for `/admin/preview/:path*` before rendering. Invalid sessions redirect directly to `/admin/login`; valid and redirect responses receive private no-store, no-cache, noindex/nofollow, and Vary Cookie headers.
- Preview Page `requireAdminUser()` remains intact as defense-in-depth. Cookie flags, TTL, login UI, logout behavior, public routes, Draft／Publish／Conflict/Page Block logic, and public rendering were not changed.

### Tests and build

- Targeted verifier／middleware／Preview contract: **3/3 suites, 22/22 tests PASS**.
- Final `L7_MIGRATION_DIR=/tmp/office-next-l7-migration-JMl3dz npm run anti:check`: TypeScript **PASS**; Jest **25/25 suites, 344/344 tests PASS**; exit `0`.
- `npm run build`: compile, lint/type validation, page data, static generation **45/45**, finalization, and traces **PASS**; Middleware **34 kB**; `/admin/preview/[target]` remains Dynamic; exit `0`.
- The first unsupported anti-check invocation correctly stopped at the pre-existing isolated migration gate because `L7_MIGRATION_DIR` was absent; the required dedicated `/tmp` fixture was then supplied without changing the test.

### Corrected isolated QA runtime

- QA_DIR: `/home/usersun/qa-workspaces/office-next-l7-serialization-fix-qa-20260717-143336`.
- Port: `3011`; npm parent PID `61700`; Next listener PID `61729`; both cwd values exactly equal QA_DIR.
- QA log: `/home/usersun/qa-workspaces/office-next-l7-serialization-fix-qa-20260717-143336/qa-server.log`; Runtime/Error scan `0`.
- QA baseline and migration baseline are byte-identical Legacy copies. Persistence remains Legacy with SHA `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Public `/`, `/services`, `/about`, `/contact`, and `/manifest.webmanifest` returned `200`.
- Unauthenticated Preview returned `307` to `/admin/login`, required security headers, and a 12-byte body: exact baseline long-text hits `0`, Published `__next_f` chrome payload `false`, Draft metadata `false`, raw Envelope `false`.
- The QA server remains running for corrected Browser QA. Codex did **not** run Browser mutation QA in this repair round.

### Safety and release state

- Formal `data/site-content.json` remains an unchanged Legacy root with the required SHA; restricted Seed/package/Cases/Insights files and formal temp files are unchanged/absent.
- Existing `.agent_runs/l7-browser-qa-report.md` and `.agent_runs/openclaw-report-latest.md` were preserved without overwrite.
- Full L7 Browser QA has not been rerun. No commit, push, deploy, merge, PR, formal migration, Draft Cookie, public Draft query, package change, or production mutation was performed.

## Latest — L7 Automated Regression／Migration Gate Ready — 2026-07-17

### Final determination

- **Ready for L7 full isolated Browser QA**.
- Branch `feature/draft-publish-workflow-v1`; HEAD `8d89d37f7e01a6d64261a87100ff52b911794e85` (`feat: add admin draft preview`), synchronized with origin at preflight.
- Full regression, isolated Legacy first-write migration, Publish／Discard, Page Block normalization, failure safety, public/Admin read-only smoke, and formal restricted checks passed.
- Vercel Gate: **A — UI/routing may be deployed for read-only Preview evaluation; real mutation must remain disabled until durable external persistence exists**.
- Browser mutation QA, deployment, merge, commit, push, and formal persistence migration were not performed.

### Automated regression and build

- Final `npm run anti:check`: TypeScript **PASS**; Jest **23/23 suites, 328/328 tests PASS**; exit `0`.
- Targeted migration/repository/atomic/coordinator gate: **4/4 suites, 36/36 tests PASS**.
- `npm run build`: compile, type validation, page data, static generation **45/45**, finalization, and traces **PASS**; exit `0`.
- Middleware and instrumentation built successfully; `/admin/preview/[target]` remains Dynamic.
- Coverage includes Legacy/Envelope parsing, atomic writes, revisions/conflicts, Draft/Publish/Discard isolation, General/Design/Page Block workflows, Contact/Social isolation, Design Reset Draft, four-page Page Block isolation, Hero lock, duplicate guard, Tiptap external sync, Publish revalidation, generated CSS, Preview security/composition/site chrome, Vary Cookie, and Published-only public routes.

### Legacy migration and recovery gate

- Fixture: `/tmp/office-next-l7-migration-20260717-133448-nilBpl`.
- Legacy baseline and backup SHA: `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Read-only Published/Editor/Admin Preview access kept exact Legacy bytes and did not create an Envelope.
- First valid Save Draft created Envelope v1 only in the fixture: Published deep-equal baseline, only `brand` Draft, Draft revision 1, Published revision 1. Migration Envelope SHA: `9d428956b1e31b45abcec347e1c712b5c9c91333f443d9c4dee7b7d32db421ec`.
- Discard returned Draft scopes to empty and retained baseline Published content. Clean Save＋Publish removed the Draft, changed only the target scope, and advanced global/scope revisions to 2.
- Clean `pageBlocks.home` first write preserved Published, full IDs, defaults, and Hero lock; Discard returned Published to baseline.
- Failed write, missing Draft, malformed persistence, invalid scope, stale revision, and concurrent writes did not partially overwrite, last-write-win, or silently lose data. Atomic temp files: `0`.
- Migration is not deployment-triggered. Only a separately authorized legal Workflow mutation converts Legacy; production migration still requires an external backup and explicit authorization.

### Read-only smoke and persistent QA runtime

- Public `/`, `/services`, `/about`, `/contact`, manifest, and icons returned `200`; `/admin/login` returned `200`.
- All requested unauthenticated Admin and Preview routes returned `307` to `/admin/login`.
- Preview final responses retained `no-store`, `noindex`, and framework Vary tokens merged with `Cookie`; runtime/require error scan: `0`.
- Authenticated invalid-target `404` remains a Browser QA item because authentication intentionally precedes target parsing. `agent-browser` CLI was unavailable, so no visual or mutation operation was attempted.
- QA_DIR: `/home/usersun/qa-workspaces/office-next-l7-full-regression-qa-20260717-133602`.
- Port: `3011`; npm parent PID `22283`; Next listener PID `22309`; both cwd values exactly equal QA_DIR and the port remains listening.
- QA_LOG: `/home/usersun/qa-workspaces/office-next-l7-full-regression-qa-20260717-133602/qa-server.log`.
- QA_BASELINE: `/home/usersun/qa-workspaces/office-next-l7-full-regression-qa-20260717-133602/qa-baseline.json`.
- QA_MIGRATION_BASELINE: `/home/usersun/qa-workspaces/office-next-l7-full-regression-qa-20260717-133602/qa-migration-baseline.json`.
- Initial QA persistence and both baselines are byte-identical Legacy roots with SHA `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.

### Vercel Preview capability and persistence risk

- No local `.vercel/project.json` exists; no Vercel project/link/env/integration was read from a remote service or changed.
- Local production build and Preview UI/routing are deployable for read-only evaluation.
- `LocalFileContentWorkflowRepository` writes `process.cwd()/data/site-content.json` with local atomic rename semantics. A Vercel Function filesystem is not durable application storage across invocations/instances, so Save/Publish/Discard cannot be accepted as persistent there.
- Full mutation requires durable external storage with atomic revision/conflict semantics; transactional Postgres-compatible storage is the conservative fit. Blob/KV requires a separately designed conditional-write/concurrency model.

### Formal restricted check

- Formal `data/site-content.json`: Legacy root, no diff, SHA `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Seed, package manifests, Cases, and Insights: no diff. Formal workflow temp files: `0`.
- OpenClaw report remains untracked and unmodified. No staged changes, commit, push, deploy, merge, or formal migration.

### Full L7 isolated Browser QA checklist

1. Public `/`, `/services`, `/about`, `/contact` at 1280px and 390px.
2. Public Header／Footer／Floating CTA.
3. Public Design CSS variables and data attributes.
4. Page Block background／layout／motion／order／enabled state.
5. No public Preview banner.
6. No public Draft leakage.
7. General Save Draft.
8. General Draft Preview.
9. General Discard fallback.
10. General Publish public update.
11. Restore and Publish baseline.
12. Rich Text render/external snapshot sync.
13. Contact／Social isolation.
14. Design Save Draft.
15. Design Draft Preview across full chrome.
16. Design Reset Draft Preview.
17. Design Discard.
18. Design Publish／Restore.
19. Floating CTA enabled/disabled and spacing.
20. Four-page Page Block Save Draft.
21. Four-page Preview isolation.
22. Scoped Page Block Publish.
23. Scoped Page Block Discard.
24. Scoped Page Block Reset Draft.
25. Hero lock/first position/ID.
26. Move／toggle／background／motion／layout.
27. General two-tab conflict.
28. Page Block two-tab conflict.
29. Reload server version.
30. Duplicate request guard.
31. Local conflict values absent from Preview.
32. QA initial persistence is Legacy.
33. First valid Save converts QA to Envelope v1.
34. Published baseline retained immediately after conversion.
35. Only selected Draft scope exists.
36. Final Draft scopes empty.
37. Complete Published content restored to baseline.
38. Final Envelope structure/revisions valid.
39. Preview unauthenticated/expired blocking.
40. Authenticated invalid target safe 404.
41. Final no-store/noindex/Vary Cookie.
42. No Draft cookie.
43. No public Draft query.
44. No raw persistence/metadata/path/sensitive output.
45. 390px no horizontal overflow.
46. Mode controls and disabled semantics.
47. Dialog focus/inert/cancel/restore.
48. Descriptive iframe titles.
49. Console warnings/errors 0.
50. No hydration/runtime/MutationObserver/Next overlay error.

### Reports and next step

- Detailed report: `.agent_runs/l7-validation-report.md`.
- Release gate: `docs/draft-publish-l7-release-gate.md`.
- Next step is OpenClaw/full authenticated Browser mutation QA in the persistent QA copy. Do not deploy, merge, or perform formal migration before that QA is PASS and durable persistence limitations are explicitly accepted.

## Latest — L6 Final Acceptance／Ready for Commit — 2026-07-17

### Final determination

- **PASS — 可以進入 L6 Commit 階段**.
- L6 Admin Draft Preview is complete. Security and unauthenticated blocking passed; authenticated access remained isolated to the allowed Preview targets.
- Final focused Browser re-QA passed with console warnings／errors `0`, no hydration／runtime／MutationObserver error, and no Next overlay.
- No product feature code was changed during this final acceptance. No commit, push, deploy, merge, production mutation, or L7 work was performed.

### Final L6 acceptance coverage

1. L6 Admin Draft Preview: **PASS／complete**.
2. Security／unauthenticated blocking: **PASS**.
3. `no-store`／`noindex`／`Vary: Cookie`: **PASS** for unauthenticated and authenticated Preview responses.
4. General Rich Text Draft Preview: **PASS**.
5. Page Block Draft Preview and four-page isolation: **PASS**.
6. Multi-scope composition: **PASS**.
7. Conflict local-value isolation: **PASS**.
8. Publish transition: **PASS**.
9. Header／Footer／Floating CTA use the same composed Draft content as the Preview page body: **PASS**.
10. Preview contains exactly one Site Chrome set: **PASS**.
11. Public routes continue to read Published content only: **PASS**.
12. Founder priority warning repair: **PASS**; no final LCP warning.
13. 390px viewport: **PASS**; no horizontal overflow.
14. Console warnings／errors: `0`; hydration／runtime／MutationObserver／Next overlay: none.
15. Final Draft scopes: empty.
16. Published Brand／Contact／Social／Design and complete Published content equal the QA baseline: **PASS**.
17. Final `npm run anti:check`: TypeScript **PASS**; Jest **22/22 suites, 325/325 tests PASS**; exit `0`. Final `npm run build`: compile, type validation, page collection, static generation **45/45**, finalization, and traces **PASS**; Middleware built; `/admin/preview/[target]` remains Dynamic; exit `0`.
18. Formal `data/site-content.json`: Legacy root, no diff, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`; formal workflow temp files: `0`.
19. Commit／push／deploy: not performed.
20. L7: not started.

### Focused Browser re-QA evidence

- Focused Draft saves／discards all returned `200`: Brand PUT×1／DELETE×1; Contact PUT×1／DELETE×1; Social PUT×1／DELETE×1; Design PUT×2／DELETE×1; Founder PUT×1／DELETE×1.
- Preview requests: Home GET `200`×10 and `307`×4; Contact GET `200`×2; About GET `200`×2; invalid target GET `307`×2 and `404`×1; Preview Home HEAD `307`×1. Login redirects were `307`×8 including the Admin Brand redirect. Mutation 4xx／5xx: `0`; Publish requests: `0`.
- Isolated QA persistence: Envelope schemaVersion `1`, global Published revision `1`, Draft scopes empty, workflow temp files `0`; all Published content equals the Legacy baseline.
- The recorded QA npm parent PID `91097` and Next listener PID `91122` were already absent after VS Code restarted; port `3011` was not listening. No signal was required, no unrelated process was stopped, and the QA directory／log／baseline／screenshots were preserved.

### Restricted check and handoff state

- Branch `feature/draft-publish-workflow-v1`; HEAD remains `1349d65 feat: add page block draft workflow UI`; no staged changes.
- Seed, package manifests, Cases, Insights, and formal content have no diff. The untracked OpenClaw report and the complete L6 working-tree changes remain preserved.
- Page Block generated-CSS tests, Preview security／composition tests, and public Published-route regressions remain in the passing full suite.
- L6 changed product code introduces no `any`; product code does not use `suppressHydrationWarning`.
- Final acceptance result: **可以進入 L6 Commit 階段**. Stop here; do not commit, push, deploy, or begin L7 without the next explicit authorization.

## Historical／Superseded — L6 Preview Site Chrome／Header Repair — 2026-07-16

### Final determination

- **Ready for focused L6 Browser re-QA**.
- The three confirmed blockers are repaired: Preview chrome now uses the same composed Preview content as the page body; the final Preview response retains Next's `Vary` tokens and adds `Cookie`; the Founder hero image has `priority`.
- Automated tests, production build, restricted checks, unauthenticated HTTP smoke, and read-only authenticated response checks passed. Focused Browser **mutation** re-QA was intentionally not performed by Codex.
- No commit, push, deploy, merge, production persistence mutation, package change, or L7 work was performed.

### Original blockers and root causes

- The inner Preview route received composed Draft content, but Root Layout rendered its Published Header／Footer／Floating CTA outside that wrapper; each chrome component also called `readContent()` independently.
- Middleware set `Vary: Cookie`, but Next 15.5's App Router page template later replaced `Vary` with its framework tokens via `setHeader`, removing Cookie from the final response. A precise `next.config.mjs` Preview header was also proven to be overwritten and was not retained.
- The above-the-fold Founder hero `Image` lacked Next Image `priority`, producing the LCP warning for `/people/founder-hero.svg`.

### Site chrome and Preview composition repair

- `HeaderContent`, `FooterContent`, and `FloatingCtaContent` are pure, typed, content-driven render components. Their existing public async wrappers still call `readContent()` and render the same JSX, so public routes remain Published-only and chrome markup has one implementation.
- `AdminPreviewSiteShell` renders the banner, Header, page main, Floating CTA, and Footer from the same `preview.content`. Draft design data attributes and CSS variables wrap the entire Preview chrome; Draft `floatingCta.enabled` controls both CTA rendering and main bottom padding.
- `RootSiteShell` uses `usePathname()` to omit only the outer Published Header／Footer／CTA and Published CTA spacing under `/admin/preview/*`. Public pages and normal Admin Editor routes keep their existing Published shell. No Draft cookie, query, localStorage, hydration suppression, or global Draft mode was introduced.
- The Founder hero image expression `content.founder.heroImageUrl || "/people/founder-hero.svg"` now has `priority`; its source, dimensions, sizes, layout, and surrounding content were not changed.

### Final `Vary: Cookie` repair

- `lib/http-vary.ts` provides case-insensitive token merge and the exact `/admin/preview/*` request predicate.
- Preview middleware continues to declare private/no-store intent, `Pragma: no-cache`, `X-Robots-Tag: noindex, nofollow`, and a merged Cookie vary token.
- Because Next's final App Router template overwrites middleware/config `Vary`, `instrumentation.ts` installs one idempotent Node `ServerResponse.setHeader` boundary guard. It acts only when the response request URL starts `/admin/preview/` and only when the written header is `Vary`; it merges Cookie into the framework-generated value instead of hardcoding or deleting framework tokens.
- Actual unauthenticated GET／HEAD final header: `rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Cookie, Accept-Encoding`; status `307` to `/admin/login`.
- Actual authenticated GET final header has the same tokens; status `200`. Authenticated invalid target returned `404` with the same cache／robots boundary. Public `/about` retained framework tokens plus `Accept-Encoding` and did **not** gain Cookie.

### Files added or changed for this repair

- Added: `components/admin/preview/admin-preview-site-shell.tsx`, `components/layout/root-site-shell.tsx`, `lib/http-vary.ts`, `instrumentation.ts`, and `__tests__/lib/admin-preview-site-chrome.test.tsx`.
- Updated: `app/layout.tsx`, `app/admin/preview/[target]/page.tsx`, `components/layout/header.tsx`, `components/layout/footer.tsx`, `components/layout/floating-cta.tsx`, `components/public-pages/about-page-content.tsx`, `middleware.ts`, `__tests__/lib/admin-preview.test.ts`, and this handoff.
- `.agent_runs/openclaw-report-latest.md` remains untracked and was not modified.

### Tests and build

- Targeted TypeScript plus Preview tests: **2/2 suites, 13/13 tests PASS**.
- Final `npm run anti:check`: TypeScript **PASS**; Jest **22/22 suites, 325/325 tests PASS**; exit `0`.
- Tests cover supplied-content Header／Footer／CTA rendering, public Published wrappers, disabled Draft CTA, full-chrome design scope, Draft／Published banners, CTA padding, Root Preview boundary, no duplicate chrome implementation, Founder hero priority, Vary merge/deduplication, and matcher isolation.
- Existing Draft composition, Page Block workflow, and generated CSS selector tests remain in the passing full suite.
- Final `npm run build`: compile **PASS**; type validation **PASS**; page data **PASS**; static generation **45/45 PASS**; build traces／finalization **PASS**; exit `0`.
- Middleware built successfully; `/admin/preview/[target]` remains a dynamic App Router route.

### Restricted check

- Formal `data/site-content.json`: Legacy root, no Draft／Envelope, no diff, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- `data/site-content.seed.ts`, package manifests, Cases, Insights, Page Block definitions／defaults／IDs, and formal content have no repair diff. Workflow temp files: `0`.
- No staged changes. `git diff --check`: **PASS**. No `any`, `suppressHydrationWarning`, Draft cookie/query/localStorage, permanent Preview token, or package addition was introduced.

### New isolated QA environment

- QA_DIR: `/home/usersun/qa-workspaces/office-next-l6-preview-fix-qa-20260716-235037`.
- URL／port: `http://localhost:3011`, port `3011`.
- npm parent PID: `91097`; Next listener PID: `91122`. Both cwd values resolve exactly to the QA_DIR.
- QA log: `/home/usersun/qa-workspaces/office-next-l6-preview-fix-qa-20260716-235037/qa-server.log`.
- QA baseline: `/home/usersun/qa-workspaces/office-next-l6-preview-fix-qa-20260716-235037/qa-baseline.json`.
- QA content, baseline, and formal JSON are byte-identical Legacy roots with no Draft／Envelope; SHA-256 for all three is `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Copy excludes `.git`, `.next`, `.swc`, copied `node_modules`, copied `.env.local`, and `tsconfig.tsbuildinfo`; `node_modules` and `.env.local` are symlinks. Environment values were not output.
- Smoke: manifest, Home, About, and Contact returned `200`; unauthenticated Preview returned `307`; authenticated valid Preview returned `200`; authenticated invalid target returned `404`; port remains listening.
- QA log has no Runtime Error, `require is not defined`, instrumentation compilation error, or module resolution error. Opening Preview did not change the QA persistence hash or create Draft／Envelope state.

### Required next step

- OpenClaw should run focused L6 Browser re-QA for Draft Header／Footer／CTA values and Draft Design across the entire Preview shell, including Draft CTA enabled／disabled behavior, 390px layout, hydration／console checks, and the Founder LCP warning.
- The Coding Codex checks in this repair were read-only; no Save Draft, Publish, Discard, or Reset action was run. Do not commit, push, merge, deploy, or begin L7 until focused QA passes and the user authorizes the next phase.

## Historical／Superseded — L6 Admin Draft Preview／Ready for Browser QA — 2026-07-16

### 1. L6 Summary

- Coding and automated verification: **PASS**. L6 is ready for isolated, authenticated Browser mutation QA; that QA was intentionally not run by Codex.
- Base branch／HEAD remained `feature/draft-publish-workflow-v1` at `1349d65 feat: add page block draft workflow UI`; origin tracking matched at preflight.
- Added authenticated Draft Preview for General Sections, Design, and all four Page Block pages. Public `/`, `/services`, `/about`, `/contact`, layout, Header, Footer, and CTA continue to obtain Published content through `readContent()`.
- No commit, push, merge, PR, Vercel deploy, production migration, database work, or L7 was performed.

### 2. Preview security architecture

- Preview is a Server Component route at `/admin/preview/[target]`. It calls `requireAdminUser()` before target parsing／repository reads; an expired or missing session redirects to `/admin/login`.
- No permanent capability, hardcoded secret, public `?draft=true`, arbitrary path proxy, Draft cookie, Draft localStorage payload, raw persistence fetch, or middleware-wide Draft mode was added.
- Preview calls only `readPublished()` and typed `readEditor(scope)` methods. It never calls Save／Publish／Discard, never changes revisions, never creates a Draft, and never converts Legacy persistence to an Envelope.
- Route metadata is `noindex, nofollow`; route is forced dynamic with `noStore()` and `revalidate = 0`. Preview-only middleware sets private/no-store intent, `Pragma: no-cache`, `X-Robots-Tag: noindex, nofollow`, and `Vary: Cookie`. Next dev normalizes the final Cache-Control header to `no-store, must-revalidate`, which remains non-shareable.
- Storage／session errors render a generic safe error UI without paths, stack, Envelope metadata, tokens, or storage messages.

### 3. Preview target allowlist and scope composition

- Targets: `home`, `services`, `about`, `contact` only. Invalid targets use `notFound()`; target input is never used as a filesystem path or arbitrary import.
- Home: `brand`, `home`, `founder`, `services`, `cases`, `testimonials`, `faq`, `contact`, `design`, `pageBlocks.home`.
- Services: `brand`, `services`, `cases`, `faq`, `design`, `pageBlocks.services`.
- About: `brand`, `founder`, `testimonials`, `faq`, `design`, `pageBlocks.about`.
- Contact: `brand`, `contact`, `social`, `faq`, `design`, `pageBlocks.contact`.
- Each listed scope uses Draft only when its EditorSnapshot source is Draft; otherwise it independently falls back to Published. Unlisted scopes remain Published, so another page's Page Block Draft cannot leak into the target.
- Composition uses `mergeScopeValue()` and `readEditor()`; it does not merge raw Envelope structures and does not create a second repository.

### 4. General／Design／Page Block Preview UI

- General scopes `brand`, `home`, `founder`, `services`, `testimonials`, `faq`, `contact`, and `social` now share a right-side Preview appropriate to the public page where the scope renders. Contact and Social remain separate workflow snapshots.
- Design Preview uses the composed Draft Design settings through the same safe CSS variable／data-attribute helpers. Reset Draft becomes previewable only after the server Save succeeds.
- Home／Services／About／Contact Page Block Preview uses the target-specific Draft and preserves the existing normalizers, Hero lock, stable IDs, definitions/defaults, layout allowlists, background, motion, order, enabled state, static class maps, and generated CSS selectors.
- Public page JSX was mechanically extracted to four pure `components/public-pages/*-page-content.tsx` views. Public page files still read Published and pass it to the same views; Admin Preview passes composed content, avoiding duplicated page markup or visual redesign.

### 5. Published／Draft toggle and accessibility

- Shared `AdminPreviewFrame` provides native Published／Draft buttons, `aria-pressed`, `aria-controls`, disabled Draft semantics, 390／768／1280 controls, explicit iframe titles, screen-reader status banners, `aria-busy`, timeout alert live region, and focus-visible styles.
- Draft mode is disabled when the current Editor snapshot has no Draft. Save／Reset success updates the server snapshot and iframe key; Discard／Publish removes Draft availability and returns the control to Published.
- Local dirty values and conflict-local values are never passed to Preview. The iframe reads persistence independently, so only a successful Save Draft is visible.
- Banners are `草稿預覽｜此內容尚未發布` and `已發布版本`; server fallback additionally marks `data-preview-source="draft|published"`.

### 6. Files changed

- Added: `lib/admin-preview.ts`, `lib/admin-preview-types.ts`, `app/admin/preview/[target]/page.tsx`, its safe `error.tsx`, `components/admin/preview/admin-preview-frame.tsx`, four `components/public-pages/*-page-content.tsx`, `middleware.ts`, and `__tests__/lib/admin-preview.test.ts`.
- Updated: four public page wrappers; General／Design／Page Block editors and preview adapter; workflow UI tests; Page Block workflow tests; four Draft workflow／Admin guides; this handoff.
- Preserved untracked OpenClaw evidence: `.agent_runs/openclaw-report-latest.md` was not modified.

### 7. Tests and build

- Targeted L6／affected tests: **3 suites, 44 tests PASS**.
- Final `npm run anti:check`: TypeScript **PASS**; Jest **21/21 suites, 316/316 tests PASS**; exit `0`.
- Final `npm run build`: compile **PASS**; type validation **PASS**; page data collection **PASS**; static generation **45/45 PASS**; build traces／optimization **PASS**; exit `0`.
- Build lists `/admin/preview/[target]` as dynamic and the four public pages as their prior on-demand server-rendered routes. Middleware build succeeded.
- Existing generated Page Block selector tests remain in the full suite; static background/layout maps and generated selectors remain present.

### 8. Restricted check

- Formal `data/site-content.json`: Legacy root, no diff, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- `data/site-content.seed.ts`, `package.json`, `package-lock.json`, `data/cases.json`, `data/insights.json`, formal content, environment files, Page Block definitions/defaults/IDs, and Vercel config: no diff.
- Formal workflow temp files: `0`. No staged changes. `git diff --check`: PASS.
- No `any`, `suppressHydrationWarning`, Draft query, Draft localStorage, Draft cookie, permanent token, package change, secret read/output, or persistence mutation was added.

### 9. Persistent isolated Browser QA environment

- QA_DIR: `/home/usersun/qa-workspaces/office-next-l6-preview-qa-20260716-215854`.
- URL／port: `http://localhost:3011`, port `3011`.
- npm parent PID: `17621`; Next listener PID: `17646`. Both cwd values resolve exactly to the QA_DIR.
- Log: `/home/usersun/qa-workspaces/office-next-l6-preview-qa-20260716-215854/l6-preview-dev.log`.
- Baseline: `/home/usersun/qa-workspaces/office-next-l6-preview-qa-20260716-215854/qa-baseline.json`.
- QA persistence and baseline are byte-identical Legacy roots with no Draft／Envelope; each SHA-256 is `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Copy excludes `.git`, copied `.next`, copied `.swc`, copied `node_modules`, and copied `.env.local`; `node_modules` and `.env.local` are symlinks. Environment contents were not read.
- Read-only smoke: unauthenticated `/admin/preview/home` returned `307` to `/admin/login`, `no-store, must-revalidate`, `Pragma: no-cache`, and `X-Robots-Tag: noindex, nofollow`. QA persistence hash remained unchanged.
- `agent-browser` CLI was unavailable (`command not found`), so no screenshot／visual check and no authenticated Browser QA were performed. The fallback was HTTP-only and non-mutating.

### 10. Required OpenClaw Browser QA／manual verification

- Authenticate only inside the QA copy and verify General Rich Text, Design Draft／Reset Draft, and Home／Services／About／Contact Page Block Draft Preview.
- Verify local dirty values remain absent until Save Draft succeeds; then verify Draft banner/content, Discard fallback, Publish refresh, conflict isolation, and no cross-page Page Block Draft leak.
- Verify 390px has no horizontal overflow; iframe titles／mode controls／disabled states are accessible; console, hydration, runtime, and Next overlay are clean.
- Confirm unauthenticated／expired session blocking and response cache／robots headers.
- Restore QA Published content to the baseline and clear every Draft scope before stopping the runtime.
- L7 remains not started. Do not commit, push, merge, or deploy until OpenClaw QA reports PASS and the user authorizes the next phase.

## Latest — L5 Final Acceptance／Ready for Commit — 2026-07-16

### Final determination

- **PASS — 可以進入 L5 Commit 階段**.
- The four-page Page Block Draft Workflow is complete. Save Draft, Publish, Discard, Reset Draft, conflict handling, duplicate guard, Hero lock, page isolation, and Published-only Preview behavior passed their scoped automated and Browser QA.
- The original Publish public-render blocker was fixed with precise Page Block path `revalidatePath`; Browser QA confirmed that Publish updates the iframe and fresh public-request wrapper class and data attributes, while Save Draft does not expose Draft content.
- The final visual Browser re-QA passed Home soft-grid and Contact soft-blue computed styles and rendered visuals, Publish-only Preview refresh, restore, baseline comparison, and console/runtime checks.
- Commit／push／merge／PR／deploy were not performed, and L6 was not started.

### Root cause and minimal repair

- `app/globals.css` kept the Page Block visual rules inside `@layer components`, but `getPageBlockClassConfig()` assembled `page-block--${background}` and `page-block-layout--${layout}` dynamically. Tailwind content scanning could not see complete tokens and removed those component selectors from generated CSS.
- `lib/page-block-settings.ts` now exports exhaustive typed static maps using `as const satisfies Record<PageBlockBackground, string>` and `as const satisfies Record<PageBlockLayout, string>`. `getPageBlockClassConfig()` reads those maps and preserves its exact existing wrapper output.
- No Page Block definition, default, ID, data attribute, motion behavior, CSS visual value, Tailwind config, public page, workflow/API, persistence, or revalidation behavior changed.

### Files changed for this repair

- `lib/page-block-settings.ts`
- `__tests__/lib/page-block-settings.test.ts`
- `__tests__/lib/page-block-generated-css.test.ts` (new)
- `.agent_runs/codex-handoff-latest.md`
- `.agent_runs/openclaw-report-latest.md` remains preserved as the prior FAIL evidence and was not modified by this repair.

### Generated CSS regression and build artifacts

- Helper tests cover all five background mappings, all five layout mappings, unchanged wrapper strings, exhaustive Record typing, and removal of runtime class interpolation.
- The new generated-CSS test runs the existing `app/globals.css` through the installed PostCSS＋Tailwind pipeline with `tailwind.config.ts`; it verifies all required Page Block background/layout selectors and their visual declarations.
- Targeted Jest: **2/2 suites, 40/40 tests PASS**.
- Final `npm run anti:check`: TypeScript **PASS**; Jest **20/20 suites, 312/312 tests PASS**; exit `0`.
- Final `npm run build`: compile **PASS**; type validation **PASS**; static page generation **45/45 PASS**; exit `0`.
- All CSS files under `.next/static/css/` were searched. `page-block--clean`, `soft-grid`, `soft-blue`, `deep-panel`, and layout `contained`, `wide`, `single-column`, `two-column` are present. The built soft-grid rule contains `background-color`, `background-image`, and `background-size`; soft-blue／deep-panel contain `background`.
- The new dev QA runtime also serves all eight required tokens and the complete soft-grid declarations from `/_next/static/css/app/layout.css`.

### Final scoped Browser acceptance

- Home `pain-points` Publish: iframe and fresh `/` request used `page-block--soft-grid`, data background `soft-grid`, computed color `rgb(241, 246, 249)`, two linear-gradient background images, and `32px 32px` background size. Rendered grid visual: **PASS**.
- Contact `contact-methods` Publish: iframe and fresh `/contact` request used `page-block--soft-blue`, data background `soft-blue`, and computed `linear-gradient(135deg, rgb(244, 248, 251), rgb(229, 239, 245))`. Rendered gradient visual: **PASS**.
- Local edits and Save Draft did not refresh Published Preview or fresh public requests. Successful Publish was the only automatic Published Preview refresh boundary: **PASS**.
- Home and Contact restore Publish returned wrapper/data/computed styles to baseline. Final Draft scopes are empty; Published Home, Contact, all pageBlocks, and complete Published content equal baseline: **PASS**.
- Console errors/warnings: `0`; Hydration Error, Runtime Error, MutationObserver Error, and Next.js overlay: none.

### Restricted check

- Branch `feature/draft-publish-workflow-v1`; HEAD remains `ea673bf feat: add content draft workflow UI`; no staged changes.
- Formal `data/site-content.json`: Legacy root, no diff, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Seed, package manifests, Cases, Insights, all four public pages, Page Block definitions/defaults/IDs, and formal content have no repair diff. Formal workflow temp files: **0**.
- No `any`, `suppressHydrationWarning`, `force-dynamic`, cache-busting query, iframe URL change, dependency, or package-manifest change was added.

### New persistent isolated QA environment

- Old QA port `3011` runtime was stopped with precise SIGTERM only after its npm/listener cwd matched the old QA_DIR; no broad or forced process command was used.
- QA_DIR: `/home/usersun/qa-workspaces/office-next-l5-css-fix-qa-20260716-203755`.
- QA_PORT: `3011`.
- Final QA used npm parent PID `33295` and Next listener PID `33323`; all process cwd values resolved exactly to the QA_DIR. The exact runtime was stopped with SIGTERM after final QA, and port `3011` no longer listens.
- QA_LOG: `/home/usersun/qa-workspaces/office-next-l5-css-fix-qa-20260716-203755/qa-server.log`.
- QA_BASELINE: `/home/usersun/qa-workspaces/office-next-l5-css-fix-qa-20260716-203755/qa-baseline.json`.
- The QA copy is not a Git repository and excludes `.git`, `.next`, `.swc`, copied `node_modules`, copied `.env.local`, and `tsconfig.tsbuildinfo`. `node_modules` and `.env.local` are symlinks; environment contents were not read.
- Initial QA JSON and QA baseline are byte-identical to formal Legacy content, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`, with no Envelope and no Draft.
- Runtime checks: manifest `200`, Home `200`, Contact `200`, Admin Home／Contact `307` to login, with no `require is not defined` or Runtime Error.
- Final isolated Envelope: schema v1, global Published revision `5`; Page Block revisions Home `3`, Services `1`, About `1`, Contact `3`; Draft scopes empty; workflow temp files `0`; all Published content equals baseline.
- QA log summary: `PUT /api/admin/content/pageBlocks/draft 200` ×4 and `POST /api/admin/content/pageBlocks/publish 200` ×4, exactly Home/Contact test Publish plus restore Publish. Discard/Editor calls `0`; mutation 4xx/5xx `0`.

### Final automated and restricted verification

- Final `npm run anti:check`: TypeScript **PASS**; Jest **20/20 suites, 312/312 tests PASS**; exit `0`.
- Final `npm run build`: compile **PASS**; type validation **PASS**; static page generation **45/45 PASS**; exit `0`.
- Final `.next/static/css` inspection found all four Page Block background tokens and all four non-default layout tokens; soft-grid and soft-blue include their real background declarations.
- Formal `data/site-content.json` remains a Legacy root with no diff and SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`. Seed, package manifests, Cases, Insights, all four public pages, and formal content have no restricted diff. No staged changes or workflow temp files.

## Historical／Superseded — L5 Page Block Published Rendering Repair — 2026-07-16

### Final determination

- **Ready for scoped Browser re-QA**.
- The confirmed Home／Contact Published rendering blocker received one minimal route-level repair. Coding and automated verification passed, and a new persistent isolated QA runtime is ready.
- Repair verification is intentionally incomplete until Browser mutation re-QA confirms Home Publish, Contact Publish／Restore, and the Published-only Preview refresh boundary.
- Commit／push／merge／PR／deploy were not performed. L6 was not started.

### Original Browser blocker

- Page Block Draft remained hidden before Publish as required, and Publish returned HTTP 200 with an increased Published revision.
- After Home soft-grid and Contact visual-setting Publish, the public route and Published Preview iframe retained the old wrapper classes, data attributes, computed background, and rendered view.
- This was a Published public-render boundary failure, not a Draft-leak, CSS-only, or revision-write failure.

### Root-cause evidence

- Persistence is correct: `LocalFileContentWorkflowRepository.publishDraft()` normalizes the target Draft and merges it into `published.content.pageBlocks.<page>`, increments global and scoped Published revisions, removes only the target Draft, atomically writes the Envelope, and creates the response snapshot from that updated Envelope.
- The API snapshot is correct: successful Publish returns `createEditorSnapshot()` from the new Envelope, so its Page Block data and Published revision come from the just-written Published state.
- Published reads are correct: `readPublished()` and `readContent()` construct/read the repository persistence again; `readContent()` also calls `unstable_noStore`.
- Public rendering is wired correctly: `/`, `/services`, `/about`, and `/contact` read `content.pageBlocks`, use their `getOrderedEnabled*Blocks()` helper, and pass each config to `PageBlockFrame`. The frame derives `data-page-block-background`, `data-page-block-layout`, `data-page-block-motion`, `page-block--<background>`, and `page-block-layout--<layout>` directly from that config.
- The missing boundary was in the successful Publish route: persistence mutation had no explicit connection to invalidating the corresponding App Router public-page server render. Browser QA showed that a fresh iframe/public request could therefore retain the prior route output even though persistence and the Publish response had advanced. The repair marks only that public page route for revalidation after the repository mutation succeeds.

### Minimal repair

- Added `lib/content-workflow-public-paths.ts`, a typed allowlist mapping:
  - `pageBlocks.home` → `/`
  - `pageBlocks.services` → `/services`
  - `pageBlocks.about` → `/about`
  - `pageBlocks.contact` → `/contact`
- Updated `app/api/admin/content/[section]/publish/route.ts`: after authentication, input parsing, and successful `repository.publishDraft(input)`, it resolves the public path and calls `revalidatePath(path, "page")` before returning the unchanged snapshot response.
- General L4 scopes return `null` from the helper and receive no Page Block path revalidation.
- Save Draft, Discard Draft, Reset Draft, and Editor GET do not revalidate. Authentication, parse, 409 conflict, 404 missing Draft, storage error, and failed Publish paths cannot reach revalidation.
- No response schema/revision behavior, iframe URL, public page, Page Block definition/default/ID, package manifest, or formal content was changed. No `force-dynamic`, cache-busting query, `window.location.reload`, `router.refresh`, Draft Preview, or `any` was added.

### Regression tests and build

- Updated `__tests__/api/admin-content-workflow-publish-route.test.ts` and added `__tests__/lib/content-workflow-public-paths.test.ts`.
- Coverage includes all four mappings; `revalidatePath(path, "page")`; repository-before-revalidation ordering; unchanged success snapshot; Publish request without blocks; no revalidation for general scope, 409, missing Draft, or storage failure; no revalidation token in Draft/Discard/Editor routes; and no dynamic/client cache-busting workaround.
- Targeted Jest: **2/2 suites, 41/41 tests PASS**.
- Final `npm run anti:check`: TypeScript **PASS**; Jest **19/19 suites, 292/292 tests PASS**; exit `0`.
- Final `npm run build`: compile **PASS**; type validation **PASS**; static page generation **45/45 PASS**; exit `0`.

### Restricted check

- Branch `feature/draft-publish-workflow-v1`; HEAD remains `ea673bf feat: add content draft workflow UI`; origin tracking is aligned; no staged changes.
- Formal `data/site-content.json`: Legacy root, no diff, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Seed, package manifests, Cases, Insights, Page Block definitions/defaults, and all four formal public pages have no diff. Formal workflow temp files: **0**.
- Existing uncommitted L5 working-tree changes, including the ESM typography runtime repair, remain present.

### New persistent isolated QA environment

- QA_DIR: `/home/usersun/qa-workspaces/office-next-l5-render-fix-qa-20260716-180114`.
- QA_PORT: `3011`.
- After the interrupted Codex session stopped the original runtime, the same untouched QA copy was restarted without Browser mutation. Current npm parent PID: `4504`; current Next listener PID: `4535`.
- npm and listener cwd both resolve exactly to the QA_DIR. The current listener on port `3011` was rechecked after restart.
- QA_LOG: `/home/usersun/qa-workspaces/office-next-l5-render-fix-qa-20260716-180114/qa-server.log`.
- QA_BASELINE: `/home/usersun/qa-workspaces/office-next-l5-render-fix-qa-20260716-180114/qa-baseline.json`.
- The QA copy contains all current uncommitted L5 changes and this repair; it excludes `.git`, `.next`, `.swc`, copied `node_modules`, and copied `.env.local`. It is not a Git repository. `node_modules` and `.env.local` are symlinks; environment contents were not read.
- Initial QA JSON is byte-identical to the formal Legacy baseline, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`, with no Envelope and no Draft.
- Runtime checks: manifest `200`, Home `200`, Contact `200`, Admin Home／Contact `307` to login, port remains LISTEN, and no `require is not defined` or Next.js Runtime Error was logged.
- No mutation API was called by Coding Codex. Formal persistence remained unchanged.

### Scoped Browser re-QA boundary

- Run mutation QA only against `http://localhost:3011` in the new QA_DIR.
- Re-test Home Publish, Contact Publish／Restore, and automatic Published Preview refresh. Confirm wrapper class, data attributes, computed background, and rendered view update after Publish while Save Draft remains Published-only.
- Restore Published Page Blocks to baseline and clear all Draft scopes before stopping the QA runtime.

## Historical／Superseded FAIL — L5 Isolated Browser Mutation QA — 2026-07-16

### Final determination

- **修正阻塞問題後重新驗收**。
- **不得進入 L5 Commit 階段**。Commit／push／merge／PR／deploy 均未執行；L6 未開始。
- Blocker: mutation API and revision workflow succeed, but successful Page Block Publish does not make the Published Preview iframe or public page consume／render the latest Published Page Block visual settings. Home soft-grid Publish increased the revision without changing the iframe class, computed background, or rendered view; Contact showed the same failure on its public page.
- Required re-QA after a scoped repair: Home Publish, Contact Publish／Restore, and the Published-only Preview refresh boundary. Do not broaden the repair beyond this confirmed defect.

### Isolated Browser QA scope and result

- Browser QA used only `http://localhost:3011` from `QA_DIR=/home/usersun/qa-workspaces/office-next-l5-qa-20260716-144831`; it did not mutate the formal project persistence.
- Four-page Initial UI: **PASS**. Hero lock: **PASS**.
- Four-page Save／Publish／Discard／Reset coverage completed. Save Draft did not expose unpublished content: **PASS**. Services Discard: **PASS**. About Reset Draft: **PASS**. Home Publish: **FAIL**. Contact Publish／Restore: **FAIL**.
- Four-page nested isolation and Home Publish isolation from Services／About／Contact: **PASS**.
- Hero／move／toggle／background／motion／layout options: **PASS**.
- Duplicate guard: **PASS** — two rapid parallel Save clicks produced only revision 1.
- 409 Conflict: **PASS**. Conflict Reload: **PASS**.
- Published-only Preview boundary: **FAIL** — Draft remained hidden as required, but the iframe／public route did not render the newly Published Page Block settings after Publish.
- 390px horizontal overflow: **PASS**.
- Console／Hydration／Runtime: **PASS** — zero errors or warnings, no hydration error, runtime error, or Next.js overlay.

### Mutation API log summary

- Browser mutations were recorded in `qa-server-resume.log`; the original `qa-server.log` contained no Page Block mutation API lines.
- `PUT /api/admin/content/pageBlocks/draft 200`: **12**.
- `PUT /api/admin/content/pageBlocks/draft 409`: **1**.
- `POST /api/admin/content/pageBlocks/publish 200`: **6**.
- `DELETE /api/admin/content/pageBlocks/draft 200`: **6**.
- `GET /api/admin/content/pageBlocks/editor?page=services 200`: **1**.
- The six Publish calls match Home revision 1→5 (four publishes) and Contact revision 1→3 (two publishes). The single 409 matches the conflict case. Save／Discard counts are consistent with the reported multi-step QA, cleanup, and duplicate-guard flow; no unexpected repeated Publish or other unexplained mutation was found.

### Final isolated persistence

- QA persistence: Envelope `schemaVersion=1`; Draft scopes: **empty**; workflow temp files: **0**.
- Global Published revision: `7`.
- Published Page Block revisions: Home `5`, Services `1`, About `1`, Contact `3`.
- Published `pageBlocks` deeply equals the QA Legacy baseline: **PASS**. Home／Services／About／Contact each deeply equal baseline: **PASS**.
- All test settings were restored. There is no Draft and no public test visual residue.
- QA runtime was stopped precisely after verification: npm parent PID `75718`, Next listener PID `75748`; both cwd values were exactly the QA_DIR. Port `3011` no longer listens. No `pkill`, `killall`, or `kill -9` was used.

### Formal-project restricted check

- Branch: `feature/draft-publish-workflow-v1`; HEAD remains `ea673bf feat: add content draft workflow UI`; no staged changes.
- Formal `data/site-content.json`: **Legacy root**, no diff, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- `data/site-content.seed.ts`, `package.json`, `package-lock.json`, `data/cases.json`, and `data/insights.json`: no diff.
- Formal workflow temp files: **0**. Existing L5 working-tree changes remain present.

### Final automated verification

- `npm run anti:check`: TypeScript **PASS**; Jest **18/18 suites, 273/273 tests PASS**; exit `0`.
- `npm run build`: compile **PASS**; type validation **PASS**; static page generation **45/45 PASS**; exit `0`.
- Automated checks do not override the confirmed Browser QA rendering blocker.

## 0A. L5 Pre-QA Implementation Record — Superseded by Final Status Above

### 1. L5 Summary

- Coding result: **PASS／Ready for isolated Browser mutation QA**.
- Base commit: \`ea673bf feat: add content draft workflow UI\` on \`feature/draft-publish-workflow-v1\`; local and origin were synchronized at preflight.
- Home、Services、About、Contact Page Block Editors now use the L3 Draft Workflow API instead of legacy immediate-Publish Save.
- L4 general Section／Design behavior remains covered by the full test suite. L6 Draft Preview, database persistence, commit, push, merge, PR, and deploy were not started.

### 2. Files added／changed

Added:

- \`components/admin/page-block-editor/page-block-workflow-helpers.ts\`
- \`components/admin/page-block-editor/use-page-block-workflow.ts\`
- \`__tests__/lib/page-block-workflow.test.ts\`

Changed:

- Shared Page Block Editor: \`page-block-editor.tsx\`, \`page-block-editor-types.ts\`, \`page-block-editor-helpers.ts\`, \`page-block-preview.tsx\`.
- Four thin wrappers: \`home-block-editor.tsx\`, \`services-block-editor.tsx\`, \`about-block-editor.tsx\`, \`contact-block-editor.tsx\`.
- Four Admin server pages under \`app/admin/(dashboard)/pages/{home,services,about,contact}/page.tsx\`.
- Minimal L4 reuse: shared actions/status/helper scope typing and shared response parsing in \`lib/content-workflow-client.ts\`.
- Tests: \`page-block-editor.test.ts\`, \`content-workflow-ui-helpers.test.ts\`.
- Docs: \`admin-page-block-editor-guide.md\`, \`draft-publish-workflow-v1-design.md\`.
- This handoff.

### 3. Shared Page Block workflow architecture

- \`PageBlockEditor\` keeps the established shared controls, move/update rules, reset section, and responsive Published preview.
- \`usePageBlockWorkflow\` owns the selected page's snapshot, blocks, dirty state, operation, safe error/notice, conflict, duplicate-request ref, AbortController, mounted guard, and response propagation.
- The typed adapter maps only \`home|services|about|contact\` to \`pageBlocks.<page>\` and reuses the L4 workflow response parser and revision-conflict error.
- Status, actions, revision metadata, conflict UI, and the portal confirmation dialog are shared with L4; no second dialog/parser/status implementation and no \`any\` were added.

### 4. Four-page initial snapshot

- Each async Admin Server Component calls \`getContentWorkflowRepository().readEditor("pageBlocks.<page>")\` and passes one typed single-page EditorSnapshot.
- No page reads a raw Envelope, merges Draft/Published, calls \`readContent()\`, or passes the full \`pageBlocks\` object.
- Opening any Editor is read-only and does not create a Draft. The four scope mappings and Published/Draft snapshots are covered by tests.

### 5. Save Draft

- Uses \`PUT /api/admin/content/pageBlocks/draft\` with only \`page\`, current-page \`blocks\`, \`expectedDraftRevision\`, and \`expectedPublishedRevision\`.
- The L5 Editor no longer calls legacy immediate \`PUT /api/admin/content/pageBlocks\`; the legacy route remains intact.
- Success adopts the API snapshot, sets Draft metadata, and clears dirty state. Failure/conflict preserves local blocks and revisions. Rapid clicks are claimed once.
- Save Draft does not refresh the Published iframe or claim that the public site changed.

### 6. Publish

- Uses \`POST /api/admin/content/pageBlocks/publish\` with page and revisions only; blocks are not resent.
- Available only with a Draft, clean local state, no conflict, and no active request.
- Confirmation shows the Chinese page label, Draft/Published revisions, public-update boundary, and current-page-only effect.
- Success adopts the Published snapshot, clears Draft/conflict/error/dirty state, and is the only automatic Published iframe refresh.

### 7. Discard

- Uses \`DELETE /api/admin/content/pageBlocks/draft\` with only page and expected Draft revision.
- Confirmation explains deletion of the current page Draft, return to Published Page Blocks, no Published mutation, and loss of dirty local edits.
- Success replaces blocks with the Published snapshot and clears dirty/conflict/error without changing another page.

### 8. Reset Draft

- Reset reuses the shared L4 alertdialog and saves only the current page defaults through the Draft API with current revisions.
- It creates/replaces a Draft, does not immediate-Publish, does not refresh the Published iframe, and requires a later Publish to affect the public page.

### 9. Conflict UX

- A \`409 REVISION_CONFLICT\` preserves local blocks, exposes only safe current revisions, disables Publish, and never retries or merges.
- Confirmed reload calls \`GET /api/admin/content/pageBlocks/editor?page=<page>\`, adopts the server snapshot, clears conflict, and sets \`dirty=false\` without Save or revision increment.
- Each rendered page owns an independent hook/state instance.

### 10. Preview Published-only

- Copy explicitly states: \`目前預覽顯示已發布版本；Page Block 草稿預覽將於 Preview 功能完成後提供。\`
- Local edit, Save Draft, Reset Draft, Conflict, and Discard do not expose Draft in the iframe. Manual refresh/new tab use the unchanged public route; successful Publish refreshes the iframe.
- No draft query, cookie, mode, or L6 route was added.

### 11. Hero／layout preservation and four-page isolation

- Existing Hero lock/move boundary, stable IDs, definitions/defaults, supported-layout allowlists, background/motion labels, and 390/768/1280 widths remain unchanged.
- Counts remain Home 9、Services 4、About 5、Contact 3. Server Draft normalization still runs through the L2 scope normalizer.
- Temp-repository tests confirm Home Publish preserves Services/About/Contact and another page Draft can be discarded independently.

### 12. Tests and React review

- Final \`npm run anti:check\`: TypeScript **PASS**; Jest **18/18 suites and 273/273 tests PASS**; exit \`0\`.
- Coverage includes four scope queries, exact Save/Publish/Discard bodies, no legacy Save, mismatched response rejection, safe 409 metadata, read-only initial GET, nested repository isolation, reload source contracts, duplicate/unmount guards, Published-only refresh, shared dialog/accessibility, Hero/move/options/defaults, and restricted implementation tokens.
- \`vercel:react-best-practices\` review: **PASS** — hook rules/dependencies/cleanup, stable IDs, native controls/labels, busy/disabled/live semantics, focus contracts, and TypeScript patterns checked; no extra refactor required.

### 13. Build

- Final \`npm run build\`: compile **PASS**; type validation **PASS**; static page generation **45/45 PASS**; exit \`0\`.

### 14. Restricted check

- Formal \`data/site-content.json\`: Legacy root, no Draft/Envelope, no diff, SHA-256 \`2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939\`.
- Seed, package manifests, Cases, Insights, Page Block definitions/defaults, and public pages/layout UI have no diff.
- No workflow temp file, \`any\`, or \`suppressHydrationWarning\`. No staged changes.
- L5 pre-coding ZIP \`/home/usersun/projects/office-next-site-pre-l5-20260716-1433.zip\` passed archive integrity validation.

### 15. Persistent isolated Browser QA environment

- QA_DIR: \`/home/usersun/qa-workspaces/office-next-l5-qa-20260716-144831\`.
- QA_PORT: \`3011\`.
- QA_PID: \`35466\` (npm parent); Next listener PID: \`35491\`.
- QA_LOG: \`/home/usersun/qa-workspaces/office-next-l5-qa-20260716-144831/qa-server.log\`.
- QA_BASELINE: \`/home/usersun/qa-workspaces/office-next-l5-qa-20260716-144831/qa-baseline.json\`.
- npm parent and Next listener cwd both resolve exactly to QA_DIR — PASS.
- \`HEAD http://localhost:3011/admin/pages/home\` returned a normal \`307\` redirect to \`/admin/login\`.
- Main JSON SHA-256: \`2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939\`; initial QA JSON SHA-256: \`2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939\`. Both started as Legacy root with no Draft scopes.
- The QA copy contains all uncommitted L5 files, is not a Git repository, and uses verified \`node_modules\`／\`.env.local\` symlinks. Environment contents were not read or output.

### 16. Remaining boundary

- Browser mutation QA: **not started**. It must run only at \`http://localhost:3011\` and finish with all Drafts cleared and Published test values restored to baseline.
- L6: not started.
- Commit／push／merge／PR／deploy: not performed.

## 0. L4 Final Acceptance／Ready for Commit — 2026-07-16

### Final result

- Final determination: **PASS — 可以進入 L4 Commit 階段**.
- Final isolated Browser re-QA used only `http://localhost:3011`; it did not operate against the formal project persistence.
- The original Publish concern was caused by choosing the wrong test field/public route, not by a cache defect. Re-testing `home.hero.title` on the public homepage passed.
- Save Draft did not expose unpublished content: **PASS**.
- Publish updated a new public request with the Published value: **PASS**.
- The Published test content was restored to the original HEAD Legacy baseline: full Published content **PASS**; Published home **PASS**.
- The Conflict Reload defect was caused by Tiptap not synchronizing an externally replaced `value`. `RichTextEditor` now applies the server snapshot with `emitUpdate: false`.
- 409 Conflict handling: **PASS**. Conflict Reload: **PASS**. Tiptap DOM synchronization: **PASS**. Reload completed with `dirty=false`: **PASS**. Duplicate request guard: **PASS**.
- Console errors/warnings: **0**. Hydration Error: none. Runtime Error: none. MutationObserver Error: not reproduced. Next.js overlay: none.
- Final isolated persistence: Envelope v1, home Published revision `3`, no Draft scopes, no workflow temp file, and Published content deeply equal to the HEAD Legacy baseline.
- QA_DIR: `/home/usersun/qa-workspaces/office-next-l4-fix-qa-20260716-135105`.
- QA_LOG: `/home/usersun/qa-workspaces/office-next-l4-fix-qa-20260716-135105/qa-server.log` (preserved).
- QA_BASELINE: `/home/usersun/qa-workspaces/office-next-l4-fix-qa-20260716-135105/qa-baseline.json` (preserved).
- The exact port `3011` listener PID `14202` was verified in the persistent L4 QA_DIR, sent SIGTERM, and confirmed stopped. No other server was stopped; the QA_DIR and log were not deleted.
- Formal `data/site-content.json`: Legacy root, Git diff empty, SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Restricted formal files remain unchanged: seed, package manifests, Cases, Insights, and formal workflow temp files.
- Final `npm run anti:check`: TypeScript **PASS**; Jest **17/17 suites and 249/249 tests PASS**; exit `0`.
- Final `npm run build`: compile **PASS**; type validation **PASS**; static page generation **45/45 PASS**; exit `0`.
- No commit, push, merge, deploy, or L5 work was performed.

## 0A. Historical L4 Restricted Persistence Recovery／Isolated QA — 2026-07-16

### Final result

- Recovery: **PASS**.
- Formal `data/site-content.json`: **Legacy root; exact HEAD bytes; no Draft; no Envelope; Git diff empty**.
- Fresh isolated QA environment: **PASS／Ready for OpenClaw Browser re-QA**.
- L4 coding repair and prior automated validation remain present: TypeScript PASS, Jest **17/17 suites and 249/249 tests PASS**, Build **45/45 PASS**.
- No Browser mutation QA, commit, push, merge, deploy, or L5 work was performed in this recovery task.

### Misdirected formal-project QA server

- Previously identified mutation QA runtime: Next dev PID `2744` (parent PID `2743`), port `3001`, cwd `/home/usersun/projects/office-next-site`.
- That exact runtime was sent SIGTERM and confirmed stopped before this recovery task.
- This task inventoried ports 3000–3003 and 3010–3020; no pre-existing LISTEN process remained.
- Final runtime inventory contains no `next-server` whose cwd is the formal project.

### Envelope evidence and formal recovery

- Pre-recovery formal shape: Envelope v1 with root keys `schemaVersion,published,drafts`, zero Draft scopes, and Published content equal to HEAD Legacy content.
- Evidence copy: `/tmp/office-next-l4-envelope-before-recovery-20260716-123845.json`.
- Evidence SHA-256: `db616229e9e397106be245b409fd4aa58d986b1abc76c033e1f38da19f3c09ba`.
- Recovery used exact bytes from `git show HEAD:data/site-content.json`; no `git restore`, `checkout`, `reset`, or clean command was used.
- Formal SHA-256: `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Formal byte equality with HEAD: PASS; JSON parse: PASS; Legacy root: PASS; `git diff -- data/site-content.json`: empty.
- All existing L4 source, test, documentation, and handoff working-tree changes remain present.

### Fresh isolated QA environment

- QA_DIR: `/tmp/office-next-l4-fix-qa-20260716-123934`.
- QA_PORT: `3011`.
- QA_PID: `15998` (`next-server v15.5.10`).
- Managed server session: `86692`.
- Process cwd: `/tmp/office-next-l4-fix-qa-20260716-123934` — PASS.
- QA_LOG: `/tmp/office-next-l4-fix-qa-server-20260716-123934.log`.
- QA baseline: `/tmp/office-next-l4-fix-qa-baseline-20260716-124214.json`.
- HTTP readiness: `HEAD http://localhost:3011` returned `200 OK`.
- Main JSON SHA-256: `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- QA JSON SHA-256: `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- QA JSON is Legacy root with no `schemaVersion` and no Draft scopes.
- Repair-critical RichText／workflow files in QA_DIR match the formal working tree byte-for-byte.
- `node_modules` and `.env.local` are symlinked from the formal project; `.env.local` contents were not read or output.

### Browser re-QA boundary

- Browser re-QA may now begin **only at `http://localhost:3011`**.
- Do not use ports 3000/3001 or the formal project cwd for mutation QA.
- Browser re-QA has not yet started. OpenClaw must verify Publish with `home.hero.title` on `/` or `brand.name` on `/about`, plus the two-tab rich-text conflict reload flow.

### Git／deploy state

- Branch: `feature/draft-publish-workflow-v1`; HEAD remains `0b77136`.
- No staged changes; `git diff --check` PASS.
- Commit／push／merge／PR: not performed.
- Clasp push／Cloud Run／Vercel deploy: not needed and not performed.
- L5: not started.

## 1. L4 Summary

- Task: OFFICE NEXT Draft／Publish Workflow v1 — L4 general Section／Design Workflow UI.
- Coding result: L4 UI and the shared confirmation-dialog isolation repair are implemented.
- Overall handoff result: **PASS／可以進入 L4 Commit 階段**. The prior MutationObserver source gate is resolved by the clean final persistent isolated re-QA: the error did not reproduce, and the complete Publish／Conflict Reload flows passed with zero console errors or warnings.
- Branch: `feature/draft-publish-workflow-v1`.
- Base/HEAD remains: `0b77136 feat: add admin draft workflow API`.
- No commit, push, merge, PR, or deploy was performed. Browser QA did cause the persistence incident documented below; the formal file has now been recovered to exact HEAD bytes under explicit user authorization.

## 2. Files added／changed

Added:

- `lib/content-workflow-client.ts`
- `components/admin/content-workflow/content-workflow-actions.tsx`
- `components/admin/content-workflow/content-workflow-confirm-dialog.tsx`
- `components/admin/content-workflow/content-workflow-dialog-helpers.ts`
- `components/admin/content-workflow/content-workflow-conflict.tsx`
- `components/admin/content-workflow/content-workflow-helpers.ts`
- `components/admin/content-workflow/content-workflow-status.tsx`
- `components/admin/content-workflow/content-workflow-types.ts`
- `components/admin/content-workflow/use-content-workflow.ts`
- `__tests__/lib/content-workflow-client.test.ts`
- `__tests__/lib/content-workflow-ui-helpers.test.ts`

Changed:

- `components/admin/section-editor.tsx`
- `components/admin/design-editor.tsx`
- `app/admin/(dashboard)/brand/page.tsx`
- `app/admin/(dashboard)/home/page.tsx`
- `app/admin/(dashboard)/founder/page.tsx`
- `app/admin/(dashboard)/services/page.tsx`
- `app/admin/(dashboard)/testimonials/page.tsx`
- `app/admin/(dashboard)/faq/page.tsx`
- `app/admin/(dashboard)/contact/page.tsx`
- `app/admin/(dashboard)/design/page.tsx`
- `docs/admin-content-guide.md`
- `docs/admin-design-guide.md`
- `.agent_runs/codex-handoff-latest.md`

## 3. Shared UI architecture

- Added an allowlisted typed client for the nine L4 scopes only: brand, home, founder, services, testimonials, faq, contact, social, design.
- Added separate small components for status/revision metadata, actions, confirmations, conflicts, helpers/types, and state orchestration.
- The hook owns local value, dirty state, operation state, safe notice/error state, conflict revisions, response snapshot propagation, duplicate request guard, AbortController cleanup, and mounted-state guard.
- No `any` was introduced.
- Cases and Insights retain their independent legacy callback mode through `SectionEditor`; their repositories/routes were not changed.

## 4. Initial snapshot load

- Each relevant Admin Server Component now calls `getContentWorkflowRepository().readEditor(scope)` and passes a typed `initialSnapshot`.
- No Admin page reads a raw Envelope or merges Published/Draft itself.
- Opening an editor performs read-only server loading and does not create a Draft.
- Contact loads contact and social snapshots independently with `Promise.all`; each rendered editor owns separate local state, revisions, dirty state, requests, and conflicts.
- `publishedUpdatedAt` is passed through from the repository snapshot (which derives it from `scopeUpdatedAt`).

## 5. Save Draft behavior

- General editors use `PUT /api/admin/content/[section]/draft`.
- Body contains only `data`, `expectedDraftRevision`, and `expectedPublishedRevision`.
- Successful response replaces snapshot metadata/data, sets source from the response, and clears dirty state.
- Failure retains local data and dirty state.
- Save does not refresh the public Design iframe and does not claim content was published.
- The L4 workflow path no longer calls the old immediate-Publish section PUT.

## 6. Publish behavior

- Uses `POST /api/admin/content/[section]/publish`.
- Body contains revisions only; no data/full section is resent.
- Disabled without Draft, while local content is dirty, while a request is active, or while conflict is unresolved.
- Confirmation shows the Chinese scope label, Draft revision, Published revision, and the public-site update warning.
- Successful response clears the Draft revision through the returned Published snapshot and clears dirty state.
- Only successful Design Publish refreshes the Published iframe.

## 7. Discard behavior

- Uses `DELETE /api/admin/content/[section]/draft` with only `expectedDraftRevision`.
- Disabled without Draft and protected by confirmation.
- Confirmation explains Draft deletion, return to current Published, non-history-restore semantics, and loss of unsaved local edits when dirty.
- Successful response replaces local form data with the returned Published snapshot and clears dirty/conflict/error state.

## 8. Conflict UX

- Recognizes HTTP 409 plus `REVISION_CONFLICT`.
- Preserves the local form value and does not retry, merge, overwrite, or use last-write-wins.
- Displays only safe current Draft/Published revision metadata.
- Reload action has a destructive confirmation warning and then calls the allowlisted editor GET route.
- Successful reload replaces local data with the latest server snapshot and clears dirty/conflict state.
- Server messages/internal persistence details are not displayed by the client.

## 9. Design Reset behavior

- Reset confirmation saves `designSettingsDefaults` through `PUT /api/admin/content/design/draft` using current expected revisions.
- Reset creates/replaces a Draft only; Published design remains unchanged until Publish.
- Reset Draft and ordinary Save Draft do not refresh the Published iframe.
- Preview copy explicitly says it is Published-only until the Preview feature is available.

## 10. Contact／Social isolation

- Two independent `readEditor` calls.
- Two independent `SectionEditor` instances and workflow hooks.
- No shared local value, dirty flag, revision state, request guard, or conflict state.

## 11. Accessibility

- Actions use native `button` elements and `disabled`/`aria-busy` states.
- Status uses `aria-live="polite"`.
- Confirmations use `role="alertdialog"`, `aria-modal`, labelled/described relationships, Escape cancellation, initial focus, explicit cancel/confirm buttons, and visible focus rings.
- The shared confirmation uses an SSR-safe React portal, a fixed full-viewport pointer-blocking overlay, native background `inert`, body scroll lock, bidirectional Tab trapping, trigger focus restoration, and cleanup on close/unmount.
- Conflict headings use scope-unique IDs so Contact/Social do not create duplicate accessibility IDs.

## 12. Tests

- Final command: `npm run anti:check`.
- TypeScript: PASS.
- Jest suites: **17/17 PASS**.
- Jest tests: **249/249 PASS**.
- Added coverage for allowlisted routes, request bodies, no-data Publish, discard body, safe parsing/error messaging, 409 metadata, malformed/mismatched response rejection, action availability, Contact/Social separation, server snapshot pages, confirmations/accessibility copy, Published-only Design preview copy, duplicate guard, unmount abort/guard, and no retry.
- The four added dialog regression checks cover overlay/pointer contracts, inert and scroll-lock restoration, forward/reverse Tab trapping, single-confirm claiming, and continued shared use by Publish／Discard／Reload／Reset. Because Jest uses the Node environment and no DOM component-testing package may be added, browser-only orchestration is split into small typed helpers and paired with source contracts plus Browser re-QA.

## 13. Build

- Final command: `npm run build`.
- Compile: PASS.
- Type validation: PASS.
- Static page generation: **45/45 PASS**.
- Exit: successful.
- No font ETIMEDOUT warning occurred.

## 14. Browser QA

- Original environment: Windows ChatGPT desktop App Built-in Browser.
- Repair re-QA environment: local `agent-browser` 0.31.1 using the existing authenticated Chrome profile.
- Final re-QA environment: persistent isolated QA copy at `/home/usersun/qa-workspaces/office-next-l4-fix-qa-20260716-135105`, served only on `localhost:3011`.
- Result: **PASS／previous BLOCKED determination resolved**. Save Draft isolation, Publish public synchronization, baseline restoration, 409 Conflict, Conflict Reload, Tiptap DOM synchronization, `dirty=false`, and duplicate request guarding all passed.

| Route | Result | 1280px | 390px | Horizontal overflow | Console Error | Hydration | Runtime | Next.js overlay | Tiptap | Special check |
|---|---|---|---|---|---|---|---|---|---|---|
| `/admin/brand` | PASS | PASS | PASS | None | None | None | None | None | PASS: 3 editors; normal after delayed mount at 390px | — |
| `/admin/home` | PASS | PASS | PASS | None | None | None | None | None | N/A: Tiptap not used | — |
| `/admin/founder` | PASS | PASS | PASS | None | None | None | None | None | N/A: Tiptap not used | — |
| `/admin/services` | PASS | PASS | PASS | None | None | None | None | None | N/A: Tiptap not used | — |
| `/admin/testimonials` | PASS | PASS | PASS | None | None | None | None | None | N/A: Tiptap not used | — |
| `/admin/faq` | PASS | PASS | PASS | None | None | None | None | None | N/A: Tiptap not used | — |
| `/admin/contact` | PASS | PASS | PASS | None | None | None | None | None | N/A: Tiptap not used | Contact／Social isolation: PASS |
| `/admin/design` | PASS | PASS | PASS | None | None in final re-QA | None | None | None | N/A: Tiptap not used | Published-only warning: PASS; Preview: PASS; Reset dialog overlay/inert/focus: PASS |

Earlier shared verification results (historical; the final persistent isolated re-QA above supersedes these where results differ):

- All eight routes loaded normally and displayed the Published-version status.
- Draft revision displayed `無草稿 · —`; Published revision metadata displayed normally.
- Every workflow displayed `儲存草稿`, `發布`, and `放棄草稿` controls.
- With no Draft, Publish and Discard were native disabled buttons.
- Workflow controls were native `button` elements; sync status used `aria-live="polite"`.
- With no Draft, confirmation dialogs were not rendered. Dialog accessibility semantics are therefore N/A in this state and were not marked PASS.
- Contact and Social had independent action groups, revision metadata, and live-status regions; their structures were not shared.
- Design displayed `目前預覽顯示已發布版本；草稿預覽將於 Preview 功能完成後提供。`.
- The Design Preview iframe loaded the Published homepage content normally.
- The Design Reset Draft control `建立預設設計草稿` existed.
- Root cause of the pointer defect: the shared confirmation rendered inline inside the editor section. It declared `aria-modal="true"` but had no viewport overlay, no background `inert`, no body scroll lock, and no complete focus trap.
- Actual shared repair: `ContentWorkflowConfirmDialog` now creates its portal root only in a client effect, renders a fixed `inset-0` overlay at z-index 100 with computed `pointer-events: auto`, and keeps the alertdialog panel inside that overlay. No hydration suppression or Tiptap behavior changed.
- Background isolation: while open, every pre-existing direct body child was observed with native `inert=true`; only the dialog portal remained interactive. Body overflow changed to `hidden`. Escape, Cancel, and unmount cleanup restore each element's previous inert value and the previous body overflow value.
- Pointer re-QA: a physical pointer attempt at the underlying Reset control's viewport position did not reach the underlying listener (`resetClicks=0`) and did not close or confirm the dialog. Clicking the overlay also retained focus inside the dialog. Panel events did not bubble into the page.
- Focus re-QA: initial focus entered `取消`; Shift+Tab wrapped to `確認建立 Reset Draft`; Tab wrapped back to `取消`. Escape closed without confirming and restored focus to `建立預設設計草稿`. Reopening and clicking Cancel produced the same cleanup and focus restoration.
- The shared fix applies to Publish, Discard, conflict Reload, and Design Reset. Publish and Discard remained native disabled buttons with no Draft; their common overlay/focus behavior is covered by the shared contract/helper tests without creating a real Draft.
- The browser-side request capture reported no `/api/admin/content` request, but the subsequently preserved Next.js server log is authoritative and shows two successful `PUT /api/admin/content/design/draft` requests and two successful `DELETE /api/admin/content/design/draft` requests during Browser QA.
- No `POST /api/admin/content/design/publish` occurred. Incident inspection found empty Drafts and Published content, Published Design, and Published Page Blocks all exactly matching HEAD.
- Console re-QA: no Hydration Error, page error, visible Runtime Error overlay, or Next.js error overlay. Console output contained only Fast Refresh logs.

MutationObserver investigation:

- Static product-source search for `MutationObserver`, `.observe(`, and `.disconnect(` found no project code that creates or controls a MutationObserver. The dialog repair intentionally adds no observer.
- The original Windows Built-in Browser record contained one uncaught `MutationObserver` TypeError with an empty source URL, but no complete message, stack, line, or column was available in the supplied evidence.
- The error did not reproduce during the authenticated local runner re-QA, so no new stack, webpack chunk, source map, injected/evaluate URL, line, or column could be captured.
- A separate general Windows Chrome reproduction was not available in this environment. Consequently, the evidence is insufficient to classify the earlier entry as either product code or a browser-runner tooling artifact, and no product workaround or global error suppression was added.
- Final persistent isolated re-QA did not reproduce any MutationObserver Error and completed the mutation/conflict flows with zero console errors or warnings.
- Commit gate: **RESOLVED**. Final L4 determination is **PASS／可以進入 L4 Commit 階段**.

Mutation incident and authorized persistence recovery:

- Browser QA unintentionally executed two successful Design Save Draft mutations (`PUT /api/admin/content/design/draft`) and two successful Design Discard mutations (`DELETE /api/admin/content/design/draft`). No Publish POST occurred.
- The first Save Draft migrated formal `data/site-content.json` from the Legacy root to Envelope v1. At incident inspection time `drafts` was empty, and Published content, Published Design, and Published Page Blocks all matched HEAD exactly.
- Before recovery, the Envelope incident file was copied outside the repository to `/tmp/office-next-site-content-envelope-incident-20260716-113240.json`; SHA-256: `e96f62fead13c4923232452641a1dc4394da6c8aabc521aa875598bd29849b22`.
- Under explicit user authorization, `data/site-content.json` was recovered with the exact bytes returned by `git show HEAD:data/site-content.json`, without using `git restore`, `checkout`, or `reset`.
- Recovery verification: bytes match HEAD PASS; JSON parse PASS; 17,684 bytes; SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`; `git diff -- data/site-content.json` is empty.
- All existing L4 source, test, documentation, and handoff working-tree changes remain present. No L4 program file was discarded or changed by the recovery.
- Future Browser mutation QA must use an isolated persistence copy or equivalent mutation-safe fixture and must not run against formal `data/site-content.json`.

## 15. Restricted-file check

- `git diff --check`: PASS.
- `data/site-content.json`: no diff; verified Legacy root, no `schemaVersion`, no `drafts`.
- `data/site-content.seed.ts`: no diff.
- `package.json` / `package-lock.json`: no diff.
- `data/cases.json` / `data/insights.json`: no diff.
- Page Block editor components and Page Block Admin routes: no diff.
- Public pages/UI, Header/Footer/CTA, and preview routes/iframe URLs: no diff. The only Tiptap repair is the approved external-value synchronization using `emitUpdate: false`.
- No workflow temp data file remains.
- The Browser QA incident did create and discard Design Drafts and migrate formal persistence to Envelope v1; the authorized recovery restored exact Legacy HEAD bytes. No Draft remains, and no secret access occurred.

## 16. Git status

- Worktree intentionally contains the L4 files listed above plus this handoff.
- HEAD remains `0b77136`.
- Commit: **not created** (explicit task prohibition; the resolved L4 result is ready for a separate Commit stage).
- Push: not performed.

## 17. Not implemented

- L5 four Page Block Editor Workflow UI was not started.
- L6 Admin Draft Preview route was not started.
- No real persistence migration.
- No Vercel deployment.
- No unrelated Admin/public UI changes.

## 18. L5 recommendation

- After the separate L4 Commit and OpenClaw commit QA stages complete, implement the four Page Block editors as a separate L5 batch using their existing typed Page Block shapes and the L3 Page Block workflow API.
- Keep L5 tests on mocked API/temp fixtures until all legacy immediate-Publish Page Block callers are converted.
- Do not perform the first real persistence workflow write before L5 is complete and QA passes.

## 19. Needs OpenClaw QA／deploy／manual verification

- Needs OpenClaw Browser QA: **No; final isolated re-QA PASS**. The next authorized step is the separate L4 Commit stage and its normal commit-scope QA.
- Needs clasp push: **No**.
- Needs Cloud Run deploy: **No**.
- Needs Vercel deploy: **No; explicitly forbidden in L4**.
- Needs manual verification for the former MutationObserver gate: **No; final isolated re-QA did not reproduce it**.

## 20. Critical transition warning

**Before L5 is complete, do not execute the first real Save Draft, Publish, Discard, or Design Reset against the formal local persistence.** The first workflow write converts the Legacy JSON to an Envelope; the still-legacy Page Block immediate-Publish API would then be blocked by Envelope write protection.

## 21. L7 Hydration #418 Two-Failure Consistency Gate (2026-07-18)

- Result: **Two-FAIL consistency not met; hydration evidence remains insufficient**.
- Evidence: `/home/usersun/qa-workspaces/office-next-l7-hydration-soak-qa-20260717-201458/qa-hydration-two-fail-evidence-20260718T153346`.
- Matrix: 80 PASS / 0 new supported React #418 FAIL; 80-navigation limit reached.
- Build ID remained `82M7nU5t-M-Tu7CMfQSYr`; formal and QA Site Content remained byte-identical Legacy roots with SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Conformance limitations: no cold restart occurred between loads 40 and 41 (1 ms gap), and all PASS records report MAIN child count 12 rather than the required canonical count 11.
- No additional navigation was run after audit because the authorized 80-load ceiling was exhausted.
- Product code/tests, persistence, manifests, and historical reports were not modified. No Save/Publish/Discard/Reset/Admin mutation, controlled variant, commit, push, deploy, merge, PR, or migration was performed.
- Controlled diagnostic variant: **not authorized**.
- Detailed report: `.agent_runs/l7-hydration-two-fail-consistency.md`.
