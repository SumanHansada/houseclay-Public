"use client";

import { motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import React, {
  lazy,
  ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

const AnimatePresence = lazy(() =>
  import("framer-motion").then((m) => ({ default: m.AnimatePresence })),
);

export type TransitionType =
  | "fade"
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "scale"
  | "blur";

interface PageTransitionProps {
  children: ReactNode;
  transitionType?: TransitionType;
  backTransitionType?: TransitionType;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

// Transition variants for different animation types
const transitionVariants: Record<TransitionType, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  slideRight: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  slideUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  },
  slideDown: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(10px)" },
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionType = "fade",
  backTransitionType,
  duration = 0.3,
  className = "",
  disabled = false,
}) => {
  const pathname = usePathname();

  // Lazy load AnimatePresence - only needed for page transitions

  const [isBackNavigation, setIsBackNavigation] = useState(false);
  const historyRef = useRef<string[]>([]);

  useEffect(() => {
    const currentIndex = historyRef.current.indexOf(pathname);

    if (currentIndex === -1) {
      // New path, forward navigation
      historyRef.current.push(pathname);
      setIsBackNavigation(false);
    } else if (currentIndex < historyRef.current.length - 1) {
      // Path exists earlier in history, back navigation
      historyRef.current = historyRef.current.slice(0, currentIndex + 1);
      setIsBackNavigation(true);
    } else {
      // Same path or forward navigation
      setIsBackNavigation(false);
    }
  }, [pathname]);

  // Listen for browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      setIsBackNavigation(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // If disabled, render children without animation
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const activeTransitionType =
    isBackNavigation && backTransitionType
      ? backTransitionType
      : transitionType;
  const variants = transitionVariants[activeTransitionType];

  return (
    <Suspense fallback={children}>
      <AnimatePresence mode="wait">
        {" "}
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{
            duration,
            ease: [0.22, 1, 0.36, 1], // Custom easing for smooth transitions
          }}
          className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default PageTransition;
