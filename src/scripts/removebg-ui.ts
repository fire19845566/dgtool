import { loadImage, cutOut, composeBg, removeBgFromFile, type RemoveBgOptions } from './converter';
import type { AiStatus } from './ai-bg';
import type { RGB } from './bgremove';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// Localized strings are passed in by the page as JSON (see BgRemover.astro).
const T = JSON.parse($('bgremover').dataset.i18n || '{}') as Record<string, string>;
const f = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => (k in v ? String(v[k]) : `{${k}}`));

const input = $<HTMLInputElement>('file');
const drop = $('drop');
const list = $('list');
const bar = $('bar');
const previewWrap = $('previewWrap');
const preview = $<HTMLCanvasElement>('preview');
const swatch = $('swatch');
const hex = $('hex');
const autoBtn = $('autoBtn');
const warn = $('warn');
const tol = $<HTMLInputElement>('tol');
const soft = $<HTMLInputElement>('soft');
const trim = $<HTMLInputElement>('trim');
const edges = $<HTMLInputElement>('edges');
const bgmode = $<HTMLSelectElement>('bgmode');
const fill = $<HTMLInputElement>('fill');
const fmtSel = $<HTMLSelectElement>('fmt');
const q = $<HTMLInputElement>('q');
const qualityBox = $('qualityBox');
const jpgHint = $('jpgHint');
const methodSel = $<HTMLSelectElement>('method');
const aiHint = $('aiHint');
const aiStatus = $('aiStatus');
const credit = $('credit');

type Item = { file: File; li: HTMLLIElement; ok: boolean; url?: string; name?: string };
const items: Item[] = [];
let manualColor: RGB | null = null;
let previewImg: Awaited<ReturnType<typeof loadImage>> | null = null;
let previewFile: File | null = null;
let previewSeq = 0;                                   // ignores previews that finish after a newer one started
let origCanvas: HTMLCanvasElement | null = null;      // the preview picture before removal, for picking colors
let previewLoading = false;
let running = false;
let again = false;
let runTimer = 0;
let previewTimer = 0;

const SUPPORTED = /\.(jpe?g|png|webp)$/i;
const TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const fmt = (n: number) =>
  n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

function options(): RemoveBgOptions {
  return {
    method: methodSel.value as 'color' | 'ai',
    color: [255, 255, 255],
    manualColor,
    tolerance: Number(tol.value),
    softness: Number(soft.value),
    trim: Number(trim.value),
    edgesOnly: edges.checked,
    background: bgmode.value as 'transparent' | 'color',
    fillColor: fill.value,
    format: fmtSel.value as 'png' | 'webp' | 'jpg',
    quality: Number(q.value) / 100,
  };
}

const toHex = (c: RGB) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');

const isAi = () => methodSel.value === 'ai';

function showStatus(s: AiStatus) {
  aiStatus.className = 'meta';
  aiStatus.textContent = s === 'downloading' ? T.aiLoading : T.aiStarting;
  aiStatus.hidden = false;
}
function clearStatus() { aiStatus.hidden = true; aiStatus.textContent = ''; }
function failAi() {
  aiStatus.className = 'meta err';
  aiStatus.textContent = T.aiFailed;
  aiStatus.hidden = false;
}

async function drawPreview() {
  if (!previewImg || !previewFile) { previewWrap.hidden = true; return; }
  const seq = ++previewSeq;
  const img = previewImg;
  const o = options();
  let res;
  try {
    res = await cutOut(img, previewFile, o, 900, showStatus);
  } catch (err) {
    console.error('AI preview failed:', err);
    if (seq === previewSeq) failAi();
    return;
  }
  if (seq !== previewSeq || img !== previewImg) return;   // a newer preview or a cleared page took over
  if (o.method === 'ai') clearStatus();
  const { canvas: cut, color, share } = res;
  const shown = composeBg(cut, o, false);              // shows the chosen color when "Solid color" is on
  preview.width = shown.width;
  preview.height = shown.height;
  preview.getContext('2d')!.drawImage(shown, 0, 0);
  // Keep the original at the same size so a click can read the background color.
  origCanvas = document.createElement('canvas');
  origCanvas.width = shown.width;
  origCanvas.height = shown.height;
  const oc = origCanvas.getContext('2d', { willReadFrequently: true })!;
  oc.drawImage(img.src, 0, 0, shown.width, shown.height);
  swatch.style.background = `rgb(${color[0]},${color[1]},${color[2]})`;
  hex.textContent = toHex(color);
  warn.hidden = !(o.method === 'color' && manualColor === null && share < 0.6);
  previewWrap.hidden = false;
}

preview.addEventListener('click', (ev) => {
  if (!origCanvas) return;
  const rect = preview.getBoundingClientRect();
  const x = Math.max(0, Math.min(preview.width - 1, Math.floor(((ev.clientX - rect.left) / rect.width) * preview.width)));
  const y = Math.max(0, Math.min(preview.height - 1, Math.floor(((ev.clientY - rect.top) / rect.height) * preview.height)));
  const d = origCanvas.getContext('2d', { willReadFrequently: true })!.getImageData(x, y, 1, 1).data;
  manualColor = [d[0], d[1], d[2]];
  changed();
});
autoBtn.addEventListener('click', () => { manualColor = null; changed(); });

function add(files: FileList | null) {
  if (!files) return;
  for (const file of Array.from(files)) {
    const li = document.createElement('li');
    li.innerHTML =
      '<div class="thumb"></div><div class="info"><div class="name"></div><div class="meta"></div><div class="prog"><i></i></div></div>';
    li.querySelector('.name')!.textContent = file.name;
    const meta = li.querySelector('.meta') as HTMLElement;
    meta.textContent = T.waiting;
    list.appendChild(li);
    const ok = TYPES.includes(file.type) || SUPPORTED.test(file.name);
    if (!ok) {
      meta.className = 'meta err';
      meta.textContent = T.unsupported;
      li.querySelector('.prog')?.remove();
    } else if (!previewImg && !previewLoading) {
      previewLoading = true;                      // only the first picture becomes the preview
      loadImage(file)
        .then((img) => { previewImg = img; previewFile = file; drawPreview(); })
        .catch(() => { /* the list shows the error */ })
        .finally(() => { previewLoading = false; });
    }
    items.push({ file, li, ok });
  }
  kick();
}

async function kick() {
  if (running) { again = true; return; }
  running = true;
  try {
    do {
      again = false;
      for (const it of items) {
        if (!it.ok) continue;
        await processItem(it);
        if (again) break;
      }
    } while (again);
  } finally {
    running = false;
    bar.hidden = !items.some((i) => i.url);
  }
}

async function processItem(it: Item) {
  const meta = it.li.querySelector('.meta') as HTMLElement;
  meta.className = 'meta';
  meta.textContent = T.working;
  if (!it.li.querySelector('.prog')) {
    const p = document.createElement('div');
    p.className = 'prog';
    p.innerHTML = '<i></i>';
    it.li.querySelector('.info')!.appendChild(p);
  }
  try {
    const r = await removeBgFromFile(it.file, options(), showStatus);
    if (isAi()) clearStatus();
    if (it.url) URL.revokeObjectURL(it.url);
    it.url = URL.createObjectURL(r.blob);
    const base = it.file.name.replace(/\.[^.]+$/, '');
    it.name = `${base}-no-bg.${r.ext}`;

    const old = it.li.querySelector('.thumb') as HTMLElement;
    if (old instanceof HTMLImageElement) {
      old.src = it.url;
    } else {
      const th = document.createElement('img');
      th.className = 'thumb'; th.src = it.url; th.alt = '';
      old.replaceWith(th);
    }

    meta.className = 'meta ok';
    meta.textContent = f(T.done, { w: r.w, h: r.h, before: fmt(it.file.size), after: fmt(r.blob.size) });
    if (!isAi() && manualColor === null && r.share < 0.6) { meta.className = 'meta'; meta.textContent += ' · ' + T.hintComplex; }
    if (r.limited) meta.textContent += ' · ' + T.noteLimited;
    if (r.noteKey === 'webpFallback') meta.textContent += ' · ' + T.noteWebp;

    let a = it.li.querySelector('a.btn') as HTMLAnchorElement | null;
    if (!a) {
      a = document.createElement('a');
      a.className = 'btn';
      a.textContent = T.download;
      it.li.appendChild(a);
    }
    a.href = it.url;
    a.download = it.name;
  } catch (err) {
    console.error('Background removal failed:', err);
    meta.className = 'meta err';
    meta.textContent = T.failed;
    if (isAi()) failAi();
  } finally {
    it.li.querySelector('.prog')?.remove();
  }
}

function changed() {
  clearTimeout(previewTimer);
  previewTimer = window.setTimeout(drawPreview, 60);
  clearTimeout(runTimer);
  runTimer = window.setTimeout(() => { if (items.length) kick(); }, 500);
}

function syncUi() {
  document.querySelectorAll<HTMLElement>('.color-only').forEach((el) => { el.hidden = isAi(); });
  aiHint.hidden = !isAi();
  credit.hidden = !isAi();
  if (!isAi()) clearStatus();
  fill.hidden = bgmode.value !== 'color';
  qualityBox.hidden = fmtSel.value === 'png';
  jpgHint.hidden = fmtSel.value !== 'jpg';
}

const readouts: [HTMLInputElement, string, string][] = [[tol, 'tolv', ''], [soft, 'softv', ''], [trim, 'trimv', ''], [q, 'qv', '%']];
readouts.forEach(([el, id, unit]) => el.addEventListener('input', () => { $(id).textContent = el.value + unit; }));

[tol, soft, trim, q, fill].forEach((el) => el.addEventListener('input', changed));
edges.addEventListener('change', changed);
bgmode.addEventListener('change', () => { syncUi(); changed(); });
fmtSel.addEventListener('change', () => { syncUi(); changed(); });
methodSel.addEventListener('change', () => { syncUi(); changed(); });

input.addEventListener('change', () => { add(input.files); input.value = ''; });
['dragenter', 'dragover'].forEach((e) =>
  drop.addEventListener(e, (ev) => { ev.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((e) =>
  drop.addEventListener(e, (ev) => { ev.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', (ev) => add((ev as DragEvent).dataTransfer?.files ?? null));

$('dlAll').addEventListener('click', () => {
  items.filter((i) => i.url).forEach((it, i) => setTimeout(() => {
    const a = document.createElement('a');
    a.href = it.url as string; a.download = it.name as string;
    document.body.appendChild(a); a.click(); a.remove();
  }, i * 350));
});

$('clear').addEventListener('click', () => {
  items.forEach((i) => i.url && URL.revokeObjectURL(i.url));
  items.length = 0; list.innerHTML = ''; bar.hidden = true;
  previewSeq++; previewImg?.done(); previewImg = null; previewFile = null; clearStatus(); origCanvas = null; previewWrap.hidden = true; manualColor = null;
});

syncUi();
