interface ListingOptionProps {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  isSelected: boolean;
  className?: string;
  onChange: () => void;
}

const ListingOption: React.FC<ListingOptionProps> = ({
  id,
  icon,
  iconColor,
  title,
  description,
  isSelected,
  className,
  onChange,
}) => {
  return (
    <div
      className={`lg:mb-4 mb-2 focus-within:ring-1 focus-within:rounded-lg focus-within:ring-red-500`}
    >
      <label
        htmlFor={id}
        className={`flex items-center justify-between lg:p-4 p-2 rounded-lg border cursor-pointer lg:gap-12 gap-6 ${
          isSelected ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
        } ${className}`}
      >
        <div className="flex flex-1 items-center gap-4">
          <div
            className={`flex items-center p-1 bg-${iconColor}-50 rounded-full`}
          >
            <div
              className={`flex w-12 h-12  items-center justify-center   rounded-full  bg-${iconColor}-100`}
            >
              {icon}
            </div>
          </div>
          <div>
            <h2 className="lg:text-xl text-sm font-medium">{title}</h2>
            <p className="lg:text-base text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected ? "border-red-500 bg-white" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          )}
        </div>
      </label>
      <input
        type="radio"
        id={id}
        name="listingOption"
        checked={isSelected}
        onChange={onChange}
        className="sr-only" // Visually hidden but accessible
      />
    </div>
  );
};

export default ListingOption;
