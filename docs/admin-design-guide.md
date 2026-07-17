# OFFICE NEXT 視覺設計控制台

## 進入與儲存

管理員登入後，從後台導覽選擇「視覺設計」，或直接前往 `/admin/design`。調整完成後按「儲存草稿」，伺服器會再次驗證所有選項，但公開網站不會改變；二次確認「發布」後才會更新 Published design。可用「放棄草稿」回到目前 Published。請勿直接編輯 JSON。

## 可調整設定

- 字體與排版：Hero、區塊、卡片標題尺寸，內文字級與行距。
- 版面與留白：整體密度、手機 gutter、桌機容器、區塊留白、卡片內距與間距、Header 高度。
- 卡片風格：科技切角、極簡細框、清透玻璃、柔和精品，以及 hover 效果。
- 動畫與互動：動畫模式、速度、距離、交錯間隔及是否只播放一次。
- 手機浮動操作列：顯示狀態與密度。

以上皆為全站設定。瀏覽器啟用 `prefers-reduced-motion` 時，減少動態效果永遠優先，內容會立即顯示且不位移、不模糊。

## 裝置預覽

右側 Preview 可切換手機 390px、平板 768px 與桌機 1280px，也可切換「已發布版本」與「草稿預覽」。可手動重新整理，或在新分頁開啟目前模式。手機後台會把預覽放在表單下方。只有成功 Save Draft／Reset Draft 後才會啟用草稿預覽；尚未儲存的本地設定不會進入 iframe。Discard 或 Publish 後會回到已發布版本。草稿 Design variables 只套在受 Admin session 保護的 Preview view，不會改公開網站。

## 資料與恢復預設

目前 Design 設定與其他內容共用 `data/site-content.json`，由 `LocalFileContentRepository` 存取。正式部署 Vercel 前仍應遷移到持久化資料庫；Repository abstraction 可讓未來替換資料來源而不需重寫前台元件。

「恢復預設設計」需二次確認，只會把安全預設值 PUT 至 `/api/admin/content/design/draft` 建立 Draft，不會立即改公開設計，也不影響品牌、首頁文案、課程、聯絡資訊、Founder、Cases、Insights 或 Media；仍需 Publish 才會生效。

Draft 與 Published revision 會顯示在操作列。若其他分頁先更新造成 conflict，本地設定會保留且不自動覆蓋或重試；請先記錄需要保留的值，再確認重新載入伺服器 snapshot。

> 過渡期警告：L5 四個 Page Block Editor 完成前，不得對正式 persistence 執行第一次真實「儲存草稿」或 Design Reset。第一次 workflow write 會把 Legacy JSON 轉為 Envelope，舊 Page Block immediate-Publish API 隨後會被 write protection 阻擋。
