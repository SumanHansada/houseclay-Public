"use client";

import { FocusTrap } from "focus-trap-react";
import { ChevronDown, UserRound } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { ACCOUNT_NAV_ITEMS } from "@/common/dataConstants/navbarList";
import { AccountNavList } from "@/components/AccountNavList";

interface UserDropdownProps {
  userName: string;
  className?: string;
  iconSize?: number;
  dropdownWidth?: number;
  onItemClick?: () => void;
  /** Accessible name for the menu trigger (defaults to user-aware label). */
  ariaLabel?: string;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  className = "flex flex-row xl:gap-2 md:gap-1 gap-1 xl:px-6 lg:px-5 md:px-3 px-3 py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-center",
  iconSize = 32,
  dropdownWidth = 320,
  onItemClick,
  ariaLabel: ariaLabelProp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DOMRect | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const triggerId = useId();

  const triggerAriaLabel =
    ariaLabelProp?.trim() ||
    `Open account menu, signed in as ${userName || "user"}`;

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  // Measure dropdown position
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      setDropdownPosition(triggerRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    onItemClick?.();
  };

  /** Arrow keys scroll the page by default on links; trap focus moves + preventDefault. */
  const handleMenuKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
      const root = e.currentTarget;
      const links = [...root.querySelectorAll<HTMLElement>("a[href]")];
      if (links.length === 0) return;
      e.preventDefault();
      const active = document.activeElement;
      const idx = active instanceof HTMLElement ? links.indexOf(active) : -1;
      let nextIdx: number;
      switch (e.key) {
        case "ArrowDown":
          nextIdx = idx < 0 ? 0 : (idx + 1) % links.length;
          break;
        case "ArrowUp":
          nextIdx =
            idx < 0
              ? links.length - 1
              : (idx - 1 + links.length) % links.length;
          break;
        case "Home":
          nextIdx = 0;
          break;
        case "End":
          nextIdx = links.length - 1;
          break;
        default:
          return;
      }
      links[nextIdx]?.focus();
    },
    [],
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={className}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        aria-label={triggerAriaLabel}
      >
        <UserRound width={20} height={20} className="shrink-0" aria-hidden />
        <ChevronDown
          width={20}
          height={20}
          className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {/* Dropdown Portal */}
      {isOpen &&
        dropdownPosition &&
        createPortal(
          <FocusTrap
            focusTrapOptions={{
              initialFocus: () => {
                const root = dropdownRef.current;
                if (!root) return false;
                return (
                  root.querySelector<HTMLElement>(
                    "a[href], button:not([disabled])",
                  ) ?? root
                );
              },
              fallbackFocus: () => dropdownRef.current ?? document.body,
              escapeDeactivates: false,
              clickOutsideDeactivates: false,
              allowOutsideClick: true,
              returnFocusOnDeactivate: true,
            }}
          >
            <div
              id={menuId}
              ref={dropdownRef}
              role="region"
              aria-label="Account navigation"
              tabIndex={-1}
              className="absolute z-50 mt-1 outline-none"
              onKeyDownCapture={handleMenuKeyDown}
              style={{
                top: dropdownPosition.bottom + window.scrollY,
                left: dropdownPosition.right - dropdownWidth + window.scrollX,
                minWidth: dropdownWidth,
              }}
            >
              <AccountNavList
                items={ACCOUNT_NAV_ITEMS}
                variant="header"
                userName={userName}
                iconSize={iconSize}
                onItemSelect={handleItemClick}
              />
            </div>
          </FocusTrap>,
          document.body,
        )}
    </>
  );
};
