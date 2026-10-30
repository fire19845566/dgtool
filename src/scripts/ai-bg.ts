// AI background removal with U²-Net "u2netp" (Apache-2.0) running in the browser through ONNX Runtime Web.
// The model file is served from this site (/models/u2netp.onnx); pictures never leave the device.

export const AI_MODEL = {
  url: '/models/u2netp.onnx',
  size: 320,
  mean: [0.485, 0.456, 0.406],
  std: [0.229, 0.224, 0.225],
};

export type AiStatus = 'downloading' | 'starting';

export interface MaskRunner {
  // input: float32 NCHW [1,3,size,size]; returns the first output, size*size values
  run(input: Float32Array, size: number): Promise<Float32Array>;
}

type Source = CanvasImageSource;

export function preprocess(src: Source, size = AI_MODEL.size): Float32Array {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, size, size);            // squashed to a square, like the reference pipeline
  const px = ctx.getImageData(0, 0, size, size).data;
  const n = size * size;
  let max = 1e-6;
  for (let i = 0; i < n; i++) {
    const j = i * 4;
    if (px[j] > max) max = px[j];
    if (px[j + 1] > max) max = px[j + 1];
    if (px[j + 2] > max) max = px[j + 2];
  }
  const out = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 3; k++) {
      out[k * n + i] = (px[i * 4 + k] / max - AI_MODEL.mean[k]) / AI_MODEL.std[k];
    }
  }
  return out;
}

// Min-max normalises the raw saliency map to 0..1.
export function normalizeMask(raw: Float32Array, size = AI_MODEL.size): Float32Array {
  const n = size * size;
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < n; i++) {
    const v = raw[i];
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const range = hi - lo || 1;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = (raw[i] - lo) / range;
  return out;
}

// Removes small islands that are not connected to the main subject (stray spots, wall holes...).
// Regions whose area is below `minShare` of the largest region are cleared. Several large subjects are all kept.
export function cleanMask(mask: Float32Array, size = AI_MODEL.size, minShare = 0.02, level = 0.15): Float32Array {
  const n = size * size;
  const label = new Int32Array(n);
  const areas: number[] = [0];
  const stack = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    if (mask[i] <= level || label[i]) continue;
    const id = areas.length;
    let area = 0, sp = 0;
    stack[sp++] = i;
    label[i] = id;
    while (sp) {
      const k = stack[--sp];
      area++;
      const x = k % size, y = (k - x) / size;
      if (x > 0 && mask[k - 1] > level && !label[k - 1]) { label[k - 1] = id; stack[sp++] = k - 1; }
      if (x < size - 1 && mask[k + 1] > level && !label[k + 1]) { label[k + 1] = id; stack[sp++] = k + 1; }
      if (y > 0 && mask[k - size] > level && !label[k - size]) { label[k - size] = id; stack[sp++] = k - size; }
      if (y < size - 1 && mask[k + size] > level && !label[k + size]) { label[k + size] = id; stack[sp++] = k + size; }
    }
    areas.push(area);
  }
  const biggest = Math.max(0, ...areas);
  const out = new Float32Array(mask);
  for (let i = 0; i < n; i++) {
    const id = label[i];
    if (id && areas[id] < biggest * minShare) out[i] = 0;
  }
  return out;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Box average over a (2r+1) window, clamped at the borders.
function box(src: Float32Array, w: number, h: number, r: number): Float32Array {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  const pre = new Float64Array(Math.max(w, h) + 1);
  for (let y = 0; y < h; y++) {
    pre[0] = 0;
    for (let x = 0; x < w; x++) pre[x + 1] = pre[x] + src[y * w + x];
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r);
      tmp[y * w + x] = (pre[x1 + 1] - pre[x0]) / (x1 - x0 + 1);
    }
  }
  for (let x = 0; x < w; x++) {
    pre[0] = 0;
    for (let y = 0; y < h; y++) pre[y + 1] = pre[y] + tmp[y * w + x];
    for (let y = 0; y < h; y++) {
      const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r);
      out[y * w + x] = (pre[y1 + 1] - pre[y0]) / (y1 - y0 + 1);
    }
  }
  return out;
}

// Guided filter (He et al.): makes the soft mask p follow the edges of the picture I (both 0..1).
export function guidedFilter(I: Float32Array, p: Float32Array, w: number, h: number, r: number, eps: number): Float32Array {
  const n = w * h;
  const II = new Float32Array(n), Ip = new Float32Array(n);
  for (let i = 0; i < n; i++) { II[i] = I[i] * I[i]; Ip[i] = I[i] * p[i]; }
  const mI = box(I, w, h, r), mp = box(p, w, h, r), mII = box(II, w, h, r), mIp = box(Ip, w, h, r);
  const a = new Float32Array(n), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const v = mII[i] - mI[i] * mI[i];
    const c = mIp[i] - mI[i] * mp[i];
    a[i] = c / (v + eps);
    b[i] = mp[i] - a[i] * mI[i];
  }
  const ma = box(a, w, h, r), mb = box(b, w, h, r);
  const q = new Float32Array(n);
  for (let i = 0; i < n; i++) q[i] = Math.min(1, Math.max(0, ma[i] * I[i] + mb[i]));
  return q;
}

// "keep" 0..100: higher keeps more of the uncertain areas (thin parts, soft edges).
export function keepCurve(keep: number) {
  const mid = 0.55 - Math.min(100, Math.max(0, keep)) * 0.0045;    // 0 -> 0.55, 50 -> 0.325, 100 -> 0.10
  return (v: number) => smoothstep(mid - 0.2, mid + 0.2, v);
}

// Scales the mask up to the picture's size, sharpens it along the picture's own edges and writes it into alpha.
export function applyMask(img: ImageData, mask: Float32Array, size = AI_MODEL.size, keep = 60) {
  const W = img.width, H = img.height;
  const k = Math.min(1, 1024 / Math.max(W, H));                    // refine at a moderate size, then scale up
  const w = Math.max(1, Math.round(W * k)), h = Math.max(1, Math.round(H * k));

  const mk = document.createElement('canvas');
  mk.width = size; mk.height = size;
  const mkc = mk.getContext('2d')!;
  const md = mkc.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = Math.round(255 * mask[i]);
    md.data[i * 4] = v; md.data[i * 4 + 1] = v; md.data[i * 4 + 2] = v; md.data[i * 4 + 3] = 255;
  }
  mkc.putImageData(md, 0, 0);

  const src = document.createElement('canvas');
  src.width = W; src.height = H;
  src.getContext('2d')!.putImageData(img, 0, 0);

  const work = document.createElement('canvas');
  work.width = w; work.height = h;
  const wc = work.getContext('2d', { willReadFrequently: true })!;
  wc.imageSmoothingEnabled = true;
  wc.imageSmoothingQuality = 'high';
  wc.drawImage(src, 0, 0, w, h);
  const g = wc.getImageData(0, 0, w, h).data;
  const I = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) I[i] = (0.299 * g[i * 4] + 0.587 * g[i * 4 + 1] + 0.114 * g[i * 4 + 2]) / 255;
  wc.drawImage(mk, 0, 0, w, h);
  const m = wc.getImageData(0, 0, w, h).data;
  const P = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) P[i] = m[i * 4] / 255;

  const r = Math.max(3, Math.round(Math.max(w, h) * 0.008));
  const Q = guidedFilter(I, P, w, h, r, 0.001);
  const curve = keepCurve(keep);
  const ad = wc.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const v = Math.round(255 * curve(Q[i]));
    ad.data[i * 4] = v; ad.data[i * 4 + 1] = v; ad.data[i * 4 + 2] = v; ad.data[i * 4 + 3] = 255;
  }
  wc.putImageData(ad, 0, 0);

  const big = document.createElement('canvas');
  big.width = W; big.height = H;
  const bctx = big.getContext('2d', { willReadFrequently: true })!;
  bctx.imageSmoothingEnabled = true;
  bctx.imageSmoothingQuality = 'high';
  bctx.drawImage(work, 0, 0, W, H);
  const a = bctx.getImageData(0, 0, W, H).data;
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const alpha = a[i];
    d[i + 3] = alpha;
    if (alpha === 0) { d[i] = 0; d[i + 1] = 0; d[i + 2] = 0; }
  }
}

// ---- runner (ONNX Runtime Web) --------------------------------------------
let runner: MaskRunner | null = null;
let loading: Promise<MaskRunner> | null = null;
let queue: Promise<unknown> = Promise.resolve();

export function setRunner(r: MaskRunner | null) { runner = r; loading = null; }

async function createRunner(onStatus?: (s: AiStatus) => void): Promise<MaskRunner> {
  onStatus?.('downloading');
  const ort = await import('onnxruntime-web/wasm');
  ort.env.wasm.wasmPaths = '/ort/';
  ort.env.wasm.numThreads = 1;                     // multi-threading needs special headers; one thread works everywhere
  const res = await fetch(AI_MODEL.url);
  if (!res.ok) throw new Error('model download failed: ' + res.status);
  const model = new Uint8Array(await res.arrayBuffer());
  onStatus?.('starting');
  const session = await ort.InferenceSession.create(model, { executionProviders: ['wasm'] });
  const inputName = session.inputNames[0];
  return {
    async run(input, size) {
      const t = new ort.Tensor('float32', input, [1, 3, size, size]);
      const out = await session.run({ [inputName]: t });
      return out[session.outputNames[0]].data as Float32Array;
    },
  };
}

export function getRunner(onStatus?: (s: AiStatus) => void): Promise<MaskRunner> {
  if (runner) return Promise.resolve(runner);
  if (!loading) {
    loading = createRunner(onStatus).then(
      (r) => { runner = r; return r; },
      (e) => { loading = null; throw e; },
    );
  }
  return loading;
}

// One mask per decoded picture; concurrent requests share the same run.
const cache = new WeakMap<object, Promise<Float32Array>>();

export function maskFor(key: object, src: Source, onStatus?: (s: AiStatus) => void): Promise<Float32Array> {
  let p = cache.get(key);
  if (!p) {
    p = (async () => {
      const r = await getRunner(onStatus);
      const input = preprocess(src);
      const job = queue.then(() => r.run(input, AI_MODEL.size));   // sessions run one at a time
      queue = job.catch(() => undefined);
      return cleanMask(normalizeMask(await job));
    })();
    cache.set(key, p);
    p.catch(() => cache.delete(key));
  }
  return p;
}
