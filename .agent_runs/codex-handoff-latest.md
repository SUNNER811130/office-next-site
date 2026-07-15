# Codex Handoff

## 1. L2 Summary

完成 OFFICE NEXT Draft／Publish Workflow v1 的 L2｜Local File atomic repository 與 concurrency。新增 path-keyed module-level mutation coordinator、可注入 atomic file writer、Local File `ContentWorkflowRepository`、typed workflow mutation errors，以及 legacy CMS mutation 的 atomic／Envelope write protection。

本輪所有 persistence mutation 測試都使用 OS temp directory、temp fixture、可控制 clock、barrier／deferred promise 或 filesystem／writer injection；沒有對真實 `data/site-content.json` 執行 migration、Draft mutation 或 atomic failure 測試。

## 2. Files added / changed

- `lib/content-mutation-coordinator.ts`：新增以 resolved persistence path 為 key 的 module-level serialized queue。
- `lib/atomic-content-file.ts`：新增 same-directory temp、完整 JSON write、file sync、close、atomic rename 與 best-effort cleanup。
- `lib/content-workflow-errors.ts`：新增 revision conflict、Draft not found、legacy write blocked 與 storage mutation errors。
- `lib/content-workflow-repository.ts`：新增 Local File workflow reads、Save／Publish／Discard、Legacy first-mutation migration 與受限 legacy Published mutation。
- `lib/content-store.ts`：公開 read 保持 Published-only；既有 CMS mutation 改走共用 coordinator 與 atomic writer；舊 full write 標示 deprecated/restricted。
- `__tests__/lib/content-mutation-coordinator.test.ts`：新增 deterministic serialization 與 rejection recovery tests。
- `__tests__/lib/atomic-content-file.test.ts`：新增 success、LF、same-directory temp、write/sync/rename/cleanup failure tests。
- `__tests__/lib/content-workflow-repository.test.ts`：新增 migration、CAS、normalization、isolation、failure preservation 與跨 instance concurrency tests。
- `__tests__/lib/content-store.test.ts`：改用 temp persistence repository，保留 legacy CMS compatibility 與 Published-only read tests。
- `.agent_runs/codex-handoff-latest.md`：本 handoff。

## 3. Coordinator architecture

- `runSerializedContentMutation()` 使用 module-level `Map<resolvedPath, Promise<void>>`。
- 相同 persistence path 的不同 Repository instance 共用同一 queue；instance field 沒有 mutex。
- workflow Save／Publish／Discard、first-mutation migration、legacy `writeContent()`、`updateContentSection()` 與 `updatePageBlockPage()` 全部進入同一 coordinator。
- critical section 內完成 latest read、parse、revision check、normalize、merge、serialize 與 atomic replace。
- queue node 本身只由 release resolve，不承接 mutation rejection；前一筆 mutation failure 不會污染後續 queue。
- 本方案只承諾單 process／單機 v1；多 process／多 instance deployment 仍需資料庫 transaction。

## 4. Atomic file strategy

- persistence path 與 directory 先 resolve；temp file 固定為同目錄 `.<target>.tmp-<safe-token>`。
- token 只接受英數、底線與連字號，不能以 path traversal 逃出目錄。
- JSON 先完整 serialize，固定單一 LF newline 結尾。
- 以 exclusive `open("wx")` 建立 temp，依序 write、file sync、close，再 rename 到正式檔。
- 正式檔不會先 truncate；rename 成功後 mutation 才回 success。
- 任一步驟失敗只 cleanup 本次已知 temp path，不掃描或清除資料夾。
- cleanup failure 不掩蓋 primary mutation error。

## 5. Workflow repository methods

- `readPublished()`：讀 legacy 或 Envelope，永遠只回 Published snapshot；missing file 回 seed memory snapshot。
- `readEditor(scope)`：Draft 優先，否則 Published，回 scope revision/timestamps。
- `readPreview(scope)`：只 compose 指定 scope Draft。
- `hasDrafts()`：只回 boolean，不回 Draft value。
- `saveDraft()`：CAS 後 normalize scope value，第一次 revision 1，後續 +1，不改 Published。
- `publishDraft()`：CAS 後只 merge target scope，同一 atomic mutation 更新 global/scope revisions/timestamps 並刪除 target Draft。
- `discardDraft()`：CAS 後只刪 target Draft，不改 Published metadata。

## 6. Revision semantics

- First Save 要求 `expectedDraftRevision: null` 與當前 scope Published revision；新 Draft revision 為 1。
- Re-save 要求當前 Draft revision 與 scope Published revision；Draft base 若 stale 則 conflict；Draft revision +1，base 不變。
- Publish 要求 Draft 存在、Draft/Published revisions 相符且 base 未 stale；target scope 與 global Published revision 各 +1。
- Discard 只比 Draft revision；Published content、revisions、timestamps 全不變。
- 不同 scope 經同一 queue 序列化後各自成功，不因 global revision 造成 false conflict。

## 7. Legacy first-mutation migration

- Legacy public read 與 missing-file read 都只做 memory composition，不寫檔。
- 第一次成功 workflow Save 在 coordinator 內把 latest Legacy／seed memory 組成 Envelope，與 Draft mutation 一次 atomic replace。
- 不存在單獨 migration write，因此不會留下「只 migration、mutation 未完成」狀態。
- 第一次 mutation writer failure 時，Legacy 原 bytes 保持完全一致。
- Legacy／missing 狀態 Publish 或 Discard 找不到 Draft 時回 `ContentDraftNotFoundError`，不建立 Envelope、不改檔。
- Unknown schema 與 malformed Envelope 繼續由 L1 schema errors 拒絕，原檔不被覆蓋。

## 8. Legacy writeContent protection

- `writeContent()` 標示 deprecated/restricted，仍支援 Legacy persistence 的立即公開行為，但走 coordinator 與 atomic replace。
- `updateContentSection()` 的 latest read、normalization、merge 與 write 位於同一 critical section，不再 read outside lock。
- `updatePageBlockPage()` 在 lock 內讀 latest，只替換目標 page 並 normalize 完整 Page Blocks，保留其他三頁。
- persistence 已是 Envelope v1 時，`writeContent()`、section update、Page Block update 與 reset 都丟 `LegacyContentWriteBlockedError`，不會移除 schema、Draft 或 revision metadata，也不會偷轉成 Draft／Publish。
- `readContent()` 保持 Published-only，沒有 draft mode，也不因 read 寫檔。

## 9. Typed errors

- `ContentRevisionConflictError`：只包含 scope、expected/current Draft revision、expected/current Published revision。
- `ContentDraftNotFoundError`：只包含 scope。
- `LegacyContentWriteBlockedError`：Envelope 上阻擋 legacy write boundary。
- `ContentStorageMutationError`：安全檔名與 cause；不夾帶 Draft value 或完整 SiteContent。
- Unknown schema 與 malformed Envelope 沿用 L1 errors；HTTP mapping 留給 L3。

## 10. Concurrency tests

- 相同 resolved path 的兩個 critical section不重疊。
- 不同 Repository instance 對相同 path 共用 coordinator。
- 第一筆 mutation 在 injected barrier 中時，第二筆不會進 writer／critical section。
- 第一筆 rejection 後第二筆仍可執行。
- 不同 scope Save 依序讀 latest 後各自保留，無 false conflict。
- 兩個 legacy Repository instance 的 read-merge-write 依序執行，兩個 section update 都保留。
- 測試不使用 sleep 或不穩定 timing race。

## 11. Failure preservation tests

- Atomic success 完整替換且固定 LF newline。
- temp path 與 persistence file 位於同一 directory。
- temp write、sync、rename failure 都保留原正式檔並嘗試 cleanup 已知 temp。
- cleanup failure 不覆蓋 primary write error。
- unsafe temp token 被拒絕。
- Legacy first workflow mutation failure 保留原 bytes。
- Publish persistence failure 保留完整 Published Envelope 與 Draft。

## 12. Existing CMS compatibility

- Legacy file 上一般 section、Design、整份 Page Blocks、單頁 Page Blocks、full write 與 reset 行為仍可用。
- Design 仍使用 `normalizeDesignSettings()`。
- 四個 Page Blocks scope 仍使用既有 normalizers，Hero lock、supported layouts、defaults 與跨頁 isolation 不變。
- Envelope 上舊 Admin immediate-Publish paths會明確被阻擋；L3/L4/L5 完成前不會靜默破壞 workflow metadata。
- API routes、Admin UI、公開 pages、Tiptap、CSS 均未修改。

## 13. Runtime smoke

- `npm run dev`：啟動成功，Next.js ready。
- `/`、`/services`、`/about`、`/contact`、`/admin/login`：HTTP 200、meaningful HTML、單一 H1、無 server-rendered Next error overlay。
- 四個公開頁：Header／Footer 存在。
- server log：五個 route 全為 200，無 Runtime Error。
- 2026-07-15 最終 Browser Smoke follow-up preflight：branch `feature/draft-publish-workflow-v1`、HEAD `1016588`、工作樹只含 L2 預期修改、無 staged changes，PASS。
- 最終 Browser Smoke 結果：**BLOCKED**。PATH 內沒有 `agent-browser`、Playwright CLI、Chromium／Chrome／Firefox executable；已連接工具也沒有 browser runner／connector。
- 環境只存在 Playwright Core library cache，沒有可啟動的 browser executable；取得 browser 需要重新安裝，違反本輪「不要重新安裝套件」限制，因此沒有啟動 dev server，也沒有以 HTTP fallback 冒充 Browser PASS。
- 尚未完成：1280px／390px 真實 render、390px horizontal overflow、browser console、Hydration Error、Runtime Error、Next overlay 與主要內容視覺一致性；延後至下一個具備 browser runner 的回歸階段或 L7 完整 QA 補驗。
- 此 BLOCKED 為驗收工具環境限制，不是已知產品缺陷；Browser visual smoke、390px horizontal overflow 與 Browser Console／Hydration 本輪均未實際執行或重新驗收。
- 未登入後台，未執行 Save／Reset；dev server 已停止。

## 14. Restricted-file check

- `data/site-content.json`：無 diff，未 migration、未建立 Draft、未寫 Envelope。
- `data/site-content.seed.ts`：無 diff。
- `.env.local`：無 diff、未讀取內容。
- `package.json`／`package-lock.json`：無 diff、未新增套件。
- `data/cases.json`／`data/insights.json`：無 diff。
- `data/` 無 `.site-content.json.tmp-*` 殘留。
- API routes、Admin/Public UI、Editor、Preview、Media repository、CSS：無 diff。
- 沒有 staged changes。

## 15. Tests

- L2 定向：4 suites、43 tests PASS。
- `npm run anti:check`：PASS。
- TypeScript：PASS。
- Jest：12 suites、133 tests PASS。
- `npm run build`：PASS；Next.js 15.5.10 compile、type validation、45 pages generation、exit code 0。
- `git diff --check`：PASS。
- 未出現 dynamic font fetch blocking error。

## 16. Git status

- Branch：`feature/draft-publish-workflow-v1`。
- Start／current HEAD：`1016588 feat: add draft publish persistence model`。
- 起始時與 `origin/feature/draft-publish-workflow-v1` 同步且工作樹乾淨。
- 工作樹只包含第 2 節列出的 L2 code/tests 與本 handoff。
- 未 Commit、未 Push、未 Merge、未建立 PR、未部署。

## 17. Not implemented

- L3 Draft API 與 HTTP error mapping。
- L4 一般 Section／Design workflow UI。
- L5 Page Block workflow UI。
- L6 Admin Draft Preview route／iframe。
- 真實後台 Draft 操作、真實 persistence migration、資料庫 transaction 或多 process lock。

## 18. L3 recommendation

下一階段只建議實作 L3 Draft API：Admin auth、scope/page allowlist、Editor read、Save／Publish／Discard endpoints、typed error-to-HTTP mapping 與 no-store response。開始前需新的明確授權與 preflight；不得自動進入 L4/L5/L6。

## 19. Delivery state

- Final Browser Smoke：**BLOCKED — browser runner unavailable**。
- L2 Commit gate：**可以進入 L2 Commit 階段**。
- Risk / residual QA：Browser-side visual／hydration smoke 尚待後續補驗，但因 L2 無公開頁、Admin UI、CSS、Client Component、Preview iframe 或 route JSX 變更，加上 Build、Server Runtime、HTTP smoke 與完整 persistence tests 均 PASS，本項列為非阻塞殘餘 QA。
- Needs OpenClaw QA：Yes，於下一個具備 browser runner 的回歸階段或 L7 完整 QA 補做 1280px／390px visual、horizontal overflow、console/hydration/overlay checks；restricted-file recheck 已 PASS。
- Needs deploy：No。
- Needs clasp push：No。
- Needs Cloud Run deploy：No。
- Needs manual verification：公開五 route visual smoke；不得登入或 mutation。
- Commit：None（依本輪禁止事項）。
