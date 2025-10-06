"use client";

import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { PropertySearch } from "@/interfaces/PropertySearch";
import { setPropertyCategory } from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";

import Carousel2D from "./Carousel2D";
import Properties from "./Properties";
import Link from "next/link";

interface StandoutsClientProps {
  properties: PropertySearch[];
}

const StandoutsClient: React.FC<StandoutsClientProps> = ({ properties }) => {
  const { propertyCategory } = useSelector(
    (state: RootState) => state.propertySearch,
  );
  const dispatch = useDispatch();
  return (
    <>
      <div className="bg-white bg-center bg-cover flex-col items-center md:py-20 xl:px-28 lg:px-14 md:px-14 max-md:pt-4 max-md:pb-0 px-6 pt-4 pb-0">
        {/* Header Section */}
        <div className="flex items-center mb-8 max-md:hidden">
          <h1 className="text-3xl font-bold text-gray-800">
            Standouts of the Day
          </h1>
        </div>

        <div className="font-nunito flex items-center justify-around mb-4 md:hidden">
          <h1 className="text-gray-800">Handpicked properties for you</h1>
        </div>

        {/* Tabs */}
        <div className="flex w-full justify-between max-md:justify-around">
          <div className="max-w-4xl mb-4 flex">
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
          </div>
          {/* View All Button */}
          <div className="flex mb-4 max-md:hidden">
            {/* <button className="border border-red-500 text-red-500 px-4 py-2 rounded-md"> */}
            <Link
              href="/standouts"
              prefetch
              className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
            >
              View All Standouts
            </Link>
            {/* </button> */}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        {/* Property Grid */}
        <Carousel2D
          slideWidth={370}
          gap={4}
          showDots={false}
          showArrows={true}
          containerClassName="px-2 max-md:hidden"
          className="max-md:hidden"
        >
          {properties.map((property) => (
            <Properties
              key={property.propertyID}
              property={property}
              badgeType={property.badges}
            />
          ))}
        </Carousel2D>
      </div>
      <div className="md:hidden pb-4">
        <Carousel2D
          slideWidth={320}
          gap={4}
          showDots={false}
          showArrows={true}
          containerClassName="md:hidden"
          className="md:hidden"
        >
          {properties.map((property) => (
            <Properties
              key={property.propertyID}
              property={property}
              badgeType={property.badges}
            />
          ))}
        </Carousel2D>
      </div>
    </>
  );
};

export default StandoutsClient;
