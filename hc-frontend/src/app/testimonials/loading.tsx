import Skeleton from "react-loading-skeleton";

function Lines({ n = 3 }: { n?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: n }).map((_, i) => (
        <Skeleton key={i} height={16} width={`${85 - i * 8}%`} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col max-md:p-4">
      <div className="px-6 md:px-8 pt-8 md:pt-10 pb-4 rounded-t-2xl rounded-es-2xl bg-gray-50 h-[220px] md:h-[280px]">
        <Skeleton height={40} width={40} className="mb-4" />
        <Lines n={4} />
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-3 bg-white pt-4 pr-4 pb-2 pl-2 rounded-se-2xl basis-[45%]">
          <Skeleton circle width={48} height={48} />
          <Skeleton width={120} height={16} />
        </div>
        <div className="flex-1 h-full flex items-center justify-center rounded-b-2xl bg-gray-50">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} circle width={20} height={20} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      {/* Mobile header skeleton */}
      <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white md:hidden">
        <div className="flex items-center h-full px-6 gap-2">
          <div className="shrink-0 w-10 h-10 grid place-items-center">
            <Skeleton circle width={36} height={36} />
          </div>
          <div className="flex-1 px-2">
            <Skeleton height={20} width={220} className="mx-auto" />
          </div>
          <div className="shrink-0 w-10 h-10" />
        </div>
      </header>

      {/* Desktop */}
      <section className="w-full h-full max-md:hidden md:block">
        <div className="relative w-full md:aspect-[15/4] md:block">
          <div className="absolute inset-0 hidden md:block">
            <Skeleton height="100%" />
          </div>
          <div className="absolute flex items-center pl-14 h-full xl:pl-40 w-1/4 lg:w-1/3 xl:w-2/5">
            <Skeleton height={44} width={360} />
          </div>
        </div>

        <div className="w-2/3 xl:w-2/5 mx-auto text-center py-16">
          <Skeleton height={20} width={"80%"} className="mx-auto" />
        </div>

        <div className="w-full xl:px-28 lg:px-14 md:px-14 px-8 py-8">
          <div className="hidden lg:grid gap-x-8 gap-y-12 grid-cols-[repeat(auto-fill,minmax(380px,1fr))]">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="lg:hidden">
            <div className="relative w-full">
              <div className="grid grid-flow-col auto-cols-max gap-4 py-2 overflow-x-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ width: 400 }}>
                    <CardSkeleton />
                  </div>
                ))}
              </div>
              <div className="py-4 flex justify-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} circle width={8} height={8} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:flex w-full justify-center py-6 max-lg:hidden">
          <Skeleton width={160} height={44} borderRadius={12} />
        </div>
      </section>

      {/* Mobile */}
      <section className="w-full h-full px-6 sm:px-8 md:hidden pt-[55px]">
        {/* Mobile banner: aspect matches 341×152, no crop */}
        <div className="relative w-full aspect-[341/152]">
          <Skeleton height="100%" />
        </div>

        <div className="mt-2 px-6">
          <Skeleton height={16} width={"90%"} className="mx-auto" />
        </div>

        <div className="mt-4">
          <div className="relative w-full">
            <div className="grid grid-flow-col auto-cols-max gap-2 py-2 overflow-x-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ width: 320 }}>
                  <CardSkeleton />
                </div>
              ))}
            </div>
            <div className="py-4 flex justify-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} circle width={8} height={8} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
