"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { StickyNavItem } from "@/common/dataConstants/navbar";
import { STICKY_NAV_ITEMS } from "@/common/dataConstants/navbar";
import { RootState } from "@/store/store";
interface StickyNavbarProps {
  defaultActive?: string;
}

const StickyNavbar: React.FC<StickyNavbarProps> = ({
  defaultActive = "home",
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  const connectBal = useSelector((state: RootState) =>
    isAuthenticated ? state.user.userDetail.connectBal : 0,
  );

  const handleNavClick = (id: string) => {
    setActiveTab(id);
  };

  const isTabActive = (navItem: StickyNavItem) => {
    return (
      (pathname && pathname === navItem.href.split("?")[0]) ||
      (!pathname && activeTab === navItem.id)
    );
  };

  const activeIndex = STICKY_NAV_ITEMS.findIndex((item) => {
    return isTabActive(item);
  });

  console.log("active index", activeIndex);
  console.log("active tab", activeTab);
  return (
    <nav className="fixed bottom-0 left-0 right-0 pb-safe-bottom bg-white border-t  border-gray-200 shadow-md z-40 w-full md:hidden ">
      <ul className="relative grid grid-cols-5 place-items-center py-2">
        {/* 1. Glow (below) */}
        {activeIndex >= 0 && (
          <span
            className="absolute bottom-1 h-12 w-16 blur bg-gradient-to-t from-red-500/25 to-transparent pointer-events-none z-0"
            style={{
              gridColumnStart: activeIndex + 1,
              gridColumnEnd: activeIndex + 2,
            }}
          />
        )}

        {/* 2. Underline (above glow) */}
        {activeIndex >= 0 && (
          <span
            className="absolute bottom-1 h-0.5 w-16 bg-red-500 pointer-events-none z-0"
            style={{
              gridColumnStart: activeIndex + 1,
              gridColumnEnd: activeIndex + 2,
            }}
          />
        )}

        {STICKY_NAV_ITEMS.map((item) => {
          const isActive = isTabActive(item);

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center relative w-16"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`p-1 flex relative justify-center items-center ${
                    isActive
                      ? "text-red-500 border-red-500 stroke-red-500 fill-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.icon}
                  {item.badge && (
                    <div
                      className="absolute top-0 right-0 -mt-0.5 -mr-0.5 bg-red-500 text-white text-xxs rounded-full w-4 h-4 min-w-fit px-1 flex items-center justify-center"
                      aria-label={`${connectBal || 0} connects`}
                    >
                      {connectBal || 0}
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    isActive ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default StickyNavbar;
