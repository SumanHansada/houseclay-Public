"use client";

import { ChevronDown, UserRound } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { houseclayIconURL } from "@/common/constants/cdnURLs";
import { ADMIN_ROLE_LABELS } from "@/interfaces/AdminAuth";
import { RootState } from "@/store/store";
import Popover from "@/utility-components/Popover";
import RemoteSvg from "@/utility-components/RemoteSvg";

import { AdminHeaderMenu } from "./AdminHeaderMenu";

const Header: React.FC = () => {
  const { isAuthenticated, name, role } = useSelector(
    (state: RootState) => state.adminAuth,
  );

  return (
    <header className="flex fixed top-0 left-0 right-0 bg-white z-50 justify-between w-full items-center py-2 shadow-sm px-8 h-16">
      <Link
        href="/admin/dashboard"
        className="flex items-center justify-center gap-1 cursor-pointer"
      >
        <RemoteSvg src={houseclayIconURL} className="size-6" />
        <span className="text-red-600 text-lg font-nunito font-bold">
          ZEBRA | Houseclay
        </span>
      </Link>

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
    </header>
  );
};

export default Header;
