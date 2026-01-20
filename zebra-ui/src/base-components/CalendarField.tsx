"use client";

import {
  addDays,
  addMonths,
  addYears,
  endOfWeek,
  format,
  isValid,
  parse,
  startOfWeek,
} from "date-fns";
import { FocusTrap } from "focus-trap-react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";

interface CalendarFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dateFormat?: string;
  className?: string;
  disabled?: boolean;
  showPrevNextYear?: boolean;
  // Formik props
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

const CalendarField: React.FC<CalendarFieldProps> = ({
  name,
  label,
  required = false,
  placeholder = "2025-01-01",
  dateFormat = "yyyy-MM-dd",
  className = "",
  disabled = false,
  showPrevNextYear = false,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const daysGridRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  const displayValue =
    value && isValid(new Date(value))
      ? format(new Date(value), dateFormat)
      : "";

  // Initialize focused date when opening calendar
  useEffect(() => {
    if (isOpen) {
      if (value && isValid(new Date(value))) {
        setFocusedDate(new Date(value));
        setCurrentMonth(new Date(value));
      } else {
        setFocusedDate(new Date());
      }
    }
  }, [isOpen, value]);

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    const parsedDate = parse(inputValue, dateFormat, new Date());
    if (isValid(parsedDate)) {
      setCurrentMonth(parsedDate);
      setFocusedDate(parsedDate);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    const dateIso = date.toISOString();
    onChange(dateIso);
    setIsOpen(false);

    // Return focus to the calendar button when closing
    setTimeout(() => {
      onBlur?.();
      calendarButtonRef.current?.focus();
    }, 0);
  };

  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setFocusedDate(today);

    // Focus the day element for today
    setTimeout(() => {
      const todayElement = daysGridRef.current?.querySelector(
        '[data-is-today="true"]',
      );
      if (todayElement instanceof HTMLElement) {
        todayElement.focus();
      }
    }, 10);
  };

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Navigation methods
  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevYear = () => {
    setCurrentMonth(addYears(currentMonth, -1));
  };

  const nextYear = () => {
    setCurrentMonth(addYears(currentMonth, 1));
  };

  // Close calendar
  const closeCalendar = () => {
    setIsOpen(false);

    // Return focus to the calendar button when closing
    setTimeout(() => {
      calendarButtonRef.current?.focus();
    }, 10);
  };

  // Keyboard navigation
  const handleKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    date: Date | null,
  ) => {
    if (!date || !focusedDate) return;

    let newFocusedDate: Date | null = null;
    let preventDefaultAndStopPropagation = true;

    switch (e.key) {
      case "ArrowLeft":
        newFocusedDate = addDays(focusedDate, -1);
        break;
      case "ArrowRight":
        newFocusedDate = addDays(focusedDate, 1);
        break;
      case "ArrowUp":
        newFocusedDate = addDays(focusedDate, -7);
        break;
      case "ArrowDown":
        newFocusedDate = addDays(focusedDate, 7);
        break;
      case "PageUp":
        newFocusedDate = e.shiftKey
          ? addYears(focusedDate, -1)
          : addMonths(focusedDate, -1);
        break;
      case "PageDown":
        newFocusedDate = e.shiftKey
          ? addYears(focusedDate, 1)
          : addMonths(focusedDate, 1);
        break;
      case "Home":
        newFocusedDate = startOfWeek(focusedDate);
        break;
      case "End":
        newFocusedDate = endOfWeek(focusedDate);
        break;
      case "Enter":
        handleDateSelect(focusedDate);
        break;
      case "Escape":
        closeCalendar();
        break;
      default:
        preventDefaultAndStopPropagation = false;
    }

    if (newFocusedDate) {
      setFocusedDate(newFocusedDate);

      // Update current month view if the focused date moves to another month
      if (
        newFocusedDate.getMonth() !== currentMonth.getMonth() ||
        newFocusedDate.getFullYear() !== currentMonth.getFullYear()
      ) {
        setCurrentMonth(
          new Date(newFocusedDate.getFullYear(), newFocusedDate.getMonth(), 1),
        );
      }
    }

    if (preventDefaultAndStopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus management - focus the selected/focused date when necessary
  useEffect(() => {
    if (isOpen && focusedDate) {
      setTimeout(() => {
        const dateStr = format(focusedDate, "yyyy-MM-dd");
        const dateElement = daysGridRef.current?.querySelector(
          `[data-date="${dateStr}"]`,
        );
        if (dateElement instanceof HTMLElement) dateElement.focus();
      }, 10);
    }
  }, [isOpen, focusedDate, currentMonth]);

  // Format day classes and attributes
  const getDayProps = (date: Date | null) => {
    if (!date) {
      return {
        className: "p-2",
        tabIndex: -1,
        "aria-hidden": true,
      };
    }

    const today = new Date();
    const todayTimestamp = new Date().setHours(0, 0, 0, 0);

    const isToday = today.toDateString() === date.toDateString();
    const isSelected =
      value && new Date(value).toDateString() === date.toDateString();
    const isFocused =
      focusedDate && focusedDate.toDateString() === date.toDateString();
    const isDisabled = date.getTime() < todayTimestamp; // Disable dates before today
    const dateStr = format(date, "yyyy-MM-dd");

    return {
      className: `
        p-2 cursor-pointer hover:bg-gray-100 rounded
        ${isToday ? "bg-gray-200" : ""}
        ${isSelected ? "bg-red-500 text-white hover:bg-red-600" : ""}
        ${isFocused && !isSelected ? "ring-2 ring-red-500" : ""}
        ${isDisabled ? "text-gray-100 cursor-not-allowed" : ""}
      `,
      tabIndex: isFocused && !isDisabled ? 0 : -1,
      "aria-label": format(date, "EEEE, MMMM do, yyyy"),
      "aria-selected": isSelected ? true : false,
      "aria-disabled": isDisabled ? true : undefined,
      "data-date": dateStr,
      "data-is-today": isToday ? "true" : "false",
      onClick: isDisabled ? undefined : () => handleDateSelect(date),
      onKeyDown: isDisabled
        ? undefined
        : (e: KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, date),
    };
  };

  return (
    <div className={`mb-4 relative ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-700 text-sm font-medium mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex">
        <input
          id={name}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={label || "Date input"}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`
            w-full p-3 border rounded-l-xl rounded-none
            ${error ? "border-red-500" : "border-gray-300"}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
        />
        <button
          ref={calendarButtonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-label="Toggle calendar"
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls={isOpen ? `${name}-calendar` : undefined}
          className={`inline-flex items-center px-3 ${isOpen ? "bg-gray-200" : "bg-gray-100"} text-gray-500 border border-l-0 border-gray-300 rounded-r-xl`}
        >
          <CalendarDays size={25} />
        </button>
      </div>

      {error ? (
        <div
          id={`${name}-error`}
          className="text-red-500 text-sm mt-1"
          aria-live="polite"
        >
          {error}
        </div>
      ) : null}

      {isOpen && !disabled && (
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false, // We'll handle focus manually
            escapeDeactivates: () => {
              closeCalendar();
              return true;
            },
            clickOutsideDeactivates: true,
            returnFocusOnDeactivate: true,
          }}
        >
          <div
            id={`${name}-calendar`}
            ref={calendarRef}
            className="absolute right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full md:w-80"
            role="dialog"
            aria-modal="true"
            aria-label="Select Date"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                {showPrevNextYear && (
                  <button
                    type="button"
                    onClick={prevYear}
                    aria-label="Previous year"
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronsLeft size={20} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={prevMonth}
                  aria-label="Previous month"
                  className="p-1 hover:bg-gray-100 rounded-full ml-1"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              <div
                className="font-medium"
                aria-live="polite"
                aria-atomic="true"
              >
                {format(currentMonth, "MMMM yyyy")}
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Next month"
                  className="p-1 hover:bg-gray-100 rounded-full mr-1"
                >
                  <ChevronRight size={20} />
                </button>
                {showPrevNextYear && (
                  <button
                    type="button"
                    onClick={nextYear}
                    aria-label="Next year"
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronsRight size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="font-medium text-gray-500 text-xs p-2 flex-1"
                  role="columnheader"
                  aria-label={
                    day === "Su"
                      ? "Sunday"
                      : day === "Mo"
                        ? "Monday"
                        : day === "Tu"
                          ? "Tuesday"
                          : day === "We"
                            ? "Wednesday"
                            : day === "Th"
                              ? "Thursday"
                              : day === "Fr"
                                ? "Friday"
                                : "Saturday"
                  }
                >
                  {day}
                </div>
              ))}
            </div>

            <div
              ref={daysGridRef}
              className="grid grid-cols-7 gap-1 text-center"
              role="grid"
              aria-labelledby={`${name}-calendar-heading`}
            >
              {getDaysInMonth(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
              ).map((date, i) => (
                <div key={i} {...getDayProps(date)} role="gridcell">
                  {date ? date.getDate() : ""}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={goToToday}
                className="text-red-500 hover:text-red-700 font-medium text-sm"
                aria-label="Go to today's date"
              >
                Today
              </button>
              <button
                type="button"
                onClick={closeCalendar}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm"
                aria-label="Close calendar"
              >
                Close
              </button>
            </div>
          </div>
        </FocusTrap>
      )}
    </div>
  );
};

export default CalendarField;
