// One entry = one indexable page. Add a tool by adding an object here.
export interface Tool {
  slug: string;
  category: 'image';
  name: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  accept: string;          // <input accept>
  fromExt: RegExp;         // used to rename the output file
  to: 'image/jpeg' | 'image/png';
  toExt: 'jpg' | 'png';
  engine: 'heic' | 'canvas';
  faq: { q: string; a: string }[];
  related: string[];
}

export const tools: Tool[] = [
  {
    slug: 'heic-to-jpg',
    category: 'image',
    name: 'HEIC to JPG',
    h1: 'HEIC to JPG, without uploading anything',
    title: 'HEIC to JPG Converter – Free, Private, No Upload',
    description: 'Convert iPhone HEIC photos to JPG in your browser. Files never leave your device. No sign-up, no limits.',
    intro: 'Convert iPhone photos right in your browser. Your files stay on your device, and there is no sign-up or file limit.',
    accept: '.heic,.heif,image/heic,image/heif',
    fromExt: /\.(heic|heif)$/i,
    to: 'image/jpeg', toExt: 'jpg', engine: 'heic',
    faq: [
      { q: 'Why is my iPhone photo a HEIC file?', a: 'iPhones save photos as HEIC to use less storage. Many websites, Windows apps and printers cannot open HEIC, so converting to JPG makes the photo work everywhere.' },
      { q: 'Are my photos uploaded to a server?', a: 'No. The conversion runs inside your browser tab, so your photos never leave your device.' },
      { q: 'Does converting reduce quality?', a: 'JPG is a lossy format, so a small amount of detail is lost. Keep the quality slider at 90% or higher for photos that look the same to the eye.' },
    ],
    related: ['heic-to-png', 'webp-to-jpg'],
  },
  {
    slug: 'heic-to-png',
    category: 'image',
    name: 'HEIC to PNG',
    h1: 'HEIC to PNG, right in your browser',
    title: 'HEIC to PNG Converter – Free, Private, No Upload',
    description: 'Convert HEIC images to lossless PNG in your browser. No upload, no sign-up.',
    intro: 'Turn HEIC photos into lossless PNG files without sending them to a server.',
    accept: '.heic,.heif,image/heic,image/heif',
    fromExt: /\.(heic|heif)$/i,
    to: 'image/png', toExt: 'png', engine: 'heic',
    faq: [
      { q: 'When should I choose PNG instead of JPG?', a: 'PNG keeps every pixel and supports transparency, but the files are much larger. Choose it for screenshots, graphics or editing; choose JPG for sharing photos.' },
      { q: 'Are my files uploaded?', a: 'No. Everything is converted locally in your browser.' },
    ],
    related: ['heic-to-jpg', 'webp-to-png'],
  },
  {
    slug: 'webp-to-jpg',
    category: 'image',
    name: 'WebP to JPG',
    h1: 'WebP to JPG, instantly',
    title: 'WebP to JPG Converter – Free, Private, No Upload',
    description: 'Convert WebP images to JPG in your browser. No upload, no sign-up, no limits.',
    intro: 'Save WebP images as JPG so they open in any app. Conversion happens on your device.',
    accept: '.webp,image/webp',
    fromExt: /\.webp$/i,
    to: 'image/jpeg', toExt: 'jpg', engine: 'canvas',
    faq: [
      { q: 'What happens to transparent areas?', a: 'JPG does not support transparency, so transparent areas are filled with white.' },
      { q: 'Are my files uploaded?', a: 'No. Everything is converted locally in your browser.' },
    ],
    related: ['webp-to-png', 'heic-to-jpg'],
  },
  {
    slug: 'webp-to-png',
    category: 'image',
    name: 'WebP to PNG',
    h1: 'WebP to PNG, keeping transparency',
    title: 'WebP to PNG Converter – Free, Private, No Upload',
    description: 'Convert WebP images to PNG in your browser and keep transparency. No upload required.',
    intro: 'Convert WebP to PNG and keep transparent backgrounds. Nothing is uploaded.',
    accept: '.webp,image/webp',
    fromExt: /\.webp$/i,
    to: 'image/png', toExt: 'png', engine: 'canvas',
    faq: [
      { q: 'Is transparency preserved?', a: 'Yes. PNG supports transparency, so transparent WebP areas stay transparent.' },
    ],
    related: ['webp-to-jpg', 'heic-to-png'],
  },
];

export const categories = {
  image: { label: 'Image', blurb: 'Convert image formats privately, right in your browser.' },
} as const;

export const toolPath = (t: Tool) => `/${t.category}/${t.slug}`;

export const bySlug = (slug: string) => tools.find((t) => t.slug === slug)!;
