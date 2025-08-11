"use client";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { default as InstantAccessSvg } from "public/icons/static-pages/instant-access.svg";
import { default as NoForcedPlansSvg } from "public/icons/static-pages/no-forced-plans.svg";
import { default as RealOwnersSvg } from "public/icons/static-pages/real-owners.svg";

// Test
import { user } from "../dummy";

const RealOwners = RealOwnersSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const InstantAccess = InstantAccessSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const NoForcedPlans = NoForcedPlansSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

export default function ConnectsPage() {
  const router = useRouter();

  return (
    <>
      {/* Page title */}
      <div className="border-b-2 pb-2 mb-8">
        <h1 className="text-2xl font-medium">Connects</h1>
      </div>

      <div className="flex justify-between w-full py-4 px-8 bg-red-50 rounded-lg mb-10">
        <div className="flex gap-5 items-center">
          <Image src="/icons/coin.svg" alt="coin icon" width={40} height={40} />
          <div className="text-lg flex items-center">
            Available Connects&nbsp;&nbsp;&nbsp;
            <span className="text-gray-700 text-2xl font-medium">
              {user.connects}
            </span>
          </div>
        </div>
        <button className="underline text-red-500 hover:text-red-600 text-lg">
          Buy more connects
        </button>
      </div>

      <div className="flex">
        <div className="w-1/2 space-y-6 px-4">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold w-2/3">
              How you can use connects?
            </h1>
            <p className="text-gray-800 font-light leading-relaxed">
              Connects are your one-time access tokens that let you interact
              with property owners, create rent agreements, and avail additional
              services—without any subscriptions. Use them as needed and stay in
              control of your transactions.
            </p>
          </div>
          <div className="space-y-4 lg:space-y-8 sm:space-y-6 lg:px-4 md:px-2 text-base sm:text-lg lg:text-xl mb-2 max-md:w-1/2">
            <div className="flex md:gap-4 gap-1 items-center">
              <InstantAccess
                width={50}
                height={50}
                className="text-red-500"
                aria-label="Instant Access"
              />
              <div>
                <h1 className="font-medium text-lg">Unlock Owner Details</h1>
                <p className="text-base text-gray-700 font-light">
                  Connect directly with verified owners.
                </p>
              </div>
            </div>
            <div className="flex md:gap-4 gap-1 items-center">
              <RealOwners
                width={50}
                height={50}
                className="text-red-500"
                aria-label="Real owners"
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
            <div className="flex md:gap-4 gap-1 items-center">
              <NoForcedPlans
                width={50}
                height={50}
                className="text-red-500"
                aria-label="No Forced Plans"
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
            className="px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg"
            onClick={() => router.push("/what-are-connects")}
          >
            Know more about connects
          </button>
        </div>
        <div className="w-1/2">
          <Image
            src="/icons/static-pages/how-to-use-connects.svg"
            alt="how to use connects"
            width={420}
            height={420}
            className="mx-auto"
          />
        </div>
      </div>
    </>
  );
}
