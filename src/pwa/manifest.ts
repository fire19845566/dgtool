import { getTool } from '../data/tools';
import { ui } from '../i18n/ui';
import { LANG_META, localePath, type Lang } from '../i18n';
import { toolPath } from '../data/tools';

// One manifest per language, so installing from /ja/ opens the Japanese site.
export function manifestFor(lang: Lang) {
  const t = ui[lang];
  const start = localePath(lang, '/');
  const shortcuts = ['heic-to-jpg', 'compress-image', 'resize-image', 'webp-to-jpg'].map((slug) => {
    const tool = getTool(slug, lang);
    return { name: tool.name, short_name: tool.name, url: toolPath(tool, lang) };
  });
  return {
    id: start,
    name: t.site.name,
    short_name: t.site.name,
    description: t.home.description,
    lang: LANG_META[lang].html,
    dir: 'ltr',
    start_url: `${start}?source=pwa`,
    scope: '/',
    display: 'standalone',
    background_color: '#F5F8FC',
    theme_color: '#F5F8FC',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts,
  };
}

export const manifestResponse = (lang: Lang) =>
  new Response(JSON.stringify(manifestFor(lang), null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
