# OFFICE NEXT Shared Page Block Editor Components v1 驗收報告

## A. 執行環境

- 日期：2026-07-13 01:09:31 CST；完整瀏覽器驗收至 01:42:44 CST（Asia/Taipei）
- 專案：`/home/usersun/projects/office-next-site`
- 分支：`refactor/shared-page-block-editor-v1`（符合預期）
- HEAD：`4b69098 feat: add contact page block editor`（符合本輪基準）
- Node：`v24.16.0`
- npm：`11.13.0`
- staged changes：無
- 工作樹摘要：既有修改集中於四個 Page Editor wrappers、共用 `components/admin/page-block-editor/`、對應 Jest 測試、維護文件與 Codex handoff；未見本輪範圍外的可疑修改。
- 專案層級 `AGENTS.md`：未找到；本輪依使用者提供的全域規則、task-splitting rulebook 與附件要求執行。
- 驗收期間新增／修改：只更新本驗收報告；未修改程式或測試。人工 QA 曾透過後台 API 修改 `data/site-content.json`，所有設定內容已透過 UI 恢復測試前基線；API 寫檔曾留下的檔尾 newline 差異亦已依授權解除，詳見 E3。

## B. 自動測試

- `npm run anti:check`：PASS（exit code 0）
- TypeScript `tsc --noEmit`：PASS
- Jest：PASS，7/7 suites、68/68 tests、0 snapshots
- `npm run build`：PASS（exit code 0）
- Compile：PASS，Compiled successfully in 5.0s
- Lint／type validation：PASS
- Pages generation：PASS，45/45
- 四個 Editor routes 均出現在 build route table：Home、Services、About、Contact
- `git diff --check`：PASS
- Build 警告：dynamic font fetch 發生 `ETIMEDOUT`；build 仍 exit 0、compile 與 45 pages generation 均成功，依任務規則列為非阻塞外部網路警告。
- 執行差異：未執行 `rm -rf .next`。全域 `common-agent-safety` 明確禁止刪除檔案；已先停止 dev server，再直接執行 production build，未讓 dev 與 build 同時操作 `.next`。

## C. 瀏覽器 QA

瀏覽器驗收環境建立與續驗結果：

1. `npm run dev` 成功，Next.js 15.5.10 於 `http://localhost:3000` Ready（2.7s）。
2. `agent-browser` 0.31.1 可執行，Chrome 150 runtime 已下載到工具快取。
3. 首輪 Chrome 因缺少 `libnspr4.so` 無法啟動；使用者完成系統依賴安裝後，2026-07-13 續驗時 Chrome 150 已可正常啟動並連線至本機網站。
4. 四個公開頁已完成 Desktop 1280px 與 Mobile 390px browser 快檢；均有內容、無 Next error overlay、無 page errors、單一 H1、Header／Footer 存在、無水平溢出。所有 `target="_blank"` 連結均具 `noopener noreferrer`。
5. 使用 headed Chrome 與 home 目錄下的持久化 `office-next-admin-qa` profile，由使用者親自完成正常登入；未操作或讀取帳密、Cookie、storage、session 或敏感 headers。
6. 四個 Editor、Design Console、Tiptap、lost-update 與單頁 Reset 隔離均已實際完成；所有後台 routes 無 Next error overlay 或 page errors。
7. browser 與 dev server 已停止；persistent profile 依使用者要求保留，未放入 Repository。

依「不得把未實際執行項目寫成 PASS」規則，各項結果如下：

| 項目 | 結果 | 說明 |
| --- | --- | --- |
| Home Editor | PASS | 正常載入；Hero lock、非 Hero toggle、move up/down、背景、motion、supported layouts、save、reset、preview、公開區塊消失/恢復均通過。 |
| Services Editor | PASS | 正常載入；Hero/邊界 disabled、toggle、背景/motion/layout、save/reset、三種 preview 通過；快速連點 Save 只送出 1 次 PUT。 |
| About Editor | PASS | 正常載入；Hero lock、move、背景/motion/layout、save/reset、三種 preview 通過。 |
| Contact Editor | PASS | 正常載入；Hero lock、背景/motion/layout、save、reset cancel/confirm、三種 preview 通過。 |
| Design Console | PASS | 字級、密度、Card Style、Hover、Motion、save 與 preview refresh 實測通過；設定已用 UI 恢復原基線。 |
| Tiptap | PASS | Editor 可輸入且 Undo 完整還原；Bold/Italic/H2/H3/Image toolbar 與媒體庫正常，無儲存正式內容；無 hydration/runtime error。`immediatelyRender: false` 保留，無 `suppressHydrationWarning`。 |
| 公開 Home | PASS | Desktop/Mobile 正常載入；Header/Footer、單一 H1、CTA/導覽存在；1280px/390px 無水平溢出；無 overlay/page errors；外部新分頁連結安全屬性正確。 |
| 公開 Services | PASS | Desktop/Mobile 正常載入；Header/Footer、單一 H1 存在；1280px/390px 無水平溢出；無 overlay/page errors；外部新分頁連結安全屬性正確。 |
| 公開 About | PASS | Desktop/Mobile 正常載入；Header/Footer、單一 H1 存在；1280px/390px 無水平溢出；無 overlay/page errors。 |
| 公開 Contact | PASS | Desktop/Mobile 正常載入；Header/Footer、單一 H1 存在；1280px/390px 無水平溢出；無 overlay/page errors。 |

## D. Lost-update

| 測試 | 結果 | 說明 |
| --- | --- | --- |
| Home → Services | PASS | Services 儲存後，Home 的 toggle/background/motion/layout 測試值仍存在。 |
| Services → About | PASS | About 儲存後，Home 與 Services 測試值仍存在。 |
| About → Contact | PASS | Contact 儲存後，Home、Services、About 測試值仍存在。 |
| Reset 單頁隔離 | PASS | Contact Reset 後前三頁測試值仍存在；Home/Services/About 各自 reset 亦只更新當頁。 |

實際 fetch body capture 證據：各次 PUT body 都只有 `{ page, blocks }`；`page` 分別正確為 `home`、`services`、`about`、`contact`，未送出整份 `pageBlocks`。未擷取或輸出 headers、Cookie、Session 或 HAR。

## E. 問題清單

### E1. 瀏覽器驗收環境缺少 Chrome 系統依賴（已解除）

- 嚴重度：RESOLVED（不代表產品程式缺陷）
- 重現步驟：
  1. 啟動 `npm run dev` 並等待 Ready。
  2. 執行 `agent-browser open http://localhost:3000`。
- 首輪實際結果：Chrome exit code 127；stderr 顯示無法載入 `libnspr4.so`，DevToolsActivePort 未建立。
- 預期結果：Chrome 正常啟動並連線至本機網站。
- Console／Network 證據：瀏覽器未啟動，故沒有頁面 Console 或 Network 證據；Next.js dev server 本身正常 Ready。
- 解決證據：使用者完成系統依賴安裝後，agent-browser 已正常啟動 Chrome 150、載入四個公開頁與後台登入頁。
- 可能涉及的檔案：無專案檔案；屬主機 OS browser runtime dependencies。
- 是否阻塞 Commit：否；此環境問題已解除。

### E2. 後台沒有可安全沿用的既有登入狀態（已解除）

- 嚴重度：RESOLVED（不代表產品程式缺陷）
- 重現步驟：開啟 `http://localhost:3000/admin/pages/home`。
- 實際結果：伺服器回應 307，browser 導向 `http://localhost:3000/admin/login`；顯示 Username、Password 與登入按鈕，無 error overlay 或 page errors。
- 預期結果：若環境已有正常登入狀態，應可進入 Page Editor。
- Console／Network 證據：`GET /admin/pages/home 307`，接續 `GET /admin/login 200`；登入頁正常渲染。
- 解決方式：headed Chrome 開啟後由使用者親自登入；Codex 未操作登入欄位或讀取任何登入資料。
- 可能涉及的檔案：無；屬瀏覽器 session／人工登入前置條件。
- 是否阻塞 Commit：否；登入後完整 QA 已執行。

### E3. 人工 QA 留下 `data/site-content.json` 檔尾 newline 差異（已解除）

- 嚴重度：RESOLVED（測試資料 cleanup；非產品功能缺陷）
- 重現步驟：透過 Editor Save/Reset 或 Design Save 呼叫既有 content API。
- 測試前：檔案以 `}\n` 結尾，且 `data/site-content.json` 無 Git diff。
- 測試後：pageBlocks 與 Design 的所有 JSON 值均已透過 UI 恢復測試前基線；唯一 diff 是最後一行 `}` 後不再有 newline。
- 修復方式：使用 byte-safe 方法檢查檔尾，只在缺少 LF 時追加單一 `0x0A` newline；未解析、重寫或格式化 JSON。
- 修復結果：只補回 EOF newline，JSON key、value、排序、縮排及內容均未改變。
- 驗證結果：`git diff -- data/site-content.json` 無輸出；JSON parse PASS；`git diff --check` PASS；該 restricted data file 不再出現在 `git status --short` 或 `git diff --stat`。
- 預期結果：人工 QA 結束後 restricted data file 無 diff。
- 可能涉及的檔案：`data/site-content.json`；可能原因是既有 content store/API serialize 寫檔格式不保留 EOF newline。
- 是否阻塞 Commit：否；使用者已明確授權 E3 修復，restricted data file diff 已清空。
- 重驗範圍：不需要重新執行 Browser QA 或 production build；本次只恢復檔案原有 EOF newline。

## F. 變更與安全檢查

- 沒有 Commit：確認
- 沒有 Push：確認
- 沒有 Merge：確認
- 沒有建立 PR：確認
- 沒有部署：確認
- 沒有切換分支：確認
- 沒有執行 reset／clean／restore／checkout：確認
- 沒有執行 `git add .`：確認
- 沒有修改 `.env.local`：確認
- 沒有修改 `package.json`／`package-lock.json`：確認
- `data/site-content.json`：人工 QA 的設定值已全部恢復；E3 EOF newline 已依使用者授權補回，restricted data file diff 已清空。
- 沒有讀取或輸出 `.env.local` 值、Cookie、Session、Token、Secret 或敏感 Header：確認
- 沒有擅自修正程式：確認
- 沒有在 dev server 執行時啟動 production build：確認
- 驗收結束後 dev server／build process：均已停止
- restricted-file 檢查：`.env.local`、package manifests、`data/site-content.json` 均無 status/diff。
- persistent profile：保留於 `/home/usersun/.agent-browser/profiles/office-next-admin-qa`，未放入 Repository，未刪除。

## G. 最終判定

**可以進入 Commit 階段**

自動測試、production build、四個公開頁、四個 Editor、Design Console、Tiptap、Network PUT payload、lost-update 與 Reset 單頁隔離均 PASS；未發現產品功能阻塞、Hydration Error 或 Runtime Error。

E3 已依使用者授權只補回單一 EOF newline；JSON 內容沒有改變，restricted data file diff 已清空。不需要重新執行 Browser QA 或 production build。本輪沒有 Commit、Push 或部署。
