// Source of /sw.js. A new VERSION on every build makes browsers install the new worker
// and drop the old caches.
export function swSource(version: string, langPrefixes: string[]): string {
  return `/* DGTool service worker */
const VERSION = ${JSON.stringify(version)};
const CACHE = 'dgtool-' + VERSION;
const CORE = ['/favicon.svg', '/logo-light.svg', '/logo-dark.svg', '/icons/icon-192.png'];
const LANG_RE = new RegExp('^(' + ${JSON.stringify(langPrefixes.map((p) => p.replace(/^\//, '')).join('|'))} + ')(?:/|$)');

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('dgtool-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

const withTimeout = (p, ms) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

// Pages: network first (always fresh when online), cached copy when offline or slow.
async function pageRequest(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await withTimeout(fetch(req), 4000);
    if (res.ok && !res.redirected) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    const m = LANG_RE.exec(new URL(req.url).pathname.slice(1));
    const home = await cache.match(m ? '/' + m[1] + '/' : '/');
    if (home) return home;
    return new Response(
      '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Offline</title><body style="font-family:system-ui;padding:2rem"><h1>Offline</h1><p>Open this page once while online and it will work offline too.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

// Hashed build files never change, so the cache is always right.
async function assetRequest(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

// Icons, logos and other small files: serve the cached copy, refresh it in the background.
async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const refresh = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || refresh;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // ads, fonts and other sites are left alone
  if (url.pathname === '/sw.js') return;
  if (req.mode === 'navigate') return e.respondWith(pageRequest(req));
  if (url.pathname.startsWith('/_astro/')) return e.respondWith(assetRequest(req));
  e.respondWith(staleWhileRevalidate(req));
});

// The page asks us to store its sibling pages (and the scripts they need) for offline use.
self.addEventListener('message', (e) => {
  const d = e.data;
  if (d && d.type === 'warm' && Array.isArray(d.urls)) e.waitUntil(warm(d.urls));
});

const ASSET_RE = /(?:href|src)="(\\/[^"#?]+\\.(?:js|css|svg|png|webp))"/g;
const IMPORT_RE = /["'\`]((?:\\.{1,2}\\/|\\/)[\\w.\\-\\/]+\\.js)["'\`]/g;

async function cacheAsset(cache, path, seen, depth) {
  if (seen.has(path)) return;
  seen.add(path);
  try {
    const res = await fetch(path);
    if (!res.ok) return;
    cache.put(path, res.clone());
    if (path.endsWith('.js') && depth < 4) {
      const js = await res.text();
      for (const m of js.matchAll(IMPORT_RE)) {
        await cacheAsset(cache, new URL(m[1], self.location.origin + path).pathname, seen, depth + 1);
      }
    }
  } catch (err) { /* offline or blocked: skip */ }
}

async function warm(urls) {
  const cache = await caches.open(CACHE);
  const seen = new Set();
  for (const u of urls) {
    try {
      const url = new URL(u, self.location.origin);
      if (url.origin !== self.location.origin) continue;
      const res = await fetch(url.pathname);
      if (!res.ok || res.redirected) continue;
      const html = await res.clone().text();
      await cache.put(url.pathname, res);
      for (const m of html.matchAll(ASSET_RE)) await cacheAsset(cache, m[1], seen, 0);
    } catch (err) { /* offline or blocked: skip */ }
  }
}
`;
}
