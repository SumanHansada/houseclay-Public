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
  /** Whether StickyNavbar is currently on-screen. */
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
};

const StickyNavbarVisibilityContext =
  createContext<StickyNavbarVisibilityContextValue | null>(null);

export function StickyNavbarVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [suppressed, setSuppressedState] = useState(false);
  const [isVisible, setIsVisibleState] = useState(true);
  const setSuppressed = useCallback((value: boolean) => {
    setSuppressedState(value);
  }, []);
  const setIsVisible = useCallback((value: boolean) => {
    setIsVisibleState(value);
  }, []);

  const value = useMemo(
    () => ({ suppressed, setSuppressed, isVisible, setIsVisible }),
    [suppressed, setSuppressed, isVisible, setIsVisible],
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

/** Safe optional access for components that may render outside provider. */
export function useStickyNavbarVisibilityOptional(): StickyNavbarVisibilityContextValue | null {
  return useContext(StickyNavbarVisibilityContext);
}
