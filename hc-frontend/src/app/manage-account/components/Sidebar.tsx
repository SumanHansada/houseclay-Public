"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AccountNavItem } from "@/common/constants";
import ChevronRightIcon from "public/icons/chevron-right.svg";
import ChevronRightIconActive from "public/icons/chevron-right-red.svg";
import { useAppLogout } from "@/hooks/useAppLogout";

export interface SidebarProps {
  items: AccountNavItem[];
  className?: string;
  listClassName?: string;
  itemClassName?: string;
}

export default function Sidebar({
  items,
  className = "",
  listClassName = "bg-gray-50 rounded-lg px-3 py-2",
  itemClassName = "",
}: SidebarProps) {
  const pathname = usePathname();
  const logout = useAppLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <aside className={className} data-testid="account-sidebar">
      <nav className={listClassName} aria-label="Manage account">
        {items.map((item) => {
          const isRoute = item.kind === "route";
          const isActive =
            isRoute &&
            (pathname === item.href ||
              (item.href !== "/manage-account" &&
                pathname.startsWith(item.href)));

          const ItemIcon =
            isActive && item.ActiveIcon ? item.ActiveIcon : item.Icon;
          const ChevronIcon = isActive
            ? ChevronRightIconActive
            : ChevronRightIcon;

          const row = (
            <>
              <ItemIcon />
              <div
                className={`flex justify-between items-center flex-1 border-b-2 py-2 transition-colors ${
                  isActive ? "border-red-200" : "group-hover:border-red-200"
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive ? "text-red-500" : "group-hover:text-red-500"
                  }`}
                >
                  {item.label}
                </span>
                <ChevronIcon />
              </div>
            </>
          );

          const base = `group flex items-center gap-2 px-1 py-2 text-lg ${itemClassName}`;

          if (isRoute) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={base}
                aria-current={isActive ? "page" : undefined}
              >
                {row}
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              className={`${base} w-full text-left`}
              onClick={handleLogout}
            >
              {row}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
