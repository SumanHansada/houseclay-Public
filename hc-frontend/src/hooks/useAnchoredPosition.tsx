"use client";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

type Coords = { top: number; left: number; width: number } | null;

type RefLike<T extends HTMLElement = HTMLElement> = { current: T | null };

interface Options {
  open: boolean;
  alignEnd?: boolean;
  minWidthPx?: number;
  gap?: number;
  triggerRef: RefLike<HTMLElement>;
  layerRef: RefLike<HTMLElement>;
}

export function useAnchoredPosition({
  open,
  alignEnd = true,
  minWidthPx,
  gap = 6,
  triggerRef,
  layerRef,
}: Options) {
  const [coords, setCoords] = useState<Coords>(null);

  const compute = useCallback(() => {
    const trigger = triggerRef.current;
    const layer = layerRef.current;
    if (!trigger) return;

    const r = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const width = Math.max(minWidthPx ?? r.width, 160);
    let top = r.bottom + gap;
    let left = alignEnd ? r.right - width : r.left;

    if (left + width > vw - gap) left = vw - width - gap;
    if (left < gap) left = gap;

    const estH = layer?.offsetHeight ?? 200;
    if (top + estH > vh - gap) {
      const flippedTop = r.top - estH - gap;
      top = flippedTop >= gap ? flippedTop : Math.max(gap, vh - estH - gap);
    }

    setCoords({ top, left, width });
  }, [alignEnd, gap, minWidthPx, triggerRef, layerRef]);

  useLayoutEffect(() => {
    if (open) compute();
  }, [open, compute]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => compute();
    const onResize = () => compute();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => compute());
    if (triggerRef.current) ro.observe(triggerRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [open, compute, triggerRef]);

  return { coords, recompute: compute };
}
