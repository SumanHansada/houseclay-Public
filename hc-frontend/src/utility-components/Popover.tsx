"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useId,
} from "react";
import { createPortal } from "react-dom";

type Trigger = "hover" | "click";
type Align = "start" | "center" | "end";
type Content =
  | React.ReactNode
  | ((ctx: { close: () => void }) => React.ReactNode);

interface PopoverProps {
  trigger: Trigger;
  align?: Align; // start | center | end
  /** Pass false to render just children (no popover), avoids ternaries */
  enabled?: boolean;
  /** Gap between trigger and panel */
  offset?: number;
  /** Panel content (node or render fn with close()) */
  content: Content | null | false | undefined;
  /** Classes */
  className?: string; // wrapper around trigger
  panelClassName?: string; // panel
  /** Behaviour */
  portal?: boolean; // render into body (default true)
  zIndex?: number; // default 60
  stopPropagation?: boolean; // default true (helps inside tables)
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

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
  // Short-circuit: nothing to show
  if (!enabled || !content) return <>{children}</>;

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

  const computePosition = () => {
    if (!triggerRef.current || !panelRef.current) return;
    const tr = triggerRef.current.getBoundingClientRect();
    const pr = panelRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const top = Math.min(tr.bottom + offset, vh - pr.height - 8);

    let left: number;
    if (align === "start") {
      left = tr.left;
    } else if (align === "center") {
      left = tr.left + tr.width / 2 - pr.width / 2;
    } else {
      // end
      left = tr.right - pr.width;
    }
    left = clamp(left, 8, vw - pr.width - 8);

    setCoords({ top, left });
  };

  const useIsoLayout =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsoLayout(() => {
    if (!open) return;
    computePosition();
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => setMounted(true), []);

  // Close on ESC + outside click
  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  // Hover intent (simple)
  const [enterTimer, setEnterTimer] = useState<number | null>(null);
  const [leaveTimer, setLeaveTimer] = useState<number | null>(null);
  const clearTimers = () => {
    if (enterTimer) window.clearTimeout(enterTimer);
    if (leaveTimer) window.clearTimeout(leaveTimer);
    setEnterTimer(null);
    setLeaveTimer(null);
  };

  const onTriggerMouseEnter = () => {
    if (effectiveTrigger !== "hover") return;
    clearTimers();
    setEnterTimer(window.setTimeout(() => setOpen(true), 60));
  };
  const onTriggerMouseLeave = () => {
    if (effectiveTrigger !== "hover") return;
    clearTimers();
    setLeaveTimer(window.setTimeout(() => setOpen(false), 120));
  };
  const onPanelMouseEnter = () => {
    if (effectiveTrigger !== "hover") return;
    clearTimers();
  };
  const onPanelMouseLeave = () => {
    if (effectiveTrigger !== "hover") return;
    clearTimers();
    setLeaveTimer(window.setTimeout(() => setOpen(false), 120));
  };

  const onTriggerClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
      (e.nativeEvent as any).stopImmediatePropagation?.();
    }
    if (effectiveTrigger !== "click") return;
    setOpen((v) => !v);
  };
  const onTriggerMouseDown = (e: React.MouseEvent) => {
    if (!stopPropagation) return;
    e.stopPropagation();
    (e.nativeEvent as any).stopImmediatePropagation?.();
  };

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const ro = new ResizeObserver(() => computePosition());
    ro.observe(panelRef.current);
    return () => ro.disconnect();
  }, [open]);

  // 1) Render panel when `open` (remove `&& coords`)
  const panel = open ? (
    <div
      ref={panelRef}
      id={id}
      role={effectiveTrigger === "hover" ? "tooltip" : "menu"}
      className={`fixed rounded-md border border-gray-200 bg-white shadow-xl ${panelClassName ?? ""}`}
      style={{
        // 2) While we don't have coords yet, place at 0,0 but hide it
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
        (e.nativeEvent as any).stopImmediatePropagation?.();
      }}
      onClick={(e) => {
        if (!stopPropagation) return;
        e.stopPropagation();
        (e.nativeEvent as any).stopImmediatePropagation?.();
      }}
    >
      {typeof content === "function"
        ? (content as any)({ close: () => setOpen(false) })
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
    </>
  );
}
