"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type StickyNavbarVisibilityContextValue = {
  /** When true, bottom StickyNavbar stays off-screen (e.g. property map pin card open). */
  suppressed: boolean;
  setSuppressed: (value: boolean) => void;
};

const StickyNavbarVisibilityContext =
  createContext<StickyNavbarVisibilityContextValue | null>(null);

export function StickyNavbarVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [suppressed, setSuppressedState] = useState(false);
  const setSuppressed = useCallback((value: boolean) => {
    setSuppressedState(value);
  }, []);

  const value = useMemo(
    () => ({ suppressed, setSuppressed }),
    [suppressed, setSuppressed],
  );

  return (
    <StickyNavbarVisibilityContext.Provider value={value}>
      {children}
    </StickyNavbarVisibilityContext.Provider>
  );
}

export function useStickyNavbarVisibility(): StickyNavbarVisibilityContextValue {
  const ctx = useContext(StickyNavbarVisibilityContext);
  if (!ctx) {
    throw new Error(
      "useStickyNavbarVisibility must be used within StickyNavbarVisibilityProvider",
    );
  }
  return ctx;
}

/** Safe for layout components outside the provider (returns false). */
export function useStickyNavbarSuppressed(): boolean {
  const ctx = useContext(StickyNavbarVisibilityContext);
  return ctx?.suppressed ?? false;
}
