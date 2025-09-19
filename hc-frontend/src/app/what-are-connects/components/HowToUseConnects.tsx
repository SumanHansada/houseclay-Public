"use client";

import { useRouter } from "next/navigation";
import React from "react";

import Carousel2D from "@/components/Carousel2D";
import { SvgIcon } from "@/utility-components";

const HowToUseConnects = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between md:gap-10 gap-4 xl:px-28 lg:px-14 md:px-14 md:py-20 px-0 py-6 bg-gray-100">
      {/* Heading */}
      <div className="flex flex-col items-center justify-center md:gap-4 gap-2 px-6">
        <h1 className="lg:text-4xl sm:text-3xl text-xl md:font-bold font-medium text-center">
          How Can You Use Connects?
        </h1>
        <p className="text-center md:text-gray-800 text-gray-600 md:font-light max-md:text-base lg:w-3/4 md:w-11/12">
          Listing your property has never been easier or more effective.
          Here&apos;s why thousands of property owners trust us:
        </p>
      </div>

      {/* Desktop */}
      <div className="flex xl:gap-10 lg:gap-6 md:gap-3 max-md:gap-6 justify-between xl:px-12 lg:px-2 max-lg:hidden">
        {/* Card 1 */}
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-10 lg:px-6 px-3 py-6 justify-evenly items-center min-h-[380px] md:min-h-[420px]">
          <SvgIcon iconSize="medium" name="connect-with-owners" size={150} />
          <div className="flex flex-col gap-2 text-center items-center">
            <h1 className="font-semibold lg:text-2xl max-md:text-xl lg:w-4/5 w-11/12">
              Find &amp; Connect with Owners
            </h1>
            <p className="text-gray-800 text-balance lg:text-lg max-md:text-lg">
              Unlock verified owner details and contact them directly—no
              middlemen, no extra charges.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-10 lg:px-6 px-3 py-6 justify-evenly items-center min-h-[380px] md:min-h-[420px]">
          <SvgIcon
            iconSize="large"
            name="simplify-rental-processes"
            size={150}
          />
          <div className="flex flex-col gap-2 text-center items-center">
            <h1 className="font-semibold lg:text-2xl max-md:text-xl lg:w-4/5 w-11/12">
              Simplify Rental Processes
            </h1>
            <p className="text-gray-800 text-balance lg:text-lg max-md:text-lg">
              Use Connects for rent agreements, tenant verification, and
              seamless property transactions.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-10 lg:px-6 px-3 py-6 justify-evenly items-center min-h-[380px] md:min-h-[420px]">
          <SvgIcon
            iconSize="large"
            name="access-property-services"
            size={150}
          />
          <div className="flex flex-col gap-2 text-center items-center">
            <h1 className="font-semibold lg:text-2xl max-md:text-xl lg:w-4/5 w-11/12">
              Access Property Services
            </h1>
            <p className="text-gray-800 text-balance lg:text-lg max-md:text-lg">
              Redeem Connects for maintenance, cleaning, painting, and expert
              property management.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div
        role="list"
        className="relative scrollbar-hide flex overflow-x-auto w-full lg:hidden"
      >
        <Carousel2D
          slideWidth={320}
          gap={4}
          showDots
          showArrows
          containerClassName="px-6"
        >
          {/* Slide 1 */}
          <div className="flex flex-col bg-white rounded-3xl border border-gray-200 shadow-lg px-3 py-6 justify-evenly items-center min-h-[360px]">
            <SvgIcon iconSize="medium" name="connect-with-owners" size={150} />
            <div className="flex flex-col gap-2 text-center items-center">
              <h3 className="font-semibold text-xl w-11/12">
                Find &amp; Connect with Owners
              </h3>
              <p className="text-gray-800 text-balance text-base">
                Unlock verified owner details and contact them directly—no
                middlemen, no extra charges.
              </p>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="flex flex-col bg-white rounded-3xl border border-gray-200 shadow-lg px-3 py-6 justify-evenly items-center min-h-[360px]">
            <SvgIcon
              iconSize="large"
              name="simplify-rental-processes"
              size={150}
            />
            <div className="flex flex-col gap-2 text-center items-center">
              <h3 className="font-semibold text-xl w-11/12">
                Simplify Rental Processes
              </h3>
              <p className="text-gray-800 text-balance text-base">
                Use Connects for rent agreements, tenant verification, and
                seamless property transactions.
              </p>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="flex flex-col bg-white rounded-3xl border border-gray-200 shadow-lg px-3 py-6 justify-evenly items-center min-h-[360px]">
            <SvgIcon
              iconSize="large"
              name="access-property-services"
              size={150}
            />
            <div className="flex flex-col gap-2 text-center items-center">
              <h3 className="font-semibold text-xl w-11/12">
                Access Property Services
              </h3>
              <p className="text-gray-800 text-balance text-base">
                Redeem Connects for maintenance, cleaning, painting, and expert
                property management.
              </p>
            </div>
          </div>
        </Carousel2D>
      </div>

      {/* CTA */}
      <button
        className="bg-red-500 text-white text-lg xl:px-6 lg:px-5 lg:py-3 md:px-3 px-3 py-2 rounded-xl size-fit max-md:hidden"
        onClick={() => router.push("/buy-connects")}
      >
        Buy Connects Now
      </button>
    </div>
  );
};

export default HowToUseConnects;
