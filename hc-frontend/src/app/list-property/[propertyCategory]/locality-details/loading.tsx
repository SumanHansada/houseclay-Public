import React from "react";

interface LocalityDetailsStepLoadingProps {
  className?: string;
}

export default function LocalityDetailsStepLoading({
  className = "",
}: LocalityDetailsStepLoadingProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Form Header */}
      <div className="mb-8">
        <div className="h-[36px] w-[60%] bg-gray-200 rounded animate-pulse" />
      </div>

      {/* City and Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* City Dropdown */}
        <div className="md:col-span-1">
          <div className="h-5 w-[60px] mb-1 bg-gray-200 rounded animate-pulse" />
          <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Location/Society Name */}
        <div className="md:col-span-2">
          <div className="h-5 w-[150px] mb-1 bg-gray-200 rounded animate-pulse" />
          <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Landmark Field */}
      <div className="mb-6">
        <div className="h-5 w-[120px] mb-1 bg-gray-200 rounded animate-pulse" />
        <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Map Section Header */}
      <div className="mt-8">
        <div className="h-[28px] w-[50%] mb-2 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-2 items-center">
          <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-[70%] bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Map Container */}
      <div className="mt-4">
        <div className="h-[384px] bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
