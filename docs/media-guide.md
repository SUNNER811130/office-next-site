# Media Guide

## Storage flow
- Frontend components only consume final renderable URLs stored in content.
- Uploads go through [`lib/media-store.ts`](/C:/Users/User/office-next-site/lib/media-store.ts).
- Default adapter: Vercel Blob.
- Fallback adapter: read-only public placeholder assets.

## Recommended formats
- Logos: `svg`
- Founder / people photos: `webp`
- Section visuals: `webp`
- OG images: `png` or `jpg`

## Suggested sizes
- `logo-wordmark`: around 1200px wide SVG
- `logo-mark`: square SVG
- `og-default`: 1200 x 630
- `founder-hero`: 1600 x 2000+
- `founder-portrait`: 1200 x 1200+
- `section visuals`: 1600 x 1200
- `client logos`: SVG when possible

## Naming strategy
- `brand/logo-wordmark.svg`
- `brand/logo-mark.svg`
- `brand/og-default.png`
- `people/founder-hero.webp`
- `people/founder-portrait.webp`
- `sections/advisory-01.webp`
- `sections/workshop-01.webp`
- `sections/strategy-session-01.webp`
- `logos/client-01.svg`
- `logos/client-02.svg`
- `logos/client-03.svg`

## Blob and fallback relationship
- With `BLOB_READ_WRITE_TOKEN`, uploads and deletes work against Vercel Blob.
- Without Blob env, admin media still lists fallback assets from `public/`, but upload/delete is disabled.
- This prevents an empty local dev environment from breaking the frontend.

## Switching storage adapters later
- Replace the adapter returned by `getMediaStore()` in [`lib/media-store.ts`](/C:/Users/User/office-next-site/lib/media-store.ts).
- Keep the same `uploadAsset`, `deleteAsset`, and `listAssets` interface so admin and frontend code do not need to change.
