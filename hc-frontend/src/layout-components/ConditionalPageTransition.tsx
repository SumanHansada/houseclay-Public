"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import PageTransition, { TransitionType } from "./PageTransition";

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
  const shouldSkipTransition = skipTransitionPaths.some((path) =>
    pathname.startsWith(path),
  );

  return (
    <PageTransition
      transitionType={transitionType}
      backTransitionType={backTransitionType}
      disabled={shouldSkipTransition}
    >
      {children}
    </PageTransition>
  );
}
