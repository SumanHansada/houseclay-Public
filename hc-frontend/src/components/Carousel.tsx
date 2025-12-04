import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { ImageWithLoader } from "@/utility-components";

export default function Carousel(props: { images: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const images = props.images;
  const maxSlide = Math.max(0, images.length - slidesPerView);

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesPerView(1); // Mobile: 1 slide
      } else if (width < 1024) {
        setSlidesPerView(2); // Tablet: 2 slides
      } else if (width < 1280) {
        setSlidesPerView(3); // Small desktop: 3 slides
      } else {
        setSlidesPerView(4); // Large desktop: 4 slides
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlide));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-7xl">
        {/* Carousel Container */}
        <div className="relative group">
          {/* Slides Container - Shows Multiple Slides */}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
              }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / slidesPerView}% - ${((slidesPerView - 1) * 16) / slidesPerView}px)`,
                  }}
                >
                  <ImageWithLoader
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full aspect-[4/3] object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => goToSlide(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={toggleAutoPlay}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label={isAutoPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: maxSlide + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "bg-blue-600 w-8 h-2"
                  : "bg-gray-300 hover:bg-gray-400 w-2 h-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="text-center mt-4 text-gray-600 text-sm">
          Showing {currentSlide + 1}-
          {Math.min(currentSlide + slidesPerView, images.length)} of{" "}
          {images.length} images
        </div>
      </div>
    </div>
  );
}
