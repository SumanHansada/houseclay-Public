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

export default function Loading() {
  return (
    <>
      {/* Mobile Header - matches page.tsx mobile header */}
      <section className="py-2 px-4 fixed top-0 left-0 right-0 z-50 h-14 border-b border-gray-200 bg-white flex gap-2 justify-center items-center w-full md:hidden">
        <button className="rounded-full md:border-none items-center justify-center">
          <ChevronLeft size={25} />
        </button>
        <div className="h-10 flex-1 w-full rounded-full bg-gray-200 animate-pulse" />
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
      </section>

      {/* Desktop Header - matches page.tsx desktop header */}
      <section className="fixed z-50 flex w-full xl:gap-16 border-b border-t bg-white border-gray-200 lg:gap-8 md:gap-0 gap-0 xl:px-24 md:px-12 px-12 max-md:pt-4 max-md:pb-8 h-16 max-md:hidden">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1">
            <div className="h-[46px] w-full rounded-xl bg-gray-200 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 flex-row">
            <div className="h-[46px] w-20 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-[46px] w-36 rounded-xl bg-gray-200 animate-pulse max-2xl:hidden" />
            <div className="h-[46px] w-32 rounded-xl bg-gray-200 animate-pulse max-xl:hidden" />
            <div className="h-[46px] w-40 rounded-xl bg-gray-200 animate-pulse max-xl:hidden" />
            <div className="h-[46px] w-48 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-[46px] max-lg:w-12 w-24 rounded-xl bg-gray-200 animate-pulse" />
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
                <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Property List */}
          <div className="mx-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
