import React from "react";

interface RadioOption {
  value: string | boolean;
  label: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  horizontal?: boolean;
  withIcons?: boolean;
  selectedColor?: string;
  disabled?: boolean;
  // Styling props
  containerClassName?: string;
  labelClassName?: string;
  radioGroupClassName?: string;
  radioOptionClassName?: string;
  radioLabelClassName?: string;
  radioInputClassName?: string;
  radioTextClassName?: string;
  errorClassName?: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  onBlur?: () => void;
  error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  required = false,
  columns = 3,
  horizontal = true,
  withIcons = false,
  selectedColor = "border-red-500",
  disabled = false,
  // Styling props with defaults
  containerClassName = "mb-4",
  labelClassName = "block text-gray-700 text-sm font-medium mb-1",
  radioGroupClassName = "flex w-full justify-between",
  radioOptionClassName = "border flex-1 rounded-xl w-full relative transition-all",
  radioLabelClassName = "block cursor-pointer p-3 w-full h-full",
  radioInputClassName = "sr-only",
  radioTextClassName = "",
  errorClassName = "text-red-500 text-sm mt-1",
  value,
  onChange,
  onBlur,
  error,
}) => {
  const isSelected = (optionValue: string | boolean) => {
    return value === optionValue;
  };

  const handleChange = (optionValue: string | boolean) => {
    if (disabled) return;
    onChange(optionValue);
  };

  // Define grid columns based on the columns prop
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
    8: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label id={`${name}-group-label`} className={labelClassName}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`${radioGroupClassName} ${
          horizontal
            ? `grid ${gridCols[columns]} gap-3 xl:gap-6`
            : "grid grid-cols-1 gap-2"
        }`}
        role="radiogroup"
        aria-labelledby={`${name}-group-label`}
        aria-disabled={disabled}
      >
        {options.map((option) => (
          <div
            key={String(option.value)}
            className={`
              ${radioOptionClassName}
              ${
                isSelected(option.value)
                  ? `${selectedColor} border`
                  : "border-gray-300 hover:border-gray-400"
              }
              ${disabled ? "cursor-not-allowed disabled:bg-gray-300" : ""}
              focus-within:shadow-[inset_0_0_0_2px_royalBlue] focus-within:border-transparent
            `}
          >
            <label
              htmlFor={`${name}-${String(option.value)}`}
              className={`
                ${radioLabelClassName}
                ${withIcons ? "text-center flex flex-col " : "flex "}
                items-center justify-center
                ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <input
                type="radio"
                id={`${name}-${String(option.value)}`}
                name={name}
                value={String(option.value)}
                checked={isSelected(option.value)}
                onChange={() => handleChange(option.value)}
                onBlur={onBlur}
                className={radioInputClassName}
                aria-label={option.label}
                disabled={disabled}
              />
              {withIcons && option.icon}
              <span
                className={`${withIcons ? "text-sm" : ""} ${radioTextClassName}`}
              >
                {option.label}
              </span>
            </label>
          </div>
        ))}
      </div>

      {error ? <div className={errorClassName}>{error}</div> : null}
    </div>
  );
};

export default RadioGroup;
