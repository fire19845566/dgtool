import { resizeImage, type ResizeOptions } from './converter';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// Localized strings are passed in by the page as JSON (see Resizer.astro).
const T = JSON.parse($('resizer').dataset.i18n || '{}') as Record<string, string>;
const f = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => (k in v ? String(v[k]) : `{${k}}`));

const input = $<HTMLInputElement>('file');
const drop = $('drop');
const list = $('list');
const bar = $('bar');
const modeSel = $<HTMLSelectElement>('mode');
const percentBox = $('percentBox');
const pixelBox = $('pixelBox');
const pct = $<HTMLInputElement>('pct');
const wIn = $<HTMLInputElement>('w');
const hIn = $<HTMLInputElement>('h');
const ratio = $<HTMLInputElement>('ratio');
const fmtSel = $<HTMLSelectElement>('fmt');
const q = $<HTMLInputElement>('q');
const qv = $('qv');

type Item = { file: File; li: HTMLLIElement; ok: boolean; url?: string; name?: string };
const items: Item[] = [];
let running = false;
let again = false;
let timer = 0;

const SUPPORTED = /\.(jpe?g|png|webp)$/i;
const TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const fmt = (n: number) =>
  n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
const num = (el: HTMLInputElement) => {
  const v = Math.round(Number(el.value));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

function options(): ResizeOptions {
  return {
    mode: modeSel.value as 'percent' | 'pixels',
    percent: num(pct) || 100,
    width: num(wIn),
    height: num(hIn),
    keepRatio: ratio.checked,
    format: fmtSel.value as ResizeOptions['format'],
    quality: Number(q.value) / 100,
  };
}

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
  meta.textContent = T.resizing;
  if (!it.li.querySelector('.prog')) {
    const p = document.createElement('div');
    p.className = 'prog';
    p.innerHTML = '<i></i>';
    it.li.querySelector('.info')!.appendChild(p);
  }
  try {
    const r = await resizeImage(it.file, options());
    if (it.url) URL.revokeObjectURL(it.url);
    it.url = URL.createObjectURL(r.blob);
    const base = it.file.name.replace(/\.[^.]+$/, '');
    it.name = `${base}-${r.to.w}x${r.to.h}.${r.ext}`;

    const old = it.li.querySelector('.thumb') as HTMLElement;
    if (old instanceof HTMLImageElement) {
      old.src = it.url;
    } else {
      const th = document.createElement('img');
      th.className = 'thumb'; th.src = it.url; th.alt = '';
      old.replaceWith(th);
    }

    meta.className = 'meta ok';
    meta.textContent = f(T.done, {
      fw: r.from.w, fh: r.from.h, tw: r.to.w, th: r.to.h,
      before: fmt(it.file.size), after: fmt(r.blob.size),
    });
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
    console.error('Resize failed:', err);
    meta.className = 'meta err';
    meta.textContent = T.failed;
  } finally {
    it.li.querySelector('.prog')?.remove();
  }
}

function scheduleRerun() {
  clearTimeout(timer);
  timer = window.setTimeout(() => { if (items.length) kick(); }, 300);
}

function syncMode() {
  const pixels = modeSel.value === 'pixels';
  percentBox.hidden = pixels;
  pixelBox.hidden = !pixels;
}

modeSel.addEventListener('change', () => { syncMode(); scheduleRerun(); });
[pct, wIn, hIn].forEach((el) => el.addEventListener('input', scheduleRerun));
ratio.addEventListener('change', scheduleRerun);
fmtSel.addEventListener('change', scheduleRerun);
q.addEventListener('input', () => { qv.textContent = q.value + '%'; scheduleRerun(); });
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
});

syncMode();
