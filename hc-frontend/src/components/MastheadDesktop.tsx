import bannerBackground from "public/images/banner-background.webp";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import HomeSearchBar from "@/components/HomeSearchBar";
import { setPropertyCategory } from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { ImageWithLoader } from "@/utility-components";

const MastHeadDesktop = () => {
  const propertyCategory = useSelector(
    (state: RootState) => state.propertySearch.propertyCategory,
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className="absolute inset-0">
        <ImageWithLoader
          src={bannerBackground.src}
          alt="Banner Background"
          fill
          className="object-cover object-right"
          fetchPriority="high"
          priority
        />
      </div>
      <div className="absolute h-full flex flex-col justify-center xl:pl-40 lg:pl-14 pl-14 xl:w-7/12 lg:w-7/12 md:w-4/5 w-4/5">
        {/* Headings */}
        <div className="max-w-md mb-8">
          <h1 className="xl:text-6xl lg:text-5xl text-5xl font-bold text-gray-900 mb-2">
            No Middlemen
          </h1>
          <h2 className="xl:text-5xl lg:text-4xl text-4xl text-gray-800">
            Just Connects
          </h2>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl flex justify-start pl-8 mb-4">
          <button
            className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RENT ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"}`}
            onClick={() => dispatch(setPropertyCategory(PropertyCategory.RENT))}
          >
            Rent
          </button>
          <button
            className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RESALE ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"}`}
            onClick={() =>
              dispatch(setPropertyCategory(PropertyCategory.RESALE))
            }
          >
            Buy
          </button>
        </div>

        {/* Search Form */}
        <HomeSearchBar id="desktop-search-bar" />
      </div>
    </>
  );
};

export default MastHeadDesktop;
