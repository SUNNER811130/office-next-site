# Codex Handoff

## 1. Summary

完成 OFFICE NEXT About Page Block Editor v1。新增 `/admin/pages/about`，可安全控制正式 `/about` 五個既有主要區塊的顯示、順序、背景、版型與動畫，提供三種裝置 iframe 預覽、成功儲存後刷新與二次確認恢復 About 預設。Founder 內容、圖片、CTA、SEO、單一 H1 與 Design Tokens 均保留。

## 2. About blocks

- `hero`：Founder 姓名、角色、定位、Bio、CTA 與主視覺圖片；固定第一且不可隱藏。
- `brand-positioning`：品牌摘要、定位、主張與 Founder 摘要卡片。
- `founder-experience`：同一既有 Section 內的過去經歷、現任與專業、代表性客戶及培訓經歷。
- `testimonials`：白領工作流程升級後的真實回饋。
- `faq`：關於 OFFICE NEXT 的常見問題。

Header、Footer、Floating CTA 不納入；頁面沒有獨立 final CTA，也沒有把同一 Section 內三組經歷虛構拆開。

## 3. Controls

- 非 Hero 區塊可顯示／隱藏；隱藏不刪除 Founder 或其他內容。
- 原生 button 向上／向下排序，具 aria-label、disabled、focus-visible 與鍵盤操作能力。
- 背景 allowlist：default、clean、soft-grid、soft-blue、deep-panel。
- 動畫 allowlist：inherit、none、fade、fly-up、fly-left、fly-right。
- 版型依 About block metadata 僅提供實際支援選項。
- Hero 強制 enabled=true、order=0 且不能移動。
- About Reset 需二次確認，只重設 `pageBlocks.about`。

## 4. Preview

`/admin/pages/about` 桌機採左側表單、右側 sticky preview，窄螢幕上下排列。iframe 指向 `/about`，可切換 390px、768px、1280px，顯示目前寬度，支援手動刷新及新分頁開啟。PUT 成功後才刷新，失敗不刷新。

## 5. Data architecture

- `PageBlockSettings` 擴充為 `home`、`services`、`about`，共用 PageBlockConfig、background、motion、layout 型別。
- 新增 `AboutBlockId`、`aboutBlockDefinitions`、`aboutPageBlockDefaults`、`normalizeAboutBlocks()`、`getOrderedEnabledAboutBlocks()`。
- About normalizer 處理缺失／舊 JSON、未知與重複 ID、缺少區塊、非法／重複 order、非法 boolean/background/motion/layout，最後產生連續 order 並鎖定 Hero。
- `/about` 使用 typed `aboutBlockRegistry` 與 normalized configs；metadata、JSON-LD、Server Component 邊界與單一 H1 保留。
- 原 `components/home/page-block-frame.tsx` 安全移至 `components/layout/page-block-frame.tsx`，Home、Services、About 統一 import，行為不變並新增 about page scope。
- 沿用 Generic Admin API、LocalFileContentRepository 與 `data/site-content.json`，沒有平行 repository 或資料庫。

## 6. Lost-update protection

- Nested payload 擴充接受 `{ page: "about", blocks }`。
- `updatePageBlockPage()` 仍先讀取最新完整 content，只替換指定 page，normalize 後寫回。
- 更新 About 保留最新 Home、Services 與 Founder content。
- 更新 Home 或 Services 皆保留最新 About。
- Reset About 使用相同 nested update，只替換 about defaults，不影響其他頁或 Founder。

## 7. Existing editors preserved

- Home Page Block Editor：設定、預覽與 nested update 保留；只更新共用 Frame import。
- Services Page Block Editor：設定、預覽、lost-update 與 page-scoped deep-panel 保留；只更新 Frame import。
- Design Console：資料與 editor 未修改。
- Founder Content Editor：資料與 route 未修改。
- Tiptap：`immediatelyRender: false` 保留，無 `suppressHydrationWarning`。

## 8. Security

所有 ID、背景、動畫與版型都經 allowlist normalization，沒有任意 CSS、Tailwind、HTML、JavaScript、色碼或背景 URL 輸入。Generic API 仍先驗證 admin，nested page 僅接受 home／services／about。About deep-panel 對標題、Bio、經歷卡、清單、客戶文字、邊框與 focus-visible 使用固定 page-scoped 對比規則，不改變 Home／Services 已驗收樣式。reduced-motion 仍具有最高優先權。

## 9. Files changed

- `types/content.ts`：AboutBlockId、PageBlockId 與 PageBlockSettings.about。
- `lib/page-block-settings.ts`：About definitions、defaults、normalizer、排序／過濾。
- `lib/content-store.ts`：nested page union 加入 about。
- `data/site-content.json`：加入 about defaults，保留現有 Home／Services 設定與 Founder 內容。
- `app/api/admin/content/[section]/route.ts`：authenticated nested page allowlist 加入 about。
- `components/admin/about-block-editor.tsx`：About 控制、save/reset 與 preview。
- `app/admin/(dashboard)/pages/about/page.tsx`：About Block Editor 頁面。
- `components/admin/admin-nav.tsx`、`app/admin/(dashboard)/page.tsx`：導覽與 Overview 入口／摘要。
- `components/layout/page-block-frame.tsx`：共用 Page Block Frame 新位置與 About scope。
- `components/home/page-block-frame.tsx`：移除舊位置。
- `app/page.tsx`、`app/services/page.tsx`：只更新 Frame import。
- `app/about/page.tsx`：typed About registry 與動態渲染。
- `app/globals.css`：About deep-panel 卡片、清單及 focus 對比，限定 about scope。
- `__tests__/lib/page-block-settings.test.ts`：About defaults、非法值、Hero lock、排序／隱藏與 allowlist。
- `__tests__/lib/content-store.test.ts`：About／Home／Services lost-update 與 reset 隔離、Founder 保留。
- `__tests__/api/admin-content-route.test.ts`：About auth 與 nested update。
- `docs/admin-page-block-editor-guide.md`：About 操作、預覽、reset 與資料隔離說明。
- `.agent_runs/codex-handoff-latest.md`：本 handoff。

## 10. Tests

- `npm run anti:check`：PASS；TypeScript PASS；6 suites、49 tests PASS。
- `rm -rf .next && npm run build`：PASS；先確認無 dev server；Next.js 15.5.10 production build、type check、44 static pages generation PASS；新增 `/admin/pages/about`。
- `git diff --check`：PASS。
- `data/site-content.json` parse：PASS。
- 安全檢查：`.env.local`、`package.json`、`package-lock.json`、`data/site-content.seed.ts` 無 diff；`immediatelyRender: false` 存在；無 `suppressHydrationWarning`；`/about` source 只有一個 H1；正式 Email 與兩個 Google Form URL 保留；Founder 文字內容無 diff。

## 11. Manual QA

後台：`http://localhost:3000/admin`、`/admin/pages/home`、`/admin/pages/services`、`/admin/pages/about`、`/admin/design`、`/admin/founder`。

前台：`http://localhost:3000`、`/services`、`/about`。

請由 OpenClaw／使用者驗證：非 Hero About 隱藏與恢復、區塊互換、Home／Services 不受影響、deep-panel Founder/Bio/經歷/客戶/CTA 對比、fly-left／fly-right、reduced-motion、390px 無水平捲動、About reset 不改其他頁，以及 Console 無 Hydration／Tiptap／Runtime Error。

## 12. Git

- 分支：`feature/about-page-block-editor-v1`。
- 開工基準：`64fcb73 feat: add services page block editor`。
- 沒有 Commit、沒有 Push、沒有部署。
- 沒有修改 `.env.local`，沒有新增套件，package manifests／lockfile 未修改。
- build 前確認沒有 dev server；目前 dev server 未執行。
- 工作樹只有本輪 Files changed 所列修改與新增／移位檔案。

## 13. Next phase

- Contact Page Block Editor。
- 草稿與發布工作流。
- 持久化資料庫。
