# Codex Handoff

## 1. L3 Summary

完成 OFFICE NEXT Draft／Publish Workflow v1 的 L3｜Admin Draft API。新增 Editor read、Save Draft、Publish Draft、Discard Draft action routes、共用 scope／request parser、安全 response/error mapper、production repository factory 與完整 API route tests。

本輪只處理後端 Workflow API；未修改 Admin UI、Page Block Editor、Design Editor、Preview iframe、公開頁或 CSS。所有 mutation route tests 都 mock repository，runtime smoke 只送未登入 request，沒有對正式 persistence 執行 migration、Save、Publish 或 Discard。

## 2. Files added / changed

- `lib/content-workflow-api.ts`：新增一致 success/error envelope、typed error-to-HTTP mapping 與 private no-store headers。
- `lib/content-workflow-request.ts`：新增 section/page allowlist parser、exact-key request validation、revision validation 與 JSON body parser。
- `app/api/admin/content/[section]/editor/route.ts`：新增 authenticated Editor Snapshot GET。
- `app/api/admin/content/[section]/draft/route.ts`：新增 authenticated Save Draft PUT 與 Discard Draft DELETE。
- `app/api/admin/content/[section]/publish/route.ts`：新增 authenticated Publish POST。
- `lib/content-store.ts`：公開最小 `getContentWorkflowRepository()` production factory，沿用正式 persistence path、L2 coordinator 與 atomic writer。
- `app/api/admin/content/[section]/route.ts`：既有 GET/PUT 成功 contract 不變；只為 typed workflow/storage errors 增加安全 mapper。
- `__tests__/api/admin-content-workflow-editor-route.test.ts`：新增 auth、scope、snapshot、read-only 與 header tests。
- `__tests__/api/admin-content-workflow-draft-route.test.ts`：新增 Save／Discard validation、mapping、error safety 與 header tests。
- `__tests__/api/admin-content-workflow-publish-route.test.ts`：新增 Publish validation、scope、content rejection、conflict safety 與 header tests。
- `__tests__/api/admin-content-route.test.ts`：補 legacy GET/PUT success contract、未登入與 Envelope write block regression。
- `.agent_runs/codex-handoff-latest.md`：本 handoff。

## 3. Route structure

- `GET /api/admin/content/[section]/editor`
- `PUT /api/admin/content/[section]/draft`
- `DELETE /api/admin/content/[section]/draft`
- `POST /api/admin/content/[section]/publish`

一般 section 由 path 決定 scope；Page Blocks 只接受 `section=pageBlocks` 加上 `page=home|services|about|contact`，server 轉成對應 typed scope。

## 4. Auth behavior

- 所有 Workflow route 第一個 awaited operation 都是既有 `rejectIfNotAdmin()`。
- 未登入固定回 401 workflow error envelope。
- auth failure 時不解析 params/body、不建立 repository、不呼叫任何 read/mutation method。
- 沒有新增登入機制、帳密 fixture、Cookie/Session output 或環境修改。

## 5. Scope / page parser

- 一般 allowlist 直接衍生自 L1 `contentScopes`，不建立第二套 scope registry。
- 合法一般 section：brand、home、founder、services、cases、testimonials、faq、contact、social、design。
- `cases` 只轉為 `SiteContent.cases` scope；未接觸獨立 Cases CMS。
- Page Blocks 合法 page：home、services、about、contact。
- unknown section/page、dot path、prototype path、constructor 與 traversal-like input 均拒絕為 404。
- client 不能直接提交任意 scope。

## 6. Request validation

- JSON parse failure、非 object body、缺欄、額外欄位與錯誤 revision 回 400。
- revision 依 L2 contract 只接受正整數；Save 的 `expectedDraftRevision` 另允許 null。
- Save 一般 section exact keys：data、expectedDraftRevision、expectedPublishedRevision。
- Save Page Blocks exact keys：page、blocks、expectedDraftRevision、expectedPublishedRevision；blocks 必須是 array，否則 422。
- Publish 只接受 revision metadata（Page Blocks 另含 page）；data、blocks、scope 或 Draft metadata 都拒絕，不會忽略。
- Discard 只接受 expectedDraftRevision（Page Blocks 另含 page）；不接受 Published revision。
- route 不重造 scope normalization；合法 value 交由 L2 repository／scope registry 正規化。

## 7. Response envelope

- 成功：`{ "ok": true, "snapshot": EditorSnapshot }`。
- 錯誤：`{ "ok": false, "error": { "code": string, "message": string, ...safeMetadata } }`。
- 成功只回目標 scope snapshot；不回 raw Envelope、其他 Draft、persistence path 或 temp filename。
- conflict 只回 scope 與 expected/current revision metadata，不含 Draft data。

## 8. No-store headers

所有 Workflow 成功與錯誤 response 統一包含：

- `Cache-Control: private, no-store`
- `Pragma: no-cache`
- `X-Robots-Tag: noindex, nofollow`
- `Vary: Cookie`

## 9. Error mapping

- 400 `BAD_REQUEST`：JSON/body/key/revision validation。
- 401 `UNAUTHORIZED`：Admin session 無效。
- 404 `NOT_FOUND`：unknown section/page。
- 404 `DRAFT_NOT_FOUND`：`ContentDraftNotFoundError`。
- 409 `REVISION_CONFLICT`：`ContentRevisionConflictError`，只含安全 revision metadata。
- 409 `LEGACY_WRITE_BLOCKED`：`LegacyContentWriteBlockedError`。
- 422 `UNPROCESSABLE_CONTENT`：明確 payload structure rejection。
- 500 `STORAGE_ERROR`：`ContentStorageMutationError`。
- 500 `STORAGE_SCHEMA_ERROR`：unknown schema／malformed Envelope。
- 500 `INTERNAL_ERROR`：其他 unexpected error，固定 generic message，不回 stack、path 或 content。

## 10. Legacy API compatibility

- 既有 `GET/PUT /api/admin/content/[section]` 成功 payload 完全不變。
- Legacy persistence 上的 immediate-Publish 行為仍沿用原本 store methods，沒有偷轉成 Draft／Publish workflow。
- Envelope 上舊 PUT 的 `LegacyContentWriteBlockedError` 現在安全映射為 409，不再成為不明 500／裸 stack。
- 既有未登入 GET/PUT response behavior 保持不變。

## 11. Repository injection / factory

- production routes 只透過 `getContentWorkflowRepository()` 取得 L2 `LocalFileContentWorkflowRepository`。
- factory 固定使用現有 `CONTENT_FILE` 與 `siteContentSeed`；client 無法控制 persistence path。
- route 沒有自行建立 coordinator、atomic writer、raw Envelope read 或 read-merge-write。
- API tests 使用 module mock 注入 typed repository interface，未碰正式 JSON。

## 12. API tests

- L3 定向：4 suites、98 tests PASS。
- auth：Editor／Save／Publish／Discard 未登入 401，repository/factory 不被呼叫。
- scope：10 個一般 section、四個 Page Blocks scope、unknown/prototype/dot/traversal input。
- Editor：Published/Draft snapshots、read-only semantics、headers。
- Save：一般／Design／四頁 Page Blocks、null/positive revisions、JSON/body/extra-field validation、422 blocks validation。
- Publish：一般／四頁 Page Blocks、拒絕 data/blocks/metadata、revision conflicts、只送 revision input。
- Discard：一般／四頁 Page Blocks、Draft missing 404、stale 409、Published snapshot response。
- errors：revision、Draft missing、storage、schema、malformed、legacy block、unexpected generic 500 與 detail non-leakage。
- legacy regression：GET/PUT success payload、401 behavior、Envelope block 409。

## 13. Runtime API smoke

- `npm run dev` 啟動成功，Next.js ready；完成後已停止。
- `GET /`：200。
- `GET /admin/login`：200。
- `GET /api/admin/content/home/editor`：401。
- `PUT /api/admin/content/home/draft`：401。
- `POST /api/admin/content/home/publish`：401。
- `DELETE /api/admin/content/home/draft`：401。
- `GET /api/admin/content/pageBlocks/editor?page=home`：401。
- 五個 Workflow 401 都有一致 error envelope、private no-store、Pragma、X-Robots-Tag 與 Vary Cookie。
- 未登入 request 沒有 repository read/mutation；未登入後台，未執行真實 Save／Publish／Discard。

## 14. Restricted-file check

- `data/site-content.json`：前後 SHA-256 完全一致，無 diff。
- 正式 JSON 仍為 Legacy root；沒有 schemaVersion、Published Envelope 或 Drafts。
- `data/` 無 `.site-content.json.tmp-*` 殘留。
- `data/site-content.seed.ts`：無 diff。
- `.env.local`：無 diff、未輸出內容。
- `package.json`／`package-lock.json`：無 diff、未新增套件。
- `data/cases.json`／`data/insights.json`：無 diff。
- Admin/Public UI、Editor、Preview、Media repository、Tiptap、CSS：無 diff。
- 沒有 staged changes。

## 15. Tests / Build

- TypeScript 定向：PASS。
- L3 API 定向：4 suites、98 tests PASS。
- `npm run anti:check`：PASS。
- TypeScript full check：PASS。
- Jest full：15 suites、223 tests PASS。
- `npm run build`：PASS；Next.js 15.5.10 compile、type validation、45 pages generation、exit code 0。
- `git diff --check`：PASS。
- 未出現 dynamic font fetch blocking error。

## 16. Git status

- Branch：`feature/draft-publish-workflow-v1`。
- Start／current HEAD：`6ccba2c feat: add atomic content workflow repository`。
- HEAD 與 `origin/feature/draft-publish-workflow-v1` 一致。
- 工作樹只包含第 2 節列出的 L3 code/tests 與本 handoff。
- 未 Commit、未 Push、未 Merge、未建立 PR、未部署。

## 17. Not implemented

- L4 一般 Section／Design workflow UI。
- L5 Page Block workflow UI。
- L6 Admin Draft Preview route／iframe。
- 真實登入後台 Draft 操作或真實 persistence migration。
- Vercel deployment。

## 18. L4 recommendation

下一階段只建議實作 L4 一般 Section／Design workflow UI：載入 EditorSnapshot、Save Draft、Publish、Discard、revision conflict UX 與 Draft 狀態提示。開始前需新的明確授權與乾淨 preflight；不得同輪進入 L5 Page Blocks 或 L6 Preview。

## 19. Delivery state

- L3 implementation：PASS。
- Needs OpenClaw QA：Yes；請獨立重跑 API tests、build、restricted-file check 與未登入 API smoke。
- Needs deploy：No。
- Needs clasp push：No。
- Needs Cloud Run deploy：No。
- Needs manual verification：本輪不使用真實 Admin session mutation；後續整合階段再驗證登入後 Editor/Save/Publish/Discard。
- Commit：None（依本輪禁止事項）。
