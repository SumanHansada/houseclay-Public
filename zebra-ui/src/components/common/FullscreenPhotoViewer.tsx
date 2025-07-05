"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

import ImageWithLoader from "./ImageWithLoader";

interface FullscreenPhotoViewerProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function FullscreenPhotoViewer({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: FullscreenPhotoViewerProps) {
  const currentImage = images[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

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
  }, [isOpen, currentIndex, hasPrevious, hasNext, onClose, onNavigate]);

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

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(currentIndex + 1);
    }
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
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
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-colors duration-200 z-10"
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
            className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-10"
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
              <ImageWithLoader
                src={currentImage}
                alt={`Fullscreen image ${currentIndex + 1}`}
                fill
                className="object-contain transition-transform duration-300 ease-in-out"
                priority
                style={{ transformOrigin: "center" }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
