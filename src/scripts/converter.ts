// Browser-only conversion. Each engine takes a File and returns a Blob.
import { quantizePng } from './png-quant';
export type Engine = 'heic' | 'canvas';

// iOS and iPadOS Safari limit canvas size to roughly 16.7 million pixels.
// Other browsers allow far larger canvases, so only shrink on those devices.
const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const MAX_PIXELS = isIOS ? 16_000_000 : 100_000_000;

type Decoded = { src: CanvasImageSource; w: number; h: number; done: () => void };

// Decode with the browser's own image decoder. Safari on iPhone, iPad and Mac
// can decode HEIC natively; other browsers will throw and we fall back.
async function decodeNative(file: File, fallbackType?: string): Promise<Decoded> {
  const blob = !file.type && fallbackType ? new Blob([file], { type: fallbackType }) : file;
  try {
    const bmp = await createImageBitmap(blob);
    return { src: bmp, w: bmp.width, h: bmp.height, done: () => bmp.close() };
  } catch {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    try {
      await img.decode();
    } catch {
      URL.revokeObjectURL(url);
      throw new Error('native decode failed');
    }
    return { src: img, w: img.naturalWidth, h: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
  }
}

async function drawToBlob(file: File, mime: string, quality: number, fallbackType?: string): Promise<Blob> {
  const d = await decodeNative(file, fallbackType);
  try {
    if (!d.w || !d.h) throw new Error('empty image');
    const scale = Math.min(1, Math.sqrt(MAX_PIXELS / (d.w * d.h)));
    const c = document.createElement('canvas');
    c.width = Math.round(d.w * scale);
    c.height = Math.round(d.h * scale);
    const ctx = c.getContext('2d')!;
    if (mime === 'image/jpeg') {          // JPG has no alpha: paint white first
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.drawImage(d.src, 0, 0, c.width, c.height);
    return await new Promise<Blob>((res, rej) =>
      c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), mime, quality),
    );
  } finally {
    d.done();
  }
}

async function canvas(file: File, mime: string, quality: number): Promise<Blob> {
  return drawToBlob(file, mime, quality);
}

async function heic(file: File, mime: string, quality: number): Promise<Blob> {
  // 1) Native decoder first: handles every HEIC variant the device supports
  //    (newer iPhone and iPad photos included) and also files that are
  //    already JPG/PNG but still carry a .heic name.
  try {
    return await drawToBlob(file, mime, quality, 'image/heic');
  } catch {
    /* fall through to the bundled decoder */
  }
  // 2) Bundled decoder for browsers without HEIC support (Chrome, Firefox, Edge).
  //    Loaded on demand so the heavy decoder is only fetched when needed.
  const { default: heic2any } = await import('heic2any');
  const out = await heic2any({ blob: file, toType: mime, quality });
  return Array.isArray(out) ? out[0] : out;
}

export const engines: Record<Engine, typeof heic> = { heic, canvas };

// ---------------------------------------------------------------------------
// Image compression
// ---------------------------------------------------------------------------
export type OutFormat = 'same' | 'jpg' | 'webp';
export interface CompressOptions { quality: number; maxSide: number; format: OutFormat }
export interface CompressResult { blob: Blob; ext: 'jpg' | 'png' | 'webp'; kept: boolean; noteKey?: 'webpFallback'; colors?: number; lossless?: boolean }

const EXT: Record<string, 'jpg' | 'png' | 'webp'> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function guessMime(file: File): string {
  if (file.type === 'image/jpg') return 'image/jpeg';
  if (file.type) return file.type;
  const m = /\.(jpe?g|png|webp)$/i.exec(file.name);
  if (!m) return 'image/jpeg';
  const e = m[1].toLowerCase();
  return e === 'png' ? 'image/png' : e === 'webp' ? 'image/webp' : 'image/jpeg';
}

function encode(d: Decoded, w: number, h: number, mime: string, quality: number): Promise<Blob> {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  if (mime === 'image/jpeg') {            // JPG has no alpha: paint white first
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(d.src, 0, 0, w, h);
  return new Promise((res, rej) =>
    c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), mime, quality),
  );
}

// Quality slider (0.40 to 0.95) -> palette size (32 to 256 colors).
function pngColors(quality: number): number {
  const t = Math.max(0, Math.min(1, (quality - 0.4) / 0.45));
  return Math.round(Math.pow(2, 5 + 3 * t));
}

async function encodePng(d: Decoded, w: number, h: number, quality: number): Promise<{ blob: Blob; colors: number; lossless: boolean } | null> {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(d.src, 0, 0, w, h);
  const r = await quantizePng(ctx.getImageData(0, 0, w, h), pngColors(quality));
  if (!r) return null;
  return { blob: r.blob, colors: r.colors, lossless: r.lossless };
}

export async function compressImage(file: File, o: CompressOptions): Promise<CompressResult> {
  const srcMime = guessMime(file);
  const wanted =
    o.format === 'jpg' ? 'image/jpeg' : o.format === 'webp' ? 'image/webp' : EXT[srcMime] ? srcMime : 'image/jpeg';
  const d = await decodeNative(file, srcMime);
  try {
    if (!d.w || !d.h) throw new Error('empty image');
    let scale = Math.min(1, Math.sqrt(MAX_PIXELS / (d.w * d.h)));
    if (o.maxSide > 0) scale = Math.min(scale, o.maxSide / Math.max(d.w, d.h));
    const w = Math.max(1, Math.round(d.w * scale));
    const h = Math.max(1, Math.round(d.h * scale));

    let mime = wanted;
    let noteKey: 'webpFallback' | undefined;
    let blob: Blob;
    let colors: number | undefined;
    let lossless: boolean | undefined;
    const png = mime === 'image/png' ? await encodePng(d, w, h, o.quality) : null;
    if (png) {
      blob = png.blob;
      colors = png.colors;
      lossless = png.lossless;
    } else {
      blob = await encode(d, w, h, mime, o.quality);
    }
    if (blob.type !== mime) {
      // Some browsers cannot save WebP and silently return PNG. Use JPG instead.
      mime = 'image/jpeg';
      noteKey = 'webpFallback';
      blob = await encode(d, w, h, mime, o.quality);
      colors = lossless = undefined;
    }
    const resized = w !== d.w || h !== d.h;
    if (!resized && mime === srcMime && blob.size >= file.size) {
      return { blob: file, ext: EXT[srcMime], kept: true, noteKey };
    }
    return { blob, ext: EXT[mime], kept: false, noteKey, colors, lossless };
  } finally {
    d.done();
  }
}

// ---------------------------------------------------------------------------
// Image resizing
// ---------------------------------------------------------------------------
export interface ResizeOptions {
  mode: 'percent' | 'pixels';
  percent: number;          // used when mode is "percent"
  width: number;            // pixels, 0 = not set
  height: number;           // pixels, 0 = not set
  keepRatio: boolean;
  format: 'same' | 'jpg' | 'png' | 'webp';
  quality: number;          // 0..1, JPG and WebP only
}
export interface ResizeResult {
  blob: Blob;
  ext: 'jpg' | 'png' | 'webp';
  from: { w: number; h: number };
  to: { w: number; h: number };
  limited: boolean;
  noteKey?: 'webpFallback';
}

const MAX_SIDE = 16384;

// Shrinking in steps of one half gives smoother results than one big jump.
function scaleTo(d: Decoded, tw: number, th: number, mime: string): HTMLCanvasElement {
  let cur: CanvasImageSource = d.src;
  let cw = d.w;
  let ch = d.h;
  while (cw / 2 >= tw && ch / 2 >= th) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(cw / 2));
    c.height = Math.max(1, Math.ceil(ch / 2));
    const x = c.getContext('2d')!;
    x.imageSmoothingQuality = 'high';
    x.drawImage(cur, 0, 0, c.width, c.height);
    cur = c;
    cw = c.width;
    ch = c.height;
  }
  const out = document.createElement('canvas');
  out.width = tw;
  out.height = th;
  const ctx = out.getContext('2d')!;
  if (mime === 'image/jpeg') {            // JPG has no alpha: paint white first
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, tw, th);
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(cur, 0, 0, tw, th);
  return out;
}

const toBlob = (c: HTMLCanvasElement, mime: string, quality: number) =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), mime, quality));

export async function resizeImage(file: File, o: ResizeOptions): Promise<ResizeResult> {
  const srcMime = guessMime(file);
  const wanted =
    o.format === 'jpg' ? 'image/jpeg'
    : o.format === 'png' ? 'image/png'
    : o.format === 'webp' ? 'image/webp'
    : EXT[srcMime] ? srcMime : 'image/jpeg';
  const d = await decodeNative(file, srcMime);
  try {
    if (!d.w || !d.h) throw new Error('empty image');

    let tw: number;
    let th: number;
    if (o.mode === 'percent') {
      const s = Math.max(1, o.percent) / 100;
      tw = d.w * s;
      th = d.h * s;
    } else if (o.keepRatio) {
      const sw = o.width > 0 ? o.width / d.w : Infinity;
      const sh = o.height > 0 ? o.height / d.h : Infinity;
      const s = Math.min(sw, sh);
      const k = Number.isFinite(s) ? s : 1;
      tw = d.w * k;
      th = d.h * k;
    } else {
      tw = o.width > 0 ? o.width : d.w;
      th = o.height > 0 ? o.height : d.h;
    }
    tw = Math.max(1, Math.round(tw));
    th = Math.max(1, Math.round(th));

    // Stay inside what the browser can draw.
    let limited = false;
    let k = 1;
    if (tw * th > MAX_PIXELS) k = Math.min(k, Math.sqrt(MAX_PIXELS / (tw * th)));
    if (Math.max(tw, th) > MAX_SIDE) k = Math.min(k, MAX_SIDE / Math.max(tw, th));
    if (k < 1) {
      tw = Math.max(1, Math.floor(tw * k));
      th = Math.max(1, Math.floor(th * k));
      limited = true;
    }

    let mime = wanted;
    let noteKey: 'webpFallback' | undefined;
    let blob = await toBlob(scaleTo(d, tw, th, mime), mime, o.quality);
    if (blob.type !== mime) {
      mime = 'image/jpeg';                  // browser cannot save this type (for example WebP in Safari)
      noteKey = 'webpFallback';
      blob = await toBlob(scaleTo(d, tw, th, mime), mime, o.quality);
    }
    return { blob, ext: EXT[mime], from: { w: d.w, h: d.h }, to: { w: tw, h: th }, limited, noteKey };
  } finally {
    d.done();
  }
}
