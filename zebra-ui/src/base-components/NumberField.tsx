"use client";

import { Minus, Plus } from "lucide-react";
import React, { useEffect } from "react";

interface NumberFieldProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  symbol?: string;
  disabled?: boolean;
  className?: string;
  // Formik props
  value: number | string;
  onChange: (value: number) => void;
  onBlur?: () => void;
  error?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({
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
  value,
  onChange,
  onBlur,
  error,
}) => {
  // Ensure the value is within min/max bounds when the component mounts or when bounds change
  useEffect(() => {
    if (value !== undefined) {
      const numValue = Number(value);
      if (min !== undefined && numValue < min) {
        onChange(min);
      } else if (max !== undefined && numValue > max) {
        onChange(max);
      }
    }
  }, [min, max, value, onChange]);

  const handleIncrement = () => {
    if (disabled) return;

    const currentValue = Number(value) || 0;
    const newValue = currentValue + step;

    if (max === undefined || newValue <= max) {
      onChange(newValue);
    } else {
      onChange(max);
    }
  };

  const handleDecrement = () => {
    if (disabled) return;

    const currentValue = Number(value) || 0;
    const newValue = currentValue - step;

    if (min === undefined || newValue >= min) {
      onChange(newValue);
    } else {
      onChange(min);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      onChange(0);
      return;
    }

    const numValue = Number(inputValue);

    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    onBlur?.();

    const numValue = Number(value);

    if (value === "" || isNaN(numValue)) {
      onChange(min || 0);
      return;
    }

    if (min !== undefined && numValue < min) {
      onChange(min);
    } else if (max !== undefined && numValue > max) {
      onChange(max);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-gray-700 text-sm font-medium mb-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex items-center rounded-xl border focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "cursor-not-allowed disabled:bg-gray-300" : ""}`}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && Number(value) <= min)}
          className="w-10 h-10 m-2 flex rounded-lg items-center justify-center text-gray-500 bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
          aria-label="Decrease value"
        >
          <Minus size={20} />
        </button>

        <div className="flex-1 flex items-center justify-center">
          {symbol && <span className="text-gray-500 mr-2">{symbol}</span>}
          <input
            id={id || name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            className="w-full text-center py-2 outline-none disabled:bg-gray-100 disabled:text-gray-500"
            aria-invalid={error ? "true" : "false"}
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && Number(value) >= max)}
          className="w-10 h-10 m-2 flex rounded-lg items-center justify-center text-gray-500 bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
          aria-label="Increase value"
        >
          <Plus size={20} />
        </button>
      </div>

      {error ? <div className="text-red-500 text-sm mt-1">{error}</div> : null}
    </div>
  );
};

export default NumberField;
