import React from "react";

export default function ResaleDetailsStepLoading() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="h-[36px] w-[60%] bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
        <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
        <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
        <div className="h-[48px] bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="mb-8">
        <div className="h-[28px] w-[40%] bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[42px] bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
