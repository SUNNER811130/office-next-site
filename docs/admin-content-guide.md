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

> 過渡期警告：L5 四個 Page Block Editor 完成前，不得對正式 persistence 執行第一次真實「儲存草稿」。第一次 workflow write 會把 Legacy JSON 轉為 Envelope，而舊 Page Block immediate-Publish API 會被 Envelope write protection 阻擋。
