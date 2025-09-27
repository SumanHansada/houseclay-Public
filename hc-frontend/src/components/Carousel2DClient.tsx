"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

interface Carousel2DProps {
  children: ReactNode;
  className?: string;
  slideWidth?: number;
  gap?: number;
  showArrows?: boolean;
  showDots?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  containerClassName?: string;
}

const Carousel2DClient: React.FC<Carousel2DProps> = ({
  children,
  className = "",
  slideWidth = 200,
  gap = 16,
  showArrows = false,
  showDots = false,
  autoScroll = false,
  autoScrollInterval = 3000,
  containerClassName = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slidesCount = React.Children.count(children);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
    );
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = slideWidth
      ? slideWidth + gap
      : container.clientWidth / 2;
    const targetScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  };

  const handleScrollUpdate = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const slideIndex = Math.round(container.scrollLeft / (slideWidth + gap));
    setCurrentSlideIndex(slideIndex);
  };

  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth - 1
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        handleScroll("right");
      }
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScrollButtons);
    container.addEventListener("scroll", handleScrollUpdate);
    window.addEventListener("resize", checkScrollButtons);
    checkScrollButtons();
    return () => {
      container.removeEventListener("scroll", checkScrollButtons);
      container.removeEventListener("scroll", handleScrollUpdate);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [slideWidth, gap]);

  return (
    <div className={`relative w-full ${className}`}>
      {showArrows && (
        <button
          onClick={() => handleScroll("left")}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition-opacity duration-300 flex items-center justify-center ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className={`grid grid-flow-col auto-cols-max ${gap ? `gap-${gap}` : ""} py-2 overflow-x-scroll scrollbar-hide scroll-smooth ${containerClassName}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {React.Children.map(children, (child) => (
          <div
            style={{
              width: slideWidth ? `${slideWidth}px` : "auto",
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {showArrows && (
        <button
          onClick={() => handleScroll("right")}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition-opacity duration-300 flex items-center justify-center ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {showDots && (
        <div className="py-4 bottom-2 left-0 right-0 flex justify-center gap-1">
          {Array.from({ length: slidesCount }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlideIndex ? "bg-black" : "bg-gray-400"
              }`}
              name={`carousel-item-${index}`}
              aria-label={`carousel-item-${index}`}
              onClick={() => {
                const container = scrollContainerRef.current;
                if (!container) return;
                const targetScrollLeft = index * (slideWidth + gap);
                container.scrollTo({
                  left: targetScrollLeft,
                  behavior: "smooth",
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel2DClient;
