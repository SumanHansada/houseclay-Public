import { useField } from "formik";
import { Minus, Plus } from "lucide-react";
import React, { useEffect } from "react";

interface FormNumberFieldProps {
  id?: string; // Added id to the props
  name: string;
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  symbol?: string;
  disabled?: boolean;
  className?: string;
}

const FormFormNumberField: React.FC<FormNumberFieldProps> = ({
  id,
  name,
  label,
  required = false,
  min,
  max,
  step = 1,
  symbol,
  disabled = false,
  className = "",
}) => {
  const [field, meta, helpers] = useField(name);

  // Ensure the value is within min/max bounds when the component mounts or when bounds change
  useEffect(() => {
    if (field.value !== undefined) {
      const numValue = Number(field.value);
      if (min !== undefined && numValue < min) {
        helpers.setValue(min);
      } else if (max !== undefined && numValue > max) {
        helpers.setValue(max);
      }
    }
  }, [min, max, field.value, helpers]);

  const handleIncrement = () => {
    if (disabled) return;

    const currentValue = Number(field.value) || 0;
    const newValue = currentValue + step;

    if (max === undefined || newValue <= max) {
      helpers.setValue(newValue);
    } else {
      helpers.setValue(max);
    }
  };

  const handleDecrement = () => {
    if (disabled) return;

    const currentValue = Number(field.value) || 0;
    const newValue = currentValue - step;

    if (min === undefined || newValue >= min) {
      helpers.setValue(newValue);
    } else {
      helpers.setValue(min);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      helpers.setValue("");
      return;
    }

    const numValue = Number(value);

    if (!isNaN(numValue)) {
      helpers.setValue(numValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e);

    const numValue = Number(field.value);

    if (field.value === "" || isNaN(numValue)) {
      helpers.setValue(min || 0);
      return;
    }

    if (min !== undefined && numValue < min) {
      helpers.setValue(min);
    } else if (max !== undefined && numValue > max) {
      helpers.setValue(max);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id || name} // Updated to use id or name
          className="block text-gray-700 text-sm font-medium mb-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex items-center rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={
            disabled || (min !== undefined && Number(field.value) <= min)
          }
          className="w-10 h-10 m-2 flex rounded-lg items-center justify-center text-gray-500 bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
          aria-label="Decrease value"
        >
          <Minus size={20} />
        </button>

        <div className="flex-1 flex items-center justify-center">
          {symbol && <span className="text-gray-500 mr-2">{symbol}</span>}
          <input
            id={id || name} // Updated to use id or name
            {...field}
            onChange={handleChange}
            onBlur={handleBlur}
            value={field.value}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            className="w-full text-center py-2 outline-none disabled:bg-gray-100 disabled:text-gray-500"
            aria-invalid={meta.touched && meta.error ? "true" : "false"}
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={
            disabled || (max !== undefined && Number(field.value) >= max)
          }
          className="w-10 h-10 m-2 flex rounded-lg items-center justify-center text-gray-500 bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
          aria-label="Increase value"
        >
          <Plus size={20} />
        </button>
      </div>

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormFormNumberField;
