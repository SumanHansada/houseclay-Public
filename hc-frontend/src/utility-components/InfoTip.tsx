"use client";

import React, { ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAnchoredPosition } from "@/hooks/useAnchoredPosition";

interface InfoTipProps {
  children: ReactNode;
  content: ReactNode;
  enabled?: boolean;
  alignEnd?: boolean;
  minWidthPx?: number;
  openDelayMs?: number;
  closeDelayMs?: number;
  gap?: number;
  className?: string;
}

const InfoTip: React.FC<InfoTipProps> = ({
  children,
  content,
  enabled = true,
  alignEnd = true,
  minWidthPx,
  openDelayMs = 80,
  closeDelayMs = 120,
  gap = 6,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const { coords } = useAnchoredPosition({
    open,
    alignEnd,
    minWidthPx,
    gap,
    triggerRef,
    layerRef: tipRef,
  });

  // stable timers
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleEnter = () => {
    clearTimers();
    openTimerRef.current = window.setTimeout(() => {
      if (enabled) setOpen(true);
    }, openDelayMs);
  };
  const handleLeave = () => {
    clearTimers();
    closeTimerRef.current = window.setTimeout(
      () => setOpen(false),
      closeDelayMs,
    );
  };

  // close if `enabled` flips to false while open
  useEffect(() => {
    if (!enabled && open) setOpen(false);
  }, [enabled, open]);

  useEffect(() => clearTimers, []);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      aria-describedby={open ? tooltipId : undefined}
      className="inline-flex"
    >
      {children}
      {open &&
        coords &&
        createPortal(
          <div
            ref={tipRef}
            id={tooltipId}
            role="tooltip"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              minWidth: coords.width,
              zIndex: 1000,
            }}
            className={`rounded-md border border-gray-200 bg-white shadow-xl ${className}`}
          >
            <div className="px-4 py-3 text-sm text-gray-800">{content}</div>
          </div>,
          document.body,
        )}
    </span>
  );
};

export default InfoTip;
