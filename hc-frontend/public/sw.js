// Minimal Service Worker for PWA Install Prompt
// This service worker does NO caching - it only enables the beforeinstallprompt event

// Install event - do nothing, just satisfy the requirement
self.addEventListener("install", (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - take control of all pages immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
