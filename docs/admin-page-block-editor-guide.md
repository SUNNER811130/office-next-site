# OFFICE NEXT 首頁區塊管理指南

管理者登入後前往 `/admin/pages/home`，即可調整首頁九個既有區塊。Hero 是首頁主入口，固定第一且不可隱藏；其他區塊可用「向上／向下」按鈕排序，並用「顯示區塊」開關控制是否渲染。隱藏只會改變呈現設定，不會刪除原本文字、圖片或 CTA，再次開啟即可完整恢復。

每個區塊可選擇經 allowlist 驗證的背景、動畫與該區塊確實支援的版型。背景包含原始、冷白、柔和科技網格、極淡藍灰與深藍科技面板；動畫可沿用 Design Console，或選擇無動畫、淡入、向上、由左、由右。系統的 reduced-motion 設定永遠優先。

右側預覽可切換 390px 手機、768px 平板與 1280px 桌機，也可手動刷新或在新分頁開啟首頁。未儲存的設定不會套用；「儲存首頁區塊設定」成功後 iframe 會自動刷新，失敗時不刷新。

「恢復首頁預設區塊」需要二次確認，只會重設 `pageBlocks.home` 的順序、顯示、背景、動畫與版型，不會變更 Design Settings、首頁文案、Email、服務、Founder、Cases、Insights 或 Media。

目前資料沿用 `LocalFileContentRepository`，儲存在 `data/site-content.json`。本機可持久化；正式 Vercel CMS 上線前仍需遷移到持久化資料庫。

## 服務頁區塊管理

管理者可前往 `/admin/pages/services` 控制 `/services` 的主視覺、服務卡片、案例快照與 FAQ。Hero 固定第一且不可隱藏；其他區塊可顯示／隱藏、向上／向下排序，並選擇安全背景、支援版型與動畫。隱藏只影響呈現，不會刪除服務內容或報名 CTA。

右側 iframe 可切換 390px、768px、1280px，手動刷新或在新分頁開啟 `/services`。成功儲存或確認恢復服務頁預設後才自動刷新；失敗不刷新。

Home 與 Services 設定彼此獨立。兩個編輯器都使用 server-side nested update：伺服器先讀取最新 `pageBlocks`，只替換指定頁面並 normalize，因此儲存或 reset Services 不會覆蓋 Home，反向亦同。

## 關於頁區塊管理

管理者可前往 `/admin/pages/about` 控制 `/about` 的 Founder 主視覺、品牌定位、Founder 經歷、真實回饋與 FAQ。Hero 固定第一且不可隱藏；其他區塊可以顯示／隱藏、向上／向下排序，並選擇安全背景、實際支援版型與動畫。隱藏區塊不會刪除 Founder 姓名、Bio、經歷、客戶或圖片內容。

右側 iframe 可切換 390px、768px、1280px，手動刷新或在新分頁開啟 `/about`。成功儲存或確認 About reset 後才自動刷新，失敗不刷新。

Home、Services、About 使用相同 nested update 流程且彼此獨立。伺服器讀取最新 JSON 後只替換指定頁面，因此 About 儲存／reset 不修改 Home、Services 或 Founder content。資料仍位於 `data/site-content.json`，正式 Vercel CMS 未來仍需持久化資料庫。

## 聯絡頁區塊管理

管理者可前往 `/admin/pages/contact` 控制 `/contact` 的三個實際區塊：`hero`（Contact Intro、回覆時間、Contact Snapshot、Email 與洽詢選項）、`contact-methods`（Email CTA、服務內容 CTA、Office Upgrade Note 與 Social Links）及 `faq`。Hero 固定第一且不可隱藏；其他區塊可顯示／隱藏、排序，並選擇安全背景、實際支援版型與動畫。

右側 iframe 可切換 390px、768px、1280px，亦可手動刷新或在新分頁開啟 `/contact`。只有成功儲存或確認 Contact reset 後才自動刷新；失敗不刷新。隱藏區塊只改變呈現，不會刪除 Email、Contact Intro、洽詢選項、品牌內容或 Social Links。

「恢復聯絡頁預設區塊」只重設 `pageBlocks.contact`，不修改 Home、Services、About、Design、正式 Email 或其他 Contact 內容。四個頁面使用相同 server-side nested update，伺服器每次讀取最新 JSON 後只替換指定頁面，因此設定彼此獨立。資料目前仍由 `LocalFileContentRepository` 儲存於 `data/site-content.json`；正式 CMS 上線前仍需遷移到持久化資料庫。

## 開發者維護：共用 Page Block Editor

四頁後台共用 `components/admin/page-block-editor/` 的單一架構。`PageBlockEditor` 管理 blocks、儲存／錯誤狀態、排序、顯示切換、reset 二次確認與 preview refresh；`PageBlockControlCard` 統一區塊控制與 accessibility；`PageBlockPreview` 統一 390px／768px／1280px iframe 預覽、手動刷新及新分頁連結。背景、動畫、版型 label 與裝置設定只有一份共用來源，可測試的 update、move、payload 與 request 邏輯則集中在純 helper。

`home-block-editor.tsx`、`services-block-editor.tsx`、`about-block-editor.tsx`、`contact-block-editor.tsx` 都是薄 wrapper，只提供 page key、頁面名稱、preview path、block definitions、該頁 defaults 與既有 save/reset 文案。supported layouts 必須繼續由各 block definition 提供，不能在 wrapper 或共用卡片中自行擴張。

新增第五個頁面 Editor 時，先在既有 `PageBlockSettings`、normalizer、definitions、defaults 與 Generic API page allowlist 完成該頁資料契約，再建立一個薄 wrapper，使用 `PageBlockEditorConfig` 傳入上述頁面差異；不要複製 fetch、卡片或 preview JSX，也不要另建平行共用元件組。

Save 與 Reset 都必須送出 `{ page, blocks }` 到 `PUT /api/admin/content/pageBlocks`。Reset 只把該頁 defaults 當作 blocks 送出。不得從 client 提交整份可能過期的 `pageBlocks`；不得繞過 `updatePageBlockPage()` 讀取最新 content、只替換指定 page、normalize 後寫回的 nested update，否則會破壞 lost-update protection。

目前 JSON 只適合本機持久化；未來遷移資料庫時，共用 Editor 的 nested payload 與 allowlist 邊界仍應保留。管理器不得新增任意 CSS、Tailwind class、HTML、JavaScript、色碼或背景 URL 輸入，伺服器 normalizer 仍是最終資料安全邊界。
