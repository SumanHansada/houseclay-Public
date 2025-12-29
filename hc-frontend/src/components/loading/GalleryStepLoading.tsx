import { Lightbulb } from "lucide-react";
import React from "react";

interface GalleryStepLoadingProps {
  maxPhotos?: number;
  className?: string;
  showTip?: boolean;
  /** Whether to show the "loading existing photos" state or the "empty upload" state */
  variant?: "empty" | "loading" | "random";
}

export default function GalleryStepLoading({
  maxPhotos = 10,
  className = "",
  showTip = true,
  variant = "random", // "random" mimics your current Math.random() behavior
}: GalleryStepLoadingProps) {
  const renderEmptyState = () => (
    <>
      <div className="rounded-lg p-16 mb-4 bg-gray-50 flex flex-col items-center gap-6">
        <div className="flex flex-col gap-4 items-center">
          <div className="h-5 w-[200px] bg-gray-200 rounded animate-pulse" />
          <div className="h-[40px] w-[120px] bg-gray-200 rounded-[12px] animate-pulse" />
        </div>
        {showTip && (
          <div className="mt-4 bg-green-100 p-2 rounded-md inline-flex items-center">
            <span className="bg-teal-500 text-white px-3 py-1 rounded-lg mr-2 text-xs flex items-center">
              <Lightbulb size={15} /> Tip
            </span>
            <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </>
  );

  const renderLoadingPhotos = () => {
    const photoCount = 4; // Fixed for consistency in loading state

    return (
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        {Array.from({ length: photoCount }).map((_, i) => (
          <div key={i} className="relative rounded-md overflow-hidden">
            <div className="h-[200px] aspect-square w-full bg-gray-200 animate-pulse" />
            {i === 0 && (
              <div className="absolute top-2 left-2 flex gap-2 bg-white text-sm p-2 rounded-lg">
                <div className="h-5 w-[100px] bg-gray-200 rounded animate-pulse" />
              </div>
            )}
          </div>
        ))}

        {photoCount < maxPhotos && (
          <div className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square">
            <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  const shouldShowEmpty =
    variant === "random" ? Math.random() > 0.5 : variant === "empty";

  return (
    <div className={`w-full ${className}`}>
      {/* Header skeleton */}
      <div className="flex justify-between w-full mb-2 items-center">
        <div className="h-[30px] w-[150px] bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-[60px] bg-gray-200 rounded-[8px] animate-pulse" />
      </div>

      {/* Main content */}
      {shouldShowEmpty ? renderEmptyState() : renderLoadingPhotos()}

      {/* Checkbox / helper text skeleton */}
      <div className="flex items-center my-4 gap-2">
        <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-6 w-[180px] bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
