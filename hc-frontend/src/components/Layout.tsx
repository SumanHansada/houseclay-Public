"use client";
import { X } from "lucide-react";
import PropertySvg from "public/icons/property.svg";
import { useDispatch, useSelector } from "react-redux";

import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Login from "@/components/Login";
import StickyNavbar from "@/components/StickyNavbar";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { useLogoutMutation } from "@/store/apiSlice";
import { clearToken } from "@/store/authSlice";
import { RootState } from "@/store/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  const { openDialog, isDialogOpen, closeDialog } = useDialog();
  const [logout] = useLogoutMutation();
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const Property = PropertySvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const onLogin = () => {
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

  return (
    <>
      <Header />
      <main className="mx-auto my-0  min-h-screen flex-1 flex flex-wrap items-center justify-center">
        {children}
      </main>
      {/* Login Dialog */}
      {isDialogOpen("login-dialog") && (
        <Dialog
          id="login-dialog"
          type={isMobile ? "fullscreen" : "card"}
          onClose={() => closeDialog("login-dialog")}
          entryAnimation={
            isMobile ? "animate-slide-in-right" : "animate-fade-in"
          }
          exitAnimation={
            isMobile ? "animate-slide-out-right" : "animate-fade-out"
          }
        >
          {
            <DialogHeader>
              <div
                className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
              >
                {isMobile && (
                  <h1 className="text-xl py-2 text-black">
                    Log In to Your Account
                  </h1>
                )}
                <button className="absolute top-4 right-4 border border-gray-200 rounded-full md:border-none">
                  <X onClick={() => closeDialog("login-dialog")} size={25} />
                </button>
              </div>
            </DialogHeader>
          }
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
          onClose={() => closeDialog("menu-dialog")}
          entryAnimation="animate-slide-in-left"
          exitAnimation="animate-slide-out-left"
        >
          <DialogHeader>
            <div
              className={`py-2 px-4 flex justify-between items-center w-full`}
            >
              <button className="border border-gray-200 rounded-full md:border-none items-center justify-center">
                <X onClick={() => closeDialog("menu-dialog")} size={25} />
              </button>
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
          </DialogHeader>
          <DialogContent>
            {/* Property Banner */}
            <div className="m-4 p-4 bg-white rounded-lg shadow-md inset-shadow-xs flex justify-between items-center">
              <div className="">
                <h2 className="text-xl font-bold">
                  List Your Property For Free
                </h2>
                <div className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Verified Tenants/Buyers.</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-red-500 font-bold mr-2">0%</span>
                  <span>Zero Brokerage.</span>
                </div>
              </div>
              <Property />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Footer />
      <StickyNavbar />
    </>
  );
}
