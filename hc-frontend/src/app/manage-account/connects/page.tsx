"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { default as InstantAccessSvg } from "public/icons/static-pages/instant-access.svg";
import { default as NoForcedPlansSvg } from "public/icons/static-pages/no-forced-plans.svg";
import { default as RealOwnersSvg } from "public/icons/static-pages/real-owners.svg";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { MobileHeader } from "@/layout-components";
import { setHideStickyNavBar } from "@/store/appSlice";

// Test
import { userDummy } from "../dummy";

const RealOwners = RealOwnersSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const InstantAccess = InstantAccessSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const NoForcedPlans = NoForcedPlansSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

export default function ConnectsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHideStickyNavBar(true));
    return () => {
      dispatch(setHideStickyNavBar(false));
    };
  }, [dispatch]);

  return (
    <>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Page title */}
        <div className="border-b-2 pb-2 mb-8">
          <h1 className="text-2xl font-medium">Connects</h1>
        </div>

        <div className="flex mb-10">
          <div className="flex justify-between w-2/3 lg:w-full py-4 px-3 lg:px-8 bg-red-50 rounded-lg">
            <div className="flex max-lg:flex-col gap-2 lg:gap-5 items-start lg:items-center">
              <span className="lg:hidden">Available Connects</span>
              <Image
                src="/icons/coin.svg"
                alt="coin icon"
                width={40}
                height={40}
                className="max-lg:hidden"
              />
              <div className="text-lg flex items-center gap-2 lg:gap-4">
                <span className="max-lg:hidden">Available Connects</span>
                <Image
                  src="/icons/coin.svg"
                  alt="coin icon"
                  width={40}
                  height={40}
                  className="lg:hidden"
                />
                <span className="text-gray-700 text-2xl font-medium">
                  {userDummy.connects}
                </span>
              </div>
            </div>
            <button
              className="underline text-red-500 hover:text-red-600 lg:text-lg"
              onClick={() => router.push("/buy-connects")}
            >
              Buy more connects
            </button>
          </div>
          <Image
            src="/icons/static-pages/how-to-use-connects.svg"
            alt="how to use connects"
            width={80}
            height={80}
            className="m-auto lg:hidden"
          />
        </div>

        <div className="flex">
          <div className="lg:w-2/3 space-y-6 px-4">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold xl:w-2/3">
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
                <div>
                  <InstantAccess
                    width={50}
                    height={50}
                    className="text-red-500"
                    aria-label="Instant Access"
                  />
                </div>
                <div>
                  <h1 className="font-medium text-lg">Unlock Owner Details</h1>
                  <p className="text-base text-gray-700 font-light">
                    Connect directly with verified owners.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div>
                  <RealOwners
                    width={50}
                    height={50}
                    className="text-red-500"
                    aria-label="Real owners"
                  />
                </div>

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
                <div>
                  <NoForcedPlans
                    width={50}
                    height={50}
                    className="text-red-500"
                    aria-label="No Forced Plans"
                  />
                </div>

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
              className="px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg"
              onClick={() => router.push("/what-are-connects")}
            >
              Know more about connects
            </button>
          </div>
          <div className="lg:w-1/3 max-lg:hidden m-auto">
            <Image
              src="/icons/static-pages/how-to-use-connects.svg"
              alt="how to use connects"
              width={100}
              height={100}
              className="w-full h-full object-scale-down"
            />
          </div>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden">
        {/* Mobile Header */}
        <MobileHeader title="Connects" />

        <div className="px-6 pb-20 pt-4">
          <div className="flex justify-between w-full py-4 rounded-lg mb-4">
            {/* Available Connects */}
            <div className="flex flex-col gap-2 items-start w-2/5">
              <span className="font-medium">Your Connects</span>
              <div className="text-lg flex items-center">
                <Image
                  src="/icons/coin.svg"
                  alt="coin icon"
                  width={36}
                  height={36}
                />
                <span className="text-gray-700 text-2xl font-medium">
                  {userDummy.connects}
                </span>
              </div>
            </div>
            <div>
              <Image
                src="/icons/static-pages/how-to-use-connects.svg"
                alt="how to use connects"
                width={80}
                height={80}
                className=""
              />
            </div>
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
                <div>
                  <InstantAccess
                    width={50}
                    height={50}
                    className="text-red-500"
                    aria-label="Instant Access"
                  />
                </div>
                <div>
                  <h1 className="font-medium">Unlock Owner Details</h1>
                  <p className="text-sm text-gray-700 font-light">
                    Connect directly with verified owners.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div>
                  <RealOwners
                    width={50}
                    height={50}
                    className="text-red-500"
                    aria-label="Real owners"
                  />
                </div>

                <div>
                  <h1 className="font-medium">Access Additional Services</h1>
                  <p className="text-sm text-gray-700 font-light">
                    Use Connects for cleaning, painting, and handyman services.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div>
                  <NoForcedPlans
                    width={50}
                    height={50}
                    className="text-red-500"
                    aria-label="No Forced Plans"
                  />
                </div>
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

      <footer className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 shadow-sm px-4 py-3">
        <div className="flex gap-4">
          <button
            className="px-5 py-2 border border-black rounded-lg w-1/2"
            onClick={() => router.push("/what-are-connects")}
          >
            Know more
          </button>
          <button
            className="px-5 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg w-1/2"
            onClick={() => router.push("/buy-connects")}
          >
            Buy Connects
          </button>
        </div>
      </footer>
    </>
  );
}
