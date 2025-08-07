import React from "react";

interface TextAreaProps {
  name: string;
  id?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  // Formik props
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  id,
  label,
  required = false,
  placeholder = "",
  rows = 5,
  className = "",
  disabled = false,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    onBlur?.();
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
      <textarea
        id={id || name}
        placeholder={placeholder}
        rows={rows}
        className={`w-full p-3 border rounded-xl ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "cursor-not-allowed disabled:bg-gray-300" : ""} ${className}`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
      />
      {error ? <div className="text-red-500 text-sm mt-1">{error}</div> : null}
    </div>
  );
};

export default TextArea;
