"use client";

import { FocusTrap } from "focus-trap-react";
import React, {
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

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

export function ActionMenu<T extends ActionOption = ActionOption>({
  options,
  onSelect,
  children,
  alignEnd = true,
  minWidthPx,
  className = "",
}: ActionMenuProps<T>) {
  const [open, setOpen] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Compute viewport-fixed position; handles nested scrolling
  const compute = (): void => {
    const trigger = triggerRef.current;
    const menuEl = menuRef.current;
    if (!trigger) return;

    const r = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const width = Math.max(minWidthPx ?? r.width, 160);
    let top = r.bottom + GAP;
    let left = alignEnd ? r.right - width : r.left;

    // Clamp horizontally
    if (left + width > vw - GAP) left = vw - width - GAP;
    if (left < GAP) left = GAP;

    // Estimate height and flip if needed
    const estH = menuEl?.offsetHeight ?? 200;
    if (top + estH > vh - GAP) {
      const flippedTop = r.top - estH - GAP;
      top = flippedTop >= GAP ? flippedTop : Math.max(GAP, vh - estH - GAP);
    }

    setCoords({ top, left, width });
  };

  // Recompute when opening
  useLayoutEffect(() => {
    if (open) compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, alignEnd, minWidthPx]);

  // Recompute on scroll/resize and trigger size changes
  useEffect(() => {
    if (!open) return;
    const onScroll = (): void => compute();
    const onResize = (): void => compute();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => compute());
    if (triggerRef.current) ro.observe(triggerRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [open]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent): void => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !triggerRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Menu items (query on demand; no per-item refs needed)
  const getItems = (): HTMLElement[] =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );

  const moveFocus = (nextIndex: number): void => {
    const items = getItems();
    if (!items.length) return;
    const clamped = Math.max(0, Math.min(nextIndex, items.length - 1));
    setFocusedIndex(clamped);
    const el = items[clamped];
    el.focus();
    el.scrollIntoView({ block: "nearest" });
  };

  // Keyboard on menu
  const onMenuKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
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

  // Keyboard on trigger
  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      // focus first item after render
      setTimeout(() => moveFocus(0), 0);
    }
  };

  return (
    <div className="min-w-fit" ref={triggerRef}>
      <div
        className={`${className} cursor-pointer`}
        onClick={() => {
          setOpen((v) => !v);
          // focus first item after opening via click
          setTimeout(() => moveFocus(0), 0);
        }}
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
              clickOutsideDeactivates: true,
              fallbackFocus: () => triggerRef.current as HTMLElement,
            }}
          >
            <div
              ref={menuRef}
              role="menu"
              aria-orientation="vertical"
              onKeyDown={onMenuKeyDown}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                minWidth: coords.width,
                zIndex: 1000,
              }}
              className="rounded-md border border-gray-200 bg-white shadow-xl"
            >
              <div className="max-h-64 overflow-y-auto outline-none">
                {options.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No options available
                  </div>
                ) : (
                  options.map((opt: T, idx: number) => (
                    <div
                      key={opt.id}
                      role="menuitem"
                      tabIndex={-1}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                        focusedIndex === idx ? "bg-gray-50 outline-none" : ""
                      }`}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      onClick={(e) => {
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
