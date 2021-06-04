const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/dist/app.bundle.js',
  '/dist/manifest.webmanifest',
  '/dist/assets/icons/icon_96x96.png',
  '/dist/assets/icons/icon_128x128.png',
  '/dist/assets/icons/icon_192x192.png',
  '/dist/assets/icons/icon_256x256.png',
  '/dist/assets/icons/icon_384x384.png',
  '/dist/assets/icons/icon_512x512.png',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
];

const STATIC_CACHE = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", event => {
  const currentCaches = [STATIC_CACHE, DATA_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        // return array of cache names that are old to delete
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// fetch
self.addEventListener("fetch", function(evt) {
  // cache successful requests to the API
  if (evt.request.url.includes("/api/transaction")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  // if the request is not for the API, serve static assets using "offline-first" approach.
  // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
  evt.respondWith(
    caches.match(evt.request).then(function(response) {
      return response || fetch(evt.request);
    })
  );
});