"use client";

import { ChevronDown, Check, X } from "lucide-react";
import { useMemo, useState } from "react";

interface DropdownOption {
  value: string | number | boolean;
  label: string;
}

type ValueType = string | number | boolean;

type DisplayMode = "first" | "first+count" | "count" | "join";

interface MultiSelectDropdownProps {
  label?: string;
  name: string;
  id: string;
  options: DropdownOption[];
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;

  // Controlled value
  value: ValueType[];
  onChange: (values: ValueType[]) => void;

  onBlur?: () => void;
  error?: string;

  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  dropdownWidth?: "auto" | "full" | "fit";

  // Behaviour
  closeOnSelect?: boolean; // default: false (keep open for multi-select)
  showSelectAll?: boolean; // default: false
  showClear?: boolean; // default: false
  showCheckbox?: boolean; // default: false

  // Display
  displayMode?: DisplayMode; // default: "first"
  joinSeparator?: string; // default: ", "
  displayFormatter?: (selected: DropdownOption[]) => string; // overrides display text

  // Styling (same surface as your SelectDropdown)
  containerClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  dropdownItemClassName?: string;
  selectedOptionClassName?: string;
  displayTextClassName?: string;
  errorClassName?: string;
  toolbarClassName?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  name,
  id,
  options,
  required = false,
  placeholder = "Select options",
  disabled = false,

  value,
  onChange,

  onBlur,
  error,

  size = "md",
  variant = "primary",
  dropdownWidth = "full",

  closeOnSelect = false,
  showSelectAll = false,
  showClear = false,
  showCheckbox = false,

  displayMode = "first",
  joinSeparator = ", ",
  displayFormatter,

  containerClassName = "relative w-full",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  buttonClassName = "flex justify-between items-center w-full p-3 border rounded-xl text-left",
  dropdownClassName = "absolute z-10 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-auto",
  dropdownItemClassName = "px-3 py-2 cursor-pointer hover:bg-gray-100 relative flex items-center gap-2",
  selectedOptionClassName = "bg-red-50 text-red-700 font-medium",
  displayTextClassName = "text-gray-900",
  errorClassName = "mt-1 text-sm text-red-600",
  toolbarClassName = "flex items-center justify-between border-b border-gray-200 sticky top-0 bg-white px-2",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sizeStyles = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };

  const variantStyles = {
    primary: "bg-white border-gray-300 hover:border-gray-400",
    secondary: "bg-gray-50 border-gray-200 hover:border-gray-300",
    outline: "bg-transparent border-gray-300 hover:border-gray-400",
  };

  const dropdownWidthStyles = {
    auto: "w-auto",
    full: "w-full",
    fit: "w-fit",
  };

  const selectedOptions = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value],
  );

  const displayText = useMemo(() => {
    if (displayFormatter) return displayFormatter(selectedOptions);
    if (selectedOptions.length === 0) return placeholder;

    switch (displayMode) {
      case "first":
        return selectedOptions[0].label;
      case "first+count":
        return selectedOptions.length > 1
          ? `${selectedOptions[0].label} +${selectedOptions.length - 1}`
          : selectedOptions[0].label;
      case "count":
        return `${selectedOptions.length} selected`;
      case "join":
        return selectedOptions.map((s) => s.label).join(joinSeparator);
      default:
        return selectedOptions[0].label;
    }
  }, [
    selectedOptions,
    displayFormatter,
    displayMode,
    joinSeparator,
    placeholder,
  ]);

  const toggleValue = (v: ValueType) => {
    if (disabled) return;
    const exists = value.includes(v);
    const next = exists ? value.filter((x) => x !== v) : [...value, v];
    onChange(next);
    if (closeOnSelect) setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const max = options.length - 1;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((i) => (i >= max ? 0 : i + 1));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(max);
        } else {
          setActiveIndex((i) => (i <= 0 ? max : i - 1));
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const opt = options[activeIndex];
          if (opt) toggleValue(opt.value);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const allSelected =
    options.length > 0 && selectedOptions.length === options.length;

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
          onClick={() => !disabled && setIsOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            onBlur?.();
            setTimeout(() => setIsOpen(false), 150);
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id || name}-listbox`}
          disabled={disabled}
        >
          <span
            className={`${selectedOptions.length === 0 ? "text-gray-400" : displayTextClassName}`}
          >
            {displayText}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform duration-200 ${displayTextClassName} ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`${dropdownClassName} ${dropdownWidthStyles[dropdownWidth]}`}
          >
            {(showSelectAll || showClear) && (
              <div className={toolbarClassName}>
                {showSelectAll ? (
                  <button
                    type="button"
                    className="text-sm disabled:text-gray-400 py-1"
                    onClick={() =>
                      onChange(allSelected ? [] : options.map((o) => o.value))
                    }
                    disabled={options.length === 0}
                  >
                    {allSelected ? "Unselect all" : "Select all"}
                  </button>
                ) : (
                  <span />
                )}
                {showClear && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm disabled:text-gray-400 py-1"
                    onClick={() => onChange([])}
                    disabled={value.length === 0}
                  >
                    Clear
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            <ul
              id={`${id || name}-listbox`}
              className="py-1"
              role="listbox"
              aria-labelledby={id || name}
              aria-multiselectable="true"
            >
              {options.map((option, idx) => {
                const selected = value.includes(option.value);
                // const active = idx === activeIndex;

                return (
                  <li
                    key={String(option.value)}
                    id={`${id || name}-${String(option.value)}`}
                    className={`${dropdownItemClassName} ${
                      selected ? selectedOptionClassName : "text-gray-900"
                    } ${sizeStyles[size]}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => toggleValue(option.value)}
                    role="option"
                    aria-selected={selected}
                  >
                    {showCheckbox ? (
                      <span
                        aria-hidden
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          selected ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        {selected ? <Check size={14} /> : null}
                      </span>
                    ) : null}
                    <span>{option.label}</span>
                    <span className="absolute z-10 inset-0 w-full h-full"></span>
                  </li>
                );
              })}
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

export default MultiSelectDropdown;
