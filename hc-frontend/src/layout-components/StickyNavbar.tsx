"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { StickyNavItem } from "@/common/dataConstants/navbarList";
import { STICKY_NAV_ITEMS } from "@/common/dataConstants/navbarList";
import { useDialog } from "@/providers/DialogContextProvider";
import { useStickyNavbarSuppressed } from "@/providers/StickyNavbarVisibilityProvider";
interface StickyNavbarProps {
  defaultActive?: string;
}

const StickyNavbar: React.FC<StickyNavbarProps> = ({
  defaultActive = "home",
}) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  const { openDialog } = useDialog();
  const suppressed = useStickyNavbarSuppressed();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

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
  };

  const isTabActive = (navItem: StickyNavItem) => {
    if (navItem.href) {
      return (
        (pathname && pathname === navItem.href.split("?")[0]) ||
        (!pathname && activeTab === navItem.id)
      );
    }
    return activeTab === navItem.id;
  };

  const activeIndex = STICKY_NAV_ITEMS.findIndex((item) => {
    return isTabActive(item);
  });

  const showNav = !suppressed && visible;

  return (
    <nav
      aria-hidden={suppressed}
      className={`fixed bottom-0 left-0 right-0 pb-safe-bottom bg-white border-t border-gray-200 shadow-md z-40 w-full md:hidden transition-transform duration-300 ease-in-out ${showNav ? "translate-y-0" : "translate-y-full"} ${suppressed ? "pointer-events-none" : ""}`}
    >
      <div className="relative grid grid-cols-5 place-items-center py-2">
        <ul className="contents">
          {STICKY_NAV_ITEMS.map((item) => {
            const isActive = isTabActive(item);

            const navContent = (
              <>
                <div
                  className={`p-1 flex relative justify-center items-center ${
                    isActive
                      ? "text-red-500 border-red-500 stroke-red-500 fill-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.icon}
                  {/* {item.badge && (
                    <div
                      className="absolute top-0 right-0 -mt-0.5 -mr-0.5 bg-red-500 text-white text-xxs rounded-full w-4 h-4 min-w-fit px-1 flex items-center justify-center"
                      aria-label={`${connectBal || 0} connects`}
                    >
                      {connectBal || 0}
                    </div>
                  )} */}
                </div>
                <span
                  className={`text-xs ${
                    isActive ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex flex-col items-center justify-center relative w-16"
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {navContent}
                  </Link>
                ) : (
                  <button
                    className="flex flex-col items-center justify-center relative w-16"
                    onClick={() => {
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
        {/* 1. Glow (below) */}
        {activeIndex >= 0 && (
          <span
            className="absolute bottom-1 h-12 w-14 blur-sm bg-gradient-to-t from-red-500/25 to-transparent pointer-events-none z-0"
            style={{
              gridColumnStart: activeIndex + 1,
              gridColumnEnd: activeIndex + 2,
            }}
          />
        )}

        {/* 2. Underline (above glow) */}
        {activeIndex >= 0 && (
          <span
            className="absolute bottom-0 h-0.5 w-16 bg-red-500 pointer-events-none z-0"
            style={{
              gridColumnStart: activeIndex + 1,
              gridColumnEnd: activeIndex + 2,
            }}
          />
        )}
      </div>
    </nav>
  );
};

export default StickyNavbar;
