import React from "react";

import LazyPhoneInput from "@/components/LazyPhoneInput";

interface PhoneFieldProps {
  name: string;
  id?: string;
  label?: string;
  required?: boolean;
  defaultCountry?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  // Formik props
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

const PhoneField: React.FC<PhoneFieldProps> = ({
  name,
  id,
  label,
  required = false,
  defaultCountry = "us",
  placeholder = "Enter phone number",
  className = "",
  disabled = false,
  value,
  onChange,
  onBlur,
  error,
}) => {
  // Function to handle phone number change with immediate validation
  const handlePhoneChange = (phoneValue: string) => {
    const sanitizedPhone = phoneValue.replace(/^\+/, "");
    onChange(sanitizedPhone);
  };

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <LazyPhoneInput
          name={id || name}
          defaultCountry={defaultCountry}
          value={value}
          placeholder={placeholder}
          onChange={(phoneValue) => handlePhoneChange(phoneValue)}
          onBlur={onBlur}
          disabled={disabled}
          className={`custom-phone-input w-full ${
            error ? "phone-error" : ""
          } ${className}`}
        />
      </div>

      {error ? (
        <div className="mt-1 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default PhoneField;
