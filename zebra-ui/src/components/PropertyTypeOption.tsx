interface PropertyTypeOptionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  iconClassName?: string;
  className?: string;
  onChange: () => void;
}

const PropertyTypeOption: React.FC<PropertyTypeOptionProps> = ({
  id,
  label,
  icon,
  isSelected,
  iconClassName,
  className,
  onChange,
}) => {
  return (
    <div className="flex flex-1 focus-within:ring-1 focus-within:rounded-lg focus-within:ring-red-500">
      <label
        htmlFor={id}
        className={`flex flex-1 items-start justify-between lg:p-4 p-2 rounded-lg border border-gray-300 cursor-pointer text-center ${
          isSelected ? "border-red-500" : ""
        } ${className}`}
      >
        <div className={`flex flex-col items-start justify-center`}>
          <span className={`${iconClassName}`}>{icon}</span>
          <span>{label}</span>
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
        name="propertyType"
        className="sr-only"
        checked={isSelected}
        onChange={onChange}
      />
    </div>
  );
};

export default PropertyTypeOption;
