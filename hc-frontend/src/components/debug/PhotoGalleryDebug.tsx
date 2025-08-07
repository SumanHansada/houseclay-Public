"use client";

import { useState } from "react";

import { PhotoGallery } from "@/utility-components";

interface PhotoGalleryDebugProps {
  images: string[];
  className?: string;
}

export default function PhotoGalleryDebug({
  images,
  className,
}: PhotoGalleryDebugProps) {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="w-full">
      {/* Debug Toggle */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
      >
        {showDebug ? "Hide Debug" : "Show Debug"}
      </button>

      {/* Debug Info */}
      {showDebug && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm">
          <h3 className="font-bold mb-2">PhotoGallery Debug Info:</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(
              {
                images,
                imagesLength: images?.length,
                imagesType: typeof images,
                isArray: Array.isArray(images),
                firstImage: images?.[0],
                validImages: Array.isArray(images)
                  ? images.filter(
                      (img) =>
                        img && typeof img === "string" && img.trim() !== "",
                    )
                  : [],
              },
              null,
              2,
            )}
          </pre>
        </div>
      )}

      {/* PhotoGallery Component */}
      <PhotoGallery
        images={images}
        className={className}
        maxDisplayImages={5}
        thumbnailPosition="bottom"
      />
    </div>
  );
}
