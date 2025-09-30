"use client";

import { Heart, Search, UserRound } from "lucide-react";
import HouseClayHomeSvg from "public/icons/houseclay-home.svg";
import React, { useState } from "react";
import { useSelector } from "react-redux";

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
  const hideStickyNavbar = useSelector(
    (state: RootState) => state.app.hideStickyNavBar,
  );
  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  const HouseClayHome = HouseClayHomeSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const connectBal = useSelector(
    (state: RootState) => state.user.userDetail.connectBal,
  );

  const navItems: NavItem[] = [
    {
      id: "explore",
      icon: <Search size={25} />,
      label: "Explore",
      href: "/explore",
    },
    {
      id: "shortlists",
      icon: <Heart size={25} />,
      label: "Shortlists",
      href: "/shortlists",
    },
    {
      id: "home",
      icon: <HouseClayHome width={20} height={20} />,
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

  if (hideStickyNavbar) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 pb-safe-bottom bg-white border-t  border-gray-200 shadow-md z-50 w-full md:hidden ">
      <ul className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className="flex flex-col items-center justify-center relative"
              onClick={() => handleNavClick(item.id)}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              <div
                className={`p-1 flex relative justify-center items-center ${activeTab === item.id && item.id !== "connects" ? "text-red-500 border-red-500 stroke-red-500 fill-red-500" : "text-gray-500"}`}
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
                className={`text-xs ${activeTab === item.id ? "text-red-500" : "text-gray-500"}`}
              >
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default StickyNavbar;
