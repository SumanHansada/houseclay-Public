"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { type AccountNavItem } from "@/common/dataConstants/navbar";
import { useLogout } from "@/hooks/useLogout";
interface BaseProps {
  items: AccountNavItem[];
  listClassName?: string;
  itemClassName?: string;
  onItemSelect?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: AccountNavItem,
  ) => void;
  iconSize?: number;
}

interface HeaderProps extends BaseProps {
  variant: "header";
  userName: string;
}

interface SidebarProps extends BaseProps {
  variant?: "sidebar";
}

interface MobileProps extends BaseProps {
  variant: "mobile";
}

export type AccountNavProps = HeaderProps | SidebarProps | MobileProps;

export function AccountNavList({
  items,
  onItemSelect,
  listClassName,
  itemClassName,
  iconSize = 32,
  variant = "sidebar",
  ...props
}: AccountNavProps) {
  const pathname = usePathname();
  const { logout } = useLogout();
  const router = useRouter();

  // Get userName for header variant
  const userName = variant === "header" ? (props as HeaderProps).userName : "";

  // Default classes based on variant
  const getDefaultClasses = () => {
    switch (variant) {
      case "header":
        return {
          list: "bg-white border border-gray-200 rounded-xl shadow-lg py-2 px-3 space-y-1",
          item: "gap-3 cursor-pointer rounded-md hover:bg-gray-50",
        };
      case "mobile":
        return {
          list: "bg-white w-full divide-y-2 divide-gray-200",
          item: "gap-3 py-2 cursor-pointer w-full flex items-center",
        };
      case "sidebar":
      default:
        return {
          list: "bg-gray-50 rounded-lg px-2 py-1",
          item: "gap-2 px-1 py-2 cursor-pointer",
        };
    }
  };

  const defaultClasses = getDefaultClasses();
  const finalListClassName = listClassName || defaultClasses.list;
  const finalItemClassName = itemClassName || defaultClasses.item;

  const handleItemClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: AccountNavItem,
  ) => {
    onItemSelect?.(e, item);

    if (item.actionId === "LOGOUT") {
      e.preventDefault();
      logout();
      router.replace("/");
    }
  };

  // Special rendering for header variant items
  const renderHeaderItem = (item: AccountNavItem, isActive: boolean) => {
    const { label, NavIcon } = item;

    if (label === "Logout") {
      return (
        <div className="w-full flex items-center text-gray-700 py-2 px-4 gap-3">
          <NavIcon
            width={iconSize}
            height={iconSize}
            className="text-gray-700"
          />
          <span className="font-medium">Logout</span>
        </div>
      );
    }

    if (label === "My Profile") {
      return (
        <div className="flex items-center gap-3 bg-gray-100 w-full rounded-xl py-2 px-4">
          <NavIcon
            width={iconSize}
            height={iconSize}
            className="text-gray-700"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900">{userName}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      );
    }

    // Default header item rendering
    return (
      <div className="flex items-center gap-3 w-full py-2 px-4">
        <NavIcon
          width={iconSize}
          height={iconSize}
          className={isActive ? "text-red-500" : "text-gray-700"}
        />
        <span
          className={`flex justify-between items-center flex-1 border-b-2 py-2 ${isActive ? "text-red-500 border-red-200" : "text-gray-700"}`}
        >
          {label}
          <ChevronRight
            size={20}
            className={isActive ? "text-red-500" : "text-gray-400"}
          />
        </span>
      </div>
    );
  };

  // Default rendering for sidebar and mobile
  const renderDefaultItem = (item: AccountNavItem, isActive: boolean) => {
    const { label, NavIcon } = item;

    return (
      <div className="flex justify-between items-center w-full">
        {/* Icon */}
        <NavIcon
          width={iconSize}
          height={iconSize}
          className={isActive ? "text-red-500" : ""}
        />

        <div
          className={`flex-1 flex justify-between items-center ml-2 lg:ml-3 transition-colors ${
            variant === "mobile"
              ? ""
              : `border-b-2 py-2 ${
                  isActive ? "border-red-200" : "group-hover:border-red-200"
                }`
          }`}
        >
          <span
            className={`transition-colors ${
              isActive ? "text-red-500" : "group-hover:text-red-500"
            }`}
          >
            {label}
          </span>

          {/* Show chevron only for sidebar */}
          {/* {variant === "sidebar" && ( */}
          <ChevronRight
            size={20}
            className={`shrink-0 ${isActive ? "text-red-500" : "text-gray-400"}`}
          />
          {/* )} */}
        </div>
      </div>
    );
  };

  return (
    <nav aria-label="Manage account">
      <ul className={`w-full h-full ${finalListClassName}`}>
        {items.map((item) => {
          const isActive = item.href !== "/" && pathname.startsWith(item.href);
          const { label, href } = item;

          return (
            <li key={label}>
              <Link
                href={href}
                onClick={(e) => handleItemClick(e, item)}
                className={`group flex items-center ${finalItemClassName}`}
                aria-current={isActive ? "page" : undefined}
              >
                {variant === "header"
                  ? renderHeaderItem(item, isActive)
                  : renderDefaultItem(item, isActive)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
