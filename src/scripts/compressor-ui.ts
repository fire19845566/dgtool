import { compressImage, type OutFormat } from './converter';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// Localized strings are passed in by the page as JSON (see Compressor.astro).
const T = JSON.parse($('compressor').dataset.i18n || '{}') as Record<string, string>;
const f = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => (k in v ? String(v[k]) : `{${k}}`));
const input = $<HTMLInputElement>('file');
const drop = $('drop');
const list = $('list');
const bar = $('bar');
const summary = $('summary');
const q = $<HTMLInputElement>('q');
const qv = $('qv');
const sizeSel = $<HTMLSelectElement>('size');
const fmtSel = $<HTMLSelectElement>('fmt');

type Item = { file: File; li: HTMLLIElement; ok: boolean; url?: string; name?: string; outSize?: number };
const items: Item[] = [];
let running = false;
let again = false;
let timer = 0;

const SUPPORTED = /\.(jpe?g|png|webp)$/i;
const TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const fmt = (n: number) =>
  n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

function add(files: FileList | null) {
  if (!files) return;
  for (const file of Array.from(files)) {
    const li = document.createElement('li');
    li.innerHTML =
      '<div class="thumb"></div><div class="info"><div class="name"></div><div class="meta"></div><div class="prog"><i></i></div></div>';
    li.querySelector('.name')!.textContent = file.name;
    (li.querySelector('.meta') as HTMLElement).textContent = T.waiting;
    list.appendChild(li);
    const ok = TYPES.includes(file.type) || SUPPORTED.test(file.name);
    const item: Item = { file, li, ok };
    if (!ok) {
      const m = li.querySelector('.meta') as HTMLElement;
      m.className = 'meta err';
      m.textContent = T.unsupported;
      li.querySelector('.prog')?.remove();
    }
    items.push(item);
  }
  kick();
}

function options() {
  return {
    quality: Number(q.value) / 100,
    maxSide: Number(sizeSel.value),
    format: fmtSel.value as OutFormat,
  };
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
    updateSummary();
  }
}

async function processItem(it: Item) {
  const meta = it.li.querySelector('.meta') as HTMLElement;
  meta.className = 'meta';
  meta.textContent = T.compressing;
  if (!it.li.querySelector('.prog')) {
    const p = document.createElement('div');
    p.className = 'prog';
    p.innerHTML = '<i></i>';
    it.li.querySelector('.info')!.appendChild(p);
  }
  try {
    const r = await compressImage(it.file, options());
    if (it.url) URL.revokeObjectURL(it.url);
    it.url = URL.createObjectURL(r.blob);
    const base = it.file.name.replace(/\.[^.]+$/, '');
    it.name = r.kept ? it.file.name : `${base}-compressed.${r.ext}`;
    it.outSize = r.blob.size;

    const old = it.li.querySelector('.thumb') as HTMLElement;
    if (old instanceof HTMLImageElement) {
      old.src = it.url;
    } else {
      const th = document.createElement('img');
      th.className = 'thumb'; th.src = it.url; th.alt = '';
      old.replaceWith(th);
    }

    meta.className = 'meta ok';
    if (r.kept) {
      meta.textContent = f(T.kept, { size: fmt(it.file.size) });
    } else {
      const pct = Math.round((1 - r.blob.size / it.file.size) * 100);
      const sign = pct >= 0 ? '−' : '+';
      if (pct < 0) meta.className = 'meta';   // bigger than the original: do not style it as a success
      meta.textContent = f(T.done, { before: fmt(it.file.size), after: fmt(r.blob.size), sign, pct: Math.abs(pct) });
    }
    if (r.colors) meta.textContent += ' · ' + f(r.lossless ? T.detailLossless : T.detailColors, { n: r.colors });
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
    console.error('Compression failed:', err);
    it.outSize = undefined;
    meta.className = 'meta err';
    meta.textContent = T.failed;
  } finally {
    it.li.querySelector('.prog')?.remove();
  }
}

function updateSummary() {
  const done = items.filter((i) => i.url && i.outSize !== undefined);
  bar.hidden = done.length === 0;
  if (!done.length) { summary.hidden = true; return; }
  const before = done.reduce((s, i) => s + i.file.size, 0);
  const after = done.reduce((s, i) => s + (i.outSize as number), 0);
  const saved = before - after;
  summary.hidden = false;
  summary.textContent =
    saved > 0
      ? f(done.length > 1 ? T.summarySavedMany : T.summarySavedOne, { saved: fmt(saved), pct: Math.round((saved / before) * 100), n: done.length })
      : T.summaryNone;
}

function scheduleRerun() {
  clearTimeout(timer);
  timer = window.setTimeout(() => { if (items.length) kick(); }, 250);
}

q.addEventListener('input', () => { qv.textContent = q.value + '%'; scheduleRerun(); });
sizeSel.addEventListener('change', scheduleRerun);
fmtSel.addEventListener('change', scheduleRerun);
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
  items.length = 0; list.innerHTML = ''; bar.hidden = true; summary.hidden = true;
});
