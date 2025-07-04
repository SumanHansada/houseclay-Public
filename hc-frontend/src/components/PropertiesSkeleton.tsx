import "react-loading-skeleton/dist/skeleton.css";

import { MapPin } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const PropertiesSkeleton: React.FC = () => {
  return (
    <div className="flex-col gap-8 bg-white border border-gray-100 rounded-lg drop-shadow relative p-3">
      {/* Image Carousel Skeleton */}
      <div className="relative h-72 max-md:h-60">
        <Skeleton
          height="100%"
          width="100%"
          className="rounded-lg"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Badge Skeleton */}
        <div className="absolute top-3 left-3 px-2 py-2 rounded-lg text-xs bg-white">
          <Skeleton width={64} height={12} borderRadius={8} />
        </div>

        {/* Favorite Button Skeleton */}
        <div className="absolute top-3 right-3 bg-gray-50/30 rounded-full p-2 shadow-md">
          <Skeleton circle width={16} height={16} />
        </div>

        {/* Carousel Dots Skeleton */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} circle width={8} height={8} />
          ))}
        </div>
      </div>

      {/* Property Info Skeleton */}
      <div className="flex-col mt-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton width={64} height={12} borderRadius={8} />
          <Skeleton width={80} height={12} borderRadius={8} />
        </div>

        <div className="flex justify-between items-center mb-2">
          <Skeleton width={128} height={12} borderRadius={8} />
          <Skeleton width={64} height={16} borderRadius={8} />
        </div>

        <div className="flex justify-between items-center text-xs">
          <Skeleton width={96} height={12} borderRadius={8} />
        </div>

        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <MapPin size={12} className="text-gray-300 mr-1" />
          <Skeleton width={128} height={12} borderRadius={8} />
        </div>
      </div>
    </div>
  );
};

export default PropertiesSkeleton;
