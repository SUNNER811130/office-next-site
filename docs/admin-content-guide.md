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
- Each admin page saves one content section at a time through `/api/admin/content/[section]`.
- After saving, the frontend reads the latest JSON content on the next request.
