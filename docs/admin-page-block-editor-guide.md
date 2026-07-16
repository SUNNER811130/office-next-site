# OFFICE NEXT 首頁區塊管理指南

管理者登入後前往 `/admin/pages/home`，即可調整首頁九個既有區塊。Hero 是首頁主入口，固定第一且不可隱藏；其他區塊可用「向上／向下」按鈕排序，並用「顯示區塊」開關控制是否渲染。隱藏只會改變呈現設定，不會刪除原本文字、圖片或 CTA，再次開啟即可完整恢復。

每個區塊可選擇經 allowlist 驗證的背景、動畫與該區塊確實支援的版型。背景包含原始、冷白、柔和科技網格、極淡藍灰與深藍科技面板；動畫可沿用 Design Console，或選擇無動畫、淡入、向上、由左、由右。系統的 reduced-motion 設定永遠優先。

右側預覽可切換 390px 手機、768px 平板與 1280px 桌機，也可手動刷新或在新分頁開啟首頁。L6 尚未完成，因此 iframe 與新分頁永遠顯示 Published；本地修改、Save Draft、Reset Draft、Conflict 與 Discard 都不會把 Draft 顯示在預覽。只有 Publish 成功才會自動刷新 Published iframe。

「恢復首頁預設區塊」需要二次確認，只會把 `pageBlocks.home` 的預設順序、顯示、背景、動畫與版型儲存成 Draft，不會立即公開，也不會變更 Design Settings、首頁文案、Email、服務、Founder、Cases、Insights 或 Media。使用者必須另按 Publish 才會影響公開首頁。

目前資料沿用 `LocalFileContentRepository`，儲存在 `data/site-content.json`。本機可持久化；正式 Vercel CMS 上線前仍需遷移到持久化資料庫。

## 服務頁區塊管理

管理者可前往 `/admin/pages/services` 控制 `/services` 的主視覺、服務卡片、案例快照與 FAQ。Hero 固定第一且不可隱藏；其他區塊可顯示／隱藏、向上／向下排序，並選擇安全背景、支援版型與動畫。隱藏只影響呈現，不會刪除服務內容或報名 CTA。

右側 iframe 可切換 390px、768px、1280px，手動刷新或在新分頁開啟 `/services`。Save Draft 與 Reset Draft 不刷新；只有 Publish 成功才會自動刷新 Published iframe。

Home 與 Services 設定彼此獨立。兩個編輯器各自使用 `pageBlocks.home`／`pageBlocks.services` scope 的 EditorSnapshot 與 revision；Save、Publish、Discard、Reset 及 conflict reload 都只操作指定 page，伺服器仍以 Page Block normalizer 作最終安全邊界。

## 關於頁區塊管理

管理者可前往 `/admin/pages/about` 控制 `/about` 的 Founder 主視覺、品牌定位、Founder 經歷、真實回饋與 FAQ。Hero 固定第一且不可隱藏；其他區塊可以顯示／隱藏、向上／向下排序，並選擇安全背景、實際支援版型與動畫。隱藏區塊不會刪除 Founder 姓名、Bio、經歷、客戶或圖片內容。

右側 iframe 可切換 390px、768px、1280px，手動刷新或在新分頁開啟 `/about`。它維持 Published-only；Save Draft 與 About Reset Draft 不刷新，只有 Publish 成功才自動刷新。

Home、Services、About 使用相同 nested scope workflow 且彼此獨立，因此 About Save／Publish／Discard／Reset 不修改 Home、Services 或 Founder content。資料仍位於 `data/site-content.json`，正式 Vercel CMS 未來仍需持久化資料庫。

## 聯絡頁區塊管理

管理者可前往 `/admin/pages/contact` 控制 `/contact` 的三個實際區塊：`hero`（Contact Intro、回覆時間、Contact Snapshot、Email 與洽詢選項）、`contact-methods`（Email CTA、服務內容 CTA、Office Upgrade Note 與 Social Links）及 `faq`。Hero 固定第一且不可隱藏；其他區塊可顯示／隱藏、排序，並選擇安全背景、實際支援版型與動畫。

右側 iframe 可切換 390px、768px、1280px，亦可手動刷新或在新分頁開啟 `/contact`。Save Draft／Reset Draft 不刷新；只有 Publish 成功才刷新 Published iframe。隱藏區塊只改變呈現，不會刪除 Email、Contact Intro、洽詢選項、品牌內容或 Social Links。

「恢復聯絡頁預設區塊」只建立 `pageBlocks.contact` defaults Draft，不修改 Home、Services、About、Design、正式 Email、其他 Contact 內容或目前 Published。四頁使用相同 nested scope workflow，因此設定、revision 與 conflict state 彼此獨立。正式 CMS 上線前仍需遷移到持久化資料庫。

## 開發者維護：共用 Page Block Editor

四頁後台共用 `components/admin/page-block-editor/` 的單一架構。`PageBlockEditor` 管理 blocks、排序、顯示切換、Reset Draft 與 Published preview；`usePageBlockWorkflow` 管理 snapshot、dirty、operation、conflict、duplicate guard、AbortController 與 mounted guard；`page-block-workflow-helpers` 提供 typed nested API adapter。Status、actions、conflict 與 confirmation dialog 重用 L4 元件；`PageBlockControlCard` 與 `PageBlockPreview` 保留既有 accessibility、allowlists 與 390／768／1280 行為。

`home-block-editor.tsx`、`services-block-editor.tsx`、`about-block-editor.tsx`、`contact-block-editor.tsx` 都是薄 wrapper，只提供 page key、頁面名稱、preview path、block definitions、該頁 defaults 與既有 save/reset 文案。supported layouts 必須繼續由各 block definition 提供，不能在 wrapper 或共用卡片中自行擴張。

新增第五個頁面 Editor 時，先在既有 `PageBlockSettings`、normalizer、definitions、defaults 與 Generic API page allowlist 完成該頁資料契約，再建立一個薄 wrapper，使用 `PageBlockEditorConfig` 傳入上述頁面差異；不要複製 fetch、卡片或 preview JSX，也不要另建平行共用元件組。

Save Draft 與 Reset Draft 都送到 `PUT /api/admin/content/pageBlocks/draft`，且只包含 `page`、該頁 `blocks` 與 expected revisions。Publish 送 revision、不重送 blocks；Discard 只送 page 與 expected Draft revision。Editor 不得再以 legacy `PUT /api/admin/content/pageBlocks` 儲存，也不得從 client 提交整份可能過期的 `pageBlocks`。Server normalizer 與 revision compare 是最終 nested isolation／lost-update 邊界。

目前 JSON 只適合本機持久化；未來遷移資料庫時，共用 Editor 的 nested payload 與 allowlist 邊界仍應保留。管理器不得新增任意 CSS、Tailwind class、HTML、JavaScript、色碼或背景 URL 輸入，伺服器 normalizer 仍是最終資料安全邊界。
