"use client";

// import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HouseclaySvg from "public/icons/houseclay.svg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLogoutMutation } from "@/store/apiSlice";
import { clearToken, initializeToken } from "@/store/authSlice";

import { RootState } from "../store/store";
import ActionMenu from "./ActionMenu";

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const HouseClay = HouseclaySvg as React.FC<React.SVGProps<SVGSVGElement>>;

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

  return (
    <>
      <header className="flex sticky top-0 left-0 right-0 bg-white z-50 justify-between w-full items-center py-2 shadow-sm xl:gap-32 lg:gap-16 md:gap-8 gap-8 xl:px-24 md:px-12 px-12 max-md:hidden mx-auto">
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
            <Link href="/rent" className="hover:text-red-500">
              Rent
            </Link>
            <Link href="/buy" className="relative text-red-500">
              Buy
              <span className="absolute left-0 -bottom-1/2 w-full h-[2px] bg-red-500"></span>
            </Link>
            <Link href="/buy-connects" className="hover:text-red-500">
              Buy Connects
            </Link>
            <Link href="/about-us" className="hover:text-red-500">
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
              <Image
                src={"/icons/coin.svg"}
                alt="Coin"
                height={20}
                width={20}
              />
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
                    <Image
                      src="/icons/user.svg"
                      alt="User"
                      height={20}
                      width={20}
                    />
                    <Image
                      src="/icons/arrow-down.svg"
                      alt="Arrow Down"
                      height={20}
                      width={20}
                    />
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
      <header className="fixed top-0 left-0 right-0 bg-white flex justify-between w-full px-4 py-2 shadow-sm md:hidden">
        {/* Left Section - Logo */}

        <div className="flex items-center gap-2">
          <div>
            <Menu />
          </div>
          <Link href="/" className="flex items-center gap-1">
            <HouseClay />
            <span className="text-red-600 text-lg font-nunito font-bold">
              HouseClay
            </span>
          </Link>
        </div>
        {token ? (
          <button
            className="px-24 py-2 border rounded-md border-orange-600 text-orange-600 hover:bg-gray-100text-center"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="px-24 py-2 border rounded-md border-orange-600 text-orange-600 hover:bg-gray-100 text-center"
            onClick={onLogin}
          >
            Log In
          </button>
        )}
      </header>
    </>
  );
};

export default Header;
