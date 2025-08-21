import React from "react";

export interface RadioOption {
  value: string | boolean;
  label: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  horizontal?: boolean;
  withIcons?: boolean;
  selectedColor?: string;
  disabled?: boolean;
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
  selectedColor = "border border-red-500",
  disabled = false,
  containerClassName = "mb-4",
  labelClassName = "block text-gray-700 text-sm font-medium mb-1",
  radioGroupClassName = `${horizontal ? "gap-3 xl:gap-6" : "gap-2"}`,
  radioOptionClassName = "border rounded-xl w-full relative transition-all",
  radioLabelClassName = "block p-3 w-full h-full",
  radioInputClassName = "sr-only",
  radioTextClassName = "",
  errorClassName = "text-red-500 text-sm mt-1",
  value,
  onChange,
  onBlur,
  error,
}) => {
  const isSelected = (optionValue: string | boolean) => value === optionValue;

  const handleChange = (optionValue: string | boolean) => {
    if (disabled) return;
    onChange(optionValue);
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
  };

  const layout = horizontal ? `grid ${gridCols[columns]}` : "grid grid-cols-1";

  return (
    <div className={containerClassName}>
      {label && (
        <label id={`${name}-group-label`} className={labelClassName}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`${layout} ${radioGroupClassName}`}
        role="radiogroup"
        aria-labelledby={`${name}-group-label`}
        aria-disabled={disabled}
      >
        {options.map((option) => {
          const selected = isSelected(option.value);
          return (
            <div
              key={String(option.value)}
              onClick={() => handleChange(option.value)}
              className={`
                ${radioOptionClassName}
                ${selected ? `${selectedColor}` : "border-gray-300 hover:border-gray-400"}
                ${disabled ? "cursor-not-allowed bg-gray-50" : "cursor-pointer"}
              `}
              role="radio"
              aria-checked={selected}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handleChange(option.value);
                }
              }}
            >
              <label
                htmlFor={`${name}-${String(option.value)}`}
                className={`
                  ${radioLabelClassName}
                  ${withIcons ? "text-center flex flex-col" : "flex"}
                  items-center justify-center
                  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <input
                  type="radio"
                  id={`${name}-${String(option.value)}`}
                  name={name}
                  value={String(option.value)}
                  checked={selected}
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
          );
        })}
      </div>

      {error ? <div className={errorClassName}>{error}</div> : null}
    </div>
  );
};

export default RadioGroup;
