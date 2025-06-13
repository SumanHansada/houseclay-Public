import "react-loading-skeleton/dist/skeleton.css";

import Skeleton from "react-loading-skeleton";

const PropertyCardSkeleton = () => (
  <div className="flex-col gap-8 bg-white border border-gray-100 rounded-lg drop-shadow relative p-3 animate-pulse">
    <div className="relative h-72 max-md:h-60 mb-4">
      <Skeleton height="100%" width="100%" borderRadius={12} />
    </div>
    <Skeleton height={16} width="33%" className="mb-2" />
    <Skeleton height={16} width="66%" className="mb-2" />
    <Skeleton height={16} width="50%" className="mb-2" />
    <Skeleton height={16} width="25%" />
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[70px] pb-10">
      <div className="container mx-auto xl:px-28 lg:px-14 md:px-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
          <div>
            <Skeleton height={32} width={320} className="mb-1" />
            <Skeleton height={16} width={120} />
          </div>
          <div className="flex flex-wrap gap-2 items-center bg-white rounded-xl shadow px-4 py-2 border border-gray-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={32} width={110} borderRadius={8} />
            ))}
            <div className="flex items-center border-l h-6 mx-2" />
            <Skeleton height={32} width={120} borderRadius={8} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
