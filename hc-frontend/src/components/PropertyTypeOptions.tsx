import FlatmatesSvg from "public/icons/flatmates.svg";
import RentSvg from "public/icons/rent.svg";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setPropertyCategory } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

import PropertyTypeOption from "./PropertyTypeOption";

const Rent = RentSvg as React.FC<React.SVGProps<SVGSVGElement>>;
// const Resale = ResaleSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const Flatmates = FlatmatesSvg as React.FC<React.SVGProps<SVGSVGElement>>;

interface PropertyTypeOptionsProps {
  onBack?: () => void;
  onNext?: () => void;
  handlePrefetch?: () => void;
}

const PropertyTypeOptions = ({ onBack, onNext }: PropertyTypeOptionsProps) => {
  const dispatch = useDispatch();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );
  const { isTablet } = useDeviceContext();

  const propertyTypes = [
    {
      id: "rent",
      label: "Rent out my property",
      icon: <Rent />,
      type: PropertyCategory.RENT,
    },
    // {
    //   id: "resale",
    //   label: "Resale",
    //   icon: <Resale />,
    //   type: PropertyCategory.RESALE,
    // },
    {
      id: "flatmates",
      label: "Find a flatmate",
      icon: <Flatmates />,
      type: PropertyCategory.FLATMATE,
    },
  ];

  return (
    <div className="flex flex-col gap-4 xl:gap-8 h-full">
      <h1 className="max-md:text-2xl lg:text-2xl text-xl lg:mb-8 mb-4">
        Tell us what we can do for you today!
      </h1>
      <div
        className={`grid max-md:grid-cols-1 grid-cols-2 justify-between gap-4 lg:mb-8 mb-4`}
      >
        {propertyTypes.map((option) => (
          <PropertyTypeOption
            key={option.id}
            id={option.id}
            label={option.label}
            icon={option.icon}
            className="max-md:px-4 items-center"
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
            Back
          </button>
        )}
        <button
          type="button"
          className={`text-center flex-1 border border-red-500 bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 hover:bg-red-600 text-white px-6 py-2 xl:py-3 rounded-xl transition duration-200`}
          onClick={onNext}
          disabled={!propertyCategory}
        >
          {isTablet ? "Start Posting" : "Start Posting Your Free Listing"}
        </button>
      </div>
    </div>
  );
};

export default PropertyTypeOptions;
