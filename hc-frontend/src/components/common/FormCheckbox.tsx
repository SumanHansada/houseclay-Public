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
  selectedColor = "border-red-500",
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

      <div className={`grid ${gridCols[columns]} gap-3 xl:gap-6`}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`
              cursor-pointer border rounded-lg transition-all p-4
              flex flex-col items-${alignment} justify-center
              focus-within:ring-2 focus-within:rounded-xl focus-within:ring-red-500
              ${
                isChecked(option.value)
                  ? `${selectedColor} border-2`
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
          >
            <label
              htmlFor={`${name}-${option.value}`}
              className={`flex flex-col items-${alignment} justify-center cursor-pointer`}
            >
              {withIcons && option.icon && (
                <div className="mb-2">{option.icon}</div>
              )}
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
