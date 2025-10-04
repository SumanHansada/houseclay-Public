"use client";

import { FocusTrap } from "focus-trap-react";
import React, {
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useAnchoredPosition } from "@/hooks/useAnchoredPosition";

export interface ActionOption {
  id: string | number;
  label: string;
}

interface ActionMenuProps<T extends ActionOption = ActionOption> {
  options: T[];
  onSelect: (option: T) => void;
  children: ReactNode;
  alignEnd?: boolean;
  minWidthPx?: number;
  className?: string;
}

const GAP = 6;

function ActionMenu<T extends ActionOption = ActionOption>({
  options,
  onSelect,
  children,
  alignEnd = true,
  minWidthPx,
  className = "",
}: ActionMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { coords } = useAnchoredPosition({
    open,
    alignEnd,
    minWidthPx,
    gap: GAP,
    triggerRef,
    layerRef: menuRef,
  });

  const getItems = (): HTMLElement[] =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );

  const moveFocus = (nextIndex: number) => {
    const items = getItems();
    if (!items.length) return;
    const clamped = Math.max(0, Math.min(nextIndex, items.length - 1));
    setFocusedIndex(clamped);
    const el = items[clamped];
    el.focus();
    el.scrollIntoView({ block: "nearest" });
  };

  const onMenuKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const max = options.length - 1;
    if (max < 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveFocus(focusedIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(focusedIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        moveFocus(0);
        break;
      case "End":
        e.preventDefault();
        moveFocus(max);
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0) {
          onSelect(options[focusedIndex]);
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setTimeout(() => moveFocus(0), 0);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
    if (!open) {
      setTimeout(() => moveFocus(0), 0);
    }
  };

  const handleDeactivate = () => {
    setOpen(false);
  };

  return (
    <div className="min-w-fit" ref={triggerRef}>
      <div
        className={`${className} cursor-pointer`}
        onMouseDown={handleTriggerClick}
        onKeyDown={onTriggerKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {children}
      </div>

      {open &&
        coords &&
        createPortal(
          <FocusTrap
            focusTrapOptions={{
              initialFocus: false,
              allowOutsideClick: true,
              clickOutsideDeactivates: true,
              returnFocusOnDeactivate: false,
              onDeactivate: handleDeactivate,
              fallbackFocus: () => triggerRef.current as HTMLElement,
            }}
          >
            <div
              ref={menuRef}
              role="menu"
              aria-orientation="vertical"
              onKeyDown={onMenuKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                minWidth: coords.width,
                zIndex: 9999,
              }}
              className="rounded-md border border-gray-200 bg-white shadow-xl"
            >
              <div className="max-h-64 overflow-y-auto outline-none">
                {options.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No options available
                  </div>
                ) : (
                  options.map((opt, idx) => (
                    <div
                      key={opt.id}
                      role="menuitem"
                      tabIndex={-1}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${focusedIndex === idx ? "bg-gray-50 outline-none" : ""}`}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        onSelect(opt);
                        setOpen(false);
                      }}
                    >
                      {opt.label}
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
}

export default ActionMenu;
