# Codex Handoff

## 1. L1 Summary

完成 OFFICE NEXT Draft／Publish Workflow v1 的 L1｜Persistence model 與 legacy read。新增 workflow domain types、typed ContentScope allowlist、scope extractor／merger／normalizer registry、legacy v0 與 envelope v1 parser、in-memory migration、Published／Editor／single-scope Preview composition、Repository contract 與 `hasDrafts` 純函式基礎。

本輪沒有實作 L2 atomic mutation、L3 API、L4/L5 Admin UI 或 L6 Preview route；沒有建立或寫入真實 Draft。

## 2. Files added / changed

- `types/content-workflow.ts`：新增 Revision、ContentScope、ScopeValueMap、PublishedSnapshot、DraftRecord、ContentEnvelopeV1、EditorSnapshot、mutation inputs 與 ContentWorkflowRepository contract。
- `lib/content-scopes.ts`：新增固定 scope allowlist、scope validation、typed extractor／merger，以及重用既有 Design/Page Block normalizers 的 registry。
- `lib/content-envelope.ts`：新增 workflow schema errors、legacy/envelope 判別與 parser、in-memory migration、Published／Editor／Preview composition 與 Draft inspection。
- `lib/content-store.ts`：legacy adapter 明確改名；`readContent()` 解析 legacy 或 v1 envelope 後只回 Published；讀檔不存在時在 memory 回 seed，不因 read 建檔或寫檔。
- `__tests__/lib/content-scopes.test.ts`：新增 scope allowlist、任意 path 拒絕、extract/merge/isolation、normalizer 與 Cases 邊界測試。
- `__tests__/lib/content-envelope.test.ts`：新增 legacy migration、v1 parser、schema errors、snapshot composition、single-scope Preview、hasDrafts 與 Draft normalization 測試。
- `__tests__/lib/content-store.test.ts`：更新 read-no-write expectation，新增 missing file memory fallback 與 envelope Published-only read 測試。
- `.agent_runs/codex-handoff-latest.md`：本 handoff；舊 handoff 保留於下方 archive。

## 3. Workflow types

- ContentScope 共 14 個固定值；`cases` 僅對應 `SiteContent.cases`，不包含 `data/cases.json`、Insights 或 Media。
- `ScopeValueMap` 逐 scope 對應正確的 `SiteContent`／`PageBlockSettings` value。
- PublishedSnapshot 包含 global/scope revisions、global `updatedAt` 與 `scopeUpdatedAt`。
- EditorSnapshot 的 `publishedUpdatedAt` 固定取自目標 scope 的 `scopeUpdatedAt`。
- Repository contract 宣告 `readPublished`、`readEditor`、`readPreview`、`hasDrafts`、`saveDraft`、`publishDraft`、`discardDraft`；三個 mutation method 本輪只有 interface，沒有 filesystem 實作。
- 新增程式未使用 `any` 型別。

## 4. Scope registry

- 只接受 allowlist，不解析或接受任意 JSON path。
- 一般 section extractor／merger 使用 typed registry。
- `pageBlocks.home/services/about/contact` 各自只抽取或合併目標頁，不會覆蓋其他三頁。
- Design 重用 `normalizeDesignSettings()`。
- 四個 Page Blocks scopes 分別重用既有 `normalizeHomeBlocks()`、`normalizeServicesBlocks()`、`normalizeAboutBlocks()`、`normalizeContactBlocks()`；Hero lock、supported layouts、defaults 與 allowlist 不變。
- 一般 section 只保留既有 runtime 相容行為，沒有假裝新增完整 schema validation。

## 5. Legacy parser behavior

- 無 `schemaVersion`、無 `published` 的 object 視為 legacy v0。
- 使用現有 seed shallow fallback，並對 Design/Page Blocks 套既有 normalizers。
- 只在 memory 包成 schema v1 envelope；global 與各 scope revision 初始為 1、Drafts 空、所有 scope 使用同一 migration baseline timestamp。
- 公開 read 與 legacy read 都不因讀取寫回或轉換 `data/site-content.json`。

## 6. Envelope parser behavior

- `schemaVersion === 1` 時驗證 Published、Drafts、revisions、timestamps、scope metadata 與 Draft record 必要結構。
- Published content 維持 legacy fallback／normalizer 相容；Draft scope 必須通過 allowlist，Draft value 經目標 scope normalizer。
- Unknown schema version 丟出 `UnknownContentSchemaVersionError`，不得降級成 legacy。
- Malformed envelope 丟出 `MalformedContentEnvelopeError`，不得靜默 fallback 或寫檔。

## 7. Public compatibility

- `readContent()` 介面與現有 callers 保留，且只回 Published content，caller 不能傳入 draft mode。
- v1 envelope 即使存在 Draft，`readContent()` 測試確認仍回 Published。
- legacy JSON、缺 Design、缺 Page Blocks 與 missing file 的公開結果維持 seed/default 相容。
- 公開 pages、API、Admin UI、Preview iframe、Design Console、Tiptap 與 CSS 均未修改。

## 8. Tests

- `npm run anti:check`：PASS。
- TypeScript：PASS。
- Jest：9 suites、112 tests PASS。
- L1 定向 suites：3 suites、64 tests PASS。
- `git diff --check`：PASS。
- 未執行 production build；本輪無 UI/API route 行為變更，建議由 OpenClaw 決定完整 QA 是否需要 build。

## 9. Not implemented

- 沒有 mutation coordinator、atomic temp write/rename、CAS 或 revision updates（L2）。
- 沒有 save/publish/discard API（L3）。
- 沒有 Section/Design/Page Block Editor workflow UI（L4/L5）。
- 沒有 Admin Preview route 或 iframe 改造（L6）。
- 沒有將 persistence file 轉成 envelope，沒有真實 Draft。

## 10. Restricted-file check

- `data/site-content.json`：無 diff、未寫入。
- `data/site-content.seed.ts`：無 diff、內容未修改。
- `.env.local`：無 diff、未讀取內容。
- `package.json`／`package-lock.json`：無 diff、未新增套件。
- `data/cases.json`／`data/insights.json`：無 diff。
- API、Admin/Public pages、Editor components、Media repository、CSS：無 diff。
- 無 staged changes。

## 11. Git status

- Branch：`feature/draft-publish-workflow-v1`。
- Start HEAD：`61e5cb9 docs: design draft publish workflow v1`。
- 工作樹只有第 2 節列出的 L1 code/tests；`.agent_runs` handoff 依專案規則更新。
- 未 Commit、未 Push、未 Merge、未建立 PR、未部署。

## 12. L2 recommendation

下一階段只建議實作 module-level singleton mutation coordinator（或共用 Repository singleton）、serialized atomic save/publish/discard/migration、revision CAS 與 failure preservation。所有 mutation 必須共用同一 critical section；開始前仍需新的明確授權與 preflight。本輪到此停止，不自動開始 L2。

---

# Archived Previous Handoff — Shared Page Block Editor Components v1

## 1. Summary

完成 OFFICE NEXT Shared Page Block Editor Components v1 安全重構。Home、Services、About、Contact 四份 Editor 原有的 state、排序、toggle、select、PUT save、reset 二次確認、status、preview refresh、裝置切換、control card 與 options 已集中為單一共用架構；四份 wrapper 由原本合計 263 行縮為合計 60 行，只保留頁面差異設定。沒有新增功能或改變四頁可觀察行為。

## 2. Shared architecture

- `page-block-editor.tsx`：管理 blocks、saving/saved/error、重複送出保護、move/update、nested save、reset、成功後 preview refresh，以及 unmount state guard。
- `page-block-control-card.tsx`：統一 block metadata、locked Hero、checkbox、move buttons、background/motion/layout selects。
- `page-block-preview.tsx`：統一 390px／768px／1280px iframe、sticky preview、手動刷新與新分頁開啟。
- `page-block-editor-types.ts`：泛型 `PageBlockEditorConfig`、definition、page key 與 status 型別，未使用 `any`。
- `page-block-editor-options.ts`：背景、動畫、layout labels 與裝置寬度單一來源。
- `page-block-editor-helpers.ts`：可測試的 update、move、nested payload 與 PUT request helper。

## 3. Page wrappers

- Home：只傳入 `home`、`/`、Home definitions/defaults 與既有中文 save/reset 文案。
- Services：只傳入 `services`、`/services`、Services definitions/defaults 與既有中文 save/reset 文案。
- About：只傳入 `about`、`/about`、About definitions/defaults 與既有中文 save/reset 文案。
- Contact：只傳入 `contact`、`/contact`、Contact definitions/defaults 與既有中文 save/reset 文案。

四份 wrapper 不再保留 fetch、reorder、reset、iframe、裝置按鈕、control card JSX 或 options arrays。

## 4. Behavior preservation

- Home 9、Services 4、About 5、Contact 3 個 block definitions 與 block IDs 未改。
- Hero 仍固定第一、不可 disabled、不可移動；第一個非 Hero 不能移到 Hero 前面。
- supported layouts 仍只取自各 block definition。
- 既有背景、動畫、layout labels、390／768／1280 preview、save/reset 文案與 responsive layout 保留。
- save/reset 成功才刷新 iframe；失敗保留目前設定且不刷新。saving ref 防止快速重複 PUT。
- Design Console、前台 registries、PageBlockFrame、公開頁排序與 CSS 均未修改。

## 5. Accessibility

保留原生 button、checkbox、select 與 anchor；checkbox 使用包覆 label；move buttons 保留 aria-label、Hero/邊界 disabled、鍵盤操作與 focus-visible；裝置按鈕保留 aria-pressed；status 保留 aria-live；reset 保留 alertdialog 與 aria-labelledby；iframe title 與可理解的新分頁文字保留。

## 6. Data and API

- `PageBlockSettings` JSON 結構未改。
- Generic API payload 仍為 `{ page: "home" | "services" | "about" | "contact", blocks }`。
- Reset 只將目前頁 defaults 送入相同 nested update，未提交其他頁設定。
- `updatePageBlockPage()`、Repository、normalizers 與 lost-update protection 未修改。
- `data/site-content.json`、正式 Email、兩個 Google Form URL、Founder、Contact 與其他公開內容檔均無 diff。

## 7. Files changed

- `components/admin/page-block-editor/page-block-editor.tsx`：新增共用 Editor orchestration。
- `components/admin/page-block-editor/page-block-control-card.tsx`：新增共用 control card。
- `components/admin/page-block-editor/page-block-preview.tsx`：新增共用 preview。
- `components/admin/page-block-editor/page-block-editor-types.ts`：新增共用泛型型別。
- `components/admin/page-block-editor/page-block-editor-options.ts`：新增共用 allowlisted UI options。
- `components/admin/page-block-editor/page-block-editor-helpers.ts`：新增純 helper 與 PUT request helper。
- `components/admin/home-block-editor.tsx`：改為 Home 薄 wrapper。
- `components/admin/services-block-editor.tsx`：改為 Services 薄 wrapper。
- `components/admin/about-block-editor.tsx`：改為 About 薄 wrapper。
- `components/admin/contact-block-editor.tsx`：改為 Contact 薄 wrapper。
- `__tests__/lib/page-block-editor.test.ts`：新增 wrapper、payload、reset defaults、Hero lock、move/update、options、supportedLayouts 與 save 成敗測試。
- `docs/admin-page-block-editor-guide.md`：新增共用架構、第五頁 wrapper、save/reset 與 nested update 維護章節。
- `.agent_runs/codex-handoff-latest.md`：本 handoff。

## 8. Tests

- `npm run anti:check`：PASS；TypeScript PASS；7 suites、68 tests PASS。
- `rm -rf .next && npm run build`：PASS；Next.js 15.5.10 production build、lint/type check、45 pages generation、exit code 0；四個 Admin Page Editor routes 均生成。
- Build 出現一筆動態字型 fetch `ETIMEDOUT`，Build 仍成功，依規則記為非阻塞外部網路警告，未修改字型架構。
- `git diff --check`：PASS。
- `data/site-content.json` parse：PASS。
- restricted-file diff：PASS；`.env.local`、package manifests、content JSON/seed、types、content store、API、PageBlockFrame、globals CSS、公開 pages 與 Design Editor 均無 diff。
- `immediatelyRender: false` 保留；`suppressHydrationWarning` 不存在。

## 9. Manual QA

後台：

- `http://localhost:3000/admin/pages/home`
- `http://localhost:3000/admin/pages/services`
- `http://localhost:3000/admin/pages/about`
- `http://localhost:3000/admin/pages/contact`
- `http://localhost:3000/admin/design`

前台：

- `http://localhost:3000`
- `http://localhost:3000/services`
- `http://localhost:3000/about`
- `http://localhost:3000/contact`

請由 OpenClaw／使用者逐頁驗證非 Hero toggle、move、背景、動畫、支援版型、save、成功 refresh、reset、Hero lock、三種 preview 寬度、390px 無水平捲動及 Console 無 Hydration／Runtime Error；並交叉確認四頁 nested save 不互相覆蓋、Design Console 與 Tiptap 正常。

## 10. Git

- 分支：`refactor/shared-page-block-editor-v1`。
- 基準／HEAD：`4b69098 feat: add contact page block editor`。
- 沒有 Commit、沒有 Push、沒有部署。
- 沒有修改 `.env.local`，沒有新增套件，`package.json`／`package-lock.json` 無修改。
- 工作樹只包含第 7 節的共用 Editor、薄 wrappers、必要測試、文件與本 handoff。

## 11. Next phase

只建議、不在本輪實作：Draft／Publish Workflow v1、持久化資料庫、正式 CMS 上線準備。
