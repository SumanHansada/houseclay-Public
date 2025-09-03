"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function Actions({
  anchorEl,
  open,
  onClose,
  onDashboard,
  onMarkSold,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onDashboard: () => void;
  onMarkSold: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    if (!open || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 8,
      left: Math.min(
        rect.left + window.scrollX - 160 + rect.width,
        window.scrollX + window.innerWidth - 208,
      ),
    });
  }, [open, anchorEl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" aria-hidden="true" onClick={onClose}>
      <div
        role="menu"
        aria-orientation="vertical"
        ref={menuRef}
        className="absolute z-[61] w-48 rounded-xl bg-white shadow-lg ring-1 ring-black/5"
        style={{ top: pos.top, left: pos.left }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          role="menuitem"
          className="w-full text-left px-4 py-2 hover:bg-gray-50"
          onClick={() => {
            onDashboard();
            onClose();
          }}
        >
          Dashboard
        </button>
        <button
          role="menuitem"
          className="w-full text-left px-4 py-2 hover:bg-gray-50"
          onClick={() => {
            onMarkSold();
            onClose();
          }}
        >
          Mark property as sold
        </button>
      </div>
    </div>
  );
}
