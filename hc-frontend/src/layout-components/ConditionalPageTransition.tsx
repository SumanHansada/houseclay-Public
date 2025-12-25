"use client";

import { usePathname } from "next/navigation";
import { lazy, ReactNode, Suspense, useMemo } from "react";

import type { TransitionType } from "./PageTransition";

// Lazy load PageTransition
const PageTransition = lazy(() => import("./PageTransition"));

interface ConditionalPageTransitionProps {
  children: ReactNode;
  transitionType?: TransitionType;
  backTransitionType?: TransitionType;
  /**
   * Array of pathname patterns to skip transitions for.
   * Can be exact paths (e.g., "/about") or path prefixes (e.g., "/admin").
   * If a pathname starts with any of these patterns, transitions will be disabled.
   */
  skipTransitionPaths?: string[];
}

export default function ConditionalPageTransition({
  children,
  transitionType,
  backTransitionType,
  skipTransitionPaths = [],
}: ConditionalPageTransitionProps) {
  const pathname = usePathname();

  // Check if current pathname should skip transitions
  const shouldSkipTransition = useMemo(
    () => skipTransitionPaths.some((path) => pathname.startsWith(path)),
    [pathname, skipTransitionPaths],
  );

  // If transitions are disabled, render children directly
  if (shouldSkipTransition) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<div>{children}</div>}>
      <PageTransition
        transitionType={transitionType}
        backTransitionType={backTransitionType}
        disabled={shouldSkipTransition}
      >
        {children}
      </PageTransition>
    </Suspense>
  );
}
