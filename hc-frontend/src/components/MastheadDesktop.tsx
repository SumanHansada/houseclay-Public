import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import HomeSearchBar from "@/components/HomeSearchBar";
import { setPropertyCategory } from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { SvgIcon } from "@/utility-components";
import { BedDouble } from "lucide-react";

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
      <div className="absolute h-full flex flex-col justify-center xl:pl-40 lg:pl-14 pl-14 xl:w-1/2 lg:w-7/12 md:w-3/5 w-4/5">
        {/* Headings */}
        <div className="max-w-md mb-8">
          <h2 className="flex flex-col xl:text-5xl lg:text-4xl text-4xl max-lg:flex-col text-gray-800 mb-1 gap-2">
            <span className="font-semibold text-nowrap">
              Find Your Perfect Home,
            </span>
            <span className="font-semibold text-nowrap">
              Without the Hassle
              {/* <span className="underline decoration-red-600 decoration-wavy decoration-4 underline-offset-2">
                Hassle
              </span> */}
            </span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl flex justify-start mb-4">
          <button
            className={`flex items-center gap-2 px-2 py-2 text-lg border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RENT ? "text-red-600 border-b-2 border-red-600" : "text-gray-700"}`}
            onClick={() => dispatch(setPropertyCategory(PropertyCategory.RENT))}
          >
            <SvgIcon
              iconSize="small"
              name="instant-access"
              className="size-8 text-black"
            />
            <span className="">Flats for rent</span>
          </button>
          <button
            className={`flex items-center gap-2 px-2 py-2 text-lg border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.FLATMATE ? "text-red-600 border-b-2 border-red-600" : "text-gray-700"}`}
            onClick={() =>
              dispatch(setPropertyCategory(PropertyCategory.FLATMATE))
            }
          >
            <BedDouble className="size-5 text-black" />
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
