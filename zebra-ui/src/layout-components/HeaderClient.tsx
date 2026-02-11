"use client";

import { ChevronDown, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { houseclayIconURL } from "@/common/constants/cdnURLs";
import ActionMenu from "@/components/ActionMenu";
import { useAdminLogout } from "@/hooks/useAdminLogout";
import { RootState } from "@/store/store";
import RemoteSvg from "@/utility-components/RemoteSvg";

const actionOptions = [
  { id: "my-profile", label: "My Profile" },
  { id: "dashboard", label: "Dashboard" },
  { id: "logout", label: "Logout" },
];

const Header: React.FC = () => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.adminAuth,
  );
  const router = useRouter();
  const { logout: onLogout, isLoading: isLoggingOut } = useAdminLogout();

  const headerActions: Record<string, () => void> = {
    "my-profile": () => router.push("/admin/my-profile"),
    dashboard: () => router.push("/admin/dashboard"),
    logout: () => onLogout(),
  };

  return (
    <header className="flex fixed top-0 left-0 right-0 bg-white z-50 justify-between w-full items-center py-2 shadow-sm px-8 h-16">
      {/* Logo and App Name */}
      <Link
        href="/admin/dashboard"
        className="flex items-center justify-center gap-1 cursor-pointer"
      >
        <RemoteSvg src={houseclayIconURL} className="size-6" />
        <span className="text-red-600 text-lg font-nunito font-bold">
          ZEBRA | Houseclay
        </span>
      </Link>

      {isAuthenticated ? (
        <div className="relative mr-20">
          <ActionMenu
            options={actionOptions}
            onSelect={(option) => {
              const currentAction = headerActions[option.id];
              if (currentAction) {
                currentAction();
              }
            }}
          >
            <button
              data-testid="profile-menu-button"
              aria-label="profile menu"
              disabled={isLoggingOut}
              className="flex flex-row xl:gap-2 md:gap-1 gap-1 xl:px-3 lg:px-2 md:px-1 px-px py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-center"
            >
              <UserRound width={20} height={20} />
              <ChevronDown width={20} height={20} />
            </button>
          </ActionMenu>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
