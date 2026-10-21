// Language helpers. To add a language: add it to LANGS and LANG_META, then add
// its files (src/i18n/ui.ts, content/<lang>.ts, pages.ts) and a src/pages/<lang>/ folder.
export const LANGS = ['en', 'zh-tw'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_META: Record<Lang, { label: string; html: string; og: string }> = {
  en: { label: 'English', html: 'en', og: 'en_US' },
  'zh-tw': { label: '繁體中文', html: 'zh-TW', og: 'zh_TW' },
};

// "/image/x" -> "/zh-tw/image/x"; the default language has no prefix.
export function localePath(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG) return path;
  return path === '/' ? `/${lang}/` : `/${lang}${path}`;
}

// Swap the language prefix of a pathname, keeping its trailing slash style.
export function switchPath(pathname: string, from: Lang, to: Lang): string {
  let p = pathname || '/';
  if (from !== DEFAULT_LANG) {
    p = p.replace(new RegExp(`^/${from}(?=/|$)`), '') || '/';
  }
  if (to === DEFAULT_LANG) return p;
  return p === '/' ? `/${to}/` : `/${to}${p}`;
}

// "Done · {from} → {to}" with { from: '1 MB', to: '300 KB' }
export function fmt(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
