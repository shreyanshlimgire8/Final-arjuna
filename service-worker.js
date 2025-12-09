
const CACHE_NAME = 'arjuna-v1';
const OFFLINE_URL = 'index.html';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Put a clone in cache for future.
          try { cache.put(event.request, response.clone()); } catch(e) {}
          return response;
        });
      });
    }).catch(() => caches.match(OFFLINE_URL))
  );
});
