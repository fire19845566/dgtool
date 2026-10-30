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

## Languages
English lives at the site root, other languages under a prefix (`/zh-tw/...`).
All text is in `src/i18n/`: `ui.ts` (interface strings), `content/<lang>.ts` (tool copy, keyed by slug),
`pages.ts` (About, Privacy, Terms). Missing tool copy falls back to English.

Add a language (for example Japanese, `ja`):
1. `src/i18n/index.ts`: add `'ja'` to `LANGS` and an entry in `LANG_META`.
2. `src/i18n/ui.ts`: add a `ja` dictionary (same keys as `en`) and list it in `ui`.
3. `src/i18n/content/ja.ts`: copy `zh-tw.ts`, translate it, and register it in `content/index.ts`.
4. `src/i18n/pages.ts`: add `ja` pages.
5. Copy the folder `src/pages/zh-tw/` to `src/pages/ja/` and change `lang="zh-tw"` to `lang="ja"` in each file.
6. `src/styles/global.css`: add a `:lang(ja)` font stack next to `:lang(zh-TW)`.
Each tool added later needs copy in every language (or it shows in English).

## Installable app (PWA)
- `src/pages/manifest.json.ts` and `src/pages/<lang>/manifest.json.ts`: one web app manifest per language.
- `src/pages/sw.js.ts` builds `/sw.js` from `src/pwa/sw-source.ts`. Its version changes on every build, so each deploy replaces the old cache.
- `src/scripts/pwa.ts` registers the worker, asks it to keep the visitor's language pages for offline use, and shows the "Install app" button.
- Icons are in `public/icons/`. Ads and other sites are never intercepted by the worker (only same-origin requests).

## AI background removal (U²-Net, Apache-2.0)
The "AI" method of the Remove Background tool runs the `u2netp` model (U²-Net by Xuebin Qin et al., Apache-2.0) in the browser with ONNX Runtime Web.
1. `npm install` (adds `onnxruntime-web`).
2. Download `u2netp.onnx` (about 4.4 MB) from the U²-Net / rembg releases (or a byte-for-byte mirror such as huggingface.co/edgetools/u2netp) and save it as `public/models/u2netp.onnx`.
3. `npm run dev`. The script `scripts/prepare-ai.mjs` runs first and copies the WebAssembly files into `public/ort/` (it also runs before `npm run build`). Optionally add `public/ort/` to `.gitignore`.
4. Commit `public/models/u2netp.onnx` (small enough for Cloudflare Pages' 25 MiB per-file limit).

Licenses: keep the credit line shown on the page when the AI method is selected. U²-Net and ONNX Runtime (MIT) permit commercial use.
Do not swap in RMBG-1.4 (non-commercial) or `@imgly/background-removal` (AGPL) without checking their licenses.
