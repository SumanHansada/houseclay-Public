// components/skeletons/LocationFormSkeleton.tsx

import "react-loading-skeleton/dist/skeleton.css";

import React from "react";
import Skeleton from "react-loading-skeleton";

const LocationFormSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-8">
        <Skeleton height={36} width="60%" />
      </div>

      {/* City and Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* City Dropdown */}
        <div className="md:col-span-1">
          <Skeleton height={20} width={60} className="mb-1" />
          <Skeleton height={48} />
        </div>

        {/* Location/Society Name */}
        <div className="md:col-span-2">
          <Skeleton height={20} width={150} className="mb-1" />
          <Skeleton height={48} />
        </div>
      </div>

      {/* Landmark Field */}
      <div className="mb-6">
        <Skeleton height={20} width={120} className="mb-1" />
        <Skeleton height={48} />
      </div>

      {/* Map Section Header */}
      <div className="mt-8">
        <Skeleton height={28} width="50%" className="mb-2" />
        <div className="flex gap-2 items-center">
          <Skeleton circle width={20} height={20} />
          <Skeleton height={20} width="70%" />
        </div>
      </div>

      {/* Map Container */}
      <div className="mt-4">
        <Skeleton height={384} className="rounded-lg" />
      </div>
    </div>
  );
};

export default LocationFormSkeleton;
