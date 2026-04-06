import { useDispatch, useSelector } from "react-redux";

import { flatmateIconURL, rentIconURL } from "@/common/constants/cdnURLs";
import { PropertyCategory } from "@/common/enums";
import { setPropertyCategory } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import RemoteSvg from "@/utility-components/RemoteSvg";

interface PropertyTypeOptionsProps {
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  handlePrefetch?: () => void;
}

const propertyTypes = [
  {
    label: "Rent",
    icon: rentIconURL,
    type: PropertyCategory.RENT,
  },
  // {
  //   label: "Resale",
  //   icon: resaleIconURL,
  //   type: PropertyCategory.RESALE,
  // },
  {
    label: "Flatmate",
    icon: flatmateIconURL,
    type: PropertyCategory.FLATMATE,
  },
];

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Select listing type
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose the type of listing you want to create for this user.
        </p>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        {propertyTypes.map((option) => {
          const isSelected = propertyCategory === option.type;
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => dispatch(setPropertyCategory(option.type))}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors text-left ${
                isSelected
                  ? "border-red-500 bg-red-50/40"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-start gap-2">
                <span
                  className={`transition-opacity duration-200 ${
                    isSelected ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <RemoteSvg src={option.icon} />
                </span>
                <span className="font-medium text-gray-800">
                  {option.label}
                </span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? "border-red-500 bg-white" : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 justify-between">
        {onBack && (
          <button
            type="button"
            className="w-1/3 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl transition-colors"
            onClick={onBack}
          >
            {backLabel}
          </button>
        )}
        <button
          type="button"
          className="flex-1 border border-red-500 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300"
          onClick={onNext}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          disabled={!propertyCategory}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PropertyTypeOptions;
