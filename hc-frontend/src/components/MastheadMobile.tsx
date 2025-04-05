import DealSvg from "public/icons/deal.svg";
import FindFlatmatesSvg from "public/icons/find-flatmates.svg";
import FindRoomsSvg from "public/icons/find-rooms.svg";
import ListPropertySvg from "public/icons/list-property.svg";
import SearchSvg from "public/icons/search.svg";
import WeeklyStandoutsSvg from "public/icons/weekly-standouts.svg";
import ZeroPercentSvg from "public/icons/zero-percent.svg";

import { useDialog } from "@/providers/DialogContextProvider";

interface MastHeadMobileProps {
  activeTab: string;
  setActiveTab: (tab: "rent" | "buy") => void;
}

const MastHeadMobile: React.FC<MastHeadMobileProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { openDialog } = useDialog();
  const Search = SearchSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const FindFlatmates = FindFlatmatesSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const FindRooms = FindRoomsSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const WeeklyStandouts = WeeklyStandoutsSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const ListProperty = ListPropertySvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const Deal = DealSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const ZeroPercent = ZeroPercentSvg as React.FC<React.SVGProps<SVGSVGElement>>;

  return (
    <div className="bg-[url('/images/banner-background-mobile.png')] flex flex-col bg-top bg-cover px-8 pt-8 pb-14 gap-6">
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
            <div className="flex-1 justify-center items-center self-center bg-white opacity-50">
              <input
                type="text"
                placeholder="Enter a locality or location..."
                className="w-full h-full text-gray-500"
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
      <div className="bg-[url('/images/banner-people-mobile.svg')] bg-cover bg-right bg-no-repeat rounded-2xl p-5 relative">
        <div className="w-full">
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
        <button className="absolute bg-red-500 right-6 -bottom-6 text-white font-nunito px-4 py-2 rounded-2xl border-4 border-red-100 font-bold">
          Know More
        </button>
      </div>
    </div>
  );
};

export default MastHeadMobile;
