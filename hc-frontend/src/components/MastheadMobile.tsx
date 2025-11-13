import dynamic from "next/dynamic";
// import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
// import bannerBackgroundMobile from "public/images/banner-background-mobile.webp";
import bannerPeopleMobile from "public/images/banner-people-mobile.webp";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { useDialog } from "@/providers/DialogContextProvider";
import { setPropertyCategory as setSearchPropertyCategory } from "@/store/propertySearchSlice";
import { setPropertyCategory as setListPropertyCategory } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { ImageWithLoader } from "@/utility-components";

import HomeSearchBar from "./HomeSearchBar";
import Link from "next/link";
import { BENGALURU_LOCATION } from "@/common/constants";

const FindFlatmates = dynamic(
  () => import("public/icons/find-flatmates.svg"),
) as React.FC<React.SVGProps<SVGSVGElement>>;
const FindRooms = dynamic(
  () => import("public/icons/find-rooms.svg"),
) as React.FC<React.SVGProps<SVGSVGElement>>;
const WeeklyStandouts = dynamic(
  () => import("public/icons/weekly-standouts.svg"),
) as React.FC<React.SVGProps<SVGSVGElement>>;
const ListProperty = dynamic(
  () => import("public/icons/list-property.svg"),
) as React.FC<React.SVGProps<SVGSVGElement>>;
const Deal = dynamic(() => import("public/icons/deal.svg")) as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const ZeroPercent = dynamic(
  () => import("public/icons/zero-percent.svg"),
) as React.FC<React.SVGProps<SVGSVGElement>>;

const MastHeadMobile: React.FC = () => {
  const dispatch = useDispatch();
  const { openDialog } = useDialog();
  const propertyCategory = useSelector(
    (state: RootState) => state.propertySearch.propertyCategory,
  );
  const router = useRouter();

  const searchParams = useSearchParams();

  const handleFindFlatmates = () => {
    dispatch(setListPropertyCategory(PropertyCategory.FLATMATE));
    // dispatch(ListPropertyMobileS)
    router.push("/list-property");
  };

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
      <div>
        {/* Tabs */}
        <div className="flex justify-center">
          <button
            onClick={() =>
              dispatch(setSearchPropertyCategory(PropertyCategory.RENT))
            }
            className={`px-8 py-2 border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RENT ? "text-red-500 border-red-500" : "text-gray-700 "}`}
          >
            Flats for rent
          </button>
          <button
            onClick={() =>
              dispatch(setSearchPropertyCategory(PropertyCategory.FLATMATE))
            }
            className={`px-8 py-2 border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.FLATMATE ? "text-red-500 border-red-500" : "text-gray-700 "}`}
          >
            Find rooms
          </button>
          {/* <button
            onClick={() =>
              dispatch(setPropertyCategory(PropertyCategory.RESALE))
            }
            className={`px-8 py-2 border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RESALE ? "text-red-500 border-red-500" : "text-gray-700 "}`}
          >
            Buy
          </button> */}
        </div>

        {/* Search */}
        <HomeSearchBar id="mobile-search-bar" />
      </div>

      {/* Tagline */}
      <div className="flex justify-center items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-inter">No Middleman,</span>
          <span className="text-xl font-nunito text-red-500 ">
            Just Connects
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
            onClick={handleFindFlatmates}
          >
            <div className="rounded-full">
              <FindFlatmates />
            </div>
          </button>
          <div className="text-center mt-2">
            <div className="text-sm font-nunito">Find Flatmates</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center self-start justify-self-center">
          <Link
            href={`/property-search?lat=${BENGALURU_LOCATION.lat}&lon=${BENGALURU_LOCATION.lng}&propertyCategory=flatmate`}
            data-category="flatmate"
            data-active={
              searchParams.get("propertyCategory") === "flatmate"
                ? "true"
                : "false"
            }
            className="bg-white p-4 border border-gray-200 rounded-2xl shadow-lg justify-center items-center"
            aria-label="find-rooms"
          >
            <div className="rounded-full">
              <FindRooms />
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
            onClick={() => openDialog("standouts-dialog")}
            name="weekly-standouts"
            aria-label="weekly-standouts"
          >
            <div className="rounded-full">
              <WeeklyStandouts />
            </div>
          </button>
          <div className="text-center mt-2">
            <div className="text-sm font-nunito">Weekly Standouts</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center self-start justify-self-center">
          <button
            className="bg-white p-4 border border-gray-200 rounded-2xl shadow-lg justify-center items-center relative"
            onClick={() => router.push("/list-property")}
            role="button"
            name="list-property"
            aria-label="list-property"
          >
            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded">
              FREE
            </div>
            <div className="rounded-full">
              <ListProperty />
            </div>
          </button>
          <div className="text-center mt-2 flex-1">
            <div className="text-sm font-nunito">List Your Property</div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="relative w-full flex justify-center">
        <div className="rounded-2xl p-5 relative overflow-hidden w-full">
          <div className="absolute inset-0 pointer-events-none">
            <ImageWithLoader
              src={bannerPeopleMobile.src}
              alt="Banner People"
              fill
              className="object-cover object-right"
              sizes="100vw"
              fetchPriority="high"
              priority
            />
          </div>
          <div className="w-full relative">
            <h3 className="font-bold">Introducing connects</h3>
            <p className="text-xs text-gray-600 mt-2">
              The new way to find your house
            </p>

            <div className="flex items-center mt-2 gap-2">
              <ZeroPercent />
              <span className="text-sm">ZERO brokerage</span>
            </div>

            <div className="flex items-center mt-2 gap-3">
              <Deal />
              <span className="text-sm">Direct Deals</span>
            </div>
          </div>
        </div>
        <button
          className="absolute right-6 -bottom-6 bg-red-500 text-white font-nunito px-4 py-2 rounded-2xl border-4 border-red-100 font-bold"
          onClick={() => router.push("/what-are-connects")}
        >
          Know More
        </button>
      </div>
    </div>
  );
};

export default MastHeadMobile;
