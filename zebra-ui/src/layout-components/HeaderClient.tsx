"use client";

import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { houseclayIconURL } from "@/common/constants/cdnURLs";
import { ADMIN_ROLE_LABELS } from "@/interfaces/AdminAuth";
import { useSidebar } from "@/providers/SidebarContext";
import { RootState } from "@/store/store";
import Popover from "@/utility-components/Popover";
import RemoteSvg from "@/utility-components/RemoteSvg";

import { AdminHeaderMenu } from "./AdminHeaderMenu";

const Header: React.FC = () => {
  const { isAuthenticated, name, role } = useSelector(
    (state: RootState) => state.adminAuth,
  );
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <header className="flex fixed top-0 left-0 right-0 bg-white z-50 w-full items-center h-16 shadow-sm">
      {/* Sidebar zone — mirrors sidebar width + background */}
      <div
        className={`flex items-center h-full bg-gray-300 shrink-0 transition-[width,padding] duration-300 ease-in-out ${
          isCollapsed ? "w-16 justify-center" : "w-72 lg:w-80 px-4 gap-3"
        }`}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-400/30 transition-colors shrink-0"
          aria-label="Toggle sidebar"
          data-testid="sidebar-toggle"
        >
          {isCollapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
        {!isCollapsed && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 cursor-pointer overflow-hidden"
          >
            <RemoteSvg src={houseclayIconURL} className="size-6 shrink-0" />
            <span className="text-red-600 text-lg font-nunito font-bold whitespace-nowrap">
              ZEBRA | Houseclay
            </span>
          </Link>
        )}
      </div>

      {/* Header content */}
      <div className="flex-1 flex items-center justify-between px-8">
        {isCollapsed ? (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 cursor-pointer"
          >
            <RemoteSvg src={houseclayIconURL} className="size-6 shrink-0" />
            <span className="text-red-600 text-lg font-nunito font-bold whitespace-nowrap">
              ZEBRA | Houseclay
            </span>
          </Link>
        ) : (
          <div />
        )}
        {isAuthenticated && (
          <Popover
            id="admin-header-menu"
            trigger="click"
            align="end"
            content={({ close }) => <AdminHeaderMenu close={close} />}
          >
            <button
              data-testid="profile-menu-button"
              aria-label="profile menu"
              className="flex items-center gap-2 px-3 py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <UserRound size={18} className="text-gray-600 shrink-0" />
              {(name || role) && (
                <span className="text-sm font-medium text-gray-700 w-fit max-w-64 truncate">
                  {name ?? "Admin"}
                  {role && (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      | {ADMIN_ROLE_LABELS[role]}
                    </span>
                  )}
                </span>
              )}
              <ChevronDown size={16} className="text-gray-500 shrink-0" />
            </button>
          </Popover>
        )}
      </div>
    </header>
  );
};

export default Header;
