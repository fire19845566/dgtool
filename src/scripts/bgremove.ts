// Background removal by color. No AI model: it works on plain, single-color backgrounds.
// Pure functions over RGBA pixel data, so they run (and can be tested) anywhere.

export interface Pixels { data: Uint8ClampedArray; width: number; height: number }
export type RGB = [number, number, number];

export interface BgOptions {
  color: RGB;               // the background color to remove
  tolerance: number;        // 0..100, how different from the background a pixel may be
  softness: number;         // 0..3, width of the soft edge in pixels (0 = hard cut)
  trim: number;             // 0..5, pixels to cut away from the edge of the subject
  edgesOnly: boolean;       // only remove background that touches the border of the image
}

// "Redmean" color distance: close to what the eye sees, and cheap.
function dist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const rm = (r1 + r2) / 2;
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return Math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db);
}

const LIMIT_PER_PERCENT = 2.2;   // tolerance 100 -> distance 220

// Most common color along the border of the image, and how much of the border it covers.
export function detectBackground(img: Pixels): { color: RGB; share: number } {
  const { data, width: w, height: h } = img;
  const t = Math.max(1, Math.min(2, Math.floor(Math.min(w, h) / 50)));
  const bins = new Map<number, { n: number; r: number; g: number; b: number }>();
  const pts: number[] = [];
  const take = (x: number, y: number) => {
    const p = (y * w + x) * 4;
    if (data[p + 3] < 10) return;
    pts.push(p);
    const k = ((data[p] >> 3) << 10) | ((data[p + 1] >> 3) << 5) | (data[p + 2] >> 3);
    const e = bins.get(k) ?? { n: 0, r: 0, g: 0, b: 0 };
    e.n++; e.r += data[p]; e.g += data[p + 1]; e.b += data[p + 2];
    bins.set(k, e);
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x < t || y < t || x >= w - t || y >= h - t) take(x, y);
    }
  }
  if (!pts.length) return { color: [255, 255, 255], share: 0 };
  let best = { n: 0, r: 0, g: 0, b: 0 };
  for (const e of bins.values()) if (e.n > best.n) best = e;
  const c: RGB = [Math.round(best.r / best.n), Math.round(best.g / best.n), Math.round(best.b / best.n)];
  const lim = 30 * LIMIT_PER_PERCENT;
  let close = 0;
  for (const p of pts) if (dist(data[p], data[p + 1], data[p + 2], c[0], c[1], c[2]) <= lim) close++;
  return { color: c, share: close / pts.length };
}

// Dilate a mask by one pixel (8 neighbors).
function dilate(mask: Uint8Array, w: number, h: number): Uint8Array {
  const out = mask.slice();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (mask[i]) continue;
      let hit = 0;
      for (let dy = -1; dy <= 1 && !hit; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          if (mask[yy * w + xx]) { hit = 1; break; }
        }
      }
      if (hit) out[i] = 1;
    }
  }
  return out;
}

// Makes the background transparent. Changes img.data in place.
export function removeBackground(img: Pixels, o: BgOptions): void {
  const { data, width: w, height: h } = img;
  const n = w * h;
  const [br, bgc, bb] = o.color;
  const limit = (o.tolerance / 100) * 220;

  // Distance of every pixel to the background color (already transparent pixels count as background).
  const d = new Uint16Array(n);
  for (let i = 0, p = 0; i < n; i++, p += 4) {
    d[i] = data[p + 3] < 10 ? 0 : Math.min(65535, Math.round(dist(data[p], data[p + 1], data[p + 2], br, bgc, bb)));
  }

  // 1. Which pixels are background?
  let bg = new Uint8Array(n);
  if (!o.edgesOnly) {
    for (let i = 0; i < n; i++) if (d[i] <= limit) bg[i] = 1;
  } else {
    const queue = new Int32Array(n);
    let head = 0, tail = 0;
    const seed = (i: number) => { if (!bg[i] && d[i] <= limit) { bg[i] = 1; queue[tail++] = i; } };
    for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
    while (head < tail) {
      const i = queue[head++];
      const x = i % w;
      if (x > 0) seed(i - 1);
      if (x < w - 1) seed(i + 1);
      if (i >= w) seed(i - w);
      if (i < n - w) seed(i + w);
    }
  }

  // 2. Cut a few pixels off the subject if asked.
  for (let t = 0; t < o.trim; t++) bg = dilate(bg, w, h);

  // 3. Soft edge: pixels next to the background get a partial alpha.
  const R = Math.max(0, Math.min(3, Math.round(o.softness)));
  if (R > 0) {
    let reach = bg;
    for (let t = 0; t < R; t++) reach = dilate(reach, w, h);
    const alpha = new Float32Array(n).fill(1);
    const rad = R + 1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (bg[i] || !reach[i]) continue;                  // only the band around the background
        // Foreground color nearby: average of pixels that are neither background nor in the band.
        let sr = 0, sg = 0, sb = 0, cnt = 0;
        for (let dy = -rad; dy <= rad; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (let dx = -rad; dx <= rad; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            const j = yy * w + xx;
            if (reach[j]) continue;
            const q = j * 4;
            sr += data[q]; sg += data[q + 1]; sb += data[q + 2]; cnt++;
          }
        }
        if (!cnt) continue;                                // thin detail: keep as is
        sr /= cnt; sg /= cnt; sb /= cnt;
        const p = i * 4;
        // How much of this pixel is foreground? Project it onto the line background -> foreground.
        const vr = sr - br, vg = sg - bgc, vb = sb - bb;
        const vv = vr * vr + vg * vg + vb * vb;
        if (vv < 1) continue;                              // foreground looks like the background
        let a = ((data[p] - br) * vr + (data[p + 1] - bgc) * vg + (data[p + 2] - bb) * vb) / vv;
        a = a < 0 ? 0 : a > 1 ? 1 : a;
        if (a > 0.98) continue;                            // fully foreground
        alpha[i] = a;
        data[p] = sr; data[p + 1] = sg; data[p + 2] = sb;  // use the foreground color: no halo of background color
      }
    }
    for (let i = 0, p = 3; i < n; i++, p += 4) {
      if (bg[i]) data[p] = 0;
      else if (alpha[i] < 1) data[p] = Math.round(data[p] * alpha[i]);
    }
  } else {
    for (let i = 0, p = 3; i < n; i++, p += 4) if (bg[i]) data[p] = 0;
  }
  for (let i = 0, p = 0; i < n; i++, p += 4) if (data[p + 3] === 0) { data[p] = 0; data[p + 1] = 0; data[p + 2] = 0; }
}
