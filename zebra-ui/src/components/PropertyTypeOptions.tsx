import { useDispatch, useSelector } from "react-redux";

import { flatmateIconURL, rentIconURL } from "@/common/constants/cdnURLs";
import { PropertyCategory } from "@/common/enums";
import { MobileFooter } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setPropertyCategory } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import RemoteSvg from "@/utility-components/RemoteSvg";

import PropertyTypeOption from "./PropertyTypeOption";

interface PropertyTypeOptionsProps {
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  handlePrefetch?: () => void;
}

const PropertyTypeOptions = ({
  onBack,
  backLabel = "Back",
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
      icon: <RemoteSvg src={rentIconURL} />,
      type: PropertyCategory.RENT,
    },
    // {
    //   id: "resale",
    //   label: "Resale",
    //   icon: <RemoteSvg src={resaleIconURL} className="size-full" />,
    //   type: PropertyCategory.RESALE,
    // },
    {
      id: "flatmate",
      label: "Flatmate",
      icon: <RemoteSvg src={flatmateIconURL} />,
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
        className={`grid ${isMobile ? "grid-cols-3 max-md:grid-cols-1 lg:gap-4 gap-4" : "grid-cols-2 max-md:grid-cols-1 gap-4 justify-between"} lg:mb-8 mb-4`}
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
      <div className={`flex gap-4 mt-auto max-md:hidden justify-between`}>
        {onBack && (
          <button
            type="button"
            className={`text-center w-1/4 border border-gray-300 text-gray-700 hover:bg-gray-50 px-2 xl:px-6  py-2 xl:py-3 rounded-xl transition duration-200`}
            onClick={onBack}
          >
            {backLabel}
          </button>
        )}
        <button
          type="button"
          className={`text-center flex-1 border border-red-500 bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 hover:bg-red-600 text-white px-6 py-2 xl:py-3 rounded-xl transition duration-200`}
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
              {backLabel}
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
