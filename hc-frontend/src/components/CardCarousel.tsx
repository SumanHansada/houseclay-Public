"use client";

import React, { useState, useEffect, JSX } from "react";

interface CardCarouselProps {
  cards: JSX.Element[];
  height?: string;
  width?: string;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const CardCarousel: React.FC<CardCarouselProps> = ({
  cards,
  height = "h-screen",
  width = "max-w-md",
  loop = true,
  autoPlay = false,
  autoPlayInterval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleNext = React.useCallback(() => {
    if (animating) return;

    setAnimating(true);
    setActiveIndex((prev) =>
      prev === cards.length - 1 ? (loop ? 0 : prev) : prev + 1,
    );

    setTimeout(() => {
      setAnimating(false);
    }, 500);
  }, [animating, cards.length, loop]);

  const handlePrev = () => {
    if (animating) return;

    setAnimating(true);
    setActiveIndex((prev) =>
      prev === 0 ? (loop ? cards.length - 1 : prev) : prev - 1,
    );

    setTimeout(() => {
      setAnimating(false);
    }, 500);
  };

  const getCardStyle = (index: number) => {
    const position = (index - activeIndex + cards.length) % cards.length;

    if (position === 0) {
      return {
        transform: `translateX(0%) scale(1) rotateY(0deg)`,
        zIndex: 30,
        opacity: 1,
      };
    } else if (position === 1 || position === -2) {
      return {
        transform: `translateX(50%) scale(0.85) rotateY(-5deg)`,
        zIndex: 20,
        opacity: 0.8,
      };
    } else if (position === -1 || position === 2) {
      return {
        transform: `translateX(-50%) scale(0.85) rotateY(5deg)`,
        zIndex: 20,
        opacity: 0.8,
      };
    } else {
      return {
        transform: `translateX(${position < 0 ? "-" : ""}5%) scale(0.7) rotateY(${position < 0 ? "" : "-"}15deg)`,
        zIndex: 10,
        opacity: 0,
      };
    }
  };

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(handleNext, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, handleNext]);

  return (
    <div
      className={`${width} mx-auto px-4 font-sans overflow-hidden flex justify-center`}
    >
      <div className="border-t border-gray-200 pt-6">
        {/* 3D Carousel */}
        <div
          className={`relative ${height} mb-6 overflow-visible`}
          style={{ perspective: "1000px" }}
        >
          <div
            className="w-full h-full relative flex "
            style={{ transformStyle: "preserve-3d" }}
          >
            {cards.map((card, index) => {
              const style = getCardStyle(index);
              return (
                <div
                  key={index}
                  className="transition-all duration-500 ease-in-out cursor-pointer"
                  style={{
                    transform: style.transform,
                    zIndex: style.zIndex,
                    opacity: style.opacity,
                  }}
                  onClick={
                    index !== activeIndex
                      ? index < activeIndex ||
                        (activeIndex === 0 && index === cards.length - 1)
                        ? handlePrev
                        : handleNext
                      : undefined
                  }
                >
                  {card}
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          {/* <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white rounded-full p-2 shadow-lg ml-1"
            onClick={handlePrev}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white rounded-full p-2 shadow-lg mr-1"
            onClick={handleNext}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button> */}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mb-6">
          {cards.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${activeIndex === index ? "bg-gray-700" : "bg-gray-300"}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
