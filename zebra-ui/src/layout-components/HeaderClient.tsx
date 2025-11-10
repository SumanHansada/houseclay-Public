"use client";

import { ChevronDown, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HouseClaySvg from "public/icons/houseclay.svg";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import ActionMenu from "@/components/ActionMenu";
import { useAdminLogout } from "@/hooks/useAdminLogout";
import { RootState } from "@/store/store";

const HouseClay = HouseClaySvg as React.FC<React.SVGProps<SVGSVGElement>>;

const Header: React.FC = () => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.adminAuth,
  );
  const router = useRouter();
  const { logout: onLogout, isLoading: isLoggingOut } = useAdminLogout();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  return (
    <header className="flex fixed top-0 left-0 right-0 bg-white z-50 justify-between w-full items-center py-2 shadow-sm px-8 h-16">
      {/* Logo and App Name */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-1">
          <HouseClay />
          <span className="text-red-600 text-lg font-nunito font-bold">
            ZEBRA | HouseClay
          </span>
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="relative mr-20">
          <ActionMenu
            options={[
              { id: 1, label: "Manage Account" },
              { id: 2, label: "Logout" },
            ]}
            onSelect={(option) => {
              if (option.id === 1) {
                console.log("Manage Account");
              } else {
                onLogout();
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
