"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { PropertyCardWithImages } from "@/interfaces/User";

import Carousel2D from "./Carousel2D";
import Properties from "./Properties";

interface StandoutsClientProps {
  properties: PropertyCardWithImages[];
}

const StandoutsClient: React.FC<StandoutsClientProps> = ({ properties }) => {
  // const { propertyCategory } = useSelector(
  //   (state: RootState) => state.propertySearch,
  // );
  // const dispatch = useDispatch();

  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent, propertyID: string) => {
    e.stopPropagation();
    router.push(`/property-details/${propertyID}`);
  };

  return (
    <>
      <div className="bg-white pb-safe-bottom bg-center bg-cover flex-col items-center md:py-20 xl:px-28 lg:px-14 md:px-14 max-md:pt-4 max-md:pb-0 px-6 pt-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 max-md:hidden">
          <h1 className="text-3xl font-bold text-gray-800">
            Standouts of the Day
          </h1>
          {properties.length > 3 ? (
            <div className="flex items-center max-md:hidden">
              <Link
                href="/standouts"
                prefetch
                className="border border-red-600 text-red-600 px-4 py-2 rounded-md"
              >
                View All Standouts
              </Link>
            </div>
          ) : null}
        </div>

        <div className="font-nunito flex items-center justify-around mb-4 md:hidden">
          <h1 className="text-gray-800">Handpicked properties for you</h1>
        </div>

        {/* Tabs */}
        {/* Commented Resale Logic */}
        <div className="flex w-full justify-between max-md:justify-around">
          {/* <div className="max-w-4xl mb-4 flex">
            <button
              className={`px-6 py-2 border-b-2 font-medium ${
                propertyCategory === PropertyCategory.RENT
                  ? "text-red-500 border-red-500"
                  : "text-gray-700"
              }`}
              onClick={() =>
                dispatch(setPropertyCategory(PropertyCategory.RENT))
              }
            >
              For Rent
            </button>
            <button
              className={`px-6 py-2 border-b-2 font-medium ${
                propertyCategory === PropertyCategory.RESALE
                  ? "text-red-500 border-red-500"
                  : "text-gray-700"
              }`}
              onClick={() =>
                dispatch(setPropertyCategory(PropertyCategory.RESALE))
              }
            >
              For Sale
            </button>
          </div> */}
          {/* View All Button */}
          {/* <div className="flex mb-4 max-md:hidden">
            <Link
              href="/standouts"
              prefetch
              className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
            >
              View All Standouts
            </Link>
          </div> */}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        {/* Property Grid */}
        <Carousel2D
          gap={4}
          showDots={false}
          showArrows
          responsiveSlidesPerView={true}
          containerClassName="px-2 max-md:hidden"
          className="max-md:hidden"
        >
          {properties.map((property) => (
            <Properties
              key={property.propertyID}
              property={property}
              badgeType={property.badges}
              showCarouselDots={false}
              onClick={(e: React.MouseEvent) =>
                handleCardClick(e, property.propertyID)
              }
            />
          ))}
        </Carousel2D>
      </div>
      <div className="md:hidden pb-safe-bottom">
        <Carousel2D
          gap={4}
          showDots={false}
          showArrows
          responsiveSlidesPerView
          containerClassName="md:hidden px-6"
          className="md:hidden"
        >
          {properties.map((property) => (
            <Properties
              key={property.propertyID}
              property={property}
              badgeType={property.badges}
              showCarouselDots={false}
              onClick={(e: React.MouseEvent) =>
                handleCardClick(e, property.propertyID)
              }
            />
          ))}
        </Carousel2D>
      </div>
    </>
  );
};

export default StandoutsClient;
