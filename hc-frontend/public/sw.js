// Minimal Service Worker for PWA Install Prompt
// This service worker does NO caching - it only enables the beforeinstallprompt event

// Install event - do nothing, just satisfy the requirement
self.addEventListener("install", (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - do nothing
self.addEventListener("activate", (event) => {
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

// Fetch event - always go to network, never cache
self.addEventListener("fetch", (event) => {
  // Just pass through to network - no caching at all
  event.respondWith(fetch(event.request));
});
