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
import VerifiedTenantsSvg from "public/icons/verified-tenants.svg";
import ZeroPercentRedSvg from "public/icons/zero-percent-red.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BENGALURU_LOCATION } from "@/common/constants";
import { ACCOUNT_NAV } from "@/common/dataConstants";
import { shimmer, toBase64 } from "@/common/utils";
import { AccountNavList } from "@/components/AccountNavList";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useLogout } from "@/hooks/useLogout";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { setLoginFromAddProperty } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { ImageWithLoader, SvgIcon } from "@/utility-components";

const ZeroPercentRed = ZeroPercentRedSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const VerifiedTenants = VerifiedTenantsSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

interface MenuDialogProps {
  id: string;
}

const MenuDialog: React.FC<MenuDialogProps> = ({ id }) => {
  const { token, name, phoneNo } = useSelector(
    (state: RootState) => state.auth,
  );
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const { logout } = useLogout();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const initialPathRef = useRef(pathname);
  const searchParams = useSearchParams();

  const [quickLinksExpanded, setQuickLinksExpanded] = useState(true);
  const toggleQuickLinks = () => setQuickLinksExpanded(!quickLinksExpanded);
  const connectBal = useSelector((state: RootState) => state.auth.connectBal);

  const handleClose = useCallback(() => {
    closeDialog(id);
    dispatch(setHideStickyNavBar(false));
  }, [closeDialog, id, dispatch]);

  const onLogin = () => {
    dispatch(setLoginFromAddProperty(true));
    closeDialog(id);
    openDialog("login-dialog");
  };

  const onLogout = () => logout();

  const onNavClick = () => {
    handleClose();
  };

  const handlePropertyBannerClick = () => {
    closeDialog(id);
    if (!token) {
      onLogin();
    } else {
      router.push("/list-property");
    }
  };

  useEffect(() => {
    if (pathname !== initialPathRef.current) {
      handleClose();
    }
  }, [pathname, handleClose]);

  return (
    <Dialog
      id={id}
      type="fullscreen"
      onClose={handleClose}
      entryAnimation="animate-slide-in-left"
      exitAnimation="animate-slide-out-left"
    >
      <DialogHeader>
        <div
          className={`py-2 px-4 flex justify-between items-center w-full shadow-sm`}
        >
          <button className="rounded-full items-center justify-center">
            <X onClick={handleClose} size={25} />
          </button>
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
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="px-6 py-4 flex flex-col gap-8">
          {/* Profile Section */}
          {token && (
            <div className="flex items-center p-4 gap-4 border border-gray-100 rounded-full shadow-lg inset-shadow-xs">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-white">
                <UserRound size={32} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-gray-500">+{phoneNo}</p>
              </div>
              <div>
                <ChevronRight size={20} />
              </div>
            </div>
          )}
          {/* Property Banner */}
          <div
            onClick={handlePropertyBannerClick}
            className="relative px-4 py-6 border-t border-gray-100 rounded-xl shadow-lg inset-shadow-xs flex justify-between overflow-hidden "
          >
            <div className="flex flex-col justify-between items-start gap-4">
              <h2 className="relative text-base font-bold z-10">
                List Your Property For Free
              </h2>
              <div className="relative flex flex-col z-10">
                <div className="flex items-center text-gray-700 gap-2">
                  <VerifiedTenants />
                  <span>Verified Tenants/Buyers.</span>
                </div>
                <div className="flex items-center text-gray-700 gap-2">
                  <ZeroPercentRed fill="text-red-500" />
                  <span>Zero Brokerage.</span>
                </div>
              </div>
            </div>
            <ImageWithLoader
              src="/images/property.webp"
              alt="Property"
              loading="lazy"
              placeholder="blur"
              height={100}
              width={100}
              className="!absolute items-end right-0 bottom-0 scale-125"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 400))}`}
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
          {token && (
            <AccountNavList
              items={ACCOUNT_NAV}
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
                <li>
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
                </li>

                <li>
                  <Link
                    href={`/property-search?lat=${BENGALURU_LOCATION.lat}&lon=${BENGALURU_LOCATION.lng}&propertyCategory=rent`}
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
                    <span className="flex items-center gap-2">For Rent</span>
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
                    href="/faqs"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300 w-full"
                  >
                    <span className="flex items-center gap-2">FAQs</span>
                    <ChevronRight size={20} />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms-and-conditions"
                    prefetch
                    onClick={onNavClick}
                    className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer w-full"
                  >
                    <span className="flex items-center gap-2">
                      Terms & Conditions
                    </span>
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
