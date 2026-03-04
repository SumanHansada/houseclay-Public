"use client";

import React, { useEffect, useState } from "react";

export interface InfiniteScrollerItem {
  text: string;
  icon?: React.ReactNode;
}

export interface InfiniteScrollerProps {
  items?: InfiniteScrollerItem[];
  className?: string;
  itemClassName?: string;
  intervalMs?: number;
}

const DEFAULT_ITEMS: InfiniteScrollerItem[] = [
  {
    text: "Live listings. Zero brokerage",
    // icon: <CheckCircle2 className="size-5" />,
  },
  {
    text: "Verified owners. Verified tenants.",
    // icon: <CheckCircle2 className="size-5" />,
  },
  {
    text: "No hassle. No spams.",
    // icon: <CheckCircle2 className="size-5" />
  },
];

const InfiniteScroller: React.FC<InfiniteScrollerProps> = ({
  items = DEFAULT_ITEMS,
  className = "mb-6",
  itemClassName = "font-medium text-lg text-emerald-600 justify-start",
  intervalMs = 4500,
}) => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const safeItems = items && items.length > 0 ? items : [{ text: "" }];

  useEffect(() => {
    if (safeItems.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
      setIsTransitioning(true);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [safeItems.length, intervalMs]);

  useEffect(() => {
    if (index === safeItems.length) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 700);
      return () => clearTimeout(resetTimer);
    }
  }, [index, safeItems.length]);

  if (safeItems.length === 0) return null;

  return (
    <div className={`h-7 overflow-hidden ${className}`}>
      <div
        className={
          "flex flex-col " +
          (isTransitioning
            ? "transition-transform duration-700 ease-in-out"
            : "")
        }
        style={{ transform: "translateY(-" + index * 1.75 + "rem)" }}
      >
        {[...safeItems, safeItems[0]].map((item, i) => (
          <div
            key={i}
            className={`h-7 flex items-center gap-2 text-nowrap whitespace-nowrap ${itemClassName}`}
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroller;
