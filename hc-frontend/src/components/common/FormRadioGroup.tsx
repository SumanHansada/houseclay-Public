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
  selectedColor = "border-red-500 bg-red-50",
  className = "",
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  const handleFocus = () => {
    helpers.setTouched(true);
  };

  const handleChange = (value: string | boolean) => {
    helpers.setValue(value);
    helpers.setTouched(true);
  };

  const isSelected = (optionValue: string | boolean) => {
    return field.value === optionValue;
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          id={`${name}-group-label`}
          className="block text-gray-700 text-sm font-medium mb-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex w-full justify-between ${
          horizontal ? "flex-wrap gap-3 xl:gap-6" : "flex-col gap-2"
        }`}
        role="radiogroup"
        aria-labelledby={`${name}-group-label`}
      >
        {options.map((option) => (
          <div
            key={String(option.value)}
            className={`
              flex-1 rounded-xl w-full relative
              ${
                isSelected(option.value)
                  ? `${selectedColor} border`
                  : "border border-gray-300 hover:border-gray-400"
              }
               focus-within:shadow-[inset_0_0_0_2px_royalBlue] focus-within:border-transparent
            `}
          >
            <label
              htmlFor={`${name}-${String(option.value)}`}
              className={`
                block cursor-pointer p-3 w-full h-full
                ${withIcons ? "text-center flex flex-col " : "flex "}
              items-center justify-center`}
            >
              <input
                type="radio"
                id={`${name}-${String(option.value)}`}
                name={name}
                value={String(option.value)}
                checked={isSelected(option.value)}
                onChange={() => handleChange(option.value)}
                onFocus={handleFocus}
                className="sr-only"
                aria-label={option.label}
                aria-hidden="true"
              />
              {withIcons && option.icon}
              <span className={`${withIcons ? "text-sm" : ""}`}>
                {option.label}
              </span>
            </label>
          </div>
        ))}
      </div>

      {hasError ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormRadioGroup;
