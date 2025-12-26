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

  maxLength?: number;
  showCharCount?: boolean;
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
  maxLength,
  showCharCount = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const shouldShowCharCount =
    maxLength !== undefined && (showCharCount ?? true);

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
        maxLength={maxLength}
        className={`w-full p-3 border rounded-xl ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "cursor-not-allowed disabled:bg-gray-300" : ""} ${className}`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
      />
      {error ? <div className="text-red-500 text-sm mt-1">{error}</div> : null}
      {shouldShowCharCount && (
        <div className="text-sm text-gray-500 mt-1 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default TextArea;
