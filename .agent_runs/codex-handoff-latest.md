# Codex Handoff

## 1. Summary

完成前端 UI 修復與密度調整：修正 `SectionTitle` 的非法 `<p><div>` 巢狀、處理 Next.js smooth-scroll 警告、建立較一致的響應式標題/內文字級、縮短手機 Section 與 Hero、放寬桌機容器、精簡 Header 與浮動 CTA，並將首頁及服務頁服務卡改為低飽和冷白科技框架。上一輪 Email、課程 CTA、主理人與後台資料成果完整保留。

## 2. Hydration Error

- 原因：`SectionTitle` 無條件以 `<p>` 包裝 `ReactNode` description，首頁傳入含 `<div>` 的富文字區塊。
- 修正：description 容器改為語意安全的 `<div>`，保留純文字與富文字支援；未使用 `suppressHydrationWarning`。
- 四個公開頁本機 HTTP 皆為 200，且各自只有一個 H1。
- `agent-browser` CLI 在環境中不存在，無法自動讀取瀏覽器 Console；仍需人工確認紅色 overlay 與 Console 完全清除。

## 3. Typography and layout

- Hero H1：首頁 `clamp(2.4rem, 5vw, 4.6rem)`；About/Services `clamp(2.3rem, 4.8vw, 4.25rem)`。
- Section H2：`clamp(1.9rem, 4vw, 3.25rem)`，行高 1.12。
- Card headings：手機約 1.3rem，桌機 1.45rem。
- Body：手機 0.95rem/line-height 1.75 左右，桌機約 1rem–1.08rem。
- Section：手機 64px、平板 80px、桌機 96px 上下間距。
- Container：最大 1400px；手機 20px、平板 32px、桌機 40px 左右 padding。
- Header：手機 72px、桌機 80px。
- Main 增加手機底部留白，浮動 CTA 支援 `safe-area-inset-bottom`。

## 4. Service cards

- 冷白漸層、低飽和藍灰細框、24px 淡網格、右上角座標式短線與 inset 層次。
- 圓角縮小並採非對稱右下角。
- Hover 僅上浮 4px，reduced-motion 取消位移。
- 首頁與服務頁 CTA 條件、安全 target/rel/aria 全部保留。
- 服務頁手機一欄、平板兩欄、寬桌機四欄；卡片 padding 手機 20px、桌機 28px。

## 5. Animation

- Hero 延用既有 FadeUp/FlyInPanel 分層進場。
- Section 延用 FadeUp，位移與 blur 維持輕量。
- 卡片 stagger 0.1 秒，改為 28px 垂直進場，移除較重的 scale/rotateX。
- `viewport.once` 與 `useReducedMotion` 保留，減少重播與暈動。

## 6. Files changed in this round

- `components/ui/section-title.tsx`
- `components/ui/section.tsx`
- `components/ui/container.tsx`
- `components/ui/card.tsx`
- `components/ui/motion.tsx`
- `components/home/tech-interactions.tsx`
- `components/layout/header.tsx`
- `components/layout/floating-cta.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/services/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`

上一輪未提交的資料與型別檔仍保留，沒有改動其內容值。

## 7. Tests

- `npm run anti:check`：FAIL；TypeScript PASS，Jest 11/12 PASS。唯一失敗仍是已知 SEO 測試期待 `Organization`、實作回傳 `ProfessionalService`，本輪未修改 SEO。
- `npm run build`：PASS，40/40 靜態頁生成完成。
- `git diff --check`：PASS。
- 本機 dev server：`/`、`/services`、`/about`、`/contact` 全部 HTTP 200，各一個 H1；伺服器端無 runtime error。
- 報名 URL 與 Email 搜尋：值維持不變。

## 8. Commit / deploy

- Commit：未建立（依使用者指示）。
- Push：未執行。
- Vercel / clasp / Cloud Run deploy：均不需要且未執行。

## 9. Manual verification

網址：`http://localhost:3000`、`/services`、`/about`、`/contact`。

尺寸：390×608、390×844、430×932、768×1024、1440×900、1680×1050。

檢查：Console Hydration/scroll warning、首頁首屏高度、Contact H1 換行、服務卡科技框架與 stagger、浮動 CTA 遮擋、水平捲動、兩個報名表單。

## 10. Risks / notes

- 未新增套件，未修改 `.env.local`、SEO Schema、API、Admin 認證、報名網址或 Email。
- 因 `agent-browser` 不可用，實際瀏覽器 Console 與像素級視覺結果需 OpenClaw/人工 QA。
