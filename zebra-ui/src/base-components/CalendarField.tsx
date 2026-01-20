"use client";

import {
  addDays,
  addMonths,
  addYears,
  endOfWeek,
  format,
  isValid,
  parse,
  setYear,
  startOfWeek,
} from "date-fns";
import { FocusTrap } from "focus-trap-react";
import {
  CalendarDays,
  ChevronDown,
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
  showYearDropdown?: boolean;
  disablePrevDates?: boolean;
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
  showYearDropdown = false,
  disablePrevDates = true,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const daysGridRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const yearPickerRef = useRef<HTMLDivElement>(null);

  // Generate Year Range (1900 - 2050)
  const years = Array.from({ length: 151 }, (_, i) => 1900 + i);

  const displayValue =
    value && isValid(new Date(value))
      ? format(new Date(value), dateFormat)
      : "";

  // Initialize focused date when opening calendar
  useEffect(() => {
    if (isOpen) {
      if (value && isValid(new Date(value))) {
        const date = new Date(value);
        setFocusedDate(date);
        setCurrentMonth(date);
      } else {
        const today = new Date();
        setFocusedDate(today);
        setCurrentMonth(today);
      }
    }
  }, [isOpen, value]);

  // Scroll to selected year when picker opens
  useEffect(() => {
    if (showYearPicker && yearPickerRef.current) {
      const selectedYearEl = yearPickerRef.current.querySelector(
        `[data-year="${currentMonth.getFullYear()}"]`,
      );
      if (selectedYearEl) {
        selectedYearEl.scrollIntoView({ block: "center" });
      }
    }
  }, [showYearPicker, currentMonth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    const parsedDate = parse(inputValue, dateFormat, new Date());
    if (isValid(parsedDate)) {
      setCurrentMonth(parsedDate);
      setFocusedDate(parsedDate);
    }
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
    setShowYearPicker(false);
  };

  const handleDateSelect = (date: Date) => {
    onChange(date.toISOString());
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
    setShowYearPicker(false);
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

  // Improved Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close the whole calendar if click is outside calendarRef
      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setIsOpen(false);
        setShowYearPicker(false);
      }
      // Close ONLY the year picker if it's open and we click inside the calendar but outside the year picker section
      else if (
        showYearPicker &&
        yearPickerRef.current &&
        !yearPickerRef.current.contains(target)
      ) {
        setShowYearPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showYearPicker]);

  // Ensure focus is on the right date in the grid
  useEffect(() => {
    if (isOpen && focusedDate && !showYearPicker) {
      setTimeout(() => {
        const dateStr = format(focusedDate, "yyyy-MM-dd");
        const dateElement = daysGridRef.current?.querySelector(
          `[data-date="${dateStr}"]`,
        );
        if (dateElement instanceof HTMLElement) dateElement.focus();
      }, 10);
    }
  }, [isOpen, focusedDate, currentMonth, showYearPicker]);

  // Format day classes and attributes
  const getDayProps = (
    date: Date | null,
  ): React.HTMLAttributes<HTMLDivElement> & {
    "data-date"?: string;
    "data-is-today"?: string;
  } => {
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
    const isDisabled = disablePrevDates && date.getTime() < todayTimestamp;
    const dateStr = format(date, "yyyy-MM-dd");

    return {
      className: `
      p-2 text-sm cursor-pointer hover:bg-gray-100 rounded focus:outline-none
      ${isToday ? "bg-gray-200 font-semibold" : ""}
      ${isSelected ? "bg-red-500 text-white hover:bg-red-600" : ""}
      ${isFocused && !isSelected ? "ring-2 ring-red-500" : ""}
      ${isDisabled ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-gray-700"}
    `,
      tabIndex: isFocused && !isDisabled ? 0 : -1,
      role: "gridcell",
      "aria-label": format(date, "EEEE, MMMM do, yyyy"),
      "aria-selected": !!isSelected,
      "aria-disabled": !!isDisabled,
      "aria-current": isToday ? ("date" as const) : undefined,
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

      <div className="relative flex group">
        <input
          id={name}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-label={label || "Date input"}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`
            w-full p-3 border rounded-l-xl rounded-none transition-colors
            ${error ? "border-red-500" : "border-gray-300 focus:border-red-500"}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          `}
        />
        <button
          ref={calendarButtonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-label="Toggle calendar"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls={`${name}-calendar`}
          className={`inline-flex items-center px-3 ${isOpen ? "bg-gray-200" : "bg-gray-100"} text-gray-500 border border-l-0 border-gray-300 rounded-r-xl transition-colors hover:bg-gray-200`}
        >
          <CalendarDays size={20} />
        </button>
      </div>

      {error && (
        <div
          id={`${name}-error`}
          className="text-red-500 text-sm mt-1"
          role="alert"
        >
          {error}
        </div>
      )}

      {isOpen && !disabled && (
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
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
            className="absolute right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80"
            role="dialog"
            aria-modal="true"
            aria-label="Calendar date picker"
          >
            {/* Header: Month/Year Nav */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-1">
                {showPrevNextYear && (
                  <button
                    type="button"
                    onClick={prevYear}
                    aria-label="Previous year"
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <ChevronsLeft size={20} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={prevMonth}
                  aria-label="Previous month"
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              {/* Month Name & Year Dropdown */}
              <div className="flex items-center gap-2 font-semibold text-gray-800 relative">
                {showYearDropdown ? (
                  <>
                    <span aria-live="polite">
                      {format(currentMonth, "MMMM")}
                    </span>
                    <div className="relative" ref={yearPickerRef}>
                      <button
                        type="button"
                        onClick={() => setShowYearPicker(!showYearPicker)}
                        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Select year"
                        aria-expanded={showYearPicker}
                      >
                        {currentMonth.getFullYear()}
                        <ChevronDown
                          size={14}
                          className={`transform transition-transform ${showYearPicker ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Custom Year Dropdown */}
                      {showYearPicker && (
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-24 max-h-48 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-md z-50 py-1 scrollbar-thin">
                          {years.map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => handleYearSelect(year)}
                              data-year={year}
                              className={`
                            block w-full text-center px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                            ${year === currentMonth.getFullYear() ? "bg-red-50 text-red-600 font-bold" : "text-gray-700"}
                          `}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <span aria-live="polite">
                    {format(currentMonth, "MMMM yyyy")}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Next month"
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <ChevronRight size={20} />
                </button>
                {showPrevNextYear && (
                  <button
                    type="button"
                    onClick={nextYear}
                    aria-label="Next year"
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <ChevronsRight size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2" role="row">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-1"
                  role="columnheader"
                  aria-label={day}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div
              ref={daysGridRef}
              className="grid grid-cols-7 gap-1 text-center"
              role="grid"
              aria-labelledby={`${name}-label`}
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

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={goToToday}
                className="text-red-500 hover:text-red-700 font-medium text-sm focus:outline-none focus:underline"
              >
                Today
              </button>
              <button
                type="button"
                onClick={closeCalendar}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm focus:outline-none focus:underline"
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
