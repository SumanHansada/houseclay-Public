"use client";

import { Heart, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { EXPLORE_LOCATION } from "@/common/constants";
import { RootState } from "@/store/store";
import { SvgIcon } from "@/utility-components";

type NavItem = {
  id: string;
  icon: React.ReactElement;
  label: string;
  href: string;
  badge?: number;
};

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

  const navItems: NavItem[] = [
    {
      id: "explore",
      icon: <Search size={25} />,
      label: "Explore",
      href: `/property-search?lat=${EXPLORE_LOCATION.lat}&lon=${EXPLORE_LOCATION.lng}&propertyCategory=rent`,
    },
    {
      id: "shortlists",
      icon: <Heart size={25} />,
      label: "Shortlists",
      href: "/manage-account/shortlists",
    },
    {
      id: "home",
      icon: <SvgIcon iconSize="small" name="houseclay-home" size={25} />,
      label: "Home",
      href: "/",
    },
    {
      id: "connects",
      icon: <SvgIcon iconSize="medium" name="connects" size={25} />,
      label: "Connects",
      href: "/manage-account/connects",
      badge: connectBal,
    },
    {
      id: "account",
      icon: <UserRound width={25} height={25} />,
      label: "Account",
      href: "/manage-account/my-profile",
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
  };

  const activeIndex = navItems.findIndex((item) => {
    const isActive =
      (pathname && pathname === item.href.split("?")[0]) ||
      (!pathname && activeTab === item.id);
    return isActive;
  });

  console.log("active index", activeIndex);
  console.log("active tab", activeTab);
  return (
    <nav className="fixed bottom-0 left-0 right-0 pb-safe-bottom bg-white border-t  border-gray-200 shadow-md z-40 w-full md:hidden ">
      <ul className="relative grid grid-cols-5 place-items-center px-4 py-2 mx-auto">
        {/* 1. Glow (below) */}
        <span
          className="absolute bottom-0 h-12 w-16 blur bg-gradient-to-t from-red-500/25 to-transparent
             transition-transform duration-300 ease-out pointer-events-none z-0"
          style={{
            gridColumnStart: activeIndex + 1,
            gridColumnEnd: activeIndex + 2,
          }}
        />

        {/* 2. Underline (above glow) */}
        <span
          className="absolute bottom-0 h-0.5 w-16 bg-red-500
             transition-transform duration-300 ease-out pointer-events-none z-10"
          style={{
            gridColumnStart: activeIndex + 1,
            gridColumnEnd: activeIndex + 2,
          }}
        />

        {navItems.map((item) => {
          const isActive =
            (pathname && pathname === item.href.split("?")[0]) ||
            (!pathname && activeTab === item.id);

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
                  {item.badge != null && (
                    <div
                      className="absolute top-0 right-0 -mt-0.5 -mr-0.5 bg-red-500 text-white text-xxs rounded-full w-4 h-4 min-w-fit px-1 flex items-center justify-center"
                      aria-label={`${item.badge} connects`}
                    >
                      {item.badge}
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
