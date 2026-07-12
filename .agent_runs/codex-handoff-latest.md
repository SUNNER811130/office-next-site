# Codex Handoff

## 1. Summary

完成 OFFICE NEXT 後台升級第一階段 Design Console v1：新增 `/admin/design`、五組安全設計控制、手機／平板／桌機 iframe 預覽、儲存成功後刷新、二次確認恢復預設設計，以及前台共用 Design Tokens 串接。沿用既有 generic content API、`updateContentSection`、`LocalFileContentRepository` 與 `data/site-content.json`，沒有建立平行儲存架構。

## 2. Existing admin preserved

原有 Brand、Home、Founder、Services、Cases、Testimonials、FAQ、Contact、Insights、Media 導覽與資料結構均保留。既有兩個 Google Form 報名網址、正式聯絡 Email、Founder 與其他內容值未修改。RichText、Media、Services CTA 與登入 Cookie 流程未改。

## 3. Design settings

- 字級：Hero、Section、Card title 與 Body size。
- 行距：compact、comfortable、relaxed。
- 留白：整體密度、Section spacing、Card padding、Card gap。
- 容器：手機 gutter 16／20／24px；桌機 1200／1280／1400／1520px。
- 卡片：tech-cut、minimal-line、glass-panel、soft-premium；none、lift、edge-glow hover。
- 動畫：none、fade、fly-up、fly-alternate；速度、距離、stagger、playOnce。
- Header：compact／balanced。
- Floating CTA：enabled 與 compact／balanced；關閉時不渲染且 main 不保留手機底部空白。

## 4. Preview

`/admin/design` 桌機採左表單、右 sticky preview；窄螢幕改為上下排列。iframe 可切換 390px、768px、1280px，顯示目前尺寸，支援手動刷新及新分頁開啟首頁。未儲存設定不即時套用；PUT 成功後才增加 iframe key 刷新，失敗不刷新，因此不會形成無限循環。

## 5. Data architecture

- `DesignSettings` 是 `SiteContent.design` 的唯一型別，亦加入 `ContentSectionMap`。
- `designSettingsDefaults` 集中保存目前平衡設計預設。
- `normalizeDesignSettings()` 對巢狀資料逐欄 allowlist，缺值、舊 JSON、非法 enum、非法 fixed number 與非 boolean 均 fallback。
- Repository `read()` 會合併 seed 並 normalize 舊資料；`updateContentSection()` 經可擴充的 `sectionNormalizers` mapping 正規化 design 後才寫檔。
- generic `/api/admin/content/[section]` 加入 design，仍先執行 `rejectIfNotAdmin()`，成功後回傳 normalized section。
- Repository abstraction 未改，未來可替換成 Supabase／其他持久化 repository，而不用重寫前台元件。

## 6. Security

所有控制只有 select 與原生 checkbox toggle；沒有 CSS、JavaScript、HTML attribute 或 Tailwind class 輸入。CSS variables 只由固定映射產生，數值亦限固定集合。`prefers-reduced-motion: reduce` 使用 CSS 強制清除 animation、transition、filter、transform，優先於後台 motion 設定。未讀取或修改 `.env.local`，未變更登入帳密或 secret。

## 7. Files changed

- `types/content.ts`：新增 DesignSettings、SiteContent.design 與 section map。
- `lib/design-settings.ts`：defaults、normalizer、data attributes、CSS variables、motion/card config。
- `lib/content-store.ts`：讀取 fallback 與 section normalizer mapping。
- `data/site-content.seed.ts`、`data/site-content.json`：同步 Design 預設值。
- `app/api/admin/content/[section]/route.ts`：允許 design section。
- `components/admin/section-editor.tsx`：新增安全 select、toggle、field groups、onSaved。
- `lib/admin-field-config.ts`：五組繁中 Design 欄位與 allowlist 選項。
- `components/admin/design-editor.tsx`：表單、預覽、刷新、二次確認 reset。
- `app/admin/(dashboard)/design/page.tsx`：Design Console 頁面。
- `components/admin/admin-nav.tsx`、`app/admin/(dashboard)/page.tsx`：導覽與 Overview 入口／摘要。
- `app/layout.tsx`、`app/globals.css`：root tokens、data attributes、固定映射樣式與 reduced-motion 防護。
- `components/ui/container.tsx`、`section.tsx`、`section-title.tsx`、`card.tsx`、`motion.tsx`：共用元件讀取全站 tokens。
- `components/layout/header.tsx`、`floating-cta.tsx`、`page-hero.tsx`：Header、CTA、Hero tokens。
- `app/page.tsx`、`app/services/page.tsx`、`app/about/page.tsx`、`app/contact/page.tsx`、`components/home/hero-section.tsx`：主要 Hero 改用共用 title token，不改文字或 heading 層級。
- `__tests__/lib/design-settings.test.ts`、`__tests__/lib/content-store.test.ts`、`__tests__/api/admin-content-route.test.ts`：defaults、非法值、fixed number、boolean、CSS allowlist、舊 JSON、儲存 normalization、API auth／write。
- `__tests__/lib/seo.test.ts`：測試期待更新為既有實作的 `ProfessionalService`；正式 schema 未改。
- `docs/admin-design-guide.md`：繁中操作、預覽、儲存、reduced-motion、資料與 reset 說明。

## 8. Tests

- `npm run anti:check`：PASS；TypeScript PASS；5 suites、20 tests PASS。
- `npm run build`：PASS；Next.js 15.5.10 production build、type check、41 static pages generation PASS。
- `git diff --check`：PASS。
- `data/site-content.json` JSON parse：PASS。
- 安全搜尋：沒有 `suppressHydrationWarning`；`.env.local`、`package.json`、`package-lock.json` 無 diff；報名網址與 `sunner811130gas@gmail.com` 仍存在於 seed 與正式 JSON。
- SEO：`createOrganizationSchema()` 現有 `ProfessionalService` 符合 OFFICE NEXT 專業服務／企業內訓定位，因此只修正過期測試期待，沒有修改 production schema。

## 9. Manual verification

尚未由 Codex 代替真人登入操作；需交由 OpenClaw QA／使用者驗收：

- 後台：`http://localhost:3000/admin`、`/admin/design`、`/admin/home`、`/admin/services`。
- 前台：`http://localhost:3000`、`/services`、`/about`、`/contact`。
- 尺寸：390×608、390×844、430×932、768×1024、1280×800、1440×900、1680×1050。
- 驗證 Hero／Body／gutter／container、四種 card style、motion none／fly-alternate、系統 reduced-motion、Floating CTA 關閉、reset 僅影響 design、成功儲存刷新 preview，以及 dev server 重啟後 JSON 設定仍保留。

## 10. Git

- 開工前 branch：`feature/admin-design-console-v1`。
- 開工前 commit：`f7d4073 feat: update content and refine responsive interface`。
- 開工前工作樹乾淨，沒有既有未提交修改；目前所有 status 變更皆為本輪。
- 沒有 Commit、沒有 Push、沒有部署。
- 沒有修改 `.env.local`，沒有新增套件，package manifests／lockfile 未修改。
- 修改狀態以本 handoff 上方 Files changed 清單為準；新增檔包含 design page/editor/tool/tests/doc。

## 11. Needs OpenClaw QA

Yes。請執行完整瀏覽器與登入後台 QA，尤其確認 iframe Cookie、裝置寬度、四種卡片視覺、fly-alternate 體感與 reduced-motion。

## 12. Needs deploy

No。本輪禁止部署，未執行 Vercel deploy。

## 13. Risks / notes

LocalFileContentRepository 在本機可持久化；Vercel 正式環境的 ephemeral filesystem 不適合作為長期 CMS 儲存，正式上線前仍需資料庫 migration。Design v1 集中於共用元件，少數非共用／特殊頁面卡片可能保有局部 class 覆寫，需在人工 QA 尺寸矩陣檢查視覺優先序。

## 14. Next phase

Page Block Editor v1（本輪未實作）：區塊顯示／隱藏、區塊上下排序、一欄／兩欄版型、區塊背景預設、區塊動畫預設、頁面草稿與預覽。
