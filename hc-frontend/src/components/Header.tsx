"use client";

// import { useDeviceContext } from "@/providers/DeviceContextProvider";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { useLogoutMutation } from "@/store/apiSlice";
import { clearToken } from "@/store/authSlice";

import { RootState } from "../store/store";

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

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
    <header className="flex justify-between w-full items-center py-2 shadow-sm xl:gap-32 lg:gap-16 gap-16 xl:px-24 md:px-12 px-12">
      {/* Left Section - Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/icons/houseclay.svg"
            alt="HouseClay"
            height={"200"}
            width={"200"}
          />
        </Link>
      </div>

      {/* Center - Navigation */}
      <div className="flex justify-between items-center w-full">
        <nav className="hidden md:flex xl:space-x-12 space-x-3 text-gray-800">
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
        <div className="flex items-center xl:space-x-6 space-x-3">
          {/* List Property Button */}
          <Link
            href="/list-property"
            className="relative border border-red-500 text-red-500 px-4 py-2 rounded-xl hover:bg-red-50"
          >
            List Your Property
            <span className="absolute bottom-0 right-0 -mb-2 -mr-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md">
              FREE
            </span>
          </Link>

          {/* Coin Counter */}
          <button className="flex items-center space-x-1 px-4 py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100">
            <Image src={"/icons/coin.svg"} alt="Coin" height={25} width={25} />
            <span>0</span>
          </button>

          {/* Login Button */}
          {user ? (
            <Link
              href="/profile"
              className="flex flex-row gap-2 w-24 px-4 py-2 border rounded-xl  border-gray-300 text-gray-800 hover:bg-gray-100 text-center"
            >
              <Image src="/icons/user.svg" alt="User" height={25} width={25} />
              <Image
                src="/icons/arrow-down.svg"
                alt="User"
                height={25}
                width={25}
              />
            </Link>
          ) : (
            <button
              className="w-24 px-4 py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-center"
              onClick={token ? onLogout : onLogin}
            >
              {token ? "Logout" : "Login"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
