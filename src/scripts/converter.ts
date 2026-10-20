// Browser-only conversion. Each engine takes a File and returns a Blob.
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
