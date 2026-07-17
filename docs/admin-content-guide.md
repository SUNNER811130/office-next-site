# ADMIN Content Guide

## Content source
- All frontend text and media URLs are read from `data/site-content.json` through [`lib/content-store.ts`](/C:/Users/User/office-next-site/lib/content-store.ts).
- If the JSON file does not exist yet, it is created from [`data/site-content.seed.ts`](/C:/Users/User/office-next-site/data/site-content.seed.ts).

## Section mapping
- `Brand`: header logo, footer logo, brand summary, positioning, proposition, OG image.
- `Home`: homepage hero, pain points, proposition cards, flagship modules.
- `Founder`: about page hero, founder portrait, founder introduction.
- `Services`: homepage service cards and `/services` service cards.
- `Cases`: homepage case cards and `/services` case snapshot cards.
- `Testimonials`: homepage and about page testimonial blocks.
- `FAQ`: homepage, about, services, contact FAQ blocks.
- `Contact`: header CTA label, `/contact` intro, response expectation, inquiry chips, contact email.
- `Social`: footer social links and `/contact` social link block.

## Required fields
- `brand.name`
- `brand.summary`
- `brand.positioning`
- `contact.email`
- `home.hero.title`
- `home.hero.description`

## Optional fields
- Any image URL can be left empty; the frontend falls back to `/public` placeholder assets.
- Social links can stay empty; the frontend will hide that link instead of rendering placeholder text.
- Testimonial `avatarUrl` and `logoUrl` are optional.

## Save behavior

- 一般內容 Editor 開啟時只讀取該 scope 的 `EditorSnapshot`，不會因為載入頁面而建立 Draft 或寫入 persistence。
- 「儲存草稿」只更新未發布 Draft，公開網站不會改變；「發布」確認後才會把該 Draft 更新到 Published。
- 「放棄草稿」會刪除未發布 Draft 並回到目前 Published；這不是歷史版本還原，本地尚未儲存的修改也會消失。
- Draft 與 Published revision 會顯示在操作列。若其他分頁先更新造成 409 conflict，目前本地內容會保留且不自動重試；請先複製重要文字，再用「重新載入伺服器版本」取得最新 snapshot。
- `/admin/contact` 的 Contact 與 Social 是兩個完全獨立的 workflow，各自儲存、發布、放棄與處理 conflict。

## Draft Preview

- 一般內容 Editor 右側可切換「已發布版本」與「草稿預覽」，並保留 390／768／1280 三種寬度。
- 草稿預覽只會讀取已成功 Save Draft 的 server snapshot；尚未儲存的本地修改與 conflict 中的本地值不會進入 iframe。
- 預覽 route 只允許已登入 Admin 存取，使用 `home`、`services`、`about`、`contact` 四個固定 target，且不使用公開 `?draft=true`、Draft cookie 或 localStorage。
- 每個 target 只組合該頁相關 scopes；沒有 Draft 的 scope 逐項 fallback 至 Published。Contact 與 Social 仍可各自有或沒有 Draft。
- Discard 或 Publish 後 Draft 按鈕會停用並回到已發布版本；Preview request 本身不建立、儲存、發布或捨棄 Draft。

> 過渡期警告：L5 四個 Page Block Editor 完成前，不得對正式 persistence 執行第一次真實「儲存草稿」。第一次 workflow write 會把 Legacy JSON 轉為 Envelope，而舊 Page Block immediate-Publish API 會被 Envelope write protection 阻擋。
