"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Trigger = "hover" | "click";
type Align = "start" | "center" | "end";
type Content =
  | React.ReactNode
  | ((ctx: { close: () => void }) => React.ReactNode);

interface PopoverProps {
  trigger: Trigger;
  align?: Align; // bottom placement only; horizontal align
  enabled?: boolean; // if false, behaves as plain children
  offset?: number; // px gap between trigger and panel
  content: Content | null | false | undefined;

  className?: string; // wrapper around trigger
  panelClassName?: string; // panel

  portal?: boolean; // render into body
  zIndex?: number; // default 60
  stopPropagation?: boolean; // default true
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

type NativeMouseEventLike = { stopImmediatePropagation?: () => void };

export default function Popover({
  trigger,
  align = "start",
  enabled = true,
  offset = 8,
  content,
  className,
  panelClassName,
  portal = true,
  zIndex = 60,
  stopPropagation = true,
  children,
}: React.PropsWithChildren<PopoverProps>) {
  const isDisabled = !enabled || !content;

  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const id = useId();

  // Treat hover as click on touch devices
  const [effectiveTrigger, setEffectiveTrigger] = useState<Trigger>(trigger);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = matchMedia("(hover: none)").matches;
    setEffectiveTrigger(isTouch && trigger === "hover" ? "click" : trigger);
  }, [trigger]);

  // Compute bottom placement + horizontal alignment
  const computePosition = useCallback(() => {
    if (!triggerRef.current || !panelRef.current) return;
    const tr = triggerRef.current.getBoundingClientRect();
    const pr = panelRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const top = Math.min(tr.bottom + offset, vh - pr.height - 8);

    let left: number;
    if (align === "start") left = tr.left;
    else if (align === "center") left = tr.left + tr.width / 2 - pr.width / 2;
    else left = tr.right - pr.width;
    left = clamp(left, 8, vw - pr.width - 8);

    setCoords({ top, left });
  }, [align, offset]);

  const useIsoLayout =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Recompute on open/scroll/resize
  useIsoLayout(() => {
    if (!open || isDisabled) return;
    computePosition();

    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, isDisabled, computePosition]);

  useEffect(() => setMounted(true), []);

  // Close on ESC + outside click
  useEffect(() => {
    if (!open || isDisabled) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        triggerRef.current &&
        panelRef.current &&
        !triggerRef.current.contains(t) &&
        !panelRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown, true);
    };
  }, [open, isDisabled]);

  // Hover intent
  const [enterTimer, setEnterTimer] = useState<number | null>(null);
  const [leaveTimer, setLeaveTimer] = useState<number | null>(null);
  const clearTimers = () => {
    if (enterTimer) window.clearTimeout(enterTimer);
    if (leaveTimer) window.clearTimeout(leaveTimer);
    setEnterTimer(null);
    setLeaveTimer(null);
  };

  const onTriggerMouseEnter = () => {
    if (isDisabled || effectiveTrigger !== "hover") return;
    clearTimers();
    setEnterTimer(window.setTimeout(() => setOpen(true), 60));
  };
  const onTriggerMouseLeave = () => {
    if (isDisabled || effectiveTrigger !== "hover") return;
    clearTimers();
    setLeaveTimer(window.setTimeout(() => setOpen(false), 120));
  };
  const onPanelMouseEnter = () => {
    if (isDisabled || effectiveTrigger !== "hover") return;
    clearTimers();
  };
  const onPanelMouseLeave = () => {
    if (isDisabled || effectiveTrigger !== "hover") return;
    clearTimers();
    setLeaveTimer(window.setTimeout(() => setOpen(false), 120));
  };

  const onTriggerClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
      (
        e.nativeEvent as unknown as NativeMouseEventLike
      ).stopImmediatePropagation?.();
    }
    if (isDisabled || effectiveTrigger !== "click") return;
    setOpen((v) => !v);
  };
  const onTriggerMouseDown = (e: React.MouseEvent) => {
    if (!stopPropagation) return;
    e.stopPropagation();
    (
      e.nativeEvent as unknown as NativeMouseEventLike
    ).stopImmediatePropagation?.();
  };

  // Reposition if panel size changes after mount (fonts/icons load)
  useEffect(() => {
    if (!open || isDisabled || !panelRef.current) return;
    const ro = new ResizeObserver(() => computePosition());
    ro.observe(panelRef.current);
    return () => ro.disconnect();
  }, [open, isDisabled, computePosition]);

  // Panel (render when open; hide until coords are known)
  const panel = open ? (
    <div
      ref={panelRef}
      id={id}
      role={effectiveTrigger === "hover" ? "tooltip" : "menu"}
      className={`fixed rounded-xl border border-gray-200 bg-white shadow-xl ${panelClassName ?? ""}`}
      style={{
        top: coords?.top ?? 0,
        left: coords?.left ?? 0,
        zIndex,
        visibility: coords ? "visible" : "hidden",
      }}
      onMouseEnter={onPanelMouseEnter}
      onMouseLeave={onPanelMouseLeave}
      onMouseDown={(e) => {
        if (!stopPropagation) return;
        e.stopPropagation();
        (
          e.nativeEvent as unknown as NativeMouseEventLike
        ).stopImmediatePropagation?.();
      }}
      onClick={(e) => {
        if (!stopPropagation) return;
        e.stopPropagation();
        (
          e.nativeEvent as unknown as NativeMouseEventLike
        ).stopImmediatePropagation?.();
      }}
    >
      {typeof content === "function"
        ? (content as (ctx: { close: () => void }) => React.ReactNode)({
            close: () => setOpen(false),
          })
        : content}
    </div>
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        className={className}
        aria-haspopup
        aria-expanded={open}
        aria-controls={id}
        onMouseEnter={onTriggerMouseEnter}
        onMouseLeave={onTriggerMouseLeave}
        onClick={onTriggerClick}
        onMouseDown={onTriggerMouseDown}
        tabIndex={0}
        style={{ display: "inline-flex" }}
      >
        {children}
      </span>
      {portal && mounted ? createPortal(panel, document.body) : panel}
      {/* When disabled, just render children without behavior */}
      {isDisabled && null}
    </>
  );
}
