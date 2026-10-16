// Browser-only conversion. Each engine takes a File and returns a Blob.
export type Engine = 'heic' | 'canvas';

async function heic(file: File, mime: string, quality: number): Promise<Blob> {
  // Loaded on demand so the heavy decoder is only fetched when needed.
  const { default: heic2any } = await import('heic2any');
  const out = await heic2any({ blob: file, toType: mime, quality });
  return Array.isArray(out) ? out[0] : out;
}

async function canvas(file: File, mime: string, quality: number): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const c = document.createElement('canvas');
  c.width = bmp.width;
  c.height = bmp.height;
  const ctx = c.getContext('2d')!;
  if (mime === 'image/jpeg') {            // JPG has no alpha: paint white first
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.drawImage(bmp, 0, 0);
  bmp.close();
  return new Promise((res, rej) =>
    c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), mime, quality),
  );
}

export const engines: Record<Engine, typeof heic> = { heic, canvas };
