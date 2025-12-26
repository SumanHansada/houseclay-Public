"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import React from "react";

import ImageWithFallback from "./ImageWithFallback";

interface FullscreenPhotoViewerProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  thumbnailPosition?: "bottom" | "left" | "right";
  showThumbnails?: boolean;
}

function FullscreenPhotoViewer({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  thumbnailPosition = "bottom",
  showThumbnails = true,
}: FullscreenPhotoViewerProps) {
  const currentImage = useMemo(
    () => images[currentIndex],
    [images, currentIndex],
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handlePrevious = useCallback(() => {
    if (hasPrevious) {
      onNavigate(currentIndex - 1);
    }
  }, [hasPrevious, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      onNavigate(currentIndex + 1);
    }
  }, [hasNext, currentIndex, onNavigate]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (hasPrevious) {
            onNavigate(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (hasNext) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, currentIndex, onNavigate, onClose]);

  // Handle body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleThumbnailClick = useCallback(
    (index: number) => {
      onNavigate(index);
    },
    [onNavigate],
  );

  if (!isOpen || !currentImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.1 }}
          className={`absolute text-white p-2 rounded-full hover:bg-white/10 transition-colors duration-200 z-10 ${
            thumbnailPosition === "bottom"
              ? "top-4 right-4"
              : thumbnailPosition === "left"
                ? "top-4 right-4"
                : "top-4 left-4"
          }`}
          onClick={onClose}
        >
          <X size={24} />
        </motion.button>

        {/* Image Counter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.1 }}
          className={`absolute text-white text-sm bg-black/50 px-3 py-1 rounded-full z-10 ${
            thumbnailPosition === "bottom"
              ? "top-4 left-4"
              : thumbnailPosition === "left"
                ? "bottom-4 right-4"
                : "bottom-4 left-4"
          }`}
        >
          {currentIndex + 1} / {images.length}
        </motion.div>

        {/* Previous Button */}
        {hasPrevious && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: 0.1 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/10 transition-colors duration-200 z-10"
            onClick={handlePrevious}
          >
            <ChevronLeft size={32} />
          </motion.button>
        )}

        {/* Next Button */}
        {hasNext && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/10 transition-colors duration-200 z-10"
            onClick={handleNext}
          >
            <ChevronRight size={32} />
          </motion.button>
        )}

        {/* Image Container */}
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative w-full h-full max-w-7xl max-h-[90vh] p-4"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <ImageWithFallback
              src={currentImage}
              alt={`Fullscreen image ${currentIndex + 1}`}
              fill
              className="max-md:object-contain transition-transform duration-300 ease-in-out bg-gray-200"
              style={{ transformOrigin: "center" }}
            />
          </div>
        </motion.div>

        {/* Desktop Thumbnail Navigation */}
        {showThumbnails && images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className={`absolute ${
              thumbnailPosition === "bottom"
                ? "bottom-4 left-4 w-full"
                : thumbnailPosition === "left"
                  ? "left-4 top-4 h-full"
                  : "right-4 top-4 h-full"
            } z-20`}
          >
            <div
              className={`flex ${
                thumbnailPosition === "left" || thumbnailPosition === "right"
                  ? "flex-col h-full justify-center overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                  : "flex-row w-full justify-center overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              } gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2`}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative w-24 h-24 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                    currentIndex === index
                      ? "border-red-500 scale-110"
                      : "border-transparent hover:border-white/50"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="w-full h-full object-cover bg-gray-200"
                    priority
                    style={{ transformOrigin: "center" }}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default React.memo(FullscreenPhotoViewer);
