// Lossy PNG optimizer: reduces an image to a palette of up to 256 colors and
// writes an indexed PNG. Pure TypeScript, no dependencies.
// Needs CompressionStream (available in all current browsers).

export interface QuantResult { blob: Blob; colors: number; lossless: boolean }

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

async function deflate(data: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream('deflate');   // "deflate" = zlib format, as PNG needs
  const w = cs.writable.getWriter();
  w.write(data);
  w.close();
  return new Uint8Array(await new Response(cs.readable).arrayBuffer());
}

// The histogram groups similar colors into bins. Opaque images use 6 bits per
// color channel; images with soft transparency use 5 bits per channel and
// 6 bits of alpha so that alpha gradients keep enough steps.

// Median-cut palette from a histogram of the image.
function medianCut(BINS: number, cnt: Float64Array, sr: Float64Array, sg: Float64Array, sb: Float64Array, sa: Float64Array, maxColors: number): { pal: Uint8Array; bins: number } {
  const idsArr: number[] = [];
  for (let k = 0; k < BINS; k++) if (cnt[k] > 0) idsArr.push(k);
  const m = idsArr.length;
  const ids = Int32Array.from(idsArr);
  const ch = [new Float32Array(m), new Float32Array(m), new Float32Array(m), new Float32Array(m)];
  for (let i = 0; i < m; i++) {
    const k = ids[i], c = cnt[k];
    ch[0][i] = sr[k] / c; ch[1][i] = sg[k] / c; ch[2][i] = sb[k] / c; ch[3][i] = sa[k] / c;
  }
  const W = [1, 1, 0.8, 1];

  type Box = { pos: Int32Array; count: number; score: number; axis: number };
  const stats = (pos: Int32Array): Box => {
    let count = 0;
    const mn = [255, 255, 255, 255], mx = [0, 0, 0, 0];
    for (let i = 0; i < pos.length; i++) {
      const p = pos[i];
      count += cnt[ids[p]];
      for (let c = 0; c < 4; c++) {
        const v = ch[c][p];
        if (v < mn[c]) mn[c] = v;
        if (v > mx[c]) mx[c] = v;
      }
    }
    let axis = 0, best = -1;
    for (let c = 0; c < 4; c++) {
      const r = (mx[c] - mn[c]) * W[c];
      if (r > best) { best = r; axis = c; }
    }
    return { pos, count, score: pos.length > 1 ? count * best : 0, axis };
  };

  const all = new Int32Array(m);
  for (let i = 0; i < m; i++) all[i] = i;
  const boxes: Box[] = [stats(all)];
  while (boxes.length < maxColors) {
    let bi = -1, bs = 0;
    for (let i = 0; i < boxes.length; i++) if (boxes[i].score > bs) { bs = boxes[i].score; bi = i; }
    if (bi < 0) break;
    const b = boxes[bi];
    const v = ch[b.axis];
    b.pos.sort((x, y) => v[x] - v[y]);
    let acc = 0, split = 1;
    for (let i = 0; i < b.pos.length - 1; i++) {
      acc += cnt[ids[b.pos[i]]];
      split = i + 1;
      if (acc >= b.count / 2) break;
    }
    boxes.splice(bi, 1, stats(b.pos.subarray(0, split)), stats(b.pos.subarray(split)));
  }

  const pal = new Uint8Array(boxes.length * 4);
  boxes.forEach((b, j) => {
    let c = 0, r = 0, g = 0, bl = 0, a = 0;
    for (let i = 0; i < b.pos.length; i++) {
      const k = ids[b.pos[i]];
      c += cnt[k]; r += sr[k]; g += sg[k]; bl += sb[k]; a += sa[k];
    }
    let A = Math.round(a / c);
    if (A < 4) A = 0; else if (A > 251) A = 255;
    pal[j * 4] = A ? Math.round(r / c) : 0;
    pal[j * 4 + 1] = A ? Math.round(g / c) : 0;
    pal[j * 4 + 2] = A ? Math.round(bl / c) : 0;
    pal[j * 4 + 3] = A;
  });
  return { pal, bins: m };
}

async function writePng(w: number, h: number, pal: Uint8Array, idx: Uint8Array): Promise<Blob> {
  const np = pal.length / 4;
  const depth = np <= 2 ? 1 : np <= 4 ? 2 : np <= 16 ? 4 : 8;
  const rowBytes = Math.ceil((w * depth) / 8);
  const raw = new Uint8Array((rowBytes + 1) * h);       // filter type 0 (none) on every row
  for (let y = 0; y < h; y++) {
    const o = y * (rowBytes + 1) + 1;
    const s = y * w;
    if (depth === 8) {
      raw.set(idx.subarray(s, s + w), o);
    } else {
      for (let x = 0; x < w; x++) {
        const shift = 8 - depth - (x * depth) % 8;
        raw[o + ((x * depth) >> 3)] |= idx[s + x] << shift;
      }
    }
  }
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w); dv.setUint32(4, h);
  ihdr[8] = depth; ihdr[9] = 3;
  const plte = new Uint8Array(np * 3);
  let lastAlpha = -1;
  for (let j = 0; j < np; j++) {
    plte[j * 3] = pal[j * 4]; plte[j * 3 + 1] = pal[j * 4 + 1]; plte[j * 3 + 2] = pal[j * 4 + 2];
    if (pal[j * 4 + 3] < 255) lastAlpha = j;
  }
  const parts: Uint8Array[] = [
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('PLTE', plte),
  ];
  if (lastAlpha >= 0) {
    const trns = new Uint8Array(lastAlpha + 1);
    for (let j = 0; j <= lastAlpha; j++) trns[j] = pal[j * 4 + 3];
    parts.push(chunk('tRNS', trns));
  }
  parts.push(chunk('IDAT', await deflate(raw)), chunk('IEND', new Uint8Array(0)));
  return new Blob(parts as BlobPart[], { type: 'image/png' });
}

export async function quantizePng(img: ImageData, maxColors: number): Promise<QuantResult | null> {
  if (typeof CompressionStream === 'undefined') return null;
  maxColors = Math.max(2, Math.min(256, Math.round(maxColors)));
  const { width: w, height: h, data } = img;
  const n = w * h;

  let semi = false;                                  // any partly transparent pixel?
  for (let p = 3; p < data.length; p += 4) if (data[p] > 0 && data[p] < 255) { semi = true; break; }
  const bitsA = semi ? 6 : 1, bitsC = semi ? 5 : 6;
  const sC = 8 - bitsC, sA = 8 - bitsA;
  const BINS = 1 << (3 * bitsC + bitsA);
  const key = (r: number, g: number, b: number, a: number) =>
    ((r >> sC) << (2 * bitsC + bitsA)) | ((g >> sC) << (bitsC + bitsA)) | ((b >> sC) << bitsA) | (a >> sA);

  // Pass 1: histogram, plus a check whether the image already has few enough colors.
  const cnt = new Float64Array(BINS), sr = new Float64Array(BINS), sg = new Float64Array(BINS),
        sb = new Float64Array(BINS), sa = new Float64Array(BINS);
  const seen = new Set<number>();
  let overflow = false;
  for (let i = 0, p = 0; i < n; i++, p += 4) {
    let r = data[p], g = data[p + 1], b = data[p + 2];
    const a = data[p + 3];
    if (a === 0) r = g = b = 0;
    if (!overflow) {
      const c = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
      if (!seen.has(c)) { seen.add(c); if (seen.size > maxColors) overflow = true; }
    }
    const k = key(r, g, b, a);
    cnt[k]++; sr[k] += r; sg[k] += g; sb[k] += b; sa[k] += a;
  }
  await tick();

  const idx = new Uint8Array(n);
  let pal: Uint8Array;
  let lossless = false;
  let bins = 0;

  if (!overflow) {
    // Few colors: exact palette, no quality loss.
    lossless = true;
    const list = Array.from(seen);
    pal = new Uint8Array(list.length * 4);
    const lookup = new Map<number, number>();
    list.forEach((c, j) => {
      pal[j * 4] = c >>> 24; pal[j * 4 + 1] = (c >>> 16) & 255; pal[j * 4 + 2] = (c >>> 8) & 255; pal[j * 4 + 3] = c & 255;
      lookup.set(c, j);
    });
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      let r = data[p], g = data[p + 1], b = data[p + 2];
      const a = data[p + 3];
      if (a === 0) r = g = b = 0;
      idx[i] = lookup.get(((r << 24) | (g << 16) | (b << 8) | a) >>> 0)!;
    }
  } else {
    const mc = medianCut(BINS, cnt, sr, sg, sb, sa, maxColors);
    pal = mc.pal;
    bins = mc.bins;
    const np = pal.length / 4;
    const cache = new Int16Array(BINS).fill(-1);
    const nearest = (r: number, g: number, b: number, a: number) => {
      const k = key(r, g, b, a);
      const hit = cache[k];
      if (hit >= 0) return hit;
      let best = 0, bd = Infinity;
      for (let j = 0; j < np; j++) {
        const dr = r - pal[j * 4], dg = g - pal[j * 4 + 1], db = b - pal[j * 4 + 2], da = a - pal[j * 4 + 3];
        const d = dr * dr + dg * dg + db * db + da * da;
        if (d < bd) { bd = d; best = j; }
      }
      cache[k] = best;
      return best;
    };
    const transIdx = nearest(0, 0, 0, 0);
    // Floyd-Steinberg error diffusion helps photos and gradients. Flat graphics
    // have few distinct colors and compress better without it.
    const strength = bins > 8192 ? 0.85 : 0;
    let e0 = new Float32Array((w + 2) * 3), e1 = new Float32Array((w + 2) * 3);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x, p = i * 4, a = data[p + 3];
        if (a === 0) { idx[i] = transIdx; continue; }
        const o = (x + 1) * 3;
        let r = data[p] + e0[o], g = data[p + 1] + e0[o + 1], b = data[p + 2] + e0[o + 2];
        r = r < 0 ? 0 : r > 255 ? 255 : r;
        g = g < 0 ? 0 : g > 255 ? 255 : g;
        b = b < 0 ? 0 : b > 255 ? 255 : b;
        const j = nearest(Math.round(r), Math.round(g), Math.round(b), a);
        idx[i] = j;
        const er = (r - pal[j * 4]) * strength, eg = (g - pal[j * 4 + 1]) * strength, eb = (b - pal[j * 4 + 2]) * strength;
        e0[o + 3] += er * 0.4375; e0[o + 4] += eg * 0.4375; e0[o + 5] += eb * 0.4375;
        e1[o - 3] += er * 0.1875; e1[o - 2] += eg * 0.1875; e1[o - 1] += eb * 0.1875;
        e1[o] += er * 0.3125; e1[o + 1] += eg * 0.3125; e1[o + 2] += eb * 0.3125;
        e1[o + 3] += er * 0.0625; e1[o + 4] += eg * 0.0625; e1[o + 5] += eb * 0.0625;
      }
      const t = e0; e0 = e1; e1 = t; e1.fill(0);
      if ((y & 63) === 63) await tick();                      // keep the page responsive
    }
  }

  const blob = await writePng(w, h, pal, idx);
  return { blob, colors: pal.length / 4, lossless };
}
