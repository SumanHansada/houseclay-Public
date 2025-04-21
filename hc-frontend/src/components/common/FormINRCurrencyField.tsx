import { useField } from "formik";
import { IndianRupee } from "lucide-react";
import React from "react";

interface FormINRCurrencyFieldProps {
  name: string;
  id?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const FormINRCurrencyField: React.FC<FormINRCurrencyFieldProps> = ({
  label,
  required = false,
  placeholder = "0",
  className = "",
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);

  // Format for display (add commas according to Indian numbering system)
  const formatINR = (value: number | string): string => {
    if (value === null || value === undefined || value === "") return "";

    // Convert to string and remove non-numeric characters
    const numericValue = String(value).replace(/[^0-9]/g, "");

    if (!numericValue) return "";

    // Convert to Indian numbering format (XX,XX,XXX)
    const number = parseInt(numericValue, 10);
    return number.toLocaleString("en-IN");
  };

  // Convert formatted string back to number for form value
  const parseINR = (formattedValue: string): number => {
    const numericValue = formattedValue.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatINR(e.target.value);
    e.target.value = formattedValue;
    helpers.setValue(parseINR(formattedValue));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e);

    // Ensure value is properly formatted when field loses focus
    const formattedValue = formatINR(e.target.value);
    e.target.value = formattedValue;
    helpers.setValue(parseINR(formattedValue));
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex">
        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">
          <IndianRupee size={20} />
        </span>
        <input
          type="text"
          id={props.id || props.name}
          placeholder={placeholder}
          className={`w-full p-3 border border-gray-300 focus:ring-red-500 focus:border-red-500 rounded-none ${className}`}
          value={formatINR(field.value)}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl">
          /month
        </span>
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormINRCurrencyField;
