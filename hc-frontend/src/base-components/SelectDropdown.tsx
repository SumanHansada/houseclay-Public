"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface DropdownOption {
  value: string | number | boolean;
  label: string;
}

interface SelectDropdownProps {
  label?: string;
  name: string;
  id: string;
  options: DropdownOption[];
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  onBlur?: () => void;
  error?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  dropdownWidth?: "auto" | "full" | "fit";
  // Styling props
  containerClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  dropdownItemClassName?: string;
  selectedOptionClassName?: string;
  displayTextClassName?: string;
  errorClassName?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  name,
  id,
  options,
  required = false,
  placeholder = "Select an option",
  disabled = false,
  value,
  onChange,
  onBlur,
  error,
  size = "md",
  variant = "primary",
  dropdownWidth = "full",
  // Styling props with defaults
  containerClassName = "relative w-full",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  buttonClassName = "flex justify-between items-center w-full p-3 border rounded-xl text-left",
  dropdownClassName = "absolute z-10 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto",
  dropdownItemClassName = "px-3 py-2 cursor-pointer hover:bg-gray-100 relative",
  selectedOptionClassName = "bg-red-50 text-red-700 font-medium",
  displayTextClassName = "text-gray-900",
  errorClassName = "mt-1 text-sm text-red-600",
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected option
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Size styles
  const sizeStyles = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };

  // Variant styles
  const variantStyles = {
    primary: "bg-white border-gray-300 hover:border-gray-400",
    secondary: "bg-gray-50 border-gray-200 hover:border-gray-300",
    outline: "bg-transparent border-gray-300 hover:border-gray-400",
  };

  // Dropdown width styles
  const dropdownWidthStyles = {
    auto: "w-auto",
    full: "w-full",
    fit: "w-fit",
  };

  // Function to handle option selection
  const handleSelect = (value: string | number | boolean) => {
    if (disabled) return;
    onChange(value);
    setIsOpen(false);
  };

  // Add keyboard accessibility to the dropdown
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const currentIndex = options.findIndex((opt) => opt.value === value);
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        newIndex = (currentIndex + 1) % options.length;
        break;
      case "ArrowUp":
        event.preventDefault();
        newIndex = (currentIndex - 1 + options.length) % options.length;
        break;
      case "Enter":
        event.preventDefault();
        setIsOpen(!isOpen);
        if (isOpen && options[newIndex]) {
          handleSelect(options[newIndex].value);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }

    if (newIndex !== currentIndex && options[newIndex]) {
      onChange(options[newIndex].value);
    }
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id || name} className={labelClassName}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={id || name}
          className={`${buttonClassName} ${sizeStyles[size]} ${variantStyles[variant]} ${
            error ? "border-red-500" : ""
          } ${disabled ? "cursor-not-allowed disabled:bg-gray-300" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            onBlur?.();
            // Don't close immediately to allow for click on option
            setTimeout(() => setIsOpen(false), 150);
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span
            className={`${!selectedOption ? "text-gray-400" : displayTextClassName}`}
          >
            {displayText}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform duration-200 ${displayTextClassName} ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div
            className={`${dropdownClassName} ${dropdownWidthStyles[dropdownWidth]}`}
          >
            <ul className="py-1" role="listbox" aria-labelledby={id || name}>
              {/* Add placeholder option if needed */}
              {!value && value !== false && (
                <li
                  className={`${dropdownItemClassName} text-gray-400 ${sizeStyles[size]}`}
                  onClick={() => handleSelect("")}
                  role="option"
                  aria-selected={value === ""}
                >
                  {placeholder}
                  <span className="absolute z-10 inset-0 w-full h-full"></span>
                </li>
              )}

              {/* Real options */}
              {options.map((option) => (
                <li
                  key={String(option.value)} // Ensure unique keys for boolean values
                  id={`${id || name}-${String(option.value)}`}
                  className={`${dropdownItemClassName} ${
                    value === option.value
                      ? selectedOptionClassName
                      : "text-gray-900"
                  } ${sizeStyles[size]}`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                  <span className="absolute z-10 inset-0 w-full h-full"></span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error ? (
        <div className={errorClassName} id={`${id || name}-error`}>
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default SelectDropdown;
