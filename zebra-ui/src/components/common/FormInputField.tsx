import { useField } from "formik";
import React from "react";

interface FormInputFieldProps {
  name: string;
  id?: string;
  label?: string;
  dataType?: "number" | "text"; // Determines how the value is handled
  required?: boolean;
  placeholder?: string;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  // For Now: City will always be Bengaluru
  readOnly?: boolean;
  disabled?: boolean;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
  name,
  id,
  label,
  dataType = "text",
  required = false,
  placeholder = "",
  className = "",
  prefix,
  suffix,
  readOnly = false,
  disabled = false,
}) => {
  const [field, meta, helpers] = useField(name);

  // Format numeric values for display
  const formatNumber = (value: string | number): string => {
    if (value === null || value === undefined || value === "") return "";
    const numericValue = String(value).replace(/[^0-9]/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-IN")
      : "";
  };

  // Parse formatted numeric values back to raw number
  const parseNumber = (formattedValue: string): number => {
    const numericValue = formattedValue.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!readOnly && !disabled && dataType === "number") {
      value = formatNumber(value);
      helpers.setValue(parseNumber(value));
    } else {
      helpers.setValue(value);
    }

    e.target.value = value;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e);

    if (!readOnly && !disabled && dataType === "number") {
      const formattedValue = formatNumber(e.target.value);
      e.target.value = formattedValue;
      helpers.setValue(parseNumber(formattedValue));
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">
            {prefix}
          </span>
        )}
        <input
          type="text"
          id={id || name}
          placeholder={placeholder}
          className={`w-full p-3 border ${
            prefix ? "rounded-none" : "rounded-l-xl"
          } ${suffix ? "rounded-none" : "rounded-r-xl"} ${className} ${
            meta.touched && meta.error
              ? "border-red-500"
              : disabled || readOnly
                ? "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-700"
                : "border-gray-300 bg-white"
          }`}
          value={
            dataType === "number" ? formatNumber(field.value) : field.value
          }
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {suffix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl">
            {suffix}
          </span>
        )}
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormInputField;
