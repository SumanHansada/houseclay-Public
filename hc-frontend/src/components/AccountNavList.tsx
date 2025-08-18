"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AccountNavItem } from "@/common/constants";
import ChevronRightIconSvg from "public/icons/chevron-right.svg";
import { useAppLogout } from "@/hooks/useAppLogout";

const ChevronRightIcon = ChevronRightIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

export interface AccountNavProps {
  items: AccountNavItem[];
  listClassName?: string;
  itemClassName?: string;
  onItemClick?: () => void;
}

export function AccountNavList({
  items,
  onItemClick,
  listClassName = "bg-gray-50 rounded-lg px-2 py-1",
  itemClassName = "gap-2 px-1 py-2 cursor-pointer",
}: AccountNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAppLogout();

  const handleItemClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: AccountNavItem,
  ) => {
    if (!item.actionId) {
      if (onItemClick) onItemClick();
      return;
    }
    e.preventDefault();

    switch (item.actionId) {
      case "LOGOUT":
        await logout();
        break;
    }
    if (onItemClick) {
      onItemClick();
    }
    router.push(item.href);
  };

  return (
    <nav aria-label="Manage account">
      <ul className={`w-full h-full ${listClassName}`}>
        {items.map((item) => {
          const isActive = item.href !== "/" && pathname.startsWith(item.href);
          const { label, NavIcon, href } = item;

          return (
            <li key={label}>
              <Link
                href={href}
                onClick={(e) => handleItemClick(e, item)}
                className={`group flex items-center ${itemClassName}`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Icon */}
                <NavIcon
                  width={36}
                  height={36}
                  className={isActive ? "text-red-500" : ""}
                />

                {/* Label and Chevron */}
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
                  <ChevronRightIcon
                    width={10}
                    height={20}
                    className={isActive ? "text-red-500" : ""}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
