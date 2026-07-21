# Draft／Publish Workflow v1 — L7 Release Gate

## Final — L7 Conditional Release Closeout (2026-07-21)

**L7 Conditional PASS — intermittent recoverable React #418 remains a monitored known issue.**

- Server-Shell architecture and all deterministic workflow/security gates passed.
- TypeScript PASS; Jest `25/25` suites and `345/345` tests PASS; clean isolated production build `45/45` PASS, including Middleware／instrumentation and Dynamic Admin Preview.
- The focused production hydration matrix passed `58/58` loads.
- The paired clean-profile document-start matrix passed `160/160` loads.
- Historical intermittent recoverable React #418 evidence remains preserved as a monitored known issue. React #418 is not declared eradicated.
- No stable reproducer or product branch was localized.
- Additional random localhost load testing is closed due to diminishing diagnostic value.
- Read-only Preview evaluation may proceed.
- Real mutation deployment remains blocked until durable external persistence exists.
- Formal `data/site-content.json` remains an unchanged Legacy root with SHA-256 `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`; formal persistence was not modified.
- Historical PASS／FAIL reports below and in `.agent_runs/` are retained as evidence. They describe their original gate-time decisions and are not rewritten by this final engineering classification.

## Latest — Paired Clean-Profile Document-Start Capture Gate (2026-07-21)

- Classification **D**: strict paired clean-profile capture reached the authorized ceiling with Legacy `80/80 PASS` and Envelope `80/80 PASS`; no new supported React #418 occurred.
- Identical Build ID/`.next`, Chrome, media, direct navigation, resource scheduling, and four 20-pair runtime lifecycles were retained. Lifecycle 3 has exact launch-shell/listener/cwd evidence but lacks a separately sampled intermediate npm/Next-shell PID.
- Exact Document bodies, request IDs/SHA/bytes/headers, JS hashes, Cookie/RSC booleans, and synchronous document-start/final snapshots exist for every formal load. No FAIL means no new recursive diff or causal localization.
- **Paired capture did not reproduce. Historical supported FAIL remains. No product repair or Commit authorized.** The hydration blocker is not cleared.
- Formal and QA persistence safety passed; both runtimes stopped. No product/test/workflow/persistence/build/package mutation and no commit/push/deploy/merge/PR/migration. Evidence: `.agent_runs/l7-hydration-paired-document-start-capture.md`.

## Latest — Legacy／Envelope Hydration Isolation Gate (2026-07-20)

- Gate remains **FAIL / inconclusive**. Corrected 2×2: Legacy clean `39/40` (one new LCA16 #418); the other three cells passed all `60/60` combined loads.
- agent-browser error clearing was ineffective after LCA16, so retained one-entry buffers were not counted as new failures.
- Same measured response SHA passed and failed with identical build/chunks/headers/Page Blocks/normalized BODY; FAIL post-recovery lacked trailing Suspense comments.
- The outcome is outside the specified A–E patterns. Envelope, authenticated state, Shell, and repository are not confirmed causes; no product repair or L7 Commit is authorized.
- Runtimes stopped and persistence safety preserved. Evidence: `.agent_runs/l7-hydration-legacy-envelope-isolation.md`.

## Latest — v3 Authenticated Resume Completed, Hydration FAIL (2026-07-20)

- Authenticated Admin/Preview Chrome, shell separation, security headers, UI Save Draft, Draft Preview, public Published-only serialization, Discard accessibility, and cleanup all passed.
- The isolated flow created only Home Draft revision 1 over unchanged Published revision 1, never published the marker, then sent one DELETE 200 and restored empty Draft scopes with Published deep-equal baseline.
- **Hydration gate FAIL:** supported direct navigations captured React #418 once on public Home during Draft, once on Published Preview after cleanup, and twice on public Home after cleanup. Warning/error console counts and overlays remained 0; public HTML never leaked Draft/Envelope metadata.
- Formal persistence/package/staging/temp safety passed. Hydration blocker is not repaired; L7 Commit is not authorized. No commit, push, deploy, merge, PR, Publish, or formal migration occurred.
- Evidence: `.agent_runs/l7-hydration-server-shell-repair-validation-v3.md`.

## Latest — v3 Authenticated Resume (2026-07-20)

- Gate remains **FAIL / awaiting login in the exact persistent Admin QA profile**.
- The retained v3 production runtime and byte-identical Legacy baseline passed preflight; completed automatic/build/hydration/public gates were not rerun.
- A new `office-next-l7-server-shell-v3-auth-resume` session using `/home/usersun/.agent-browser/profiles/office-next-admin-qa` still redirected `/admin` to `/admin/login`.
- The run stopped without reading auth material or performing Admin/Preview/Draft/Discard mutation. Persistence and marker/temp safety remain intact; listener `21378` remains on port `3011`.
- L7 Commit is not authorized. Evidence: `.agent_runs/l7-hydration-server-shell-repair-validation-v3.md`.

## Latest — Server-Shell Repair Validation v3 (2026-07-20)

- Gate: **FAIL / awaiting Admin login**.
- Correct fixture prefix cleared v2: TypeScript PASS, Jest `25/25` suites and `345/345` tests, migration cleanup PASS.
- Clean build and generated routes PASS (`45/45`, stale route imports `0`), followed by Phase A `29/29`, exact cold restart, and Phase B `29/29`; all hydration/error/warning/overlay counts were `0`.
- Public Chrome, 390 px layout, and unauthenticated Preview 307/no-store/noindex passed. The existing Admin QA session expired, so authenticated Dashboard/Preview and the minimal Draft/Discard smoke remain pending.
- L7 Commit is not yet authorized. The retained QA runtime is on port `3011`; after Admin login, resume only the pending authenticated checks. No product/test/manifest/persistence mutation, commit, push, deploy, merge, PR, or migration occurred.
- Evidence: `.agent_runs/l7-hydration-server-shell-repair-validation-v3.md`.

## Latest — Server-Shell Repair Clean Generated-State Validation v2 (2026-07-20)

- Gate: **FAIL before production build and Browser QA**.
- A fresh patched copy with no inherited `.next`/`.swc` passed TypeScript, so the previous stale `.next/types` blocker did not recur.
- Jest reached `24/25` suites with all `342/342` executed tests passing, then failed because the task-required migration fixture prefix `/tmp/office-next-l7-server-shell-migration-*` is rejected by the L7 test invariant accepting only `/tmp/office-next-l7-migration-*`.
- L7 Commit is not authorized. Resolve only this fixture-prefix contract, then rerun clean generated-state validation. No product/test/manifest/persistence mutation, commit, push, deploy, merge, PR, or migration occurred.
- Evidence: `.agent_runs/l7-hydration-server-shell-repair-validation-v2.md`.

## Latest — Hydration #418 Corrected Cold-Restart Reproduction Gate (2026-07-19)

- Corrected gate: `78 PASS / 2 supported FAIL`; A12, mandatory exact cold restart, then B10 with a separate clean profile.
- PASS MAIN is 12 raw children: legal Next SCRIPT, nine ordered Page Block DIVs, `$`, `/$`. Prior 11-vs-12 is a SCRIPT canonicalizer-count difference.
- Both failures lose the same two comment types/hashes by the synchronous #418 snapshot and retain the same 10-child structure through microtask, MessageChannel, timeout(0), and post-recovery; 78 PASSes retain both markers.
- Observer evidence cannot prove pre-error disappearance. **Boundary removal classified as React recovery; hydration root cause remains unlocalized.**
- Hydration blocker remains; no controlled variant, repair, commit, deployment, merge, or migration is authorized.
- Evidence: `.agent_runs/l7-hydration-corrected-cold-restart.md`.

## Latest — Hydration #418 Two-Failure Consistency Gate

- Final: **Two-FAIL consistency not met; hydration evidence remains insufficient**.
- New matrix: 80 PASS / 0 supported React #418 FAIL; authorized navigation ceiling reached.
- No midpoint cold restart was recorded after the first 40 PASSes, and saved PASS MAIN counts are 12 instead of the required canonical 11. This evidence is diagnostic-only and is not a conforming authorization gate.
- Historical single-FAIL boundary loss remains unclassified as causal versus React recovery because no new error-time sequence was captured.
- Controlled diagnostic variant and product repair remain unauthorized.
- See `.agent_runs/l7-hydration-two-fail-consistency.md` for evidence locations and restricted checks.

## Latest — Hydration #418 Error-time DOM／Client Render Localization Gate

- Result: **E — Hydration evidence仍不足；不得進行猜測性 repair**.
- A passive, normal-scheduling clean-profile runner captured 19 PASS / 1 FAIL within the 20-load cap. The consistency requirement needs two FAILs.
- FAIL load 5 has an exact response and synchronous error-time snapshot. The first difference is MAIN child count 11→9: trailing React/Suspense `$` and `/$` comment markers are present in exact server-parsed/PASS DOM but absent at FAIL error-time and recovery DOM.
- Because the error handler may run after React's synchronous boundary removal and comment nodes have no own Fiber, the evidence cannot choose RootSiteShell, adjacent PageBlockFrame, or the Next Suspense boundary as cause.
- BODY style differs only in raw serialization; normalized CSS map is identical. Normal Framer Motion completion is not treated as cause.
- Formal/QA Legacy persistence remains SHA-correct; restricted checks pass. No product change, controlled variant, commit, push, deploy, merge, migration, clasp push, or Cloud Run deploy.
- Detailed evidence: `.agent_runs/l7-hydration-error-time-localization.md`.

## Latest — Hydration #418 Pre-hydration Evidence Gate

- Result: **E — Hydration evidence仍不足；不得進行猜測性 repair**.
- Profile B reproduced 3/3. Cache-enabled and cache-disabled groups each reproduced once with identical chunk versions, ruling out simple resource mixing.
- Raw streaming order varies, but parsed pre-hydration structure is stable; the same document SHA passes/fails. Three cold clean-profile cycles passed 9/9.
- Paused-JS DOM was stable and nesting-valid but did not fail. Mutation trace shows React recovery only after #418, not the first differing node/attribute.
- RootSiteShell pathname and PageBlockFrame/motion reduced-motion branches remain unproven candidates and are not authorized for repair.
- Formal/QA Legacy persistence stays SHA-correct; restricted checks pass. No product change, commit, push, deploy, merge, migration, clasp push, or Cloud Run deploy.
- Detailed evidence: `.agent_runs/l7-hydration-preload-evidence.md`.

## Latest — Hydration Stability Soak Gate

- Result: **FAIL — Supported production reproduction confirmed**.
- Profile A passed `21/21` supported production loads. After a cold `next start` restart, fresh Profile B reproduced React #418 on Home load 2 and six further supported same-session loads/confirmations.
- The 68-load PASS matrix was stopped; Existing and reduced-motion phases were not run. The error cannot be classified as a non-reproducible runner/session transient.
- Live DOM retained the expected Published shell and chrome counts, with console warning/error and overlay counts at zero. Exact pre-hydration divergence is still required before a product repair is authorized.
- QA/formal persistence and restricted files remain safe. TypeScript, Jest `25/25` suites and `344/344` tests, and production build `45/45` pass.
- L7 Browser Gate remains FAIL. Not ready for L7 Commit/final closeout or Vercel read-only Preview evaluation. Real mutation deployment remains independently blocked by durable external persistence.
- Detailed report: `.agent_runs/l7-hydration-stability-soak.md`.

## Latest — Production Hydration #418 Root-Cause Gate

- Result: **FAIL — Hydration root cause尚未定位**.
- Current supported runs do not reproduce the prior blocker: existing authenticated profile `0/3`, clean default/no-preference profiles `0/3` and `0/8`, proper reduced-motion `0/2`.
- Server and live DOM agree on html/body attributes, Published RootSiteShell structure, and Site Chrome counts. No extension-injected DOM or invalid Home nesting was detected.
- A RootSiteShell diagnostic variant passed, but the identical unmodified control passed too; no causality was established and no product code was changed.
- Regression remains green: TypeScript PASS, Jest `25/25` suites and `344/344` tests PASS, production build `45/45` PASS. Formal Legacy persistence remains unchanged.
- L7 Browser Gate is not cleared. Do not commit, deploy, merge, migrate, or begin a product repair until an unmodified production baseline reproduces #418 with supported runner settings and pre-hydration evidence.
- Detailed report: `.agent_runs/l7-hydration-root-cause.md`.

## Latest — L7 Production Full Browser QA Ready

- Result: **Ready for final production-runtime L7 Browser QA**.
- The Public RSC Serialization Production Gate remains PASS: the observed Draft／Envelope serialization is specific to `next dev` React Flight debug records; three fresh `next start` response paths contained no Draft／Envelope／revision leakage. No product repair is required. Never expose the development server to an untrusted network, and use `next build` + `next start` for final release/security QA.
- Fresh QA_DIR: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347`; port `3011`; shell/npm/Next listener PIDs `4683`／`4689`／`4701`; exact runtime cwd match.
- Build log: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347/qa-production-build.log`; server log: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347/qa-production-server.log`.
- QA baseline: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347/qa-baseline.json`; migration baseline: `/home/usersun/qa-workspaces/office-next-l7-production-full-qa-20260717-162347/qa-migration-baseline.json`. Persistence and both baselines remain byte-identical Legacy roots with SHA `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Production build and read-only smoke passed: compile/type validation, `45/45` pages, Middleware/instrumentation/traces, Dynamic Preview route, generated Page Block CSS, public routes/manifest/login `200`, and unauthenticated Preview secured `307`. Runtime error and workflow temp-file counts are `0`.
- The complete authenticated Browser mutation QA remains pending. No product code change, commit, push, deploy, merge, PR, or formal migration was performed in this preparation step.

## Latest — Public RSC Serialization Production Gate

- Result: **PASS — Dev-only React Flight debug serialization**.
- The prior `next dev` fresh-response evidence remains a valid development security failure: Draft/raw Envelope data appeared in React Flight development debug records even though visible public content was Published-only. Never expose the dev runtime to an untrusted network or use it as a release security gate.
- A fresh isolated Legacy copy was built with `npm run build` and served with `npm run start -- -p 3011`. Compile/type validation, 45/45 pages, Middleware/instrumentation/traces, and Dynamic Preview route passed.
- First Home Save Draft migrated only the isolated QA persistence to Envelope v1 with Home Draft revision 1 and Published revision 1. Full Published content remained deep-equal to the Legacy baseline; Draft Preview showed the marker and public visible content remained Published.
- Three production fresh checks passed: no-Cookie raw HTML, authenticated no-store fetch, and a completely fresh public Browser document each contained zero Draft marker, `drafts.home`, schema/revision metadata, raw Draft root, or `Object.readFile` debug record. Normal production Flight scripts contained no sensitive data.
- The test Draft was discarded through the authenticated UI. Final QA Draft scopes are empty, Published equals baseline, marker/temp counts are zero, and formal persistence remains an unchanged Legacy root with the required SHA.
- No public rendering, repository, Root Layout/Shell, query/cookie workaround, or `force-dynamic` repair is required by this evidence.
- All release Browser QA and security gates must run against `next build` + `next start`. The complete L7 Browser checklist remains pending and is not marked PASS by this diagnostic gate.
- Detailed evidence: `.agent_runs/l7-production-serialization-gate.md`.

## Latest — L7 Vary Contract Correction／QA False Blocker

- The prior conclusion “`Vary` only contains Cookie, therefore FAIL” is **Historical／Superseded — QA contract false blocker**. It is not a product defect.
- A Middleware-generated unauthenticated `/admin/preview/*` redirect is accepted when it returns 307 to `/admin/login`, private/no-store, pragma no-cache, noindex/nofollow, `Vary` containing `Cookie`, and a body with no Site Chrome, Preview, Draft, or Envelope serialization.
- This pre-render redirect does not enter App Router/RSC rendering, so it is not required to contain RSC/router framework Vary tokens. `Accept-Encoding` is not required unless the response actually uses content-encoding negotiation.
- Authenticated App Router Preview 200/safe-404 responses must preserve the framework Vary tokens actually emitted by the installed Next version, add `Cookie`, and remain private/no-store and noindex/nofollow. Tests must not hard-code a version-specific complete framework-token list.
- Public responses must retain normal Next App Router Vary behavior, must not add Cookie, and must remain outside Preview authentication middleware.

## Latest — L7 Preview Pre-render Auth／Serialization Repair

- Result: **Ready for corrected full L7 Browser QA**.
- The prior Browser Gate confirmed unauthenticated Preview raw-response Published leakage and stopped safely. The public Draft marker was observed only in Browser DOM script history; fresh raw HTTP had not confirmed it, so this repair did not alter public pages, `readContent`, repositories, or Publish cache behavior.
- Root cause: RootLayout assembled Published site chrome across a Client Component boundary before Preview Page authentication redirected.
- Added an Edge-compatible Web Crypto session verifier that preserves the existing cookie name and HMAC token format. Preview-only async middleware now validates before rendering and returns a secured 307 for invalid sessions. Preview Page `requireAdminUser()` remains as defense-in-depth.
- Targeted tests: 3/3 suites, 22/22 tests PASS. Final anti-check: TypeScript PASS; 25/25 suites, 344/344 tests PASS. Build: compile/type validation/traces PASS, 45/45 pages, Middleware 34 kB, Dynamic Preview route.
- Corrected unauthenticated raw response: 307 to login, required no-store/no-cache/noindex/Vary Cookie headers, 12-byte body, zero baseline long-text hits, no Published `__next_f` chrome, Draft metadata, or raw Envelope.
- Corrected QA runtime: `/home/usersun/qa-workspaces/office-next-l7-serialization-fix-qa-20260717-143336`, port 3011, npm PID 61700, Next PID 61729, exact cwd match, Runtime/Error 0. Legacy persistence and both baselines retain the required SHA.
- Formal persistence is still unchanged Legacy. Full corrected Browser mutation QA has not been rerun. No commit, push, deploy, merge, PR, or formal migration was performed.

## Gate result

- Automated regression and isolated Legacy migration gate: **PASS**.
- Formal persistence safety: **PASS**; formal `data/site-content.json` remained a byte-identical Legacy root.
- Next stage: **Ready for L7 full isolated Browser QA**.
- Vercel capability: **Gate A — the UI and routing may be used for a read-only Preview deployment, but real Draft／Publish mutations must remain disabled**.
- Commit, push, merge, deployment, and formal persistence migration were not performed.

## Automated regression

- Final `npm run anti:check`: TypeScript PASS; Jest 23/23 suites and 328/328 tests PASS; exit 0.
- `npm run build`: compile, type validation, page data, 45/45 page generation, finalization, and build traces PASS; exit 0.
- Middleware and instrumentation built successfully. `/admin/preview/[target]` remains a Dynamic route.
- Coverage includes Legacy/Envelope parsing, atomic replacement, revisions and conflicts, Draft/Publish/Discard isolation, General/Design/Page Block workflows, UI conflict guards, generated Page Block CSS, Preview security/composition/site chrome, Vary Cookie, and Published-only public rendering.

## Migration gate

- Fixture: `/tmp/office-next-l7-migration-20260717-133448-nilBpl`.
- Legacy baseline and pre-write backup SHA-256: `2d0bd7de997d8c4cacc72c198ca54a7921e317d3f98362f17983368c5c873939`.
- Read-only `readPublished()`, `readEditor()`, and composed Admin Preview did not change bytes or create an Envelope.
- First valid Save Draft converted only the isolated fixture to Envelope v1. Published content remained deeply equal to the Legacy baseline; only `brand` Draft existed; Draft revision 1 and Published revision 1 were preserved.
- Discard removed the Draft while retaining the legal Envelope and byte-equivalent Published content.
- A clean first Save＋Publish removed the target Draft, advanced the global and `brand` Published revisions to 2, changed only the target scope, and returned the correct Published snapshot.
- A clean `pageBlocks.home` first write applied the existing normalizer, retained the full ID set and Hero lock, left Published unchanged, and returned to baseline after Discard.
- Failed first write, missing Draft Publish, malformed persistence, invalid scope, stale revision, and concurrent repository writes did not partially overwrite or silently lose data. Atomic temp files after the gate: 0.
- Migration is mutation-triggered, not deploy-triggered: read-only requests do not migrate. Formal migration needs separate authorization and an external backup.

## Persistent isolated QA runtime

- QA_DIR: `/home/usersun/qa-workspaces/office-next-l7-full-regression-qa-20260717-133602`.
- Port: `3011`.
- npm parent PID: `22283`; Next listener PID: `22309`. Both cwd values resolve exactly to the QA_DIR.
- Log: `/home/usersun/qa-workspaces/office-next-l7-full-regression-qa-20260717-133602/qa-server.log`.
- Baseline: `/home/usersun/qa-workspaces/office-next-l7-full-regression-qa-20260717-133602/qa-baseline.json`.
- Migration baseline: `/home/usersun/qa-workspaces/office-next-l7-full-regression-qa-20260717-133602/qa-migration-baseline.json`.
- Initial QA persistence and both baselines are byte-identical Legacy roots with the formal SHA-256. No L4/L5/L6 QA persistence was reused.
- Public routes, manifest, and icons returned 200. Unauthenticated Admin/Preview routes redirected to login. Preview responses retained no-store/noindex/Vary Cookie. Runtime error scan was clean and persistence hashes remained unchanged.
- Authenticated invalid-target 404 and all mutation flows remain intentionally pending for the full Browser QA. `agent-browser` CLI was unavailable, so this phase used HTTP and server-log smoke only.

## Vercel Preview capability

- No local `.vercel/project.json` exists, so no linked local Vercel project was verified or changed.
- `next.config.mjs` is minimal; the local Next production build, middleware, instrumentation, and Dynamic Preview route pass.
- Read-only routes can be evaluated in a Preview deployment, subject to normal environment configuration and authenticated QA.
- Workflow writes currently target `process.cwd()/data/site-content.json` with local atomic rename semantics. Vercel Functions do not provide a persistent local filesystem suitable for this workflow; bundled files may be read, but local writes are not durable across invocations or instances.
- Full mutation deployment therefore requires an external durable store. A transactional Postgres-compatible store is the conservative fit for per-scope revisions, conflicts, and atomic publish semantics. Blob/KV would require an explicit concurrency and conditional-write design before use.
- Official references: [Vercel Functions](https://vercel.com/docs/functions), [using files in Vercel Functions](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions), and [Vercel Storage](https://vercel.com/docs/storage).

## Full Browser QA checklist

### A. Public regression

1. Verify `/`, `/services`, `/about`, and `/contact` at 1280px and 390px.
2. Verify Header, Footer, and Floating CTA content and layout.
3. Verify Design CSS variables and data attributes.
4. Verify Page Block background, layout, motion, ordering, and enabled state.
5. Confirm public pages never render a Preview banner.
6. Confirm public requests never expose Draft data.

### B. General workflow

7. Save one General Section Draft.
8. Verify only the authenticated Draft Preview shows it.
9. Discard and verify fallback to Published.
10. Publish and verify the public route updates.
11. Restore and publish the original baseline.
12. Verify Rich Text rendering and external snapshot synchronization.
13. Verify Contact and Social Drafts remain isolated.

### C. Design

14. Save a Design Draft.
15. Verify Draft Design across page body and full Preview chrome.
16. Create and preview Reset Draft.
17. Discard and verify Published fallback.
18. Publish, verify, and restore the baseline.
19. Verify Floating CTA enabled/disabled rendering and spacing.

### D. Page Blocks

20. Save Draft on Home, Services, About, and Contact.
21. Verify four-page Preview isolation.
22. Publish each scoped change and verify the correct public page.
23. Verify scoped Discard.
24. Verify scoped Reset Draft.
25. Verify Hero lock, first position, and required ID.
26. Verify move, toggle, background, motion, and layout controls.

### E. Conflict and concurrency

27. Produce a General two-tab revision conflict.
28. Produce a Page Block two-tab revision conflict.
29. Reload the server version and confirm local conflict resolution.
30. Verify duplicate request guard.
31. Confirm local conflict values never enter Preview before a successful Save.

### F. Migration gate

32. Confirm QA starts as a Legacy root.
33. Confirm first valid Save converts QA persistence to Envelope v1.
34. Confirm Published content remains equal to the baseline immediately after conversion.
35. Confirm only the selected Draft scope exists.
36. Clear all Draft scopes before completion.
37. Restore and publish the complete baseline.
38. Validate final Envelope structure and revisions.

### G. Security

39. Confirm Preview blocks unauthenticated and expired sessions.
40. Confirm an authenticated invalid target returns safe 404.
41. Confirm no-store, noindex, and merged Vary Cookie on final responses.
42. Confirm no Draft cookie is introduced.
43. Confirm no public Draft query mode exists.
44. Confirm no raw persistence, Envelope metadata, paths, or sensitive values are exposed.

### H. Runtime and accessibility

45. Confirm 390px pages and Preview controls have no horizontal overflow.
46. Verify Published/Draft mode controls and disabled state.
47. Verify confirmation dialog focus, inert background, cancel, and restore behavior.
48. Verify descriptive iframe titles at all device widths.
49. Confirm console warnings/errors are 0.
50. Confirm no hydration, runtime, MutationObserver, or Next overlay error.
