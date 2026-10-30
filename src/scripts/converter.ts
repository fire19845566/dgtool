// Browser-only conversion. Each engine takes a File and returns a Blob.
import { quantizePng } from './png-quant';
import { detectBackground, removeBackground, type BgOptions, type RGB } from './bgremove';
import { applyMask, maskFor, type AiStatus } from './ai-bg';
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

// ---------------------------------------------------------------------------
// Compress to a target file size
// ---------------------------------------------------------------------------
export interface TargetOptions { targetBytes: number; maxSide: number; format: OutFormat }
export interface TargetResult {
  blob: Blob;
  ext: 'jpg' | 'png' | 'webp';
  kept: boolean;            // the original already fit, so it is returned as is
  reached: boolean;         // false when even the smallest result is above the target
  w: number;
  h: number;
  resized: boolean;         // the image had to be made smaller to fit
  quality?: number;         // 0..1, JPG and WebP
  colors?: number;          // PNG
  noteKey?: 'webpFallback';
}

const MIN_QUALITY = 0.4;
const MAX_QUALITY = 0.92;
const MIN_SIDE = 32;

export async function compressToTarget(file: File, o: TargetOptions): Promise<TargetResult> {
  const srcMime = guessMime(file);
  const wanted =
    o.format === 'jpg' ? 'image/jpeg' : o.format === 'webp' ? 'image/webp' : EXT[srcMime] ? srcMime : 'image/jpeg';

  // Nothing to do: the original already fits and no change was asked for.
  if (file.size <= o.targetBytes && wanted === srcMime && o.maxSide === 0) {
    return { blob: file, ext: EXT[srcMime], kept: true, reached: true, w: 0, h: 0, resized: false };
  }

  const d = await decodeNative(file, srcMime);
  try {
    if (!d.w || !d.h) throw new Error('empty image');
    let s0 = Math.min(1, Math.sqrt(MAX_PIXELS / (d.w * d.h)));
    if (o.maxSide > 0) s0 = Math.min(s0, o.maxSide / Math.max(d.w, d.h));
    const dim = (s: number) => ({ w: Math.max(1, Math.round(d.w * s)), h: Math.max(1, Math.round(d.h * s)) });
    const target = o.targetBytes;
    let mime = wanted;
    let noteKey: 'webpFallback' | undefined;

    let s = s0;
    let smallest: { blob: Blob; w: number; h: number; quality?: number; colors?: number } | null = null;
    let best: typeof smallest = null;

    for (let attempt = 0; attempt < 7 && !best; attempt++) {
      const { w, h } = dim(s);
      const canvas = scaleTo(d, w, h, mime);
      let tooBig: Blob;                         // the smallest result at this size, used to estimate the next one
      let info: { quality?: number; colors?: number } = {};

      if (mime === 'image/png') {
        // PNG: fewer colors first (256, 128, 64), then a smaller image.
        const steps = attempt === 0 ? [256, 128, 64] : [128, 64];
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        const data = ctx.getImageData(0, 0, w, h);
        let last: Blob | null = null;
        let lastColors = 64;
        for (const colors of steps) {
          const r = await quantizePng(data, colors);
          const blob = r ? r.blob : await toBlob(canvas, 'image/png', 1);
          last = blob;
          lastColors = r ? r.colors : 0;
          if (blob.size <= target) {
            best = { blob, w, h, colors: r ? r.colors : undefined };
            break;
          }
          if (!r) break;                        // no palette encoder: scaling is the only lever
        }
        if (best) break;
        tooBig = last!;
        info = { colors: lastColors || undefined };
      } else {
        // JPG and WebP: highest quality that fits, found by bisection.
        const top = await toBlob(canvas, mime, MAX_QUALITY);
        if (top.type !== mime) {
          mime = 'image/jpeg';                  // browser cannot save WebP (for example Safari)
          noteKey = 'webpFallback';
          attempt--;                            // redo this size as JPG
          continue;
        }
        if (top.size <= target) { best = { blob: top, w, h, quality: MAX_QUALITY }; break; }
        const bottom = await toBlob(canvas, mime, MIN_QUALITY);
        if (bottom.size <= target) {
          let fit = bottom, fq = MIN_QUALITY, a = MIN_QUALITY, b = MAX_QUALITY;
          for (let i = 0; i < 6; i++) {
            const m = (a + b) / 2;
            const t = await toBlob(canvas, mime, m);
            if (t.size <= target) { fit = t; fq = m; a = m; } else { b = m; }
          }
          best = { blob: fit, w, h, quality: fq };
          break;
        }
        tooBig = bottom;
        info = { quality: MIN_QUALITY };
      }

      if (!smallest || tooBig.size < smallest.blob.size) smallest = { blob: tooBig, w, h, ...info };
      // File size follows the pixel count roughly, so shrink by the square root of the ratio.
      const k = Math.max(0.5, Math.min(0.95, Math.sqrt(target / tooBig.size) * 0.95));
      s *= k;
      const next = dim(s);
      if (Math.min(next.w, next.h) < MIN_SIDE) break;
    }

    const reached = !!best;
    const out = (best ?? smallest)!;
    const first = dim(s0);
    return {
      blob: out.blob,
      ext: EXT[mime],
      kept: false,
      reached,
      w: out.w,
      h: out.h,
      resized: out.w !== first.w || out.h !== first.h,
      quality: out.quality,
      colors: out.colors,
      noteKey,
    };
  } finally {
    d.done();
  }
}

// ---------------------------------------------------------------------------
// Watermark
// ---------------------------------------------------------------------------
export interface WatermarkOptions {
  type: 'text' | 'image';
  text: string;
  fontPct: number;          // text size, % of the image's shorter side
  color: string;            // '#rrggbb'
  bold: boolean;
  outline: boolean;
  opacity: number;          // 0..1
  rotation: number;         // degrees
  layout: 'single' | 'tile';
  position: string;         // 'tl' 'tc' 'tr' 'ml' 'mc' 'mr' 'bl' 'bc' 'br'
  gap: number;              // tile spacing, % of the watermark size
  imageScale: number;       // image watermark width, % of the image width
  format: 'same' | 'jpg' | 'png' | 'webp';
  quality: number;          // 0..1, JPG and WebP only
}
export type MarkImage = Decoded;
export interface WatermarkResult {
  blob: Blob;
  ext: 'jpg' | 'png' | 'webp';
  w: number;
  h: number;
  limited: boolean;
  noteKey?: 'webpFallback';
}

const FONT_STACK =
  'system-ui, -apple-system, "Segoe UI", "PingFang TC", "Hiragino Sans", "Microsoft JhengHei", "Malgun Gothic", "Noto Sans CJK TC", "Noto Sans CJK JP", "Noto Sans CJK KR", sans-serif';

const brightness = (hex: string) => {
  const n = parseInt(hex.replace('#', '').padEnd(6, '0').slice(0, 6), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};

// All sizes are percentages of the image, so the preview and the full-size result look the same.
export function paintWatermark(ctx: CanvasRenderingContext2D, w: number, h: number, o: WatermarkOptions, mark: MarkImage | null) {
  const side = Math.min(w, h);
  let uw = 0;
  let uh = 0;
  let drawUnit: () => void;

  if (o.type === 'text') {
    const lines = o.text.split('\n').map((s) => s.trim()).filter(Boolean);
    if (!lines.length) return;
    let px = Math.max(6, (o.fontPct / 100) * side);
    const setFont = () => { ctx.font = `${o.bold ? '700' : '400'} ${px}px ${FONT_STACK}`; };
    const measure = () => { setFont(); return Math.max(...lines.map((l) => ctx.measureText(l).width)); };
    uw = measure();
    if (uw > w * 0.96) { px = (px * w * 0.96) / uw; uw = measure(); }   // long text on a small image
    const lh = px * 1.25;
    uh = lh * lines.length;
    const outline = brightness(o.color) > 0.6 ? '#000' : '#fff';
    drawUnit = () => {
      setFont();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      lines.forEach((line, i) => {
        const y = (i - (lines.length - 1) / 2) * lh;
        if (o.outline) {
          ctx.lineWidth = Math.max(1, px * 0.1);
          ctx.lineJoin = 'round';
          ctx.strokeStyle = outline;
          ctx.strokeText(line, 0, y);
        }
        ctx.fillStyle = o.color;
        ctx.fillText(line, 0, y);
      });
    };
  } else {
    if (!mark || !mark.w || !mark.h) return;
    uw = Math.max(4, (o.imageScale / 100) * w);
    uh = (uw * mark.h) / mark.w;
    if (uh > h * 0.9) { const k = (h * 0.9) / uh; uw *= k; uh *= k; }
    const m = mark;
    drawUnit = () => ctx.drawImage(m.src, -uw / 2, -uh / 2, uw, uh);
  }

  const rad = (o.rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const bw = uw * cos + uh * sin;          // size of the rotated watermark
  const bh = uw * sin + uh * cos;

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, o.opacity));
  if (o.layout === 'single') {
    const m = 0.03 * side;
    const row = o.position[0];
    const col = o.position[1];
    const cx = col === 'l' ? m + bw / 2 : col === 'r' ? w - m - bw / 2 : w / 2;
    const cy = row === 't' ? m + bh / 2 : row === 'b' ? h - m - bh / 2 : h / 2;
    ctx.translate(cx, cy);
    ctx.rotate(rad);
    drawUnit();
  } else {
    // A grid that is rotated together with the watermark; every other row is shifted by half a step.
    let sx = uw * (1 + o.gap / 100);
    let sy = uh * (1 + o.gap / 100);
    const reach = Math.hypot(w, h) / 2 + Math.max(sx, sy);
    const count = (2 * reach / sx) * (2 * reach / sy);
    if (count > 3000) { const k = Math.sqrt(count / 3000); sx *= k; sy *= k; }
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    const rows = Math.ceil(reach / sy);
    const cols = Math.ceil(reach / sx);
    for (let j = -rows; j <= rows; j++) {
      for (let i = -cols; i <= cols; i++) {
        ctx.save();
        ctx.translate(i * sx + (Math.abs(j) % 2 ? sx / 2 : 0), j * sy);
        drawUnit();
        ctx.restore();
      }
    }
  }
  ctx.restore();
}

export async function loadImage(file: File): Promise<Decoded> {
  return decodeNative(file, guessMime(file));
}

// Draws the picture and the watermark. maxW > 0 makes a smaller copy (for the preview).
export function renderWatermarked(img: Decoded, o: WatermarkOptions, mark: MarkImage | null, maxW = 0, whiteBg = false): HTMLCanvasElement {
  let scale = Math.min(1, Math.sqrt(MAX_PIXELS / (img.w * img.h)));
  if (maxW > 0) scale = Math.min(scale, maxW / img.w);
  const w = Math.max(1, Math.round(img.w * scale));
  const h = Math.max(1, Math.round(img.h * scale));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  if (whiteBg) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img.src, 0, 0, w, h);
  paintWatermark(ctx, w, h, o, mark);
  return c;
}

export async function watermarkImage(file: File, o: WatermarkOptions, mark: MarkImage | null): Promise<WatermarkResult> {
  const srcMime = guessMime(file);
  const wanted =
    o.format === 'jpg' ? 'image/jpeg'
    : o.format === 'png' ? 'image/png'
    : o.format === 'webp' ? 'image/webp'
    : EXT[srcMime] ? srcMime : 'image/jpeg';
  const d = await decodeNative(file, srcMime);
  try {
    if (!d.w || !d.h) throw new Error('empty image');
    let mime = wanted;
    let noteKey: 'webpFallback' | undefined;
    let c = renderWatermarked(d, o, mark, 0, mime === 'image/jpeg');
    let blob = await toBlob(c, mime, o.quality);
    if (blob.type !== mime) {
      mime = 'image/jpeg';                  // browser cannot save this type (for example WebP in Safari)
      noteKey = 'webpFallback';
      c = renderWatermarked(d, o, mark, 0, true);
      blob = await toBlob(c, mime, o.quality);
    }
    return { blob, ext: EXT[mime], w: c.width, h: c.height, limited: c.width !== d.w || c.height !== d.h, noteKey };
  } finally {
    d.done();
  }
}

// ---------------------------------------------------------------------------
// Background removal (by color)
// ---------------------------------------------------------------------------
export interface RemoveBgOptions extends BgOptions {
  method: 'color' | 'ai';
  aiKeep: number;                   // 0..100, AI method: how much of the uncertain areas to keep
  manualColor: RGB | null;          // picked by the user; null = detect from the edges
  background: 'transparent' | 'color';
  fillColor: string;                // '#rrggbb', used when background is "color"
  format: 'png' | 'webp' | 'jpg';
  quality: number;
}
export interface RemoveBgResult {
  blob: Blob;
  ext: 'jpg' | 'png' | 'webp';
  w: number;
  h: number;
  limited: boolean;
  color: RGB;
  share: number;
  noteKey?: 'webpFallback';
}

// Draws the picture (at most maxW wide when maxW > 0) and removes its background.
export async function cutOut(img: Decoded, key: object, o: RemoveBgOptions, maxW = 0, onStatus?: (s: AiStatus) => void) {
  let scale = Math.min(1, Math.sqrt(MAX_PIXELS / (img.w * img.h)));
  if (maxW > 0) scale = Math.min(scale, maxW / img.w);
  const w = Math.max(1, Math.round(img.w * scale));
  const h = Math.max(1, Math.round(img.h * scale));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img.src, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  if (o.method === 'ai') {
    const mask = await maskFor(key, img.src, onStatus);
    applyMask(data, mask, undefined, o.aiKeep);
    ctx.putImageData(data, 0, 0);
    return { canvas: c, color: [0, 0, 0] as RGB, share: 1, scale };
  }
  const detected = detectBackground(data);
  const color = o.manualColor ?? detected.color;
  // "Trim" is in pixels of the full-size image: scale it for the smaller preview.
  const trim = Math.round(o.trim * scale);
  removeBackground(data, { ...o, color, trim });
  ctx.putImageData(data, 0, 0);
  return { canvas: c, color, share: detected.share, scale };
}

// Puts the cut-out on a solid color when asked, otherwise keeps it transparent.
export function composeBg(cut: HTMLCanvasElement, o: RemoveBgOptions, forceFill: boolean): HTMLCanvasElement {
  if (o.background !== 'color' && !forceFill) return cut;
  const out = document.createElement('canvas');
  out.width = cut.width;
  out.height = cut.height;
  const ctx = out.getContext('2d')!;
  ctx.fillStyle = o.background === 'color' ? o.fillColor : '#ffffff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(cut, 0, 0);
  return out;
}

export async function removeBgFromFile(file: File, o: RemoveBgOptions, onStatus?: (s: AiStatus) => void): Promise<RemoveBgResult> {
  const d = await decodeNative(file, guessMime(file));
  try {
    if (!d.w || !d.h) throw new Error('empty image');
    const { canvas: cut, color, share } = await cutOut(d, file, o, 0, onStatus);
    let mime = o.format === 'jpg' ? 'image/jpeg' : o.format === 'webp' ? 'image/webp' : 'image/png';
    let noteKey: 'webpFallback' | undefined;
    let out = composeBg(cut, o, mime === 'image/jpeg');
    let blob = await toBlob(out, mime, o.quality);
    if (blob.type !== mime) {
      mime = 'image/png';                   // browser cannot save this type (for example WebP in Safari)
      noteKey = 'webpFallback';
      out = composeBg(cut, o, false);
      blob = await toBlob(out, mime, 1);
    }
    return { blob, ext: EXT[mime], w: out.width, h: out.height, limited: out.width !== d.w || out.height !== d.h, color, share, noteKey };
  } finally {
    d.done();
  }
}
