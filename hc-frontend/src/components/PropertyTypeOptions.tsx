import FlatmatesSvg from "public/icons/flatmates.svg";
import RentSvg from "public/icons/rent.svg";
import ResaleSvg from "public/icons/resale.svg";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { MobileFooter } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setPropertyCategory } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

import PropertyTypeOption from "./PropertyTypeOption";

const Rent = RentSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const Resale = ResaleSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const Flatmates = FlatmatesSvg as React.FC<React.SVGProps<SVGSVGElement>>;

interface PropertyTypeOptionsProps {
  onBack?: () => void;
  onNext?: () => void;
  handlePrefetch?: () => void;
}

const PropertyTypeOptions = ({
  onBack,
  onNext,
  handlePrefetch,
}: PropertyTypeOptionsProps) => {
  const dispatch = useDispatch();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );
  const { isMobile, isTablet } = useDeviceContext();

  const propertyTypes = [
    {
      id: "rent",
      label: "Rent",
      icon: <Rent />,
      type: PropertyCategory.RENT,
    },
    {
      id: "resale",
      label: "Resale",
      icon: <Resale />,
      type: PropertyCategory.RESALE,
    },
    {
      id: "flatmates",
      label: "Flatmates",
      icon: <Flatmates />,
      type: PropertyCategory.FLATMATE,
    },
  ];

  return (
    <div className="flex flex-col gap-4 xl:gap-8 h-full">
      <h1
        className={`${isMobile ? "text-2xl" : "lg:text-2xl text-xl lg:mb-8 mb-4"}`}
      >
        Tell us about your property
      </h1>
      <div
        className={`grid ${isMobile ? "grid-cols-3 max-md:grid-cols-1 lg:gap-4 gap-4" : "grid-cols-3 max-md:grid-cols-1 lg:gap-4 gap-2"} lg:mb-8 mb-4`}
      >
        {propertyTypes.map((option) => (
          <PropertyTypeOption
            key={option.id}
            id={option.id}
            label={option.label}
            icon={option.icon}
            className={isMobile ? "px-4 items-center" : ""}
            isSelected={propertyCategory === option.type}
            iconClassName={`${
              propertyCategory === option.type ? "opacity-100" : "opacity-50"
            } transition-opacity duration-200`}
            onChange={() => dispatch(setPropertyCategory(option.type))}
          />
        ))}
      </div>
      <div className={`flex gap-4 mt-auto max-md:hidden`}>
        {onBack && (
          <button
            type="button"
            className={`text-center w-1/3 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl transition duration-200`}
            onClick={onBack}
          >
            Back
          </button>
        )}
        <button
          type="button"
          className={`text-center flex-1 border border-red-500 bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition duration-200`}
          onClick={onNext}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          disabled={!propertyCategory}
        >
          {isTablet ? "Start Posting" : "Start Posting Your Free Listing"}
        </button>
      </div>
      <MobileFooter>
        <div className={`flex gap-2 mt-auto w-full md:hidden`}>
          {onBack && (
            <button
              type="button"
              className={`text-center w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl transition duration-200`}
              onClick={onBack}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className={`text-center w-full border border-red-500  bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition duration-200`}
            onClick={onNext}
            onMouseEnter={handlePrefetch}
            onFocus={handlePrefetch}
            disabled={!propertyCategory}
          >
            Next
          </button>
        </div>
      </MobileFooter>
    </div>
  );
};

export default PropertyTypeOptions;
