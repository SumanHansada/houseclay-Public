"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { RootState } from "@/store/store";
import { SvgIcon } from "@/utility-components";

export default function ConnectsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isMobile } = useDeviceContext();
  const connectBalance = useSelector(
    (state: RootState) => state.auth.connectBal,
  );

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
      dispatch(setHideStickyNavBar(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
      dispatch(setHideStickyNavBar(false));
    }
  }, [dispatch, isMobile]);

  return (
    <>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Page title */}
        <div className="border-b-2 pb-2 mb-8">
          <h1 className="text-2xl font-medium">Connects</h1>
        </div>

        <div className="flex mb-10">
          <div className="flex flex-col items-start justify-evenly lg:flex-row lg:justify-between  w-2/3 lg:w-full py-4 px-3 lg:px-8 bg-red-50 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-lg lg:text-xl">Available Connects</span>
              <div className="flex gap-1 items-center">
                <SvgIcon iconSize="medium" name="coin" size={34} />
                <span className="text-gray-700 text-2xl font-medium">
                  {connectBalance}
                </span>
              </div>
            </div>
            <button
              className="underline text-red-500 hover:text-red-600 text-lg lg:text-xl"
              onClick={() => router.push("/buy-connects")}
            >
              Buy more
            </button>
          </div>
          <div className="flex flex-1 justify-center">
            <SvgIcon
              iconSize="large"
              name="how-to-use-connects-mobile"
              size={140}
              className="lg:hidden"
            />
          </div>
        </div>

        <div className="flex">
          <div className="lg:w-2/3 space-y-6 px-4">
            <div className="space-y-4">
              <h1 className="md:text-2xl lg:text-3xl md:font-medium lg:font-bold">
                How you can use connects?
              </h1>
              <p className="text-gray-800 font-light leading-relaxed">
                Connects are your one-time access tokens that let you interact
                with property owners, create rent agreements, and avail
                additional services—without any subscriptions. Use them as
                needed and stay in control of your transactions.
              </p>
            </div>
            <div className="space-y-6 lg:space-y-8 md:px-2 lg:px-4 text-lg lg:text-xl mb-2">
              <div className="flex gap-4 items-center">
                <SvgIcon
                  iconSize="small"
                  name="instant-access"
                  size={45}
                  className="scale-90 md:scale-100 xl:scale-125"
                />
                <div>
                  <h1 className="font-medium text-lg">Unlock Owner Details</h1>
                  <p className="text-base text-gray-700 font-light">
                    Connect directly with verified owners.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <SvgIcon
                  iconSize="small"
                  name="real-owners"
                  size={45}
                  className="scale-90 md:scale-100 xl:scale-125"
                />

                <div>
                  <h1 className="font-medium text-lg">
                    Access Additional Services
                  </h1>
                  <p className="text-base text-gray-700 font-light">
                    Use Connects for cleaning, painting, and handyman services.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <SvgIcon
                  iconSize="medium"
                  name="no-forced-plans"
                  size={45}
                  className="scale-90 md:scale-100 xl:scale-125"
                />
                <span>
                  <h1 className="font-medium text-lg">
                    Upgrade to Property Management
                  </h1>
                  <p className="text-base text-gray-700 font-light">
                    Let experts handle tenant verification and rent collection.
                  </p>
                </span>
              </div>
            </div>
            <button
              className="px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl"
              onClick={() => router.push("/what-are-connects")}
            >
              Know more about connects
            </button>
          </div>
          <div className="lg:w-1/3 max-lg:hidden lg:pt-12 2xl:pt-0">
            <SvgIcon iconSize="large" name="how-to-use-connects" size={380} />
          </div>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden">
        {/* Mobile Header */}
        <MobileHeader title="Connects" />

        <div className="px-6 pb-20 pt-4">
          <div className="flex justify-between items-start w-full py-4 rounded-lg mb-4">
            {/* Available Connects */}
            <div className="flex flex-col gap-2 justify-between">
              <span className="font-medium text-xl">Your Connects</span>
              <div className="flex items-center text-lg">
                <SvgIcon iconSize="medium" name="coin" size={32} />
                <span className="text-gray-700 text-2xl font-medium">
                  {connectBalance}
                </span>
              </div>
            </div>
            <SvgIcon
              iconSize="large"
              name="how-to-use-connects-mobile"
              size={140}
            />
          </div>

          <div className="w-full space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl font-medium">How you can use connects?</h1>
              <p className="text-gray-800 font-light leading-relaxed">
                Connects are your one-time access tokens that let you interact
                with property owners, create rent agreements, and avail
                additional services—without any subscriptions. Use them as
                needed and stay in control of your transactions.
              </p>
            </div>
            <div className="space-y-4 mb-2">
              <div className="flex gap-2 items-center">
                <SvgIcon
                  iconSize="small"
                  name="instant-access"
                  size={45}
                  className="scale-90 md:scale-100 xl:scale-125"
                />
                <div>
                  <h1 className="font-medium">Unlock Owner Details</h1>
                  <p className="text-sm text-gray-700 font-light">
                    Connect directly with verified owners.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <SvgIcon
                  iconSize="small"
                  name="real-owners"
                  size={45}
                  className="scale-90 md:scale-100 xl:scale-125"
                />

                <div>
                  <h1 className="font-medium">Access Additional Services</h1>
                  <p className="text-sm text-gray-700 font-light">
                    Use Connects for cleaning, painting, and handyman services.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <SvgIcon
                  iconSize="medium"
                  name="no-forced-plans"
                  size={45}
                  className="scale-90 md:scale-100 xl:scale-125"
                />
                <span>
                  <h1 className="font-medium">
                    Upgrade to Property Management
                  </h1>
                  <p className="text-sm text-gray-700 font-light">
                    Let experts handle tenant verification and rent collection.
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="fixed bottom-0 left-0 md:hidden right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-6 border-t border-t-gray-300 bg-white">
        <button
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl"
          onClick={() => router.push("/what-are-connects")}
        >
          Know more
        </button>
        <button
          className="px-6 py-3 border bg-red-500 text-white hover:bg-red-600 rounded-xl"
          onClick={() => router.push("/buy-connects")}
        >
          Buy Connects
        </button>
      </footer>
    </>
  );
}
