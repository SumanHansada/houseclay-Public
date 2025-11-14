import React from "react";

interface CurrencyFieldProps {
  name: string;
  id?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  currencyFormat?: "en-US" | "en-IN";
  // Formik props
  value: number | string;
  onChange: (value: number) => void;
  onBlur?: () => void;
  error?: string;
}

const CurrencyField: React.FC<CurrencyFieldProps> = ({
  name,
  id,
  label,
  required = false,
  placeholder = "0",
  className = "",
  prefix,
  suffix,
  disabled = false,
  currencyFormat = "en-IN",
  value,
  onChange,
  onBlur,
  error,
}) => {
  // Format for display (add commas according to specified locale)
  const formatCurrency = (value: number | string): string => {
    if (value === null || value === undefined || value === "") return "";

    // Convert to string and remove non-numeric characters
    const numericValue = String(value).replace(/[^0-9]/g, "");

    if (!numericValue) return "";

    // Convert to specified locale format
    const number = parseInt(numericValue, 10);
    return number.toLocaleString(currencyFormat);
  };

  // Convert formatted string back to number for form value
  const parseCurrency = (formattedValue: string): number => {
    const numericValue = formattedValue.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    e.target.value = formattedValue;
    onChange(parseCurrency(formattedValue));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.();

    // Ensure value is properly formatted when field loses focus
    const formattedValue = formatCurrency(e.target.value);
    e.target.value = formattedValue;
    onChange(parseCurrency(formattedValue));
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
          className={`w-full p-3 border border-gray-300 ${
            prefix ? "rounded-none" : "rounded-l-xl"
          } ${suffix ? "rounded-none" : "rounded-r-xl"} ${className} ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "cursor-not-allowed disabled:bg-gray-300" : ""}`}
          value={formatCurrency(value)}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          inputMode="numeric"
        />
        {suffix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl">
            {suffix}
          </span>
        )}
      </div>
      {error ? <div className="text-red-500 text-sm mt-1">{error}</div> : null}
    </div>
  );
};

export default CurrencyField;
