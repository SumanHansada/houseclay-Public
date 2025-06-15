"use client";

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Contact,
  CreditCard,
  FileText,
  Heart,
  Home,
  LogOut,
  MessageSquare,
  User,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CoinSvg from "public/icons/coin.svg";
import PropertySvg from "public/icons/property.svg";
import VerifiedTenantsSvg from "public/icons/verified-tenants.svg";
import ZeroPercentRedSvg from "public/icons/zero-percent-red.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "@/components/common/Header";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Login from "@/components/Login";
import StickyNavbar from "@/components/StickyNavbar";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { useLogoutMutation } from "@/store/apiSlice";
import { setHideStickyNavBar } from "@/store/appSlice";
import { clearToken, setLoginFromAddProperty } from "@/store/authSlice";
import { RootState } from "@/store/store";

const Property = PropertySvg as React.FC<React.SVGProps<SVGSVGElement>>;
const ZeroPercentRed = ZeroPercentRedSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const VerifiedTenants = VerifiedTenantsSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const Coin = CoinSvg as React.FC<React.SVGProps<SVGSVGElement>>;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { token, name, phoneNo } = useSelector(
    (state: RootState) => state.auth,
  );
  const router = useRouter();
  const { openDialog, isDialogOpen, closeAllDialogs, closeDialog } =
    useDialog();
  const [logout] = useLogoutMutation();
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const [quickLinksExpanded, setQuickLinksExpanded] = useState(true);
  const toggleQuickLinks = () => setQuickLinksExpanded(!quickLinksExpanded);

  const onLogin = () => {
    dispatch(setLoginFromAddProperty(true));
    closeAllDialogs();
    openDialog("login-dialog");
  };

  const onLogout = async () => {
    try {
      const logoutResponse = await logout();
      console.log(logoutResponse);
      dispatch(clearToken());
    } catch (err) {
      console.error(err);
    }
  };

  const handlePropertyBannerClick = () => {
    closeAllDialogs();
    if (!token) {
      onLogin();
    } else {
      router.push("/list-property");
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto my-0 t-[54px] pt-[54px] min-h-fit flex-1 flex flex-wrap justify-center">
        {children}
      </main>
      {/* Login Dialog */}
      {isDialogOpen("login-dialog") && (
        <Dialog
          id="login-dialog"
          type={isMobile ? "fullscreen" : "card"}
          onClose={() => {
            closeDialog("login-dialog");
            dispatch(setHideStickyNavBar(false));
          }}
          entryAnimation={
            isMobile ? "animate-slide-in-right" : "animate-fade-in"
          }
          exitAnimation={
            isMobile ? "animate-slide-out-right" : "animate-fade-out"
          }
        >
          <DialogHeader>
            <div
              className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
            >
              {isMobile && (
                <h1 className="text-xl py-1.5 text-black">
                  Log In to Your Account
                </h1>
              )}
              <button className="absolute top-4 right-4 rounded-full">
                <X
                  onClick={() => {
                    closeDialog("login-dialog");
                    dispatch(setHideStickyNavBar(false));
                  }}
                  size={24}
                />
              </button>
            </div>
          </DialogHeader>
          <DialogContent>
            <Login />
          </DialogContent>
        </Dialog>
      )}

      {/* Menu Dialog */}
      {isDialogOpen("menu-dialog") && (
        <Dialog
          id="menu-dialog"
          type="fullscreen"
          onClose={() => {
            closeDialog("menu-dialog");
            dispatch(setHideStickyNavBar(false));
          }}
          entryAnimation="animate-slide-in-left"
          exitAnimation="animate-slide-out-left"
        >
          <DialogHeader>
            <div
              className={`py-2 px-4 flex justify-between items-center w-full`}
            >
              <button className="rounded-full items-center justify-center">
                <X
                  onClick={() => {
                    closeDialog("menu-dialog");
                    dispatch(setHideStickyNavBar(false));
                  }}
                  size={25}
                />
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
                <div>
                  <ul>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                      <span className="flex items-center gap-2">
                        <User size={22} />
                        My Profile
                      </span>
                      <ChevronRight size={20} />
                    </li>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                      <span className="flex items-center gap-2">
                        <FileText size={22} />
                        My Requirements
                      </span>
                      <ChevronRight size={20} />
                    </li>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                      <span className="flex items-center gap-2">
                        <Heart size={22} />
                        Shortlists
                      </span>
                      <ChevronRight size={20} />
                    </li>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                      <span className="flex items-center gap-2">
                        <Coin width={22} />
                        Connects
                      </span>
                      <ChevronRight size={20} />
                    </li>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                      <span className="flex items-center gap-2">
                        <CreditCard size={22} />
                        My Payments
                      </span>
                      <ChevronRight size={20} />
                    </li>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                      <span className="flex items-center gap-2">
                        <Home size={22} />
                        My Properties
                      </span>
                      <ChevronRight size={20} />
                    </li>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                      <span className="flex items-center gap-2">
                        <Contact size={22} />
                        Owners you Contacted
                      </span>
                      <ChevronRight size={20} />
                    </li>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                      <span className="flex items-center gap-2">
                        <MessageSquare size={22} />
                        Support
                      </span>
                      <ChevronRight size={20} />
                    </li>
                    <li className="flex items-center justify-between py-4 hover:bg-gray-100 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <LogOut size={22} />
                        Logout
                      </span>
                      <ChevronRight size={20} />
                    </li>
                  </ul>
                </div>
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
      )}
      <StickyNavbar />
    </>
  );
}
