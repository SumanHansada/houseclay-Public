import { useField } from "formik";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface FormInputFieldProps {
  name: string;
  id?: string;
  label?: string;
  dataType?: "number" | "text" | "password"; // Zebra-UI: updated
  required?: boolean;
  placeholder?: string;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  testId?: string; // Zebra-UI: updated
  autoComplete?: string; // Zebra-UI: updated
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
  testId, // Zebra-UI: updated
  autoComplete, // Zebra-UI: updated
}) => {
  const [field, meta, helpers] = useField(name);
  const [showPassword, setShowPassword] = useState(false); // Zebra-UI: updated

  const formatNumber = (value: string | number): string => {
    if (value === null || value === undefined || value === "") return "";
    const numericValue = String(value).replace(/[^0-9]/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-IN")
      : "";
  };

  const parseNumber = (formattedValue: string): number => {
    const numericValue = formattedValue.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (dataType === "number") {
      value = formatNumber(value);
      helpers.setValue(parseNumber(value));
    } else {
      helpers.setValue(value);
    }

    e.target.value = value;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e);

    if (dataType === "number") {
      const formattedValue = formatNumber(e.target.value);
      e.target.value = formattedValue;
      helpers.setValue(parseNumber(formattedValue));
    }
  };

  const inputType =
    dataType === "password" ? (showPassword ? "text" : "password") : "text"; // Zebra-UI: updated

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
          type={inputType} // Zebra-UI: updated
          id={id || name}
          name={field.name} // Zebra-UI: updated
          placeholder={placeholder}
          autoComplete={autoComplete} // Zebra-UI: updated
          data-testid={testId ? `${testId}-input` : undefined} // Zebra-UI: updated
          className={`w-full p-3 border ${
            prefix ? "rounded-none" : "rounded-l-xl"
          } ${
            dataType === "password" || suffix ? "rounded-none" : "rounded-r-xl"
          } ${className} ${
            meta.touched && meta.error ? "border-red-500" : "border-gray-300"
          }`}
          value={
            dataType === "number" ? formatNumber(field.value) : field.value
          } // Zebra-UI: updated
          onChange={handleChange} // Zebra-UI: updated
          onBlur={handleBlur} // Zebra-UI: updated
        />
        {dataType === "password" && ( // Zebra-UI: updated
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl"
            tabIndex={-1}
            data-testid={testId ? `${testId}-toggle` : undefined} // Zebra-UI: updated
            aria-label="toggle password visibility" // Zebra-UI: updated
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        )}
        {suffix &&
          dataType !== "password" && ( // Zebra-UI: updated
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
