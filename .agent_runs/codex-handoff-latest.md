# Codex Handoff

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
