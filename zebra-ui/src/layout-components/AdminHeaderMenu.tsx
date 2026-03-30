"use client";

import {
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { useAdminLogout } from "@/hooks/useAdminLogout";
import { ADMIN_ROLE_LABELS } from "@/interfaces/AdminAuth";
import { RootState } from "@/store/store";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

// ── Add / remove items here ──────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
];
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  close: () => void;
}

export const AdminHeaderMenu = ({ close }: Props) => {
  const pathname = usePathname();
  const { logout, isLoading: isLoggingOut } = useAdminLogout();
  const { name, username, role } = useSelector(
    (state: RootState) => state.adminAuth,
  );

  return (
    <div className="w-56 py-2 px-2 flex flex-col gap-1">
      {/* Identity — clickable → My Profile */}
      <Link
        href="/admin/my-profile"
        onClick={close}
        className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
      >
        <UserRound size={20} className="text-gray-500 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {name ?? "Admin"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {role ? ADMIN_ROLE_LABELS[role] : ""}
          </p>
          {username && (
            <p className="text-xs text-gray-400 truncate">{username}</p>
          )}
        </div>
      </Link>

      {/* Nav items */}
      {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={id}
            href={href}
            onClick={close}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-red-50 text-red-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon
              size={16}
              className={isActive ? "text-red-500" : "text-gray-500"}
            />
            {label}
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
            )}
          </Link>
        );
      })}

      <hr className="my-1 border-gray-100" />

      {/* Logout */}
      <button
        type="button"
        onClick={() => {
          close();
          logout();
        }}
        disabled={isLoggingOut}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full text-left"
      >
        <LogOut size={16} className="text-gray-500" />
        {isLoggingOut ? "Logging out…" : "Logout"}
      </button>
    </div>
  );
};
