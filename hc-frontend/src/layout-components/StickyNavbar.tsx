"use client";

import { Heart, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { CDN_BASE_URL, EXPLORE_LOCATION } from "@/common/constants";
import { RootState } from "@/store/store";
import { RemoteSvg, SvgIcon } from "@/utility-components";

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

const houseClayHomeSvg = CDN_BASE_URL + "/public/icons/houseclay-home.svg";

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
      icon: <RemoteSvg src={houseClayHomeSvg} className="w-5 h-5" />,
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 pb-safe-bottom bg-white border-t  border-gray-200 shadow-md z-49 w-full md:hidden ">
      <ul className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive =
            (pathname && pathname === item.href) ||
            (!pathname && activeTab === item.id);

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center relative"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`p-1 flex relative justify-center items-center ${
                    isActive && item.id !== "connects"
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
