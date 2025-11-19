"use client";

import { ChevronDown, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ACCOUNT_NAV } from "@/common/dataConstants/navbar";
import { AccountNavList } from "@/components/AccountNavList";

interface UserDropdownProps {
  userName: string;
  className?: string;
  iconSize?: number;
  dropdownWidth?: number;
  onItemClick?: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  className = "flex flex-row xl:gap-2 md:gap-1 gap-1 xl:px-6 lg:px-5 md:px-3 px-3 py-2 border rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-center",
  iconSize = 32,
  dropdownWidth = 320,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DOMRect | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={className}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <UserRound width={20} height={20} />
        <ChevronDown
          width={20}
          height={20}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Portal */}
      {isOpen &&
        dropdownPosition &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1"
            style={{
              top: dropdownPosition.bottom + window.scrollY,
              left: dropdownPosition.right - dropdownWidth + window.scrollX,
              minWidth: dropdownWidth,
            }}
          >
            <AccountNavList
              items={ACCOUNT_NAV}
              variant="header"
              userName={userName}
              iconSize={iconSize}
              onItemSelect={handleItemClick}
            />
          </div>,
          document.body,
        )}
    </>
  );
};
