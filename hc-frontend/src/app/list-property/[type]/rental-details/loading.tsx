import React from "react";

export default function RentalDetailsLoading() {
  return (
    <>
      <div className="mb-8">
        <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="col-span-1">
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="col-span-1">
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="col-span-1">
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mb-6">
          <div className="h-8 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-12 bg-gray-300 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="col-span-1">
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mb-8">
          <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <div
                key={index}
                className="h-12 bg-gray-300 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
