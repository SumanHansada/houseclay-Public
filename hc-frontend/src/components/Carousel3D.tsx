"use client";

import { animate } from "motion";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";

// Define props interface with comprehensive type annotations
interface Carousel3DProps {
  items: Array<React.ComponentType | ReactNode>;
  width?: number;
  height?: number;
  enableLoop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  initialIndex?: number;
  gap?: number;
  perspective?: number;
  rotationFactor?: number;
  scaleFactor?: number;
  centerZoom?: number;
  showNavigationArrows?: boolean;
  className?: string;
  onChange?: (currentIndex: number) => void;
}

const Carousel3D: FC<Carousel3DProps> = ({
  items = [],
  width = 800,
  height = 400,
  enableLoop = true,
  autoplay = false,
  autoplayInterval = 3000,
  initialIndex = 0,
  gap = 20,
  perspective = 1000,
  rotationFactor = 45,
  scaleFactor = 0.8,
  centerZoom = 1.1,
  showNavigationArrows = false,
  className = "",
  onChange,
}) => {
  // Type annotations for state and refs
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total items for infinite loop effect
  const totalItems = items.length;

  // Update carousel layout
  const updateCarousel = React.useCallback(() => {
    if (!containerRef.current || totalItems === 0) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Calculate position relative to current card
      let relativeIndex = index - currentIndex;

      // Handle looping for infinite carousel
      if (enableLoop && totalItems > 1) {
        if (relativeIndex > totalItems / 2) relativeIndex -= totalItems;
        if (relativeIndex < -totalItems / 2) relativeIndex += totalItems;
      }

      // Calculate transforms
      const rotateY = relativeIndex * rotationFactor;
      const translateZ = Math.abs(relativeIndex) * -100;
      const opacity = 1;
      const scale =
        relativeIndex === 0
          ? centerZoom
          : Math.max(0.6, 1 - Math.abs(relativeIndex) * scaleFactor);
      const translateX = relativeIndex * (width / 2 + gap);

      // Apply transforms
      animate(
        card,
        {
          rotateY: `${rotateY}deg`,
          translateX: `${translateX}px`,
          translateZ: `${translateZ}px`,
          scale,
          opacity,
          zIndex: 100 - Math.abs(relativeIndex),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { duration: 0.4, easing: "ease-out" } as any,
      );
    });
  }, [
    containerRef,
    cardsRef,
    currentIndex,
    enableLoop,
    totalItems,
    rotationFactor,
    centerZoom,
    scaleFactor,
    width,
    gap,
  ]);

  const goToIndex = (index: number) => {
    let newIndex = index;

    if (enableLoop) {
      // Handle wrapping for infinite loop
      if (newIndex < 0) newIndex = totalItems - 1;
      if (newIndex >= totalItems) newIndex = 0;
    } else {
      // Clamp index for non-looping carousel
      newIndex = Math.max(0, Math.min(totalItems - 1, newIndex));
    }

    setCurrentIndex(newIndex);
    onChange?.(newIndex);
    resetAutoplayTimer();
  };

  const goToNext: () => void = React.useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const goToPrev: () => void = React.useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  // Reset autoplay timer
  const resetAutoplayTimer = React.useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }

    if (autoplay && totalItems > 1) {
      autoplayTimerRef.current = setTimeout(() => {
        goToNext();
      }, autoplayInterval);
    }
  }, [autoplay, autoplayInterval, totalItems, goToNext]);

  // Initialize and update carousel
  useEffect(() => {
    if (totalItems === 0) return;

    updateCarousel();
    resetAutoplayTimer();

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [
    currentIndex,
    totalItems,
    width,
    height,
    updateCarousel,
    resetAutoplayTimer,
  ]);

  // Start autoplay on component mount
  useEffect(() => {
    resetAutoplayTimer();

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplayInterval, resetAutoplayTimer]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrev();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  // Initialize refs when items change
  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, totalItems);
  }, [items, totalItems]);

  return (
    <div
      className={`relative mx-auto my-0 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        ref={containerRef}
        className="carousel-stage  w-full h-full flex justify-center items-center"
        style={{
          perspective: `${perspective}px`,
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((Item, index) => {
          // Handle both component and ReactNode types
          const CardContent = typeof Item === "function" ? <Item /> : Item;

          return (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="carousel-card absolute transform transition-all duration-300 ease-out"
              style={{
                width: `${width * 0.7}px`,
                height: `${height * 0.8}px`,
                transformStyle: "preserve-3d",
                borderRadius: "16px",
                cursor: "pointer",
                backfaceVisibility: "hidden",
              }}
              onClick={() => goToIndex(index)}
            >
              {CardContent}
            </div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      {showNavigationArrows && (
        <>
          <button
            onClick={goToPrev}
            disabled={!enableLoop && currentIndex === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition-opacity duration-300 flex items-center justify-center ${
              !enableLoop && currentIndex === 0
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
            aria-label="Previous slide"
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
          <button
            onClick={goToNext}
            disabled={!enableLoop && currentIndex === totalItems - 1}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition-opacity duration-300 flex items-center justify-center ${
              !enableLoop && currentIndex === totalItems - 1
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
            aria-label="Next slide"
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
        </>
      )}

      {/* Optional indicators */}
      <div className="carousel-indicators relative bottom-0 w-full flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`
                w-2 h-2 rounded-full 
                ${index === currentIndex ? "bg-gray-700" : "bg-gray-300"}
                transition-colors duration-300
              `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;
