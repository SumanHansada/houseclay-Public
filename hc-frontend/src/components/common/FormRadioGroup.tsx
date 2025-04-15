import { useField } from "formik";
import React from "react";

interface RadioOption {
  value: string;
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

  const handleChange = (value: string) => {
    helpers.setValue(value);
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
        className={`${horizontal ? "flex gap-3 xl:gap-6" : "flex flex-col gap-2"}`}
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleChange(option.value)}
            className={`
              cursor-pointer border rounded-xl transition-all w-full
              ${
                field.value === option.value
                  ? `${selectedColor} border ${withIcons ? "text-red-500" : ""}`
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
            <input
              type="radio"
              id={`${name}-${option.value}`}
              {...field}
              value={option.value}
              checked={field.value === option.value}
              onChange={() => {}}
              className="hidden"
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

export default FormRadioGroup;
