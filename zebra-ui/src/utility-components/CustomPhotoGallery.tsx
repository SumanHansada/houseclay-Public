"use client";

import { useEffect, useState } from "react";

import ImageWithLoader from "./ImageWithLoader";

interface CustomPhotoGalleryProps {
  images: string[];
  className?: string;
  spacing?: number;
  onImageClick?: (index: number) => void;
}

export default function CustomPhotoGallery({
  images,
  className = "",
  spacing = 8,
  onImageClick,
}: CustomPhotoGalleryProps) {
  const [imageHeights, setImageHeights] = useState<number[]>([]);

  // Calculate image heights for responsive layout
  useEffect(() => {
    const calculateHeights = async () => {
      const heights = await Promise.all(
        images.map((src) => {
          return new Promise<number>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const aspectRatio = img.height / img.width;
              // Use a fixed width and calculate height based on aspect ratio
              const width = 800; // Fixed width for mobile
              const height = width * aspectRatio;
              resolve(height);
            };
            img.onerror = () => resolve(600); // Default height if image fails to load
            img.src = src;
          });
        }),
      );
      setImageHeights(heights);
    };

    if (images.length > 0) {
      calculateHeights();
    }
  }, [images]);

  if (!images.length) {
    return (
      <div className={`w-full text-center text-gray-500 ${className}`}>
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col gap-2" style={{ gap: `${spacing}px` }}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full cursor-pointer group overflow-hidden rounded-lg"
            style={{
              height: imageHeights[index]
                ? `${imageHeights[index]}px`
                : "400px",
            }}
            onClick={() => onImageClick?.(index)}
          >
            <ImageWithLoader
              src={image}
              alt={`Property image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
