import { useDeviceContext } from "@/providers/DeviceContextProvider";

import Carousel2D from "./Carousel2D";
import Properties, { Property } from "./Properties";

interface StandoutsProps {
  properties: Property[];
  listingType: string;
  setActiveTab: (tab: "rent" | "sale") => void;
}

const Standouts: React.FC<StandoutsProps> = ({
  properties,
  listingType,
  setActiveTab,
}) => {
  const { isMobile } = useDeviceContext();
  return (
    <>
      <div className="bg-white bg-center bg-cover flex-col items-center py-20 xl:px-28 lg:px-14 md:px-14 max-md:py-4 px-8">
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
                listingType === "rent"
                  ? "text-red-500 border-red-500"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab("rent")}
            >
              For Rent
            </button>
            <button
              className={`px-6 py-2 border-b-2 font-medium ${
                listingType === "sale"
                  ? "text-red-500 border-red-500"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab("sale")}
            >
              For Sale
            </button>
          </div>
          {/* View All Button */}
          <div className="flex mb-4 max-md:hidden">
            <button className="border border-red-500 text-red-500 px-4 py-2 rounded-md">
              View All Standouts
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        {/* Property Grid */}
        <Carousel2D
          slideWidth={isMobile ? 325 : 370}
          gap={4}
          showDots={isMobile ? true : false}
          showArrows={true}
          className="max-md:hidden"
          containerClassName="px-2"
        >
          {properties.map((property) => (
            <Properties
              key={property.id}
              property={property}
              badgeType={property.type}
            />
          ))}
        </Carousel2D>
      </div>
      <Carousel2D
        slideWidth={isMobile ? 325 : 370}
        gap={4}
        showDots={isMobile ? true : false}
        showArrows={true}
        className="md:hidden"
        containerClassName="px-2 md:hidden"
      >
        {properties.map((property) => (
          <Properties
            key={property.id}
            property={property}
            badgeType={property.type}
          />
        ))}
      </Carousel2D>
    </>
  );
};

export default Standouts;
