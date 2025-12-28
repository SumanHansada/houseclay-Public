"use client";

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/base-components";
import { propertyImageURL } from "@/common/cdnURLs";
import { EXPLORE_LOCATION } from "@/common/constants";
import { ACCOUNT_NAV_ITEMS } from "@/common/dataConstants/navbar";
import { AuthStep } from "@/common/enums";
import { AccountNavList } from "@/components/AccountNavList";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDialog } from "@/providers/DialogContextProvider";
import { setAuthStep, setLoginFromAddProperty } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { ImageWithLoader, SvgIcon } from "@/utility-components";

interface MenuDialogProps {
  id: string;
}

const MenuDialog: React.FC<MenuDialogProps> = ({ id }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [quickLinksExpanded, setQuickLinksExpanded] = useState(true);
  const toggleQuickLinks = () => setQuickLinksExpanded(!quickLinksExpanded);
  const { name, phoneNo } = useSelector(
    (state: RootState) => state.user.userDetail,
  );

  const connectBal = useSelector((state: RootState) =>
    isAuthenticated ? state.user.userDetail.connectBal : 0,
  );

  const handleCloseDialog = useCallback(() => {
    closeDialog(id);
  }, [closeDialog, id]);

  const onLogin = () => {
    dispatch(setLoginFromAddProperty(true));
    closeDialog(id);
    dispatch(setAuthStep(AuthStep.NONE));
    openDialog("login-dialog");
  };

  const onNavClick = () => {
    handleCloseDialog();
  };

  const handlePropertyBannerClick = () => {
    closeDialog(id);
    if (!isAuthenticated) {
      onLogin();
    } else {
      router.push("/list-property");
    }
  };

  return (
    <Dialog
      id={id}
      type="fullscreen"
      onClose={handleCloseDialog}
      entryAnimation="animate-slide-in-left"
      exitAnimation="animate-slide-out-left"
    >
      <DialogHeader>
        <MobileHeader>
          <MobileHeader.LeftAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-1"
              onClick={handleCloseDialog}
            >
              <X size={24} />
            </Button>
          </MobileHeader.LeftAction>
          <MobileHeader.Title>Menu</MobileHeader.Title>
          <MobileHeader.RightAction>
            {isAuthenticated ? null : (
              <button
                className="xl:px-8 lg:px-6 md:px-4 px-4 py-2 border rounded-xl border-red-600 text-red-600 hover:bg-gray-100 text-center text-sm"
                onClick={onLogin}
              >
                Log In
              </button>
            )}
          </MobileHeader.RightAction>
        </MobileHeader>
      </DialogHeader>
      <DialogContent>
        <div className="px-6 py-4 flex flex-col gap-8 pt-14">
          {/* Profile Section */}
          {isAuthenticated && (
            <Link
              href="/manage-account/my-profile"
              className="flex items-center p-4 gap-4 border border-gray-200 rounded-full shadow-lg inset-shadow-xs"
              onClick={onNavClick}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-white">
                <UserRound size={32} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-gray-500">{phoneNo}</p>
              </div>
              <div>
                <ChevronRight size={20} />
              </div>
            </Link>
          )}
          {/* Property Banner */}
          <div
            onClick={handlePropertyBannerClick}
            className="relative px-4 py-6 border border-gray-200 rounded-xl shadow-lg inset-shadow-xs flex justify-between overflow-hidden "
          >
            <div className="flex flex-col justify-between items-start gap-4">
              <h2 className="relative text-base font-bold z-10">
                List Your Property For Free
              </h2>
              <div className="relative flex flex-col z-10">
                <div className="flex items-center text-gray-700 gap-2">
                  <SvgIcon name="verified-tenants" size={20} />
                  <span>Verified Tenants/Buyers.</span>
                </div>
                <div className="flex items-center text-gray-700 gap-2">
                  <SvgIcon name="zero-percent-red" size={22} />
                  <span>Zero Brokerage.</span>
                </div>
              </div>
            </div>
            <ImageWithLoader
              src={propertyImageURL}
              alt="Property"
              loading="lazy"
              height={100}
              width={100}
              className="!absolute items-end right-0 bottom-0 scale-125"
            />
          </div>
          {/* Connects Balance */}
          <div className="flex justify-between items-center">
            <span>Connects Balance</span>
            <span className="flex items-center gap-1 font-semibold">
              <SvgIcon iconSize="medium" name="connects" size={25} />{" "}
              {connectBal ? connectBal : 0}
            </span>
          </div>

          {/* Profile Section */}
          {isAuthenticated && (
            <AccountNavList
              items={ACCOUNT_NAV_ITEMS}
              onItemSelect={onNavClick}
              iconSize={44}
              variant="mobile"
            />
          )}

          {/* Quick Links Section */}
          <div>
            <div
              onClick={toggleQuickLinks}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>Quick Links</span>
              {quickLinksExpanded ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
            <div
              className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                quickLinksExpanded ? "max-h-screen" : "max-h-0"
              }`}
            >
              <ul>
                {/* Commented Resale logic */}
                {/* <li>
                  <Link
                    href={`/property-search?lat=${BENGALURU_LOCATION.lat}&lon=${BENGALURU_LOCATION.lng}&propertyCategory=resale`}
                    data-category="resale"
                    data-active={
                      searchParams.get("propertyCategory") === "resale"
                        ? "true"
                        : "false"
                    }
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">For Resale</span>
                    <ChevronRight size={20} />
                  </Link>
                </li> */}

                <li>
                  <Link
                    href={`/property-search?lat=${EXPLORE_LOCATION.lat}&lon=${EXPLORE_LOCATION.lng}&propertyCategory=rent`}
                    data-category="rent"
                    data-active={
                      searchParams.get("propertyCategory") === "rent" ||
                      (pathname === "/property-search" &&
                        !searchParams.get("propertyCategory"))
                        ? "true"
                        : "false"
                    }
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">Rent</span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href={`/property-search?lat=${EXPLORE_LOCATION.lat}&lon=${EXPLORE_LOCATION.lng}&propertyCategory=flatmate`}
                    data-category="flatmate"
                    data-active={
                      searchParams.get("propertyCategory") === "flatmate"
                        ? "true"
                        : "false"
                    }
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">Rooms</span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/what-are-connects"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">
                      What Are Connects
                    </span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about-us"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">About Us</span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/testimonials"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">
                      Hall of Fame
                    </span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact-us"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">Contact Us</span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/refund-policy"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">
                      Refund Policy
                    </span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/privacy-policy"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">
                      Privacy Policy
                    </span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms-and-conditions"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">
                      Terms & Conditions
                    </span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/faqs"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">FAQs</span>
                    <ChevronRight size={20} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuDialog;
