import { useField } from "formik";
import React from "react";

interface FormTextAreaProps {
  name: string;
  id?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  name,
  id,
  label,
  required = false,
  placeholder = "",
  rows = 5,
  className = "",
}) => {
  const [field, meta] = useField(name);

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
      <textarea
        id={id || name}
        placeholder={placeholder}
        rows={rows}
        className={`w-full p-3 border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 rounded-xl ${
          meta.touched && meta.error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...field}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormTextArea;
