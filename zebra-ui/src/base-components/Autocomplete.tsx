"use client";

import { ChevronDown, Search, X } from "lucide-react";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface AutocompleteProps {
  name: string;
  // Data props
  items?: string[];
  selectedItems?: string[];
  onSelectionChange?: (items: string[]) => void;
  placeholder?: string;
  label?: string;

  // Styling props
  containerClassName?: string;
  inputClassName?: string;
  tagClassName?: string;
  dropdownClassName?: string;
  labelClassName?: string;
  noResultsClassName?: string;

  // Behavior props
  disabled?: boolean;
  maxItems?: number;
  size?: "sm" | "md" | "lg";
  isDropdown?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  items = [],
  selectedItems: externalSelectedItems,
  onSelectionChange,
  placeholder = "Search items...",
  label = "",
  containerClassName = "w-full",
  inputClassName = "flex items-center min-h-[44px] w-full px-3 py-2 border border-gray-300 rounded-lg bg-white",
  tagClassName = "inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-md border max-md:bg-white",
  dropdownClassName = "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto",
  labelClassName = "block text-sm font-medium text-gray-700 mb-2",
  noResultsClassName = "px-3 py-2 text-sm text-gray-500",
  disabled = false,
  maxItems,
  size = "md",
  isDropdown = false,
}) => {
  const [internalSelectedItems, setInternalSelectedItems] = useState<string[]>(
    [],
  );
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Size styles
  const sizeStyles = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };

  // Use external selectedItems if provided, otherwise use internal state
  const selectedItems =
    externalSelectedItems !== undefined
      ? externalSelectedItems
      : internalSelectedItems;
  const setSelectedItems = (newItems: string[]) => {
    if (externalSelectedItems !== undefined && onSelectionChange) {
      onSelectionChange(newItems);
    } else {
      setInternalSelectedItems(newItems);
    }
  };

  // Filter items based on input and exclude already selected items
  const filteredItems = items.filter(
    (item) =>
      !selectedItems.includes(item) &&
      item.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setInputValue(e.target.value);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleItemSelect = (item: string) => {
    if (maxItems && selectedItems.length >= maxItems) return;
    setSelectedItems([...selectedItems, item]);
    setInputValue("");
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleItemRemove = (itemToRemove: string) => {
    setSelectedItems(selectedItems.filter((item) => item !== itemToRemove));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleItemSelect(filteredItems[focusedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setFocusedIndex(-1);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      selectedItems.length > 0
    ) {
      handleItemRemove(selectedItems[selectedItems.length - 1]);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow item selection
    setTimeout(() => {
      setIsOpen(false);
      setFocusedIndex(-1);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={containerClassName}>
      <div className="relative" ref={dropdownRef}>
        {label && <label className={labelClassName}>{label}</label>}

        <div className="relative">
          <div
            className={`${inputClassName} ${sizeStyles[size]} ${disabled ? "cursor-not-allowed disabled:bg-gray-100" : ""}`}
          >
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />

            <div className="flex flex-nowrap gap-1 flex-1 min-w-0 overflow-x-auto whitespace-nowrap">
              {selectedItems.map((item, index) => (
                <span key={index} className={tagClassName}>
                  {item}
                  {!disabled && (
                    <button
                      onClick={() => handleItemRemove(item)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={`Remove ${item}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}

              <input
                ref={inputRef}
                name={name}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={selectedItems.length === 0 ? placeholder : ""}
                disabled={disabled}
                className="flex-1 min-w-[120px] max-md:max-w-[40px] outline-none text-sm disabled:cursor-not-allowed bg-transparent"
              />
            </div>

            {isDropdown && (
              <ChevronDown
                className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        </div>

        {isOpen && filteredItems.length > 0 && !disabled && (
          <div className={dropdownClassName}>
            {filteredItems.map((item, index) => (
              <div
                key={item}
                onClick={() => handleItemSelect(item)}
                className={`px-3 py-2 cursor-pointer text-sm hover:bg-gray-50 ${
                  index === focusedIndex
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-900"
                } ${maxItems && selectedItems.length >= maxItems ? "cursor-not-allowed disabled:bg-gray-100" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {isOpen && filteredItems.length === 0 && inputValue && !disabled && (
          <div className={dropdownClassName}>
            <div className={noResultsClassName}>
              No results found for &quot;{inputValue}&quot;
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
