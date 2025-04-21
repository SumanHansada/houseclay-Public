import { useField, useFormikContext } from "formik";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { FormValues } from "@/app/list-property/[type]/layout";

interface DropdownOption {
  value: string;
  label: string;
}

interface FormDropdownProps {
  label: string;
  name: string;
  id: string;
  options: DropdownOption[];
  required?: boolean;
  placeholder?: string;
}

const FormDropdown = ({
  label,
  name,
  id,
  options,
  required = false,
  placeholder = "Select an option",
}: FormDropdownProps) => {
  const [field, meta, helpers] = useField(name);
  const { validateField } = useFormikContext<FormValues>();
  const [isOpen, setIsOpen] = useState(false);
  const hasError = meta.touched && meta.error;

  // Find the selected option
  const selectedOption = options.find((opt) => opt.value === field.value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Function to handle option selection with immediate validation
  const handleSelect = async (value: string) => {
    await helpers.setValue(value);
    await helpers.setTouched(true);
    // Run validation immediately
    await validateField(id || name);
    setIsOpen(false);
  };

  // Add keyboard accessibility to the dropdown
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = options.findIndex((opt) => opt.value === field.value);
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
      helpers.setValue(options[newIndex].value);
    }
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
        <button
          type="button"
          id={id || name}
          className={`flex justify-between items-center w-full p-3 border ${
            hasError ? "border-red-500" : "border-gray-300"
          } rounded-xl bg-white text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            helpers.setTouched(true);
            // Don't close immediately to allow for click on option
            setTimeout(() => setIsOpen(false), 150);
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-required={required}
          aria-invalid={!!hasError}
          aria-activedescendant={selectedOption ? `${id || name}-${selectedOption.value}` : undefined}
        >
          <span className={!selectedOption ? "text-gray-400" : "text-gray-900"}>
            {displayText}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
            <ul className="py-1" role="listbox" aria-labelledby={id || name}>
              {/* Add placeholder option if needed */}
              {(!field.value || field.value === "") && (
                <li
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-400"
                  onClick={() => handleSelect("")}
                  role="option"
                  aria-selected={field.value === ""}
                >
                  {placeholder}
                </li>
              )}

              {/* Real options */}
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${id || name}-${option.value}`}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    field.value === option.value
                      ? "bg-red-50 text-red-700 font-medium"
                      : "text-gray-900"
                  }`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={field.value === option.value}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {hasError ? (
        <div className="mt-1 text-sm text-red-600" id={`${id || name}-error`}>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export default FormDropdown;
