"use client";

import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";

interface TextFieldProps {
  name: string;
  id?: string;
  label?: string;
  type?: "text" | "number" | "email" | "password";
  dataType?: "number" | "string"; // Determines how the value is handled
  required?: boolean;
  placeholder?: string;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  // Formik props
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  error?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  id,
  label,
  type = "text",
  dataType = "string",
  required = false,
  placeholder = "",
  className = "",
  prefix,
  suffix,
  disabled = false,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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
    let inputValue = e.target.value;

    if (dataType === "number") {
      inputValue = formatNumber(inputValue);
      onChange(parseNumber(inputValue));
    } else {
      onChange(inputValue);
    }

    e.target.value = inputValue;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.();

    if (dataType === "number") {
      const formattedValue = formatNumber(e.target.value);
      e.target.value = formattedValue;
      onChange(parseNumber(formattedValue));
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
          type={type === "password" && !showPassword ? "password" : "text"}
          id={id || name}
          placeholder={placeholder}
          className={`w-full p-3 border ${
            prefix ? "rounded-none" : "rounded-l-xl"
          } ${suffix || type === "password" ? "rounded-none" : "rounded-r-xl"} ${className} ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "cursor-not-allowed bg-gray-50" : ""}`}
          value={
            dataType === "number" ? formatNumber(value) : String(value || "")
          }
          inputMode={dataType === "number" ? "numeric" : "text"}
          pattern={dataType === "number" ? "[0-9]*" : undefined}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl cursor-pointer"
            disabled={disabled}
          >
            <div className="relative w-5 h-5">
              <Eye
                size={20}
                className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                  showPassword ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
              />
              <EyeClosed
                size={20}
                className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                  !showPassword ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
              />
            </div>
          </button>
        )}
        {suffix && type !== "password" && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl">
            {suffix}
          </span>
        )}
      </div>
      {error ? <div className="text-red-500 text-sm mt-1">{error}</div> : null}
    </div>
  );
};

export default TextField;
