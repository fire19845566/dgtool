import {
  loadImage, renderWatermarked, watermarkImage,
  type MarkImage, type WatermarkOptions,
} from './converter';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// Localized strings are passed in by the page as JSON (see Watermarker.astro).
const T = JSON.parse($('watermarker').dataset.i18n || '{}') as Record<string, string>;
const f = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => (k in v ? String(v[k]) : `{${k}}`));

const input = $<HTMLInputElement>('file');
const drop = $('drop');
const list = $('list');
const bar = $('bar');
const previewWrap = $('previewWrap');
const preview = $<HTMLCanvasElement>('preview');
const wtype = $<HTMLSelectElement>('wtype');
const layoutSel = $<HTMLSelectElement>('layout');
const textBox = $('textBox');
const imageBox = $('imageBox');
const wtext = $<HTMLTextAreaElement>('wtext');
const fsize = $<HTMLInputElement>('fsize');
const wcolor = $<HTMLInputElement>('wcolor');
const bold = $<HTMLInputElement>('bold');
const outline = $<HTMLInputElement>('outline');
const markFile = $<HTMLInputElement>('markFile');
const markName = $('markName');
const iscale = $<HTMLInputElement>('iscale');
const opacity = $<HTMLInputElement>('opacity');
const rot = $<HTMLInputElement>('rot');
const posBox = $('posBox');
const gapBox = $('gapBox');
const gap = $<HTMLInputElement>('gap');
const fmtSel = $<HTMLSelectElement>('fmt');
const q = $<HTMLInputElement>('q');

type Item = { file: File; li: HTMLLIElement; ok: boolean; url?: string; name?: string };
const items: Item[] = [];
let mark: MarkImage | null = null;
let previewImg: Awaited<ReturnType<typeof loadImage>> | null = null;
let running = false;
let again = false;
let runTimer = 0;
let previewTimer = 0;

const SUPPORTED = /\.(jpe?g|png|webp)$/i;
const TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const fmt = (n: number) =>
  n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

function options(): WatermarkOptions {
  const pos = (document.querySelector('input[name="pos"]:checked') as HTMLInputElement | null)?.value || 'br';
  return {
    type: wtype.value as 'text' | 'image',
    text: wtext.value,
    fontPct: Number(fsize.value),
    color: wcolor.value,
    bold: bold.checked,
    outline: outline.checked,
    opacity: Number(opacity.value) / 100,
    rotation: Number(rot.value),
    layout: layoutSel.value as 'single' | 'tile',
    position: pos,
    gap: Number(gap.value),
    imageScale: Number(iscale.value),
    format: fmtSel.value as WatermarkOptions['format'],
    quality: Number(q.value) / 100,
  };
}

function drawPreview() {
  if (!previewImg) { previewWrap.hidden = true; return; }
  const c = renderWatermarked(previewImg, options(), mark, 960);
  preview.width = c.width;
  preview.height = c.height;
  preview.getContext('2d')!.drawImage(c, 0, 0);
  previewWrap.hidden = false;
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
    } else if (!previewImg) {
      loadImage(file).then((img) => { previewImg = img; drawPreview(); }).catch(() => { /* the list shows the error */ });
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
    const r = await watermarkImage(it.file, options(), mark);
    if (it.url) URL.revokeObjectURL(it.url);
    it.url = URL.createObjectURL(r.blob);
    const base = it.file.name.replace(/\.[^.]+$/, '');
    it.name = `${base}-watermark.${r.ext}`;

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
    console.error('Watermark failed:', err);
    meta.className = 'meta err';
    meta.textContent = T.failed;
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
  textBox.hidden = wtype.value !== 'text';
  imageBox.hidden = wtype.value !== 'image';
  posBox.hidden = layoutSel.value !== 'single';
  gapBox.hidden = layoutSel.value !== 'tile';
}

// Show the value next to each slider.
const readouts: [HTMLInputElement, string, string][] = [
  [fsize, 'fsizev', '%'], [iscale, 'iscalev', '%'], [opacity, 'opacityv', '%'],
  [rot, 'rotv', '°'], [gap, 'gapv', '%'], [q, 'qv', '%'],
];
readouts.forEach(([el, id, unit]) => {
  el.addEventListener('input', () => { $(id).textContent = el.value + unit; });
});

[wtext, fsize, wcolor, bold, outline, iscale, opacity, rot, gap, q].forEach((el) => el.addEventListener('input', changed));
[bold, outline, fmtSel].forEach((el) => el.addEventListener('change', changed));
document.querySelectorAll('input[name="pos"]').forEach((el) => el.addEventListener('change', changed));
wtype.addEventListener('change', () => { syncUi(); changed(); });
layoutSel.addEventListener('change', () => {
  // A repeated pattern looks best when tilted a little; go back when the user returns to a single mark.
  if (layoutSel.value === 'tile' && Number(rot.value) === 0) { rot.value = '-30'; $('rotv').textContent = '-30°'; }
  else if (layoutSel.value === 'single' && Number(rot.value) === -30) { rot.value = '0'; $('rotv').textContent = '0°'; }
  syncUi();
  changed();
});

markFile.addEventListener('change', async () => {
  const file = markFile.files?.[0];
  if (!file) return;
  try {
    const img = await loadImage(file);
    mark?.done();
    mark = img;
    markName.textContent = file.name;
    markName.className = 'meta ok';
  } catch {
    markName.textContent = T.failed;
    markName.className = 'meta err';
  }
  changed();
});

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
  previewImg?.done(); previewImg = null; previewWrap.hidden = true;
});

syncUi();
