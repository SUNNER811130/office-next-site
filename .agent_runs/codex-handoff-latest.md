# Codex Handoff

## 1. Summary

完成 OFFICE NEXT Page Block Editor v1（首頁區塊管理器 MVP）。新增 `/admin/pages/home`，可安全控制首頁既有區塊的顯示、順序、背景、版型與動畫，並提供三種裝置 iframe 預覽、成功儲存後刷新及二次確認恢復預設。首頁文案、CTA、Heading、JSON-LD 與既有 Design Console 均保留。

## 2. Home blocks

實際首頁共 9 個可管理區塊：

- `hero`：首頁主視覺；固定第一且不可隱藏。
- `work-upgrade`：工作升級主張與 proposition cards。
- `pain-points`：白領工作痛點。
- `services`：服務與課程卡片。
- `flagship-modules`：提示詞、GAS 與 Agent 核心模組。
- `cases`：辦公 AI 提效案例。
- `client-logos`：合作團隊 Logo；原本無資料時仍不渲染。
- `testimonials`：學員與團隊見證。
- `faq`：首頁常見問題。

Header、Footer、Floating CTA 未納入；首頁實際沒有 final CTA，因此未建立不存在的區塊。

## 3. Controls

- 非 Hero 區塊可用原生 checkbox 顯示／隱藏；隱藏不刪除內容。
- 使用具 `aria-label`、disabled 與 focus-visible 的真正 button 向上／向下排序，未新增 drag-and-drop 套件。
- 背景 allowlist：default、clean、soft-grid、soft-blue、deep-panel。
- 動畫 allowlist：inherit、none、fade、fly-up、fly-left、fly-right。
- 版型依每個區塊 metadata 限制，只顯示前台支援選項。
- Hero 顯示「固定第一區塊」，不能關閉或移動。
- 恢復預設需二次確認，只送出 `pageBlocks` 設定，不修改內容或 Design。

## 4. Preview

後台桌機為左側設定、右側 sticky preview；窄螢幕上下排列。iframe 可切換 390px、768px、1280px，顯示目前寬度，支援手動刷新與新分頁開啟首頁。未儲存設定不套用；PUT 成功後才刷新 iframe，失敗不刷新。

## 5. Data architecture

- `PageBlockSettings` 是 `SiteContent.pageBlocks` 的唯一型別；區塊內容仍留在既有 content sections。
- `lib/page-block-settings.ts` 集中 definitions、supported layouts、defaults、normalizer、排序／過濾與安全 attributes/classes。
- Normalizer 忽略未知 ID、重複只取第一筆、補齊缺少區塊、驗證 boolean／order／background／motion／layout，最後重排連續 order 並強制 Hero 第一且啟用。
- `app/page.tsx` 使用 typed `homeBlockRegistry` 與 normalized configs 排序渲染，沒有把首頁轉成大型 Client Component；只有 `PageBlockFrame` 負責動畫外框。
- Generic admin API 新增 `pageBlocks` section，仍先驗證 admin；`updateContentSection()` 寫入前 normalize。
- 沿用既有 `LocalFileContentRepository` 與 `data/site-content.json`，沒有平行 repository 或資料庫。

## 6. Security

所有設定均為固定 allowlist；後台沒有 CSS、Tailwind class、HTML、JavaScript、顏色碼或圖片 URL 輸入。前台 class/data attributes 只由 normalized enum 產生。deep-panel 有固定高對比文字規則；非 inherit 區塊動畫會停用內層既有 motion，系統 `prefers-reduced-motion` 仍具有最高優先權。未讀取或修改 `.env.local`，未輸出 secrets。

## 7. Files changed

- `types/content.ts`：Page Block 型別、SiteContent 與 section map。
- `lib/page-block-settings.ts`：definitions、defaults、normalization、排序與安全 mapping。
- `lib/content-store.ts`：讀取舊 JSON fallback 與 pageBlocks 寫入 normalizer。
- `data/site-content.seed.ts`、`data/site-content.json`：首頁區塊預設設定。
- `app/api/admin/content/[section]/route.ts`：允許 pageBlocks generic section。
- `components/admin/home-block-editor.tsx`：管理卡、排序、select、save/reset 與 preview。
- `app/admin/(dashboard)/pages/home/page.tsx`：首頁區塊管理頁。
- `components/admin/admin-nav.tsx`、`app/admin/(dashboard)/page.tsx`：導覽及 Overview 入口／摘要。
- `components/home/page-block-frame.tsx`：安全背景／版型 attributes 與區塊 motion 外框。
- `app/page.tsx`：typed registry 與 normalized 動態渲染。
- `app/globals.css`：五種背景、安全版型、對比與 motion override。
- `__tests__/lib/page-block-settings.test.ts`：normalization、排序、隱藏與 allowlist。
- `__tests__/lib/content-store.test.ts`：舊 JSON fallback 與儲存 normalization。
- `__tests__/api/admin-content-route.test.ts`：pageBlocks auth 與 write。
- `docs/admin-page-block-editor-guide.md`：繁中操作與資料持久化說明。
- `.agent_runs/codex-handoff-latest.md`：本 handoff。

## 8. Tests

- `npm run anti:check`：PASS；TypeScript PASS；6 suites、30 tests PASS。
- `npm run build`：PASS；Next.js 15.5.10 production build、type check、42 static pages generation PASS；新增 `/admin/pages/home` route。
- `git diff --check`：PASS。
- `data/site-content.json` JSON parse：PASS。
- 安全檢查：`.env.local`、`package.json`、`package-lock.json` 無 diff；`immediatelyRender: false` 仍存在；無 `suppressHydrationWarning`；首頁 source 仍只有一個 H1；正式 Email 與兩個 Google Form URL 仍存在於 seed 與正式 JSON。

## 9. Manual QA

需交由 OpenClaw／使用者執行瀏覽器與登入驗收：

- 後台：`http://localhost:3000/admin`、`/admin/pages/home`、`/admin/design`、`/admin/home`。
- 前台：`http://localhost:3000`。
- 驗證非 Hero 隱藏／恢復、兩區塊互換、soft-grid、deep-panel 對比、fly-left／fly-right、系統 reduced-motion、390px 無水平捲動、reset、成功儲存刷新、失敗不刷新，以及 dev server 重啟後 JSON 保留。

## 10. Git

- 分支：`feature/page-block-editor-v1`。
- 開工基準：`f72548f content: refine homepage hero title`；歷史包含 `450e400 feat: add admin design console` 與 Tiptap SSR 修復。
- 沒有 Commit、沒有 Push、沒有部署。
- 沒有修改 `.env.local`，沒有新增套件，package manifests／lockfile 未修改。
- 目前工作樹只有本輪 Files changed 所列修改與新增檔。

## 11. Next phase

- Services Page Block Editor。
- About Page Block Editor。
- Contact Page Block Editor。
- 草稿與發布工作流。
- 持久化資料庫。
