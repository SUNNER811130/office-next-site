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
