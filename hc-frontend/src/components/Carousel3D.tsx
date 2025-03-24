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
  showNavigationArrows = true,
  className = "",
}) => {
  // Type annotations for state and refs
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
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
      const opacity = Math.max(0.5, 1 - Math.abs(relativeIndex) * 0.3);
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
        },
        { duration: 0.4, easing: "ease-out" },
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

  const goToIndex = React.useCallback(
    (index: number) => {
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
      resetAutoplayTimer();
    },
    [enableLoop, totalItems, resetAutoplayTimer],
  );

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

  // Mouse/touch event handlers with type annotations
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const diff = clientX - startX;

    // Apply a subtle rotation to show dragging effect
    if (containerRef.current) {
      animate(
        containerRef.current,
        { rotateY: `${diff * 0.05}deg` },
        { duration: 0.1 },
      );
    }
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX =
      "clientX" in e
        ? e.clientX
        : "changedTouches" in e
          ? e.changedTouches[0].clientX
          : 0;
    const diff = clientX - startX;

    // Reset container rotation
    if (containerRef.current) {
      animate(containerRef.current, { rotateY: "0deg" }, { duration: 0.3 });
    }

    // Change slide if drag distance is significant
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }

    setIsDragging(false);
    resetAutoplayTimer();
  };

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
      className={`carousel-container relative mx-auto my-0 ${className}`}
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
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        onMouseLeave={(e) => isDragging && handleDragEnd(e as React.MouseEvent)}
      >
        {items.map((Item, index) => {
          // Handle both component and ReactNode types
          const CardContent = typeof Item === "function" ? <Item /> : Item;

          return (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="carousel-card absolute transform transition-all duration-300 ease-out"
              style={{
                width: `${width * 0.7}px`,
                height: `${height * 0.8}px`,
                transformStyle: "preserve-3d",
                transition: "box-shadow 0.3s ease",
                boxShadow:
                  index === currentIndex
                    ? "0 10px 30px rgba(0,0,0,0.2)"
                    : "0 5px 15px rgba(0,0,0,0.1)",
                borderRadius: "16px",
                overflow: "hidden",
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
        <div className="carousel-controls absolute w-full top-1/2 flex justify-between pointer-events-none">
          <button
            onClick={goToPrev}
            disabled={!enableLoop && currentIndex === 0}
            className={`
                bg-white/80 rounded-full w-10 h-10 flex items-center justify-center 
                pointer-events-auto transform -translate-y-1/2 m-4 
                shadow-md transition-opacity duration-300
                ${
                  !enableLoop && currentIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/90 active:scale-95"
                }
              `}
          >
            ←
          </button>
          <button
            onClick={goToNext}
            disabled={!enableLoop && currentIndex === totalItems - 1}
            className={`
                bg-white/80 rounded-full w-10 h-10 flex items-center justify-center 
                pointer-events-auto transform -translate-y-1/2 m-4 
                shadow-md transition-opacity duration-300
                ${
                  !enableLoop && currentIndex === totalItems - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/90 active:scale-95"
                }
              `}
          >
            →
          </button>
        </div>
      )}

      {/* Optional indicators */}
      <div className="carousel-indicators absolute bottom-0 w-full flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`
                w-3 h-3 rounded-full 
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
