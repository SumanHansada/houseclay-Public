"use client";

import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X } from "lucide-react";
import { FocusTrap } from "focus-trap-react";

interface Option {
  id: number | string;
  label: string;
}

interface DropdownProps {
  options?: Option[];
  defaultSelected?: Option;
  onChange?: (option: Option) => void;
  placeholder?: string;
  itemsPerPage?: number;
  dropdownClass?: string;
  selectedLabelClass?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options = [],
  defaultSelected,
  onChange = (option: Option) => console.log("Selected:", option),
  placeholder = "Search...",
  itemsPerPage = 4,
  dropdownClass = "",
  selectedLabelClass = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option>(
    defaultSelected || options[0],
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleItems, setVisibleItems] = useState<number>(itemsPerPage);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [dropdownPosition, setDropdownPosition] = useState<DOMRect | null>(
    null,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  // Filter options based on search term
  const filteredOptions: Option[] = options?.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Reset focused index when filtered options change
  //   useEffect(() => {
  //     setFocusedIndex(-1);
  //     // Update refs array to match filtered options length
  //     optionRefs.current = Array(filteredOptions.slice(0, visibleItems).length)
  //       .fill(null)
  //       .map(
  //         (_, i) => optionRefs.current[i] || React.createRef<HTMLDivElement>(),
  //       );
  //   }, [filteredOptions, visibleItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (isOpen && filteredOptions.length > visibleItems) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisibleItems((prev) =>
              Math.min(prev + itemsPerPage, filteredOptions.length),
            );
          }
        },
        { threshold: 0.5 },
      );

      if (lastItemRef.current) {
        observerRef.current.observe(lastItemRef.current);
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [isOpen, filteredOptions.length, visibleItems, itemsPerPage]);

  // Handle selection
  const handleSelect = (option: Option): void => {
    setSelected(option);
    setIsOpen(false);
    setSearchTerm("");
    setVisibleItems(itemsPerPage);
    onChange(option);
  };

  // Clear search
  const clearSearch = (): void => {
    setSearchTerm("");
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    const visibleOptions = filteredOptions.slice(0, visibleItems);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (focusedIndex < visibleOptions.length - 1) {
          const newIndex = focusedIndex + 1;
          setFocusedIndex(newIndex);
          optionRefs.current[newIndex]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (focusedIndex > 0) {
          const newIndex = focusedIndex - 1;
          setFocusedIndex(newIndex);
          optionRefs.current[newIndex]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
        break;

      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < visibleOptions.length) {
          handleSelect(visibleOptions[focusedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;

      case "Home":
        e.preventDefault();
        if (visibleOptions.length > 0) {
          setFocusedIndex(0);
          optionRefs.current[0]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
        break;

      case "End":
        e.preventDefault();
        if (visibleOptions.length > 0) {
          const lastIndex = visibleOptions.length - 1;
          setFocusedIndex(lastIndex);
          optionRefs.current[lastIndex]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
        break;

      default:
        break;
    }
  };

  // Toggle dropdown with keyboard
  const handleToggleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Measure dropdown trigger position
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      setDropdownPosition(dropdownRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  return (
    <div className="min-w-fit" ref={dropdownRef}>
      {/* Selected value display */}
      <div
        className={`flex items-center justify-between ${dropdownClass} cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleToggleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="dropdown-list"
      >
        <span className={`text-gray-700 ${selectedLabelClass}`}>
          {selected.label}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown menu with higher z-index */}
      {isOpen &&
        dropdownPosition &&
        createPortal(
          <FocusTrap
            focusTrapOptions={{
              initialFocus: false,
              clickOutsideDeactivates: true,
              fallbackFocus: () => dropdownRef.current as HTMLElement,
            }}
          >
            <div
              className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
              style={{
                top: dropdownPosition.bottom + window.scrollY,
                left: dropdownPosition.left + window.scrollX,
              }}
              onKeyDown={handleKeyDown}
            >
              {/* Search input */}
              <div className="">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder={placeholder}
                    className="w-full py-2 pl-8 pr-8 border-b border-gray-300 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  {searchTerm && (
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                      onClick={clearSearch}
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Results count */}
              <div className="px-3 py-1 text-xs text-gray-500 bg-gray-50">
                Showing {Math.min(visibleItems, filteredOptions.length)} of{" "}
                {filteredOptions.length} items
              </div>

              {/* Options list */}
              <div
                className="max-h-64 overflow-y-auto"
                role="listbox"
                id="dropdown-list"
                aria-activedescendant={
                  focusedIndex >= 0
                    ? `option-${filteredOptions[focusedIndex]?.id}`
                    : undefined
                }
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No results found
                  </div>
                ) : (
                  filteredOptions
                    .slice(0, visibleItems)
                    .map((option, index) => (
                      <div
                        key={option.id}
                        ref={(el) => {
                          // For the last visible item, set the intersection observer ref
                          if (index === visibleItems - 1) {
                            lastItemRef.current = el;
                          }
                          // Set the option ref for keyboard navigation
                          if (optionRefs.current[index]) {
                            optionRefs.current[index].current =
                              el as HTMLDivElement;
                          }
                        }}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                          selected.id === option.id
                            ? "bg-red-50 border-l-4 border-red-500"
                            : ""
                        } ${
                          focusedIndex === index
                            ? "bg-blue-100 outline-none"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(option);
                        }}
                        role="option"
                        id={`option-${option.id}`}
                        aria-selected={selected.id === option.id}
                        tabIndex={-1}
                      >
                        {option.label}
                      </div>
                    ))
                )}
              </div>
            </div>
          </FocusTrap>,
          document.body,
        )}
    </div>
  );
};

export default Dropdown;
