"use client";

import { BedDouble } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import HomeSearchBar from "@/components/HomeSearchBar";
import { setPropertyCategory } from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { InfiniteScroller, SvgIcon } from "@/utility-components";

const MastHeadDesktop = () => {
  const propertyCategory = useSelector(
    (state: RootState) => state.propertySearch.propertyCategory,
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className="absolute inset-0">
        <img
          src="https://cdn.houseclay.com/public/images/banner-background.webp"
          srcSet="
          https://cdn.houseclay.com/public/images/banner-background-640w.webp 640w,
          https://cdn.houseclay.com/public/images/banner-background-768w.webp 768w,
          https://cdn.houseclay.com/public/images/banner-background-1024w.webp 1024w,
          https://cdn.houseclay.com/public/images/banner-background-1280w.webp 1280w,
          https://cdn.houseclay.com/public/images/banner-background-2560w.webp 2560w"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
          alt="Houseclay Banner Background"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute h-full flex flex-col justify-center xl:pl-24 lg:pl-12 pl-8 2xl:w-[45%] lg:w-3/5 md:w-8/12 w-4/5">
        {/* Headings */}
        <div className="max-w-md mb-8">
          <h2 className="flex flex-col xl:text-5xl lg:text-4xl text-3xl max-lg:flex-col text-gray-800 mb-1 gap-2">
            <span className="font-semibold text-nowrap">
              Find Your Perfect Home,
            </span>
            <span className="font-semibold text-nowrap">
              Without the Hassle
            </span>
          </h2>
        </div>

        {/* Animated Text Scroller */}
        <InfiniteScroller
          intervalMs={3000}
          className="mb-6 -mt-2 ml-2"
          itemClassName="font-light lg:text-lg text-base justify-start"
        />

        {/* Tabs */}
        <div className="max-w-5xl flex justify-start mb-4 px-2">
          <button
            className={`flex items-center gap-2 px-2 py-2 lg:text-lg text-base border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RENT ? "text-red-600 border-b-2 border-red-600" : "text-gray-700"}`}
            onClick={() => dispatch(setPropertyCategory(PropertyCategory.RENT))}
          >
            <SvgIcon
              iconSize="small"
              name="instant-access"
              size={24}
              className={
                propertyCategory === PropertyCategory.RENT
                  ? "text-red-600"
                  : "text-gray-700"
              }
            />
            <span className="">Flats for rent</span>
          </button>
          <button
            className={`flex items-center gap-2 px-2 py-2 lg:text-lg text-base border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.FLATMATE ? "text-red-600 border-b-2 border-red-600" : "text-gray-700"}`}
            onClick={() =>
              dispatch(setPropertyCategory(PropertyCategory.FLATMATE))
            }
          >
            <BedDouble
              className={`size-5 ${propertyCategory === PropertyCategory.FLATMATE ? "text-red-600" : "text-gray-700"}`}
            />
            <span className="">Find rooms</span>
          </button>
          {/* <button
            className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RESALE ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"}`}
            onClick={() =>
              dispatch(setPropertyCategory(PropertyCategory.RESALE))
            }
          >
            Buy
          </button> */}
        </div>

        {/* Search Form */}
        <HomeSearchBar id="desktop-search-bar" />
      </div>
    </>
  );
};

export default MastHeadDesktop;
