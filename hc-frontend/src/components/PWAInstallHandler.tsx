"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";

/**
 * Component that keeps the PWA install hook active.
 * This ensures the beforeinstallprompt event is captured.
 * Add this component high in your component tree (e.g., in Providers or Layout).
 */
export function PWAInstallHandler() {
  // Just call the hook to keep it active - the hook sets up event listeners
  usePWAInstall();
  return null;
}
