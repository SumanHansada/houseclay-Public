// Service Worker for Houseclay PWA
const CACHE_NAME = "houseclay-v1";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fetch event - network-first for navigation, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external domains
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Network-first strategy for navigation requests (HTML pages)
  if (
    request.mode === "navigate" ||
    request.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails
          return caches.match(request);
        }),
    );
    return;
  }

  // Network-only strategy for static assets (JS, CSS, images, etc.)
  // Don't cache - always fetch fresh from network
  event.respondWith(fetch(request));
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
