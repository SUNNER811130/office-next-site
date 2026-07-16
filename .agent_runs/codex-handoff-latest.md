# Codex Handoff

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
