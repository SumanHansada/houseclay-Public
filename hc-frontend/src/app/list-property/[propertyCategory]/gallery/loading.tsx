import { Lightbulb } from "lucide-react";
import React from "react";
import Skeleton from "react-loading-skeleton";

interface GalleryPageLoadingProps {
  maxPhotos?: number;
  className?: string;
  showTip?: boolean;
}

export default function GalleryPageLoading({
  maxPhotos = 10,
  className = "",
  showTip = true,
}: GalleryPageLoadingProps) {
  // When no photos are uploaded yet, show the dropzone placeholder
  const renderEmptyState = () => (
    <>
      <div className="rounded-lg p-16 mb-4 bg-gray-50 flex flex-col items-center gap-6">
        <div className="flex flex-col gap-4 items-center">
          <Skeleton width={200} height={20} />
          <Skeleton width={120} height={40} borderRadius={12} />
        </div>
        {showTip && (
          <div className="mt-4 bg-green-100 p-2 rounded-md inline-flex items-center">
            <span className="bg-teal-500 text-white px-3 py-1 rounded-lg mr-2 text-xs flex items-center">
              <Lightbulb size={15} /> Tip
            </span>
            <Skeleton width={200} height={16} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, index) => (
          <div
            key={`empty-placeholder-${index}`}
            className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square"
          >
            <Skeleton circle width={40} height={40} />
          </div>
        ))}
      </div>
    </>
  );

  // When photos are being loaded, show placeholders for the images
  const renderLoadingPhotos = () => {
    // Random number of photos between 1 and maxPhotos
    const photoCount = 4; // You can adjust this as needed

    return (
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        {[...Array(photoCount)].map((_, index) => (
          <div
            key={`photo-skeleton-${index}`}
            className="relative rounded-md overflow-hidden"
          >
            <Skeleton height={200} className="aspect-square w-full" />
            {index === 0 && (
              <div className="absolute flex top-2 left-2 text-gray-500 gap-2 bg-white text-sm p-2 rounded-lg">
                <Skeleton width={100} height={20} />
              </div>
            )}
          </div>
        ))}

        {photoCount < maxPhotos && (
          <div className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square w-full">
            <Skeleton circle width={56} height={56} />
          </div>
        )}
      </div>
    );
  };

  // Return either empty state or loading photos state
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between w-full mb-2 items-center">
        <Skeleton width={150} height={30} />
        <Skeleton width={60} height={24} borderRadius={8} />
      </div>

      {/* You can toggle between these two states */}
      {Math.random() > 0.5 ? renderEmptyState() : renderLoadingPhotos()}

      <div className="flex items-center my-4 gap-2">
        <Skeleton circle width={20} height={20} />
        <Skeleton width={180} height={24} />
      </div>
    </div>
  );
}
