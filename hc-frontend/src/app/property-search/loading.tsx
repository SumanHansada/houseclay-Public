import "react-loading-skeleton/dist/skeleton.css";

import { ChevronLeft } from "lucide-react";
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
    <>
      {/* Mobile Header - matches page.tsx mobile header */}
      <section className="py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-center items-center w-full md:hidden">
        <button className="rounded-full md:border-none items-center justify-center">
          <ChevronLeft size={25} />
        </button>
        <Skeleton height={40} width="100%" borderRadius={20} />
        <Skeleton height={40} width={80} borderRadius={20} />
      </section>

      {/* Desktop Header - matches page.tsx desktop header */}
      <section className="fixed z-50 flex w-full xl:gap-16 border-b border-t bg-white border-gray-200 lg:gap-8 md:gap-0 gap-0 xl:px-24 md:px-12 px-12 max-md:pt-4 max-md:pb-8 h-16 max-md:hidden">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1">
            <Skeleton height={46} width="100%" borderRadius={12} />
          </div>
          <div className="flex items-center gap-2 flex-row">
            <Skeleton height={46} width={80} borderRadius={12} />
            <Skeleton height={46} width={144} borderRadius={12} />
            <Skeleton height={46} width={112} borderRadius={12} />
            <Skeleton height={46} width={128} borderRadius={12} />
            <Skeleton height={46} width={80} borderRadius={12} />
            <Skeleton height={46} width={80} borderRadius={12} />
          </div>
        </div>
      </section>

      {/* Main Content Section - matches page.tsx structure */}
      <section className="w-full md:pt-[64px] bg-gray-50 relative max-md:pb-12">
        <div className="min-h-screen bg-gray-50 pb-10 xl:px-24 md:px-12 px-6">
          {/* Header Bar */}
          <div className="">
            <div className="flex flex-col gap-4 py-6">
              <div>
                <Skeleton height={16} width={200} />
              </div>
            </div>
          </div>

          {/* Property List */}
          <div className="mx-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
