"use client";
import { Camera } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { PHOTO_GALLERY_DIALOG_ID } from "@/common/dataConstants/dialogIDs";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

import FullscreenPhotoViewer from "./FullscreenPhotoViewer";
import ImageWithFallback from "./ImageWithFallback";

interface PhotoGalleryProps {
  images: string[];
  className?: string;
  maxDisplayImages?: number;
  thumbnailPosition?: "bottom" | "left" | "right";
  showThumbnails?: boolean;
}

export default function PhotoGallery({
  images,
  className = "",
  maxDisplayImages = 5,
  thumbnailPosition = "bottom",
  showThumbnails = true,
}: PhotoGalleryProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isMobile } = useDeviceContext();
  const { openDialog } = useDialog();

  // Limit the number of images to display
  const displayImages = images.slice(0, maxDisplayImages);
  const hasMoreImages = images.length > maxDisplayImages;

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsFullscreenOpen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  const handleNavigateImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // const handleMobileGalleryClick = () => {
  //   openDialog("photo-gallery-dialog");
  // };

  const handleMobileGalleryClick = () => {
    if (images.length === 0) {
      toast.error("No images found!");
      return;
    }
    openDialog(PHOTO_GALLERY_DIALOG_ID);
  };

  if (!displayImages.length) {
    return (
      <div
        className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500">
          <Camera size={48} className="mx-auto mb-2 opacity-50" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Photo Gallery Layout */}
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {displayImages.length === 1 ? (
          // Single image layout
          <div
            className="w-full h-full cursor-pointer relative group"
            onClick={() => handleImageClick(0)}
          >
            <ImageWithFallback
              src={displayImages[0]}
              alt="Property image"
              fill
              className="object-cover bg-gray-200"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
          </div>
        ) : (
          <>
            {/* Desktop Layout - Multi-image grid (Airbnb style) */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-1 h-full">
              {/* Main large image (left side) */}
              <div
                className="col-span-2 row-span-2 cursor-pointer relative group"
                onClick={() => handleImageClick(0)}
              >
                <ImageWithFallback
                  src={displayImages[0]}
                  alt="Main property image"
                  fill
                  className="object-cover bg-gray-200"
                  priority
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
                {/* Overlay with photo count */}
                <div className="absolute bottom-3 right-3 bg-white text-sm px-2 py-1 rounded-lg opacity-100 flex items-center">
                  <Camera size={20} className="mr-1" />
                  {images.length}
                </div>
              </div>

              {/* Smaller images (right side - 2x2 grid) */}
              {displayImages.slice(1, 5).map((image, index) => (
                <div
                  key={index + 1}
                  className="cursor-pointer relative group overflow-hidden"
                  onClick={() => handleImageClick(index + 1)}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`Property image ${index + 2}`}
                    fill
                    className="object-cover bg-gray-200"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>

                  {/* Show "Show all photos" button on the last visible image */}
                  {index === 3 && hasMoreImages && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white text-gray-900 text-sm px-3 py-2 rounded-lg font-medium">
                        Show all photos
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Layout - Single image with photo count */}
            <div
              className="md:hidden w-full h-full cursor-pointer relative group"
              onClick={handleMobileGalleryClick}
            >
              <ImageWithFallback
                src={displayImages[0]}
                alt="Main property image"
                fill
                className="object-cover bg-gray-200"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
              {/* Photo count overlay for mobile */}
              <div className="absolute bottom-3 right-3 bg-white text-sm px-2 py-1 rounded-lg opacity-100 flex items-center">
                <Camera size={20} className="mr-1" />
                {images.length}
              </div>
              {/* Click to view all photos overlay for mobile */}
              {hasMoreImages && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                  View all photos
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Photo Viewer */}
      {!isMobile && (
        <FullscreenPhotoViewer
          images={images}
          currentIndex={currentImageIndex}
          isOpen={isFullscreenOpen}
          onClose={handleCloseFullscreen}
          onNavigate={handleNavigateImage}
          thumbnailPosition={thumbnailPosition}
          showThumbnails={showThumbnails}
        />
      )}
    </div>
  );
}
