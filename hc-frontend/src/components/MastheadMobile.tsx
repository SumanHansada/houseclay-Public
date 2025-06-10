import Image from "next/image";
import DealSvg from "public/icons/deal.svg";
import FindFlatmatesSvg from "public/icons/find-flatmates.svg";
import FindRoomsSvg from "public/icons/find-rooms.svg";
import ListPropertySvg from "public/icons/list-property.svg";
import SearchSvg from "public/icons/search.svg";
import WeeklyStandoutsSvg from "public/icons/weekly-standouts.svg";
import ZeroPercentSvg from "public/icons/zero-percent.svg";
import bannerBackgroundMobile from "public/images/banner-background-mobile.webp";
import bannerPeopleMobile from "public/images/banner-people-mobile.webp";
import { useState } from "react";

import { useDialog } from "@/providers/DialogContextProvider";

import PlacesAutocomplete from "./common/PlacesAutocomplete";

const Search = SearchSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const FindFlatmates = FindFlatmatesSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const FindRooms = FindRoomsSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const WeeklyStandouts = WeeklyStandoutsSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const ListProperty = ListPropertySvg as React.FC<React.SVGProps<SVGSVGElement>>;
const Deal = DealSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const ZeroPercent = ZeroPercentSvg as React.FC<React.SVGProps<SVGSVGElement>>;

interface MastHeadMobileProps {
  activeTab: string;
  setActiveTab: (tab: "rent" | "buy") => void;
}

const MastHeadMobile: React.FC<MastHeadMobileProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { openDialog } = useDialog();

  const [location, setLocation] = useState<{
    latitude?: number;
    longitude?: number;
    name?: string;
    address?: string;
  } | null>(null);

  return (
    <div className="relative flex flex-col px-8 pt-8 pb-14 gap-6">
      <div className="absolute inset-0 -z-10">
        <Image
          src={bannerBackgroundMobile}
          alt="Banner Background"
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
      </div>
      {/* Tabs and Search */}
      <div>
        {/* Tabs */}
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab("rent")}
            className={`px-8 py-2 border-b-2 border-gray-300 ${activeTab === "rent" ? "text-red-500 border-red-500" : "text-gray-700 "}`}
          >
            Rent
          </button>
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-8 py-2 border-b-2 border-gray-300 ${activeTab === "buy" ? "text-red-500 border-red-500" : "text-gray-700 "}`}
          >
            Buy
          </button>
        </div>

        {/* Search */}
        <div>
          <div className="flex pl-8 pr-2 py-2 rounded-full bg-white border border-gray-200">
            <div className="flex-1 pr-2 justify-center items-center self-center bg-white">
              <PlacesAutocomplete
                id="location"
                name="location"
                placeholder="Enter a locality or location..."
                value={location?.name || ""}
                onChange={(value) => {
                  setLocation((prev) => {
                    return {
                      ...prev,
                      name: value,
                    };
                  });
                }}
                onLocationSelect={(value) => {
                  setLocation((prev) => {
                    return {
                      ...prev,
                      latitude: value.latitude,
                      longitude: value.longitude,
                      name: value.name,
                      address: value.address,
                    };
                  });
                }}
                onBlur={() => {
                  console.log("blur");
                }}
                containerClassName="w-full relative"
                labelClassName="text-sm font-medium text-gray-900 mb-1"
                inputClassName="w-full p-3"
                dropdownClassName="absolute z-10 mt-1 py-1 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-b-xl"
                dropdownItemClassName="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
                errorClassName="mt-1 text-sm text-red-600"
              />
            </div>
            {/* Search Button */}
            <button className=" text-white flex items-center justify-center">
              <Search width={40} height={40} />
            </button>
          </div>
        </div>
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
            className="bg-white p-4 rounded-2xl shadow-lg justify-center items-center "
            role="button"
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
          <button
            className="bg-white p-4 rounded-2xl shadow-lg justify-center items-center"
            role="button"
          >
            <div className="rounded-full">
              <FindRooms />
            </div>
          </button>
          <div className="text-center mt-2">
            <div className="text-sm font-nunito">Find Rooms</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center self-start justify-self-center">
          <button
            className="bg-white p-4 rounded-2xl shadow-lg justify-center items-center"
            role="button"
            onClick={() => openDialog("standouts-dialog")}
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
            className="bg-white p-4 rounded-2xl shadow-lg justify-center items-center relative"
            role="button"
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
            <Image
              src={bannerPeopleMobile}
              alt="Banner People"
              fill
              className="object-cover object-right"
              sizes="100vw"
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
        <button className="absolute right-6 -bottom-6 bg-red-500 text-white font-nunito px-4 py-2 rounded-2xl border-4 border-red-100 font-bold">
          Know More
        </button>
      </div>
    </div>
  );
};

export default MastHeadMobile;
