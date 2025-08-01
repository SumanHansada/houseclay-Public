"use client";

import { toSlug } from "@/utils/core";
import { FocusTrap } from "focus-trap-react";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Option {
  id: number | string;
  label: string;
}

interface ActionMenuProps {
  options?: Option[];
  onSelect?: (option: Option) => void;
  actionMenuClass?: string;
  selectedLabelClass?: string;
  children: React.ReactNode;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  options = [],
  onSelect = (option: Option) => console.log("Selected:", option),
  actionMenuClass = "",
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [actionMenuPosition, setActionMenuPosition] = useState<DOMRect | null>(
    null,
  );

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionMenuListRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      event.stopPropagation();
      if (
        actionMenuRef.current &&
        actionMenuRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (
        actionMenuListRef.current &&
        !actionMenuListRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection
  const handleSelect = (option: Option): void => {
    setIsOpen(false);
    onSelect(option);
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (focusedIndex < options.length - 1) {
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
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;

      case "Home":
        e.preventDefault();
        if (options.length > 0) {
          setFocusedIndex(0);
          optionRefs.current[0]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
        break;

      case "End":
        e.preventDefault();
        if (options.length > 0) {
          const lastIndex = options.length - 1;
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

  // Toggle action menu with keyboard
  const handleToggleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  // Measure action menu trigger position
  useEffect(() => {
    if (isOpen && actionMenuRef.current) {
      setActionMenuPosition(actionMenuRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  return (
    <div className="min-w-fit" ref={actionMenuRef}>
      {/* Trigger element (children) */}
      <div
        className={`${actionMenuClass} cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleToggleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {children}
      </div>

      {/* action menu menu with higher z-index */}
      {isOpen &&
        actionMenuPosition &&
        createPortal(
          <FocusTrap
            focusTrapOptions={{
              initialFocus: false,
              clickOutsideDeactivates: true,
              fallbackFocus: () => actionMenuRef.current as HTMLElement,
            }}
          >
            <div
              className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
              style={{
                top: actionMenuPosition.bottom + window.scrollY,
                left: actionMenuPosition.left + window.scrollX,
                minWidth: actionMenuPosition.width,
              }}
              ref={actionMenuListRef}
              onKeyDown={handleKeyDown}
            >
              {/* Options list */}
              <div
                className="max-h-64 overflow-y-auto"
                role="menu"
                aria-orientation="vertical"
              >
                {options.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No options available
                  </div>
                ) : (
                  options.map((option, index) => (
                    <div
                      key={option.id}
                      ref={optionRefs.current[index]}
                      className={`px-4 py-2 border-l-4 text-sm cursor-pointer hover:bg-gray-100 hover:border-red-500 ${
                        focusedIndex === index ? "bg-blue-100 outline-none" : ""
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSelect(option);
                      }}
                      role="menuitem"
                      tabIndex={-1}
                      data-testid={`menuitem-${toSlug(option.label)}`} // Zebra-UI: updated
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

export default ActionMenu;
