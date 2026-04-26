"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { StickyNavItem } from "@/common/dataConstants/navbarList";
import { STICKY_NAV_ITEMS } from "@/common/dataConstants/navbarList";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useStickyNavbarSuppressed,
  useStickyNavbarVisibilityOptional,
} from "@/providers/StickyNavbarVisibilityProvider";

interface StickyNavbarProps {
  defaultActive?: string;
}

const StickyNavbar: React.FC<StickyNavbarProps> = ({
  defaultActive = "home",
}) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  /** Cleared on pathname change — keeps indicator aligned while Next.js URL catches up after a tap */
  const [pendingTabId, setPendingTabId] = useState<string | null>(null);
  const { openDialog } = useDialog();
  const suppressed = useStickyNavbarSuppressed();
  const stickyNavbarVisibility = useStickyNavbarVisibilityOptional();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    setPendingTabId(null);
    const match = STICKY_NAV_ITEMS.find(
      (n) => n.href && pathname && pathname === n.href.split("?")[0],
    );
    if (match) setActiveTab(match.id);
  }, [pathname]);

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const atBottom =
        window.innerHeight + currentY >=
        document.documentElement.scrollHeight - 10;
      const delta = currentY - lastScrollY.current;
      if (atBottom) {
        setVisible(true);
      } else if (delta > 10) {
        setVisible(false);
      } else if (delta < -5) {
        setVisible(true);
      }
      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setPendingTabId(id);
  };

  const pathMatchedItem = STICKY_NAV_ITEMS.find(
    (n) => n.href && pathname && pathname === n.href.split("?")[0],
  );

  const activeId = pendingTabId ?? pathMatchedItem?.id ?? activeTab;

  const isTabActive = (navItem: StickyNavItem) => navItem.id === activeId;

  const activeIndex = STICKY_NAV_ITEMS.findIndex((item) => isTabActive(item));

  const showNav = !suppressed && visible;

  useEffect(() => {
    stickyNavbarVisibility?.setIsVisible(showNav);
  }, [showNav, stickyNavbarVisibility]);

  // Tween on `left` avoids spring overshoot flicker; no layoutId/transform clash
  const indicatorTransition = reduceMotion
    ? { type: "tween" as const, duration: 0, ease: "linear" as const }
    : {
        type: "tween" as const,
        duration: 0.28,
        ease: [0.4, 0, 0.2, 1] as const,
      };

  return (
    <nav
      aria-hidden={suppressed}
      className={`fixed bottom-0 left-0 right-0 pb-safe-bottom bg-white border-t border-gray-200 shadow-md z-40 w-full md:hidden transition-transform duration-300 ease-in-out ${showNav ? "translate-y-0" : "translate-y-full"} ${suppressed ? "pointer-events-none" : ""}`}
    >
      <div className="relative grid grid-cols-5 place-items-center py-2">
        {/* Glow + underline: animate `left` only — layoutId + translate-x on same node breaks alignment (transform clash) */}
        {activeIndex >= 0 && (
          <motion.div
            className="pointer-events-none absolute bottom-0 z-0 h-[52px] w-16"
            initial={false}
            animate={{
              left: `calc(${(activeIndex + 0.5) * 20}% - 2rem)`,
            }}
            transition={indicatorTransition}
            aria-hidden
          >
            <span className="absolute bottom-1 left-1/2 h-12 w-14 -translate-x-1/2 bg-gradient-to-t from-red-500/25 to-transparent blur-sm" />
            <span className="absolute bottom-0 left-1/2 h-0.5 w-16 -translate-x-1/2 bg-red-500" />
          </motion.div>
        )}

        <ul className="contents">
          {STICKY_NAV_ITEMS.map((item) => {
            const isActive = isTabActive(item);

            const navContent = (
              <>
                <div
                  className={`relative z-10 flex items-center justify-center p-1 transition-colors duration-200 ease-out ${
                    isActive
                      ? "text-red-500 border-red-500 stroke-red-500 fill-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`relative z-10 text-xs transition-colors duration-200 ease-out ${
                    isActive ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </>
            );

            return (
              <li key={item.id} className="relative flex justify-center">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="relative flex w-16 flex-col items-center justify-center"
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {navContent}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="relative flex w-16 flex-col items-center justify-center"
                    onClick={() => {
                      handleNavClick(item.id);
                      if (item.actionId) {
                        openDialog(item.actionId);
                      }
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {navContent}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default StickyNavbar;
