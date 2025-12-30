import React from "react";

interface PropertyDetailsStepLoadingProps {
  className?: string;
}

export default function PropertyDetailsStepLoading({
  className = "",
}: PropertyDetailsStepLoadingProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="h-[36px] w-[60%] mb-2 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-[80%] bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="space-y-6">
        {/* Property Type Dropdown */}
        <div>
          <div className="h-5 w-[120px] mb-1 bg-gray-200 rounded animate-pulse" />
          <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Built Up Area & Facing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-5 w-[100px] mb-1 bg-gray-200 rounded animate-pulse" />
            <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
          </div>
          <div>
            <div className="h-5 w-[80px] mb-1 bg-gray-200 rounded animate-pulse" />
            <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* BHK Type, Ownership Type, Property Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-5 w-[100px] mb-1 bg-gray-200 rounded animate-pulse" />
              <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Floor, Total Floor, Floor Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-5 w-[80px] mb-1 bg-gray-200 rounded animate-pulse" />
              <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-6">
          <div className="h-5 w-[100px] mb-1 bg-gray-200 rounded animate-pulse" />
          <div className="h-[120px] bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
