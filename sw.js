/* KLIMA.AL — service worker (cache-first for static, network-first for HTML) */

const VERSION = 'klima-v2-2026-05-11';
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

  // Cache-first for static assets (CSS/JS/JSON/images)
  event.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      // Only cache successful basic responses
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then(cache => cache.put(req, copy));
      }
      return res;
    }))
  );
});
