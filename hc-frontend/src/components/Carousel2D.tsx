import React, { ReactNode, useEffect, useRef, useState } from "react";

interface Carousel2DProps {
  children: ReactNode;
  className?: string;
  slideWidth?: number; // Optional fixed width for each slide
  gap?: number; // Gap between slides
  showArrows?: boolean; // Option to hide arrows
  autoScroll?: boolean; // Auto scroll feature
  autoScrollInterval?: number; // Interval for auto scroll in ms
}

const Carousel2D: React.FC<Carousel2DProps> = ({
  children,
  className = "",
  slideWidth,
  gap = 16,
  showArrows = true,
  autoScroll = false,
  autoScrollInterval = 5000,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check if scroll buttons should be visible
  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
    );
  };

  // Scroll handler
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

  // Set up auto-scroll
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

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);

    // Initial check
    checkScrollButtons();

    return () => {
      container.removeEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Left scroll button */}
      {showArrows && (
        <button
          onClick={() => handleScroll("left")}
          className={`absolute xl:-left-16 left-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition-opacity duration-300 flex items-center justify-center ${
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

      {/* Carousel container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Apply gap and width to child elements if specified */}
        {React.Children.map(children, (child) => (
          <div
            className="flex-shrink-0"
            style={{
              marginRight: `${gap}px`,
              width: slideWidth ? `${slideWidth}px` : "auto",
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      {showArrows && (
        <button
          onClick={() => handleScroll("right")}
          className={`absolute xl:-right-16 right-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition-opacity duration-300 flex items-center justify-center ${
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
    </div>
  );
};

export default Carousel2D;
