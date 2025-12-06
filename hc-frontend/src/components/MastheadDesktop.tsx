import { useDispatch, useSelector } from "react-redux";

import { CDN_BASE_URL } from "@/common/constants";
import { PropertyCategory } from "@/common/enums";
import HomeSearchBar from "@/components/HomeSearchBar";
import { setPropertyCategory } from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";

const bannerBackgroundURL =
  CDN_BASE_URL + "/public/images/banner-background.webp";

const MastHeadDesktop = () => {
  const propertyCategory = useSelector(
    (state: RootState) => state.propertySearch.propertyCategory,
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className="absolute inset-0">
        <img
          src={bannerBackgroundURL}
          alt="Banner Background"
          fetchPriority="high"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "right",
          }}
        />
      </div>
      <div className="absolute h-full flex flex-col justify-center xl:pl-40 lg:pl-14 pl-14 xl:w-7/12 lg:w-7/12 md:w-4/5 w-4/5">
        {/* Headings */}
        <div className="max-w-md mb-8">
          <h2 className="flex xl:text-4xl lg:text-4xl text-4xl max-lg:flex-col text-gray-800 mb-1 gap-2">
            <span className="font-semibold text-nowrap">Stop Searching.</span>
            <span className="text-red-500 text-nowrap">Start Connecting.</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl flex justify-start pl-8 mb-4">
          <button
            className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RENT ? "text-red-600 border-b-2 border-red-600" : "text-gray-700"}`}
            onClick={() => dispatch(setPropertyCategory(PropertyCategory.RENT))}
          >
            Flats for rent
          </button>
          <button
            className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.FLATMATE ? "text-red-600 border-b-2 border-red-600" : "text-gray-700"}`}
            onClick={() =>
              dispatch(setPropertyCategory(PropertyCategory.FLATMATE))
            }
          >
            Find rooms
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
