"use client";

import { Pause, Play } from "lucide-react";
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface Carousel2DProps {
  children: ReactNode;
  className?: string;
  gap?: number;
  showArrows?: boolean;
  showDots?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  containerClassName?: string;
  slidesPerView?: number;
  responsiveSlidesPerView?: boolean;
}

const getGapClass = (gap: number): string => {
  const gapMap: Record<number, string> = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
    12: "gap-12",
    16: "gap-16",
    20: "gap-20",
    24: "gap-24",
  };
  return gapMap[gap] || "";
};

const getGapInPixels = (gap: number): number => {
  // Tailwind spacing: each unit is 0.25rem (4px)
  return gap * 4;
};

const Carousel2DClient: React.FC<Carousel2DProps> = ({
  children,
  className = "",
  gap = 16,
  showArrows = false,
  showDots = false,
  autoScroll = false,
  autoScrollInterval = 3000,
  containerClassName = "",
  slidesPerView = 1,
  responsiveSlidesPerView = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoScroll);
  const [responsiveSlidesPerViewState, setResponsiveSlidesPerViewState] =
    useState(1);
  const slidesCount = React.Children.count(children);

  // Determine actual slides per view (responsive or fixed)
  const actualSlidesPerView = responsiveSlidesPerView
    ? responsiveSlidesPerViewState
    : slidesPerView;

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
    const singleSlideWidth = container.clientWidth / actualSlidesPerView;
    const scrollAmount = singleSlideWidth * actualSlidesPerView;
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
    const singleSlideWidth = container.clientWidth / actualSlidesPerView;
    const slideIndex = Math.round(container.scrollLeft / singleSlideWidth);
    setCurrentSlideIndex(slideIndex);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
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
  }, [isAutoPlaying, autoScrollInterval]);

  useEffect(() => {
    if (!responsiveSlidesPerView) return;

    const handleResize = () => {
      const width = window.innerWidth;

      // Mobile (portrait phones)
      if (width < 640) {
        setResponsiveSlidesPerViewState(1);
      }
      // Mobile landscape / Small tablets (sm: 640px)
      else if (width < 768) {
        setResponsiveSlidesPerViewState(2);
      }
      // Tablets (md: 768px)
      else if (width <= 1024) {
        setResponsiveSlidesPerViewState(2);
      }
      // Small laptops (lg: 1024px+)
      else if (width < 1280) {
        setResponsiveSlidesPerViewState(3);
      }
      // Desktop (xl: 1280px)
      else if (width < 1536) {
        setResponsiveSlidesPerViewState(3);
      }
      // Large desktop (2xl: 1536px)
      else if (width < 1920) {
        setResponsiveSlidesPerViewState(4);
      }
      // Full HD (1920px)
      else if (width <= 2560) {
        setResponsiveSlidesPerViewState(5);
      }
      // 2K / QHD (2560px+)
      else if (width < 3840) {
        setResponsiveSlidesPerViewState(7);
      }
      // 4K / UHD and beyond (3840px+)
      else {
        setResponsiveSlidesPerViewState(9);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [responsiveSlidesPerView]);

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
  }, [gap, actualSlidesPerView]);

  return (
    <div className={`relative w-full ${className}`}>
      {showArrows && (
        <button
          onClick={() => handleScroll("left")}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition-opacity duration-300 flex items-center justify-center ${
            canScrollLeft ? "opacity-100" : "opacity-40"
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
        className={`flex w-full py-2 overflow-x-scroll scrollbar-hide scroll-smooth ${containerClassName} ${getGapClass(gap)}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {React.Children.map(children, (child) => (
          <div
            style={{
              width: `calc(${100 / actualSlidesPerView}% - ${((actualSlidesPerView - 1) * getGapInPixels(gap)) / actualSlidesPerView}px)`,
              flexShrink: 0,
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
            canScrollRight ? "opacity-100" : "opacity-40"
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

      {autoScroll && (
        <button
          onClick={toggleAutoPlay}
          className="absolute bottom-4 right-4 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition-opacity duration-300 flex items-center justify-center"
          aria-label={isAutoPlaying ? "Pause autoplay" : "Play autoplay"}
        >
          {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
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
                const singleSlideWidth =
                  container.clientWidth / actualSlidesPerView;
                const targetScrollLeft = index * singleSlideWidth;
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
