"use client";

import { Heart, Search } from "lucide-react";
import CoinSvg from "public/icons/coin.svg";
import HouseClayHomeSvg from "public/icons/houseclay-home.svg";
import UserSvg from "public/icons/user.svg";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

type NavItem = {
  id: string;
  icon: React.ReactElement;
  label: string;
  href: string;
  badge?: number;
};

interface StickyNavbarProps {
  defaultActive?: string;
  onNavChange?: (id: string) => void;
}

const Coin = CoinSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const User = UserSvg as React.FC<React.SVGProps<SVGSVGElement>>;

const StickyNavbar: React.FC<StickyNavbarProps> = ({
  defaultActive = "home",
  onNavChange,
}) => {
  const hideStickyNavbar = useSelector(
    (state: RootState) => state.app.hideStickyNavBar,
  );
  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  const HouseClayHome = HouseClayHomeSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

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
      icon: <Coin width={25} height={25} />,
      label: "Connects",
      href: "/connects",
      badge: 2,
    },
    {
      id: "account",
      icon: <User width={25} height={25} />,
      label: "Account",
      href: "/account",
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (onNavChange) {
      onNavChange(id);
    }
  };

  if (hideStickyNavbar) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50 w-full md:hidden">
      <ul className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className="flex flex-col items-center justify-center relative"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              <div
                className={`p-1 flex justify-center items-center ${activeTab === item.id && item.id !== "connects" ? "text-red-500 border-red-500 stroke-red-500 fill-red-500" : "text-gray-500"}`}
              >
                {item.icon}
                {item.badge && (
                  <div
                    className="absolute -top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    aria-label={`${item.badge} new notifications`}
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
