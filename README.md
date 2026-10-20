# DGTool (Astro)

Browser-only image converters. One entry in `src/data/tools.ts` = one indexable page.

## Run
    npm install
    npm run dev        # http://localhost:4321
    npm run build      # static output in dist/

## Add a tool
1. Add an object to `src/data/tools.ts` (slug, copy, FAQ, related).
2. Use `engine: 'canvas'` for formats the browser can decode (WebP, PNG, JPG, AVIF),
   or add a new engine in `src/scripts/converter.ts` for formats it cannot (HEIC uses heic2any).

## Before going live
- Domain is set to dgtool.io in `astro.config.mjs` and `public/robots.txt`.
- Fill in the TODOs in `src/pages/privacy.astro`.
- Add a consent banner (CMP) before enabling ads for EU/UK visitors.
- Check heic2any license terms and consider a newer HEIC decoder.
- Deploy `dist/` to any static host (Cloudflare Pages, Netlify, Vercel).

## Brand
Colors and fonts live as CSS variables at the top of `src/styles/global.css`.
Logo files are in `public/` (logo-light.svg, logo-dark.svg, favicon.svg, apple-touch-icon.png, og-image.png).
