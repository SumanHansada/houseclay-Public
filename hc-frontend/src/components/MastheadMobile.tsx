import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { bannerPeopleMobileImageURL } from "@/common/cdnURLs";
import { EXPLORE_LOCATION } from "@/common/constants";
import { STANDOUTS_DIALOG_ID } from "@/common/dialogConstants";
import { PropertyCategory } from "@/common/enums";
import { useDialog } from "@/providers/DialogContextProvider";
import { setPropertyCategory as setSearchPropertyCategory } from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { SvgIcon } from "@/utility-components";

import HomeSearchBar from "./HomeSearchBar";

const MastHeadMobile: React.FC = () => {
  const dispatch = useDispatch();
  const { openDialog } = useDialog();
  const propertyCategory = useSelector(
    (state: RootState) => state.propertySearch.propertyCategory,
  );
  const router = useRouter();

  const searchParams = useSearchParams();

  return (
    <div className="relative flex flex-col px-6 pt-8 pb-14 gap-6">
      {/* <div className="absolute inset-0 -z-10">
        <Image
          src={bannerBackgroundMobile}
          alt="Banner Background"
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
      </div> */}
      {/* Tabs and Search */}
      <div className="w-full">
        {/* Tabs */}
        <div className="flex justify-center w-4/5 mx-auto">
          <button
            onClick={() =>
              dispatch(setSearchPropertyCategory(PropertyCategory.RENT))
            }
            className={`w-1/2 py-2 border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RENT ? "text-red-600 border-red-600" : "text-gray-700 "}`}
          >
            Flats for rent
          </button>
          <button
            onClick={() =>
              dispatch(setSearchPropertyCategory(PropertyCategory.FLATMATE))
            }
            className={`w-1/2 py-2 border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.FLATMATE ? "text-red-600 border-red-600" : "text-gray-700 "}`}
          >
            Find rooms
          </button>
          {/* <button
            onClick={() =>
              dispatch(setPropertyCategory(PropertyCategory.RESALE))
            }
            className={`px-8 py-2 border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RESALE ? "text-red-600 border-red-600" : "text-gray-700 "}`}
          >
            Buy
          </button> */}
        </div>

        {/* Search */}
        <HomeSearchBar id="mobile-search-bar" />
      </div>

      {/* Tagline */}
      <div className="flex flex-col justify-center items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-inter text-nowrap">
            Stop Searching.
          </span>
          <span className="text-xl font-nunito text-red-600 text-nowrap">
            Start Connecting.
          </span>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-4 gap-4 place-items-start">
        <div className="flex flex-col items-center justify-center self-start justify-self-center">
          <button
            className="bg-white p-4 border border-gray-200 rounded-2xl shadow-lg justify-center items-center "
            role="button"
            name="find-flatmates"
            aria-label="find-flatmates"
            onClick={() => router.push("/find-flatmates")}
          >
            <div className="rounded-full w-10 h-10 items-center justify-center">
              <SvgIcon name="find-flatmates" size={40} />
            </div>
          </button>
          <div className="text-center mt-2">
            <div className="text-sm font-nunito">Find Flatmates</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center self-start justify-self-center">
          <Link
            href={`/property-search?lat=${EXPLORE_LOCATION.lat}&lon=${EXPLORE_LOCATION.lng}&propertyCategory=flatmate`}
            data-category="flatmate"
            data-active={
              searchParams.get("propertyCategory") === "flatmate"
                ? "true"
                : "false"
            }
            className="bg-white p-4 border border-gray-200 rounded-2xl shadow-lg justify-center items-center"
            aria-label="find-rooms"
          >
            <div className="rounded-full w-10 h-10 flex items-center justify-center">
              <SvgIcon name="find-rooms" size={40} />
            </div>
          </Link>
          <div className="text-center mt-2">
            <div className="text-sm font-nunito px-4">Find Rooms</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center self-start justify-self-center">
          <button
            className="bg-white p-4 border border-gray-200 rounded-2xl shadow-lg justify-center items-center"
            role="button"
            onClick={() => openDialog(STANDOUTS_DIALOG_ID)}
            name="weekly-standouts"
            aria-label="weekly-standouts"
          >
            <div className="rounded-full w-10 h-10 flex items-center justify-center">
              <SvgIcon name="weekly-standouts" size={40} />
            </div>
          </button>
          <div className="text-center mt-2">
            <div className="text-sm font-nunito">Weekly Standouts</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center self-start justify-self-center">
          <Link
            href="/list-property"
            className="bg-white p-4 border border-gray-200 rounded-2xl shadow-lg justify-center items-center relative"
            aria-label="list-property"
          >
            <div className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-0.5 text-xs rounded">
              FREE
            </div>
            <div className="rounded-full w-10 h-10 flex items-center justify-center">
              <SvgIcon name="list-property" size={40} />
            </div>
          </Link>
          <div className="text-center mt-2 flex-1">
            <div className="text-sm font-nunito">List Your Property</div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="relative w-full flex justify-center">
        <div className="rounded-2xl p-5 relative overflow-hidden w-full">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={bannerPeopleMobileImageURL}
              alt="Houseclay Banner People"
              fetchPriority="high"
              decoding="async"
              style={{
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "right",
              }}
            />
          </div>
          <div className="w-full relative">
            <h3 className="font-bold">Introducing connects</h3>
            <p className="text-xs text-gray-600 mt-2">
              The new way to find your house
            </p>

            <div className="flex items-center mt-2 gap-2">
              <SvgIcon name="zero-percent" size={24} />
              <span className="text-sm">ZERO brokerage</span>
            </div>

            <div className="flex items-center mt-2 gap-3">
              <SvgIcon name="deal" size={21} />
              <span className="text-sm">Direct Deals</span>
            </div>
          </div>
        </div>
        <button
          className="absolute right-6 -bottom-6 bg-red-600 text-white font-nunito px-4 py-2 rounded-2xl border-4 border-red-100 font-bold"
          onClick={() => router.push("/what-are-connects")}
        >
          Know More
        </button>
      </div>
    </div>
  );
};

export default MastHeadMobile;
