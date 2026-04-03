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
  <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg md:rounded-none" />
);

export default function Loading() {
  return (
    <>
      {/* Mobile — matches MobileHeader (md:hidden) */}
      <header className="fixed flex w-full items-center top-0 inset-x-0 z-50 h-14 px-4 border-b border-gray-200 bg-white shadow-sm md:hidden">
        <div className="relative h-full w-full flex items-center gap-2">
          <button className="items-center justify-center rounded-full md:border-none">
            <ChevronLeft size={25} />
          </button>
          <div className="h-10 flex-1 w-full rounded-full bg-gray-200 animate-pulse" />
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </header>

      {/* Desktop filter bar — matches PropertySearchClient */}
      <section className="fixed top-14 z-50 flex w-full h-16 gap-0 px-8 bg-white border-b border-gray-200 xl:gap-16 lg:gap-8 md:gap-0 xl:px-24 lg:px-12 max-md:pt-4 max-md:pb-8 max-md:hidden">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1 flex items-center min-h-[46px] w-full p-1 border border-gray-300 rounded-xl bg-white">
            <div className="h-[38px] flex-1 rounded-lg bg-gray-200 animate-pulse mx-1" />
            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse m-1 shrink-0" />
          </div>
          <div className="flex items-center gap-2 flex-row">
            <div className="h-[46px] w-24 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-[46px] w-36 rounded-xl bg-gray-200 animate-pulse max-2xl:hidden" />
            <div className="h-[46px] w-32 rounded-xl bg-gray-200 animate-pulse max-xl:hidden" />
            <div className="h-[46px] w-40 rounded-xl bg-gray-200 animate-pulse max-lg:hidden" />
            <div className="h-[46px] w-48 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-[46px] max-lg:w-12 w-24 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full md:pt-[64px] md:bg-gray-50 relative">
        {/* Map + bottom sheet — mobile & tablet (below xl) */}
        <section className="xl:hidden">
          <div className="sticky top-14 z-0 h-[calc(100vh-3.5rem)] md:top-[120px] md:h-[calc(100vh-120px)]">
            <MapSkeleton />
          </div>

          <div className="relative z-10 -mt-[50vh] min-h-[50vh] translate-y-[50vh] rounded-t-3xl bg-white md:px-8 px-4 pb-16 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex justify-center pt-3 pb-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="flex flex-col gap-4 py-6 max-h-24">
              <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="mx-auto">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Desktop — listings + map side by side */}
        <section className="hidden xl:flex">
          <div className="min-h-[580px] px-6 pb-10 bg-gray-50 pl-8 lg:pl-12 pr-6 xl:pl-24 xl:pr-8 flex-1 min-w-0">
            <div className="flex flex-row items-center justify-between gap-4 py-6 max-h-20">
              <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="mx-auto">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>

          <div className="w-[50%] lg:w-[50%]">
            <div className="sticky top-[120px] h-[calc(100vh-120px)] pt-6 pb-6 pr-8 lg:pr-12 xl:pr-24">
              <div className="h-full w-full rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
