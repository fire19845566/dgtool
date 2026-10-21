// Language-neutral tool definitions. All user-facing text lives in
// src/i18n/content/<lang>.ts, keyed by slug.
import { DEFAULT_LANG, localePath, type Lang } from '../i18n';
import { content } from '../i18n/content';

interface ToolBase {
  slug: string;
  category: 'image';
  accept: string;          // <input accept>
  icon?: { from: string; to: string; f: string };   // overrides the auto icon
  related: string[];
}

export interface ConvertData extends ToolBase {
  kind: 'convert';
  fromExt: RegExp;         // used to rename the output file
  to: 'image/jpeg' | 'image/png';
  toExt: 'jpg' | 'png';
  engine: 'heic' | 'canvas';
}

export interface CompressData extends ToolBase {
  kind: 'compress';
}

export type ToolData = ConvertData | CompressData;

export interface ToolCopy {
  name: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  howTo: string[];                         // numbered steps
  sections: { h: string; p: string[] }[];  // explanatory content
  faq: { q: string; a: string }[];
}

export type ConvertTool = ConvertData & ToolCopy;
export type CompressTool = CompressData & ToolCopy;
export type Tool = ConvertTool | CompressTool;

export const toolData: ToolData[] = [
  { slug: 'heic-to-jpg', category: 'image', kind: 'convert', accept: '.heic,.heif,image/heic,image/heif', fromExt: /\.(heic|heif)$/i, to: 'image/jpeg', toExt: 'jpg', engine: 'heic', related: ['heic-to-png', 'webp-to-jpg', 'compress-image'] },
  { slug: 'heic-to-png', category: 'image', kind: 'convert', accept: '.heic,.heif,image/heic,image/heif', fromExt: /\.(heic|heif)$/i, to: 'image/png', toExt: 'png', engine: 'heic', related: ['heic-to-jpg', 'webp-to-png', 'compress-image'] },
  { slug: 'webp-to-jpg', category: 'image', kind: 'convert', accept: '.webp,image/webp', fromExt: /\.webp$/i, to: 'image/jpeg', toExt: 'jpg', engine: 'canvas', related: ['webp-to-png', 'heic-to-jpg', 'compress-image'] },
  { slug: 'webp-to-png', category: 'image', kind: 'convert', accept: '.webp,image/webp', fromExt: /\.webp$/i, to: 'image/png', toExt: 'png', engine: 'canvas', related: ['webp-to-jpg', 'heic-to-png', 'compress-image'] },
  { slug: 'compress-image', category: 'image', kind: 'compress', accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp', icon: {'from': '5 MB', 'to': '1 MB', 'f': 'size'}, related: ['heic-to-jpg', 'webp-to-jpg', 'webp-to-png'] },
];

export const categoryKeys = ['image'] as const;

// Tool definitions merged with the copy for one language (English fills any gaps).
export function getTools(lang: Lang): Tool[] {
  return toolData.map(
    (d) => ({ ...d, ...content[DEFAULT_LANG][d.slug], ...(content[lang]?.[d.slug] ?? {}) }) as Tool,
  );
}

export const getTool = (slug: string, lang: Lang) => getTools(lang).find((t) => t.slug === slug)!;

export const toolPath = (t: { category: string; slug: string }, lang: Lang) =>
  localePath(lang, `/${t.category}/${t.slug}`);

// Icon shown on cards: auto-generated from "a-to-b" slugs unless the tool defines its own.
export const iconOf = (t: { slug: string; icon?: { from: string; to: string; f: string } }) => {
  if (t.icon) return t.icon;
  const [a, b] = t.slug.split('-to-');
  return { from: a.toUpperCase(), to: b.toUpperCase(), f: b };
};
