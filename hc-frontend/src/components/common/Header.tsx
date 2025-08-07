"use client";

// import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { ChevronDown, Menu, User, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import CoinSvg from "public/icons/coin.svg";
import HouseClaySvg from "public/icons/houseclay.svg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useDialog } from "@/providers/DialogContextProvider";
import { useLogoutMutation } from "@/store/apiSlice";
import { clearToken, initializeToken } from "@/store/authSlice";

import { RootState } from "../../store/store";
import ActionMenu from "../ActionMenu";

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
}

const HouseClay = HouseClaySvg as React.FC<React.SVGProps<SVGSVGElement>>;
const Coin = CoinSvg as React.FC<React.SVGProps<SVGSVGElement>>;

const Header: React.FC<HeaderProps> = () => {
  const hideHeader = useSelector((state: RootState) => state.app.hideHeader);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const { openDialog, closeAllDialogs } = useDialog();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bengaluruLocation = { lat: 12.9716, lng: 77.5946 };

  const onLogin = () => {
    closeAllDialogs();
    openDialog("login-dialog");
  };

  const onMenuClick = () => {
    closeAllDialogs();
    openDialog("menu-dialog");
  };

  useEffect(() => {
    dispatch(initializeToken());
  }, [dispatch]);

  const onLogout = async () => {
    try {
      const logoutResponse = await logout();
      console.log(logoutResponse);
      dispatch(clearToken());
    } catch (err) {
      console.error(err);
    }
  };

  if (hideHeader) {
    return null;
  }

  return (
    <>
      <header className="flex fixed top-0 left-0 right-0 bg-white z-50 justify-between w-full items-center py-2 shadow-sm xl:gap-32 lg:gap-16 md:gap-8 gap-8 xl:px-24 md:px-12 px-12 max-md:hidden mx-auto">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-1">
            <HouseClay />
            <span className="text-red-600 text-lg font-nunito font-bold">
              HouseClay
            </span>
          </Link>
        </div>

        {/* Center - Navigation */}
        <div className="flex justify-between items-center w-full text-sm">
          <nav className="hidden md:flex xl:gap-12 lg:gap-6 md:gap-3 gap-3 text-gray-800">
            <Link
              href={`/property-search?lat=${bengaluruLocation.lat}&lon=${bengaluruLocation.lng}&propertyCategory=rent`}
              data-category="rent"
              data-active={
                searchParams.get("propertyCategory") === "rent" ||
                (pathname === "/property-search" &&
                  !searchParams.get("propertyCategory"))
                  ? "true"
                  : "false"
              }
              className="relative hover:text-red-500 py-2 nav-link"
            >
              Rent
            </Link>
            <Link
              href={`/property-search?lat=${bengaluruLocation.lat}&lon=${bengaluruLocation.lng}&propertyCategory=resale`}
              data-category="resale"
              data-active={
                searchParams.get("propertyCategory") === "resale"
                  ? "true"
                  : "false"
              }
              className="relative hover:text-red-500 py-2 nav-link"
            >
              Buy
            </Link>
            <Link href="#" className="hover:text-red-500 py-2">
              Buy Connects
            </Link>
            <Link href="#" className="hover:text-red-500 py-2">
              About Us
            </Link>
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center xl:gap-6 lg:gap-3 md:gap-2 gap-2">
            {/* List Property Button */}
            <Link
              href="/list-property"
              className="relative border border-red-500 text-red-500 xl:px-6 lg:px-5 md:px-3 px-3 py-2 rounded-xl hover:bg-red-50"
            >
              List Your Property
              <span className="absolute bottom-0 right-0 -mb-2 -mr-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md">
                FREE
              </span>
            </Link>

            {/* Coin Counter */}
            <button className="flex items-center xl:px-4 lg:px-3 md:px-2 px-2 py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100">
              <Coin height={20} width={20} />
              <span>0</span>
            </button>

            {/* Login Button */}
            {token ? (
              <div className="relative">
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
                  <button className="flex flex-row xl:gap-2 md:gap-1 gap-1 xl:px-6 lg:px-5 md:px-3 px-3 py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-center">
                    <UserRound width={20} height={20} />
                    <ChevronDown width={20} height={20} />
                  </button>
                </ActionMenu>
              </div>
            ) : (
              <button
                className="xl:px-8 lg:px-6 md:px-4 px-4  py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-center"
                onClick={onLogin}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 flex justify-between w-full px-4 py-2 shadow-sm md:hidden">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-2">
          <Menu role="button" onClick={onMenuClick} />
          <Link href="/" className="flex items-center gap-1">
            <HouseClay />
            <span className="text-red-600 text-lg font-nunito font-bold">
              HouseClay
            </span>
          </Link>
        </div>
        <div className="text-sm">
          {token ? (
            <button
              className="xl:px-8 lg:px-6 md:px-4 px-4 py-2 border rounded-md border-orange-600 text-orange-600 hover:bg-gray-100 text-center"
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="xl:px-8 lg:px-6 md:px-4 px-4 py-2 border rounded-md border-orange-600 text-orange-600 hover:bg-gray-100 text-center"
              onClick={onLogin}
            >
              Log In
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
