// Registers the service worker, stores the visitor's language for offline use, and
// handles the "Install app" button.
const root = document.getElementById('pwa');
const cfg = JSON.parse(root?.dataset.config || '{}') as { urls?: string[] };

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      const reg = await navigator.serviceWorker.ready;
      let done = false;
      try { done = sessionStorage.getItem('dgtool-warm') === '1'; } catch { /* storage blocked */ }
      if (!done && cfg.urls?.length) {
        const send = () => reg.active?.postMessage({ type: 'warm', urls: [location.pathname, ...cfg.urls!] });
        if ('requestIdleCallback' in window) (window as any).requestIdleCallback(send);
        else setTimeout(send, 2000);
        try { sessionStorage.setItem('dgtool-warm', '1'); } catch { /* storage blocked */ }
      }
    } catch (err) {
      console.warn('Service worker not available:', err);
    }
  });
}

const btn = document.getElementById('install') as HTMLButtonElement | null;
const dlg = document.getElementById('iosHelp') as HTMLDialogElement | null;
const standalone =
  window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

if (btn && !standalone) {
  let deferred: any = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();                    // keep the prompt for our own button
    deferred = e;
    btn.hidden = false;
  });
  window.addEventListener('appinstalled', () => { btn.hidden = true; deferred = null; });

  // iPhone and iPad have no install prompt: show the button and explain "Add to Home Screen".
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) btn.hidden = false;

  btn.addEventListener('click', async () => {
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice;
      deferred = null;
      btn.hidden = true;
    } else if (dlg && typeof dlg.showModal === 'function') {
      dlg.showModal();
    }
  });
}
