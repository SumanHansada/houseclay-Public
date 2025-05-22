import "react-international-phone/style.css";

import { useField } from "formik";
import { PhoneInput } from "react-international-phone";

interface FormPhoneInputProps {
  label: string;
  name: string;
  id?: string;
  required?: boolean;
  defaultCountry?: string;
  placeholder?: string;
  className?: string;
}

const FormPhoneInput = ({
  label,
  name,
  id,
  required = false,
  defaultCountry = "us",
  placeholder = "Enter phone number",
  className = "",
}: FormPhoneInputProps) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  // Function to handle phone number change with immediate validation
  const handlePhoneChange = async (value: string) => {
    const sanitizedPhone = value.replace(/^\+/, "");
    await helpers.setValue(sanitizedPhone);
    await helpers.setTouched(true);
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
        <PhoneInput
          name={id || name}
          defaultCountry={defaultCountry}
          value={field.value}
          placeholder={placeholder}
          onChange={(value) => handlePhoneChange(value)}
          onBlur={() => helpers.setTouched(true)}
          className={`custom-phone-input w-full ${
            hasError ? "phone-error" : ""
          } ${className}`}
        />
      </div>

      {hasError ? (
        <div className="mt-1 text-sm text-red-600" id={`${id || name}-error`}>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export default FormPhoneInput;
