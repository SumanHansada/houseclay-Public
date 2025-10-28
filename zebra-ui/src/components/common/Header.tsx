"use client";

import { ChevronDown, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HouseClaySvg from "public/icons/houseclay.svg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  initializeToken,
  logout as logoutAction,
} from "@/store/adminAuthSlice";
import { useLogoutMutation } from "@/store/apiSlice";
import { RootState } from "@/store/store";

import ActionMenu from "../ActionMenu";

const HouseClay = HouseClaySvg as React.FC<React.SVGProps<SVGSVGElement>>;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { token } = useSelector((state: RootState) => state.admin);
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    dispatch(initializeToken());
  }, [dispatch]);

  const onLogout = async () => {
    try {
      const logoutResponse = await logoutApi().unwrap();
      console.log(logoutResponse.message);
      dispatch(logoutAction());
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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

      {token ? (
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
              className="flex flex-row xl:gap-2 md:gap-1 gap-1 xl:px-3 lg:px-2 md:px-1 px-px py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-center"
            >
              <UserRound width={20} height={20} />
              <ChevronDown width={20} height={20} />
            </button>
          </ActionMenu>
        </div>
      ) : (
        <></>
      )}
    </header>
  );
};

export default Header;
