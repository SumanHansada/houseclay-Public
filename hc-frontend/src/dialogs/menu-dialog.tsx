"use client";

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  UserRound,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import CoinSvg from "public/icons/coin.svg";
import PropertySvg from "public/icons/property.svg";
import VerifiedTenantsSvg from "public/icons/verified-tenants.svg";
import ZeroPercentRedSvg from "public/icons/zero-percent-red.svg";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ACCOUNT_NAV } from "@/common/constants";
import { AccountNavList } from "@/components/AccountNavList";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useLogout } from "@/hooks/useLogout";
import { useDialog } from "@/providers/DialogContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";
import { setLoginFromAddProperty } from "@/store/authSlice";
import { RootState } from "@/store/store";

const Property = PropertySvg as React.FC<React.SVGProps<SVGSVGElement>>;
const ZeroPercentRed = ZeroPercentRedSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const VerifiedTenants = VerifiedTenantsSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const Coin = CoinSvg as React.FC<React.SVGProps<SVGSVGElement>>;

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

  const [quickLinksExpanded, setQuickLinksExpanded] = useState(true);
  const toggleQuickLinks = () => setQuickLinksExpanded(!quickLinksExpanded);

  const handleClose = () => {
    closeDialog(id);
    dispatch(setHideStickyNavBar(false));
  };

  const onLogin = () => {
    dispatch(setLoginFromAddProperty(true));
    closeDialog(id);
    openDialog("login-dialog");
  };

  const onLogout = () => logout();

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
  }, [pathname]);

  return (
    <Dialog
      id={id}
      type="fullscreen"
      onClose={handleClose}
      entryAnimation="animate-slide-in-left"
      exitAnimation="animate-slide-out-left"
    >
      <DialogHeader>
        <div className={`py-2 px-4 flex justify-between items-center w-full`}>
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
            <div className="flex items-center p-4 gap-4 border border-gray-100 rounded-full shadow-md inset-shadow-xs">
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
            className="relative px-4 py-6 border border-gray-100 rounded-lg shadow-md inset-shadow-xs flex flex-col justify-between items-start gap-4 overflow-hidden"
          >
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
            <Property className="absolute right-0 bottom-0" />
          </div>
          {/* Connects Balance */}
          <div className="flex justify-between items-center">
            <span>Connects Balance</span>
            <span className="flex items-center gap-1 font-semibold">
              <Coin width={25} height={25} /> {token ? 34 : 0}
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
              {" "}
              <ul>
                <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                  <span className="flex items-center gap-2">For Sale</span>
                  <ChevronRight size={20} />
                </li>
                <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                  <span className="flex items-center gap-2">For Rent</span>
                  <ChevronRight size={20} />
                </li>
                <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                  <span className="flex items-center gap-2">
                    What Are Connects
                  </span>
                  <ChevronRight size={20} />
                </li>
                <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                  <span className="flex items-center gap-2">Contacts</span>
                  <ChevronRight size={20} />
                </li>
                <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                  <span className="flex items-center gap-2">FAQs</span>
                  <ChevronRight size={20} />
                </li>
                <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer">
                  <span className="flex items-center gap-2">
                    Terms & Conditions
                  </span>
                  <ChevronRight size={20} />
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
