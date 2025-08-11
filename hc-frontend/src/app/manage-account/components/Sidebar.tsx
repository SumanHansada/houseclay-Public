"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AccountNavItem } from "@/common/constants";
import ChevronRightIconSvg from "public/icons/chevron-right.svg";
import { useAppLogout } from "@/hooks/useAppLogout";

const ChevronIcon = ChevronRightIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

export interface SidebarProps {
  items: AccountNavItem[];
  className?: string;
  listClassName?: string;
  itemClassName?: string;
}

export function Sidebar({
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
          const { label, NavIcon } = item;
          const redirectTo = isRoute ? item.href : "/";

          const row = (
            <>
              <NavIcon width={40} className={isActive ? "text-red-500" : ""} />
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
                  {label}
                </span>
                <ChevronIcon
                  width={10}
                  height={20}
                  className={isActive ? "text-red-500" : ""}
                />
              </div>
            </>
          );

          const base = `group flex items-center gap-2 px-1 py-2 ${itemClassName}`;

          if (isRoute) {
            return (
              <Link
                key={label}
                href={redirectTo}
                className={base}
                aria-current={isActive ? "page" : undefined}
              >
                {row}
              </Link>
            );
          }

          return (
            <button
              key={label}
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
