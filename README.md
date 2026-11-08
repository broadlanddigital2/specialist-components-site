# Specialist Components: static site (Cloudflare Workers)

A static HTML/CSS copy of every page on https://dev.specialist-components.co.uk/, captured 8 Nov 2026. It's the base for the mobile redesign and is served on Cloudflare Workers.

## What's in here

| Path | What it is |
| --- | --- |
| `public/` | The site: 224 captured pages plus a `404.html`, compiled Tailwind CSS, Nunito Sans fonts and all images saved locally as WebP |
| `public/shop/*.html` | Category and product pages under their existing `.html` URLs |
| `public/css/styles.css` | The compiled Tailwind v4 stylesheet from the Next.js build, with font URLs pointing at `/fonts/` |
| `public/js/main.js` | Plain-JS replacements for the burger menu and the hero carousel dots |
| `src/index.js` | A small Worker that maps clean URLs (`/about-us`) to their `.html` files and serves the 404 page |
| `wrangler.jsonc` | Cloudflare Workers config: static assets from `public/`, with `src/index.js` as the fallback |

## Run it locally

```bash
npm install
npm run dev        # http://localhost:8787
```

## Deploy

```bash
npx wrangler login
npm run deploy     # publishes to https://specialist-components-site.<your-subdomain>.workers.dev
```

Or connect this GitHub repo in the Cloudflare dashboard: **Workers & Pages → Create → Import a repository**. Every push to `main` then deploys automatically, and each branch gets its own preview URL.

## Notes

- This is frontend only: the Next.js runtime is removed. Search, cart, sign-in and forms look right but don't submit anywhere.
- The **Engineering** link in the main nav was already a 404 on the dev site. It still points to `/engineering` and now shows the 404 page.
- Tailwind class names match the Next.js source, so mobile changes made here can be ported back into the components directly.
