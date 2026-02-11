
const CACHE_NAME = "earn-paisa-v1";
const ASSETS = [
  "/earn-paisa/",
  "/earn-paisa/index.html",
  "/earn-paisa/login.html",
  "/earn-paisa/manifest.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
