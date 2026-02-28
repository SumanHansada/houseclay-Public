"use client";

import { Menu, ShieldCheckIcon, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  insufficientConnectsIconURL,
  loginAndEarnIconURL,
} from "@/common/cdnURLs";
import {
  BUY_CONNECTS_DIALOG_ID,
  PRO_SUBSCRIPTION_DIALOG_ID,
} from "@/common/dataConstants/dialogIDs";
import { AuthStep, PropertyCategory } from "@/common/enums";
import { getPropertySearchHrefWithLocation } from "@/common/utils";
import { UserDropdown } from "@/components/UserDropdown";
import { useDialog } from "@/providers/DialogContextProvider";
import { setAuthStep } from "@/store/authSlice";
import { ImageWithLoader, SvgIcon } from "@/utility-components";
import { Popover } from "@/utility-components";

import { RootState } from "../store/store";

type User = {
  name: string;
};

export interface HeaderClientProps {
  user?: User;
}

export const InfoTipLogin: React.FC = () => (
  <div className="flex items-center w-full px-4 py-2 gap-4">
    <div className="relative w-1/4 aspect-[7/6]">
      <ImageWithLoader
        src={loginAndEarnIconURL}
        alt="login and earn"
        fill
        className="object-center"
      />
    </div>
    <div className="w-3/4">
      <h1 className="text-lg">Login & Earn Connects!</h1>
      <p className="text-gray-500 font-light">
        Sign up to earn free Connects and unlock exclusive benefits!
      </p>
    </div>
  </div>
);

export const InfoTipZeroBalance: React.FC<{ onBuyConnects: () => void }> = ({
  onBuyConnects,
}) => (
  <div className="flex w-full px-4 py-2 gap-4 min-w-72">
    <div className="relative h-14 aspect-[7/9]">
      <ImageWithLoader
        src={insufficientConnectsIconURL}
        alt="insufficient connects"
        fill
        className="object-center"
      />
    </div>
    <div className="">
      <h1 className="text-lg">Insufficient connects!</h1>
      <p className="text-gray-500 font-light text-nowrap">
        Purchase more now to continue!
      </p>
      <button
        onClick={onBuyConnects}
        className="text-red-600 cursor-pointer text-left"
      >
        Buy Connects
      </button>
    </div>
  </div>
);

const HeaderClient: React.FC<HeaderClientProps> = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const userName = useSelector(
    (state: RootState) => state.user.userDetail.name,
  );
  const connectBal = useSelector((state: RootState) =>
    isAuthenticated ? state.user.userDetail.connectBal : 0,
  );
  const showLoginTip = !isAuthenticated;
  const showZeroTip = !!isAuthenticated && Number(connectBal) === 0;

  const dispatch = useDispatch();
  const { openDialog, closeAllDialogs } = useDialog();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rentHref = getPropertySearchHrefWithLocation(
    PropertyCategory.RENT,
    searchParams,
  );
  const flatmateHref = getPropertySearchHrefWithLocation(
    PropertyCategory.FLATMATE,
    searchParams,
  );

  const onLogin = () => {
    closeAllDialogs();
    dispatch(setAuthStep(AuthStep.NONE));
    openDialog("login-dialog");
  };

  const onMenuClick = () => {
    closeAllDialogs();
    openDialog("menu-dialog");
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-gray-200 bg-white flex justify-between items-center w-full py-2 shadow-sm xl:gap-32 lg:gap-16 md:gap-5 gap-8 xl:px-24 lg:px-12 md:px-8 px-12 max-md:hidden mx-auto ">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-1 py-1">
            <SvgIcon
              iconSize="small"
              name="houseclay"
              size={25}
              className="scale-90 lg:scale-100"
            />
            <span className="text-red-600 text-xl lg:text-2xl font-inter font-bold">
              houseclay
            </span>
          </Link>
        </div>

        {/* Center - Navigation */}
        <div className="flex justify-between items-center w-full text-sm">
          <nav className="hidden md:flex xl:gap-8 lg:gap-6 md:gap-5 gap-3 text-gray-800 text-base">
            <Link
              href={rentHref}
              data-category="rent"
              data-active={
                searchParams.get("propertyCategory") === "rent" ||
                (pathname === "/property-search" &&
                  !searchParams.get("propertyCategory"))
                  ? "true"
                  : "false"
              }
              className="relative hover:text-red-600 py-2 nav-link"
            >
              Rent
            </Link>
            <Link
              href={flatmateHref}
              data-category="flatmate"
              data-active={
                searchParams.get("propertyCategory") === "flatmate"
                  ? "true"
                  : "false"
              }
              className="relative hover:text-red-600 py-2 nav-link"
            >
              Rooms
            </Link>
            {/* <Link
              href={`/property-search?lat=${BENGALURU_LOCATION.lat}&lon=${BENGALURU_LOCATION.lng}&propertyCategory=resale`}
              data-category="resale"
              data-active={
                searchParams.get("propertyCategory") === "resale"
                  ? "true"
                  : "false"
              }
              className="relative hover:text-red-600 py-2 nav-link"
            >
              Buy
            </Link> */}
            <button
              onClick={() => openDialog(PRO_SUBSCRIPTION_DIALOG_ID)}
              className="relative hover:text-red-600 py-2 nav-link flex gap-1 items-center"
            >
              Get Pro <ShieldCheckIcon className="size-4" />
            </button>
            <Link
              href="/about-us"
              data-active={pathname === "/about-us" ? "true" : "false"}
              className="relative hover:text-red-600 py-2 nav-link hidden lg:block"
            >
              About Us
            </Link>
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center xl:gap-6 lg:gap-4 md:gap-2 gap-2">
            {/* List Property Button */}
            <Link
              href="/list-property"
              className="relative border border-red-600 text-red-600 xl:px-6 lg:px-5 md:px-3 px-3 py-2 rounded-xl hover:bg-red-50"
            >
              List Your Property
              <span className="absolute bottom-0 right-0 -mb-2 -mr-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-md">
                FREE
              </span>
            </Link>

            {/* Coin Counter with hover tip */}
            <Popover
              id="connects-popover"
              trigger="hover"
              align="end"
              enabled={showLoginTip || showZeroTip}
              panelClassName=""
              content={
                showLoginTip ? (
                  <InfoTipLogin />
                ) : (
                  <InfoTipZeroBalance
                    onBuyConnects={() => openDialog(BUY_CONNECTS_DIALOG_ID)}
                  />
                )
              }
            >
              <Link
                href="/manage-account/connects"
                className="flex items-center xl:px-4 lg:px-3 md:px-2 px-2 py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100"
                aria-label={`Connects Balance ${connectBal} Connects`}
              >
                <SvgIcon
                  iconSize="medium"
                  name="coin"
                  size={20}
                  className="h-5 w-5"
                />
                <span>{connectBal}</span>
              </Link>
            </Popover>

            {/* Login Button */}
            {isAuthenticated ? (
              <UserDropdown
                userName={userName}
                iconSize={40}
                dropdownWidth={300}
              />
            ) : pathname !== "/login" ? (
              <button
                className="xl:px-8 lg:px-6 md:px-4 px-4  py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-center"
                onClick={onLogin}
              >
                Login
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white z-40 border-b border-gray-200 flex justify-between w-full px-4 py-2 shadow-sm md:hidden">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-2">
          <Menu role="button" onClick={onMenuClick} />
          <Link href="/" className="flex items-center gap-1">
            <SvgIcon iconSize="small" name="houseclay" size={22} />
            <span className="text-red-600 text-2xl font-inter font-bold">
              houseclay
            </span>
          </Link>
        </div>
        {!isAuthenticated && pathname !== "/login" ? (
          <button
            className="xl:px-8 lg:px-6 md:px-4 px-4 py-2 border rounded-xl border-red-600 text-red-600 hover:bg-gray-100 text-center text-sm"
            onClick={onLogin}
          >
            Log In
          </button>
        ) : null}
      </header>
    </>
  );
};

export default HeaderClient;
