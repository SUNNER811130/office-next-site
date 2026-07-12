# Codex Handoff

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
