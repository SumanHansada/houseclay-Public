import React from "react";

interface AdditionalInfoStepLoadingProps {
  className?: string;
}

export default function AdditionalInfoStepLoading({
  className = "",
}: AdditionalInfoStepLoadingProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="h-9 w-[380px] bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-6">
        {/* Row 1: Khata Certificate + Sale Deed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-[280px] bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-5 w-[280px] bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Row 2: Property Tax + Secondary Phone Number */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-[280px] bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-5 w-[200px] bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
