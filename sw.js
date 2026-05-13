/* KLIMA.AL — service worker
   HTML: network-first
   CSS / JS / JSON: stale-while-revalidate (fast paint + auto-refresh next load)
   Images: cache-first (immutable assets)
*/

const VERSION = 'klima-v4-2026-05-13';
const CORE = [
  '/',
  '/index.html',
  '/produkte.html',
  '/product.html',
  '/materiale.html',
  '/404.html',
  '/style.css',
  '/app.js',
  '/cart.js',
  '/product.js',
  '/search.js',
  '/catalog.json',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/hero-mitsubishi.jpg',
  '/hero-mitsubishi.webp',
  '/materiale-bg.jpg',
  '/materiale-bg.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Skip cross-origin (images from albaelettrica, fonts.googleapis, etc.) — let browser handle
  if (url.origin !== self.location.origin) return;

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // Network-first for HTML so the user always sees latest content
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('/404.html')))
    );
    return;
  }

  // Stale-while-revalidate for CSS / JS / JSON — fast paint, async refresh
  const isSWR = /\.(css|js|json)$/i.test(url.pathname);
  if (isSWR) {
    event.respondWith(
      caches.match(req).then(hit => {
        const fresh = fetch(req).then(res => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(VERSION).then(cache => cache.put(req, copy));
          }
          return res;
        }).catch(() => hit);
        return hit || fresh;
      })
    );
    return;
  }

  // Cache-first for everything else (images, fonts, icons)
  event.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then(cache => cache.put(req, copy));
      }
      return res;
    }))
  );
});
