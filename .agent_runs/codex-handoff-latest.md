# Codex Handoff

## 1. Summary

完成 OFFICE NEXT Services Page Block Editor v1。新增 `/admin/pages/services`，管理者可安全控制正式 `/services` 四個既有主要區塊的顯示、順序、背景、版型與動畫，並使用手機／平板／桌機 iframe 預覽、成功儲存後刷新及二次確認恢復 Services 預設。既有服務內容、報名 CTA、SEO 與 Design Tokens 均保留。

## 2. Services blocks

- `hero`：服務頁主視覺，包含 Service Snapshot；固定第一且不可隱藏。
- `service-cards`：四項服務與課程卡片、適合對象及報名 CTA。
- `case-snapshots`：服務對應的辦公 AI 案例快照。
- `faq`：服務合作常見問題。

Header、Footer、Floating CTA 不在管理範圍。未使用的 `components/services/services-page-content.tsx` 沒有被誤當成正式 route 區塊來源。

## 3. Controls

- 非 Hero 區塊可顯示／隱藏；隱藏不刪除內容。
- 原生 button 向上／向下排序，具 aria-label、disabled、focus-visible 與鍵盤操作能力。
- 背景：default、clean、soft-grid、soft-blue、deep-panel。
- 動畫：inherit、none、fade、fly-up、fly-left、fly-right。
- 版型依 Services block metadata 顯示實際支援選項。
- Hero 明確標示固定第一區塊，強制 enabled=true。
- Services Reset 需二次確認，只重設 `pageBlocks.services`。

## 4. Preview

`/admin/pages/services` 桌機採左側表單、右側 sticky preview，窄螢幕上下排列。iframe 指向 `/services`，可切換 390px、768px、1280px，顯示目前寬度，支援手動刷新及新分頁開啟。PUT 成功後才刷新 iframe，失敗不刷新。

## 5. Data architecture

- `PageBlockSettings` 擴充為 `home` 與 `services`，共用 `PageBlockConfig`、background、motion、layout 型別。
- 新增 `ServicesBlockId`、`servicesBlockDefinitions`、`servicesPageBlockDefaults`、`normalizeServicesBlocks()`、`getOrderedEnabledServicesBlocks()`。
- Normalizer 處理缺失／舊 JSON、未知與重複 ID、缺少區塊、非法／重複 order、非法 boolean/background/motion/layout，最後重新產生連續 order 並鎖定 Hero。
- `/services` 使用 typed `servicesBlockRegistry` 與共用 `PageBlockFrame`，Server Component 邊界、metadata、JSON-LD 與單一 H1 保留。
- Generic `/api/admin/content/pageBlocks` 支援 authenticated nested payload `{ page, blocks }`。
- `updatePageBlockPage()` 在 server 端先讀取最新 repository，只替換指定 page 並 normalize 後寫回。
- Home editor 亦改用 nested home update；Services 儲存／reset 不覆蓋 Home，Home 儲存也不覆蓋 Services，避免 lost update。
- 沿用 `LocalFileContentRepository` 與 `data/site-content.json`，沒有平行 repository 或資料庫。

## 6. Existing editors preserved

- Home Page Block Editor：registry、控制與 preview 保留；只將儲存改為安全 nested update。
- Design Console：未修改其 editor、資料型別或 API 行為。
- Services Content Editor：`/admin/services` 與原服務資料未修改。
- Tiptap：`immediatelyRender: false` 保留，無 `suppressHydrationWarning`。

## 7. Security

所有背景、動畫、版型與 ID 都經 allowlist normalization，沒有任意 CSS、Tailwind、HTML、JavaScript、色碼或背景 URL 輸入。Generic API 仍先驗證 admin；nested page 只接受 `home` 或 `services`。Services deep-panel 的淺色卡片與 focus-visible 對比使用固定、page-scoped CSS，不改變已驗收首頁卡片規則。未讀取或修改 `.env.local`，未輸出 secret。

## 8. Files changed

- `types/content.ts`：ServicesBlockId、共用 PageBlockId 泛型、PageBlockSettings.services。
- `lib/page-block-settings.ts`：Services definitions、defaults、normalizer、排序／過濾。
- `lib/content-store.ts`：安全 nested page block update。
- `data/site-content.json`：加入 services defaults，保留既有 home 設定。
- `app/api/admin/content/[section]/route.ts`：authenticated nested pageBlocks update。
- `components/admin/home-block-editor.tsx`：Home 改用 nested update，防止覆蓋 Services。
- `components/admin/services-block-editor.tsx`：Services 控制、save/reset 與 preview。
- `app/admin/(dashboard)/pages/services/page.tsx`：Services Block Editor 頁面。
- `components/admin/admin-nav.tsx`、`app/admin/(dashboard)/page.tsx`：導覽與 Overview 入口／摘要。
- `components/home/page-block-frame.tsx`：可選 page scope data attribute。
- `app/services/page.tsx`：typed Services registry 與動態渲染。
- `app/globals.css`：Services deep-panel 卡片及 focus 對比，限定 services scope。
- `__tests__/lib/page-block-settings.test.ts`：Services defaults、非法值、Hero lock、排序／隱藏與 allowlist。
- `__tests__/lib/content-store.test.ts`：Home／Services 雙向保留與 Services reset 隔離。
- `__tests__/api/admin-content-route.test.ts`：Services auth 與 nested update。
- `docs/admin-page-block-editor-guide.md`：Services 操作、預覽、reset 與 lost-update 說明。
- `.agent_runs/codex-handoff-latest.md`：本 handoff。

## 9. Tests

- `npm run anti:check`：PASS；TypeScript PASS；6 suites、39 tests PASS。
- `rm -rf .next && npm run build`：PASS；確認 dev server 完整停止後執行；Next.js 15.5.10 production build、type check、43 static pages generation PASS；新增 `/admin/pages/services`。
- `git diff --check`：PASS。
- `data/site-content.json` parse：PASS。
- 安全搜尋：`.env.local`、`package.json`、`package-lock.json` 無 diff；`immediatelyRender: false` 存在；無 `suppressHydrationWarning`；`/services` source 只有一個 H1；正式 Email 與兩個 Google Form URL 仍存在。

## 10. Manual QA

後台：`http://localhost:3000/admin`、`/admin/pages/home`、`/admin/pages/services`、`/admin/design`、`/admin/services`。

前台：`http://localhost:3000`、`/services`。

請由 OpenClaw／使用者驗證：非 Hero 隱藏與恢復、區塊互換且首頁順序不變、soft-grid、deep-panel 文字／卡片／CTA 對比、fly-left／fly-right、reduced-motion、390px 無水平捲動、兩個報名按鈕 target/URL、Services reset 不改 Home、重啟 dev 後 JSON 保留，以及 Console 無 Hydration／Tiptap／Runtime Error。

## 11. Git

- 分支：`feature/services-page-block-editor-v1`。
- 開工基準：`a4e1e78 content: update homepage block settings`，歷史包含 `cf229c1 feat: add homepage block editor`。
- 沒有 Commit、沒有 Push、沒有部署。
- 沒有修改 `.env.local`，沒有新增套件，package manifests／lockfile 未修改。
- dev server 為避免 `.next` 競寫已停止；需人工 QA 時請重新啟動。
- 目前工作樹只有本輪 Files changed 所列修改與新增檔。

## 12. Next phase

- About Page Block Editor。
- Contact Page Block Editor。
- 草稿與發布工作流。
- 持久化資料庫。
