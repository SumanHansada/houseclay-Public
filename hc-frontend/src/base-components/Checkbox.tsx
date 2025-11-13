import React from "react";

interface CheckboxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CheckboxProps {
  name: string;
  label?: string;
  options: CheckboxOption[];
  required?: boolean;
  columns?: 1 | 2 | 3 | 4;
  withIcons?: boolean;
  selectedColor?: string;
  className?: string;
  alignment?: "start" | "center" | "end";
  disabled?: boolean;
  // Formik props
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  options,
  required = false,
  columns = 3,
  withIcons = false,
  selectedColor = "border-red-500",
  className = "",
  alignment = "center",
  disabled = false,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    const currentValues = value || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];

    onChange(newValues);
  };

  const isChecked = (optionValue: string) => {
    return (value || []).includes(optionValue);
  };

  // Define grid columns based on the columns prop
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`mt-6 ${className}`}>
      {label && (
        <fieldset>
          <legend className="block text-gray-700 text-sm font-medium mb-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </legend>
        </fieldset>
      )}

      <div className={`grid ${gridCols[columns]} gap-3 xl:gap-6`} role="group">
        {options.map((option) => (
          <div
            key={option.value}
            className={`
              border rounded-xl transition-all 
              flex flex-col items-${alignment} justify-center 
              ${
                isChecked(option.value)
                  ? `${selectedColor} border`
                  : "border-gray-300 hover:border-gray-400"
              }
              ${disabled ? "cursor-not-allowed bg-gray-100" : ""}
            `}
            tabIndex={disabled ? -1 : 0}
            onClick={(e) => {
              e.preventDefault();
              handleToggle(option.value);
            }}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggle(option.value);
              }
            }}
            aria-checked={isChecked(option.value)}
            aria-labelledby={`${name}-label-${option.value}`}
            role="checkbox"
            aria-disabled={disabled}
          >
            <label
              htmlFor={`${name}-${option.value}`}
              id={`${name}-label-${option.value}`}
              className={`block p-4 w-full h-full 
                ${withIcons ? "flex flex-col gap-2" : "flex"} 
                  items-${alignment} justify-center
                  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {withIcons && option.icon}
              <span className={`text-${alignment}`}>{option.label}</span>
            </label>
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={isChecked(option.value)}
              onChange={() => handleToggle(option.value)}
              onBlur={onBlur}
              className="sr-only"
              tabIndex={-1}
              aria-label={option.label}
              aria-hidden="true"
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {error ? <div className="text-red-500 text-xs mt-1">{error}</div> : null}
    </div>
  );
};

export default Checkbox;
