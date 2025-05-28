"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ActionMenuProps {
  offsetX?: number;
  offsetY?: number;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  offsetX = 0,
  offsetY = 0,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuStyles({
      position: "absolute",
      top: rect.bottom + window.scrollY + offsetY,
      left: rect.left + window.scrollX + offsetX,
      zIndex: 9999,
    });
  }, [offsetX, offsetY]);

  const toggleMenu = () => {
    if (!open) updatePosition();
    setOpen((o) => !o);
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  const menu = (
    <ul className="bg-white border rounded shadow-lg" style={menuStyles}>
      <li>
        <button
          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          onClick={() => setOpen(false)}
        >
          View
        </button>
      </li>
      <li>
        <button
          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          onClick={() => setOpen(false)}
        >
          Block
        </button>
      </li>
    </ul>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="px-3 py-2 rounded-full cursor-pointer hover:bg-gray-200"
      >
        &#x22EE;
      </button>
      {open && createPortal(menu, document.body)}
    </>
  );
};
