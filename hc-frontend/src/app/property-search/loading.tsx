import { ChevronLeft } from "lucide-react";

const PropertyCardSkeleton = () => (
  <div className="flex-col gap-8 bg-white border border-gray-100 rounded-lg drop-shadow relative p-3 animate-pulse">
    <div className="relative h-72 max-md:h-60 mb-4">
      <div className="h-full w-full rounded-xl bg-gray-200" />
    </div>
    <div className="flex justify-between">
      <div className="h-4 w-2/4 mb-2 bg-gray-200 rounded" />
      <div className="h-4 w-1/4 mb-2 bg-gray-200 rounded" />
    </div>
    <div className="flex justify-between">
      <div className="h-4 w-3/5 mb-2 bg-gray-200 rounded" />
      <div className="h-5 w-1/5 mb-2 bg-gray-200 rounded" />
    </div>
    <div className="h-4 w-1/2 mb-2 bg-gray-200 rounded" />
    <div className="h-4 w-full bg-gray-200 rounded" />
  </div>
);

const MapSkeleton = () => (
  <div className="h-full w-full bg-gray-200 animate-pulse rounded-xl" />
);

export default function Loading() {
  return (
    <>
      {/* Mobile Header */}
      <section className="py-2 px-4 fixed top-0 left-0 right-0 z-50 h-14 border-b border-gray-200 bg-white flex gap-2 justify-center items-center w-full md:hidden">
        <button className="rounded-full md:border-none items-center justify-center">
          <ChevronLeft size={25} />
        </button>
        <div className="h-10 flex-1 w-full rounded-full bg-gray-200 animate-pulse" />
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
      </section>

      {/* Desktop Header */}
      <section className="fixed z-50 flex w-full xl:gap-16 border-b border-t bg-white border-gray-200 lg:gap-8 md:gap-0 gap-0 xl:px-24 md:px-12 px-12 max-md:pt-4 max-md:pb-8 h-16 max-md:hidden">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1">
            <div className="h-[46px] w-full rounded-xl bg-gray-200 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 flex-row">
            <div className="h-[46px] w-24 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-[46px] w-36 rounded-xl bg-gray-200 animate-pulse max-2xl:hidden" />
            <div className="h-[46px] w-32 rounded-xl bg-gray-200 animate-pulse max-xl:hidden" />
            <div className="h-[46px] w-40 rounded-xl bg-gray-200 animate-pulse max-xl:hidden" />
            <div className="h-[46px] w-48 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-[46px] max-lg:w-12 w-24 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full md:pt-[64px] md:bg-gray-50 relative">
        {/* Mobile: Sticky map placeholder behind listings */}
        <div className="md:hidden sticky top-14 z-0 h-[40vh]">
          <MapSkeleton />
        </div>

        <div className="md:flex">
          {/* Listings */}
          <div className="min-h-screen md:min-h-[580px] px-6 pb-10 md:bg-gray-50 md:pl-12 md:pr-6 xl:pl-24 xl:pr-8 md:flex-1 md:min-w-0 max-md:relative max-md:z-10 max-md:bg-white max-md:rounded-t-3xl max-md:-mt-5 max-md:shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
            {/* Drag handle (mobile only) */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Info Bar skeleton */}
            <div className="flex flex-col gap-4 py-6 max-md:max-h-24 max-h-20">
              <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Property grid */}
            <div className="mx-auto">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Sticky map placeholder on right */}
          <div className="hidden md:block md:w-[50%] lg:w-[50%]">
            <div className="sticky top-[120px] h-[calc(100vh-120px)] pt-6 pb-6 pr-12 xl:pr-24">
              <MapSkeleton />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
