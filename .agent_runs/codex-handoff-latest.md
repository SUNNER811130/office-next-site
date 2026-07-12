# Codex Handoff

## 1. Summary

完成 OFFICE NEXT Contact Page Block Editor v1。新增 `/admin/pages/contact`，可安全控制正式 `/contact` 三個既有主要區塊的顯示、順序、背景、版型與動畫，提供 390px／768px／1280px iframe 預覽、儲存成功後刷新，以及二次確認恢復 Contact 預設。正式 Email、Contact／Brand／Social 文案與 URL、SEO、JSON-LD、單一 H1 和 Design Tokens 均保留。

## 2. Contact blocks

- `hero`：Contact Intro、Response Expectation、Contact Snapshot、正式 Email 與 Inquiry Options；固定第一且不可隱藏。
- `contact-methods`：Start a Conversation、mailto CTA、服務內容 CTA、Response Expectation、Office Upgrade Note 與 Social Links。
- `faq`：聯絡前常見問題與 FAQ Accordion。

Header、Footer 與 Floating CTA 不納入管理；沒有建立不存在的區塊，也沒有拆分或重複儲存 Contact 內容。

## 3. Controls

- 非 Hero 區塊可顯示／隱藏；隱藏只影響渲染，不刪除 Email、CTA、品牌或 Social 內容。
- 原生 button 支援向上／向下排序，具 aria-label、disabled、focus-visible 與鍵盤操作能力。
- 背景 allowlist：default、clean、soft-grid、soft-blue、deep-panel。
- 動畫 allowlist：inherit、none、fade、fly-up、fly-left、fly-right。
- 版型依 Contact metadata 僅提供各區塊實際支援選項。
- Hero 強制 enabled=true、order=0，不能隱藏或移動。
- Contact Reset 需二次確認，只重設 `pageBlocks.contact`。

## 4. Preview

`/admin/pages/contact` 在桌機採左側表單、右側 sticky preview，窄螢幕改為上下排列。iframe 指向 `/contact`，可切換 390px、768px、1280px，顯示目前寬度，支援手動刷新與新分頁開啟。PUT 成功後才刷新；失敗不刷新。

## 5. Data architecture

- `PageBlockSettings` 擴充為 `home`、`services`、`about`、`contact`，沿用共用 PageBlockConfig、background、motion、layout 型別。
- 新增 `ContactBlockId`、`ContactBlockDefinition`、`contactBlockDefinitions`、`contactPageBlockDefaults`、`normalizeContactBlocks()`、`getOrderedEnabledContactBlocks()`。
- Contact normalizer 處理缺失／舊 JSON、未知與重複 ID、缺少區塊、非法或重複 order、非法 boolean/background/motion/layout，最後產生連續 order 並鎖定 Hero。
- `/contact` 使用 typed `contactBlockRegistry` 與 normalized configs，套用共用 `PageBlockFrame`；保持 Server Component、metadata、Breadcrumb／FAQ JSON-LD 與單一 H1。
- 沿用 Generic Admin API、`updatePageBlockPage()`、LocalFileContentRepository 與 `data/site-content.json`，沒有平行 repository 或資料庫。

## 6. Lost-update protection

- Nested payload 接受 `{ page: "contact", blocks }`，authenticated API page allowlist 擴充為 home／services／about／contact。
- `updatePageBlockPage()` 先讀取最新完整 content，只替換指定 page，normalize 完整 pageBlocks 後寫回。
- 更新 Contact 保留最新 Home、Services、About 與 Contact content。
- 更新 Home、Services 或 About 均保留最新 Contact settings。
- Reset Contact 使用相同 nested update，只替換 Contact defaults，不影響其他頁、正式 Email 或 Contact 內容。

## 7. Existing editors preserved

- Home Page Block Editor：設定、預覽與 nested update 未修改。
- Services Page Block Editor：設定、預覽與 lost-update 行為未修改。
- About Page Block Editor：設定、預覽與 lost-update 行為未修改。
- Design Console：資料與 editor 未修改。
- Contact Content Editor：內容欄位、route 與資料未修改。
- Founder：內容與 editor 未修改。
- Tiptap：`immediatelyRender: false` 保留，無 `suppressHydrationWarning`。

## 8. Security

所有 block ID、背景、動畫與版型均經 allowlist normalization；後台沒有任意 CSS、Tailwind class、HTML、JavaScript、色碼、背景 URL 或 Social URL 輸入。Generic API 仍先驗證 admin。Social Links 沿用原資料來源與空 URL 條件渲染，Email 保持可點擊的 mailto 並使用 break-all 防止 390px 水平溢出。Contact deep-panel 使用 page-scoped 固定對比規則處理標題、Email、Badge、卡片、CTA、Social Links、FAQ 與 focus-visible，不改變其他頁面樣式。reduced-motion 仍具最高優先權。

## 9. Files changed

- `types/content.ts`：ContactBlockId、PageBlockId 與 PageBlockSettings.contact。
- `lib/page-block-settings.ts`：Contact definitions、defaults、normalizer、排序與 enabled 過濾。
- `lib/content-store.ts`：nested page union 加入 contact。
- `data/site-content.json`：加入 Contact defaults，其他內容值不變。
- `app/api/admin/content/[section]/route.ts`：authenticated nested page allowlist 加入 contact。
- `components/layout/page-block-frame.tsx`：共用 Frame page scope 加入 contact。
- `components/admin/contact-block-editor.tsx`：Contact 控制、save/reset 與裝置 preview。
- `app/admin/(dashboard)/pages/contact/page.tsx`：Contact Page Block Editor 頁面。
- `components/admin/admin-nav.tsx`：加入聯絡頁區塊入口。
- `app/admin/(dashboard)/page.tsx`：加入 Contact overview 卡片與入口。
- `app/contact/page.tsx`：typed Contact registry 與動態 renderer。
- `app/globals.css`：Contact page-scoped deep-panel 對比與 focus 樣式。
- `__tests__/lib/page-block-settings.test.ts`：Contact defaults、非法值、Hero lock、排序、隱藏與 allowlist。
- `__tests__/lib/content-store.test.ts`：四頁 lost-update、Contact reset 隔離與 Contact content 保留。
- `__tests__/api/admin-content-route.test.ts`：Contact authentication 與 nested update。
- `docs/admin-page-block-editor-guide.md`：Contact 操作、預覽、reset、資料隔離與 JSON 限制。
- `.agent_runs/codex-handoff-latest.md`：本 handoff。

## 10. Tests

- `npm run anti:check`：PASS；TypeScript PASS；6 suites、60 tests PASS。
- `rm -rf .next && npm run build`：PASS；先確認無 dev server；Next.js 15.5.10 production build、lint/type check、45 pages generation PASS；新增 `/admin/pages/contact`。
- `git diff --check`：PASS。
- `data/site-content.json` parse：PASS。
- 安全檢查：`.env.local`、`package.json`、`package-lock.json`、`data/site-content.seed.ts` 無 diff；`immediatelyRender: false` 存在；無 `suppressHydrationWarning`；Contact Hero 只有一個 H1 來源；正式 Email、兩個 Google Form URL、Founder 與 Contact 內容值均與 HEAD 基準一致。

## 11. Manual QA

後台：`http://localhost:3000/admin`、`/admin/pages/home`、`/admin/pages/services`、`/admin/pages/about`、`/admin/pages/contact`、`/admin/design`、`/admin/contact`。

前台：`http://localhost:3000`、`/services`、`/about`、`/contact`。

請由 OpenClaw／使用者驗證：隱藏與恢復 contact-methods、交換 contact-methods／faq、其他三頁設定不變、soft-grid／deep-panel 對比、Email／Badge／CTA／Social／FAQ focus、fly-left／fly-right、reduced-motion、390px 無水平捲動、mailto 與 `/services` CTA、Contact reset 不修改其他頁或 Email、重啟後設定持久，以及 Console 無 Hydration／Tiptap／Runtime Error。

## 12. Git

- 分支：`feature/contact-page-block-editor-v1`。
- 開工基準：`b1d3ff8 feat: add about page block editor`。
- 沒有 Commit、沒有 Push、沒有部署。
- 沒有修改 `.env.local`，沒有新增套件，package manifests／lockfile 未修改。
- build 前確認沒有 dev server；目前 dev server 未執行。
- 工作樹僅包含第 9 節所列 Contact 功能、必要測試、文件與本 handoff 修改。

## 13. Next phase

- 草稿與發布工作流。
- 持久化資料庫。
- 全站 Page Block Editor 共用元件整理。
- 正式 CMS 上線準備。
