import { useField } from "formik";
import React from "react";

interface CheckboxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FormCheckboxProps {
  name: string;
  label?: string;
  options: CheckboxOption[];
  required?: boolean;
  columns?: 1 | 2 | 3 | 4;
  withIcons?: boolean;
  selectedColor?: string;
  className?: string;
  alignment?: "start" | "center" | "end";
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  options,
  required = false,
  columns = 3,
  withIcons = false,
  selectedColor = "border-red-500 bg-red-50",
  className = "",
  alignment = "center",
}) => {
  const [field, meta, helpers] = useField<string[]>(name);

  const handleToggle = (value: string) => {
    const currentValues = field.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    helpers.setValue(newValues);
  };

  const isChecked = (value: string) => {
    return (field.value || []).includes(value);
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
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-medium">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        </div>
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
              }`}
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              handleToggle(option.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggle(option.value);
              }
            }}
            aria-checked={isChecked(option.value)}
            aria-labelledby={`${name}-label-${option.value}`}
            role="checkbox"
          >
            <label
              htmlFor={`${name}-${option.value}`}
              id={`${name}-label-${option.value}`}
              className={`block  cursor-pointer p-4 w-full h-full 
                ${
                  withIcons 
                  ? "flex flex-col gap-2" 
                  : "flex"
                } 
                  items-${alignment} justify-center`
                }
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
              className="sr-only"
              tabIndex={-1}
              aria-label={option.label}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormCheckbox;
