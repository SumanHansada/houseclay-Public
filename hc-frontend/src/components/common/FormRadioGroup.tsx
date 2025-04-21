import { useField } from "formik";
import React from "react";

interface RadioOption {
  value: string | boolean;
  label: string;
  icon?: React.ReactNode;
}

interface FormRadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  horizontal?: boolean;
  withIcons?: boolean;
  selectedColor?: string;
  className?: string;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  name,
  label,
  options,
  required = false,
  horizontal = true,
  withIcons = false,
  selectedColor = "border-red-500",
  className = "",
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (value: string | boolean) => {
    helpers.setValue(value);
  };

  // Helper function to perform strict comparison for any value type
  const isSelected = (optionValue: string | boolean) => {
    return field.value === optionValue;
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`${horizontal ? "flex w-full flex-wrap justify-between gap-3 xl:gap-6" : "flex w-full justify-between flex-col gap-2"}`}
      >
        {options.map((option) => (
          <div
            key={String(option.value)}
            className={`flex-1 rounded-xl focus-within:ring-2 focus-within:rounded-xl focus-within:ring-red-500`}
          >
            <label
              htmlFor={`${name}-${String(option.value)}`}
              className={`
                cursor-pointer border rounded-xl transition-all w-full
                ${
                  isSelected(option.value)
                    ? `${selectedColor} ${withIcons ? "border-2 text-red-500" : "border-2"}`
                    : "border-gray-300 hover:border-gray-400"
                }
                ${
                  withIcons
                    ? "p-3 text-center flex flex-col items-center justify-center"
                    : "p-3 flex items-center justify-center"
                }
              `}
            >
              {withIcons && option.icon && option.icon}
              <span className={`${withIcons ? "text-sm" : ""}`}>
                {option.label}
              </span>
            </label>
            <input
              type="radio"
              id={`${name}-${String(option.value)}`}
              name={name}
              value={String(option.value)}
              checked={isSelected(option.value)}
              onChange={() => handleChange(option.value)}
              className="sr-only"
            />
          </div>
        ))}
      </div>

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormRadioGroup;
