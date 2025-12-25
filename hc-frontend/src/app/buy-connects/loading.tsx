const ConnectsBundleCardSkeleton = () => (
  <div className="relative w-full rounded-xl p-6 max-md:rounded-lg max-md:p-4 max-md:border-2 max-md:border-neutral-100 md:h-[26rem]">
    {/* Recommended Badge Skeleton */}
    <div className="absolute max-md:-top-2 max-md:left-4 md:-top-3 md:left-1/2 md:transform md:-translate-x-1/2">
      <div className="rounded-full bg-neutral-100 animate-pulse max-md:h-5 max-md:w-[60px] md:h-6 md:w-20" />
    </div>

    {/* Radio Button Skeleton */}
    <div className="w-6 h-6 mb-4 rounded-full border-2 border-neutral-100 bg-neutral-50 animate-pulse" />

    {/* Title Skeletons */}
    <div className="h-8 w-3/5 bg-neutral-100 rounded mb-2 animate-pulse" />
    <div className="h-8 w-4/5 bg-neutral-100 rounded mb-4 animate-pulse" />

    {/* Connects Info Skeleton */}
    <div className="flex items-center gap-1 rounded-full mb-4">
      <div className="w-6 h-6 rounded-full bg-neutral-100 animate-pulse" />
      <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
    </div>

    {/* Price Skeletons */}
    <div className="flex mb-2">
      <div className="h-5 w-[120px] bg-neutral-100 rounded animate-pulse" />
    </div>
    <div className="flex">
      <div className="h-8 w-[140px] bg-neutral-100 rounded mb-4 animate-pulse" />
    </div>

    {/* Discount Badge Skeleton */}
    <div className="flex items-center justify-between mb-8">
      <div className="h-6 w-[60px] bg-neutral-100 rounded-xl animate-pulse" />
    </div>

    {/* Validity Skeleton */}
    <div className="flex items-center gap-1">
      <div className="h-3 w-12 bg-neutral-100 rounded animate-pulse" />
      <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
    </div>
  </div>
);

const PurchaseSummarySkeleton = () => (
  <div className="bg-white rounded-lg max-md:p-4 max-md:shadow-lg md:sticky">
    <div className="space-y-4 mb-6">
      {/* Account Charge */}
      <div className="flex justify-between">
        <div className="h-4 w-[120px] bg-neutral-100 rounded animate-pulse" />
        <div className="h-4 w-[100px] bg-neutral-100 rounded animate-pulse" />
      </div>

      {/* New Balance */}
      <div className="flex justify-between">
        <div className="h-4 w-[140px] bg-neutral-100 rounded animate-pulse" />
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-neutral-100 animate-pulse" />
          <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Expiry Date */}
      <div className="flex justify-between">
        <div className="h-4 w-[100px] bg-neutral-100 rounded animate-pulse" />
        <div className="h-4 w-[120px] bg-neutral-100 rounded animate-pulse" />
      </div>

      {/* Total Amount */}
      <div className="border-t border-neutral-100 pt-4">
        <div className="flex justify-between">
          <div className="h-5 w-[100px] bg-neutral-200 rounded animate-pulse" />
          <div className="h-5 w-20 bg-neutral-200 rounded animate-pulse" />
        </div>
      </div>
    </div>

    {/* Info Box Skeleton */}
    <div className="bg-neutral-50 rounded-lg p-4 mb-6">
      <div className="h-3.5 w-full bg-neutral-100 rounded mb-2 animate-pulse" />
      <div className="h-3.5 w-4/5 bg-neutral-100 rounded mb-2 animate-pulse" />
      <div className="h-3.5 w-[60px] bg-neutral-100 rounded animate-pulse" />
    </div>

    {/* Terms Checkbox Skeleton */}
    <div className="mb-6">
      <div className="h-3.5 w-full bg-neutral-100 rounded mb-4 animate-pulse" />
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-neutral-100 animate-pulse" />
        <div className="h-3.5 w-[200px] bg-neutral-100 rounded animate-pulse" />
      </div>
    </div>

    <hr className="mb-6 border-neutral-100" />

    {/* Action Buttons Skeleton */}
    <div className="flex max-md:gap-3 md:justify-between md:gap-3">
      <div className="h-12 rounded-xl bg-neutral-100 animate-pulse max-md:w-full md:w-[120px]" />
      <div className="h-12 rounded-xl bg-neutral-100 animate-pulse max-md:w-full md:w-[140px]" />
    </div>
  </div>
);

export default function Loading() {
  return (
    <>
      {/* Desktop Layout */}
      <section className="w-full max-md:hidden">
        <div className="flex justify-between items-start xl:px-28 lg:px-14 md:px-14 px-8 py-12 gap-8 md:gap-8 xl:gap-8 2xl:gap-24 relative">
          <div className="relative w-2/3 max-xl:w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-9 w-[200px] bg-neutral-100 rounded animate-pulse" />
              </div>
            </div>

            {/* Available Connects */}
            <div className="flex items-center gap-2 justify-between mb-6">
              <div className="h-5 w-[180px] bg-neutral-100 rounded animate-pulse" />
              <div className="flex items-center gap-1 px-3 py-1 rounded-full">
                <div className="w-6 h-6 rounded-full bg-neutral-100 animate-pulse" />
                <div className="h-5 w-[100px] bg-neutral-100 rounded animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Left Column - Bundle Selection */}
              <div className="lg:col-span-2">
                {/* Tabs Skeleton */}
                <div className="mb-8">
                  <div className="border-b border-neutral-100">
                    <div className="flex">
                      <div className="px-6 py-3">
                        <div className="h-5 w-[180px] bg-neutral-100 rounded animate-pulse" />
                      </div>
                      <div className="px-6 py-3">
                        <div className="h-5 w-[160px] bg-neutral-100 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Content Skeleton */}
                <div>
                  <div className="h-8 w-[300px] bg-neutral-100 rounded mb-6 animate-pulse" />

                  {/* Bundle Cards Grid */}
                  <div className="grid grid-cols-3 gap-8 md:gap-10 xl:gap-12">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <ConnectsBundleCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Purchase Summary */}
              <div className="lg:col-span-1">
                <PurchaseSummarySkeleton />
              </div>
            </div>
          </div>

          {/* Right Side Graphic Skeleton */}
          <div className="sticky top-8 w-1/3 max-xl:hidden">
            <div className="h-[400px] w-full rounded-xl bg-neutral-100 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Mobile Layout */}
      <section className="md:hidden min-h-screen bg-neutral-50">
        {/* Mobile Header */}
        <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-neutral-100 bg-white">
          <div className="grid grid-cols-3 items-center h-full px-4">
            <button
              aria-label="Go back"
              className="justify-self-start rounded-full size-10 border border-neutral-100 flex items-center justify-center bg-neutral-50 animate-pulse"
            />

            <div className="col-start-2 text-center">
              <div className="h-5 w-[120px] bg-neutral-100 rounded animate-pulse mx-auto" />
            </div>
          </div>
        </header>

        <div className="px-4 pt-16 pb-20">
          {/* Available Connects */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-4 w-[140px] bg-neutral-100 rounded animate-pulse" />
            <div className="flex items-center gap-1 bg-neutral-100 px-3 py-1 rounded-full">
              <div className="w-5 h-5 rounded-full bg-neutral-100 animate-pulse" />
              <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-neutral-100">
              <div className="flex w-full">
                <div className="flex-1 px-4 py-3 text-center">
                  <div className="h-4 w-[60px] bg-neutral-100 rounded animate-pulse mx-auto" />
                </div>
                <div className="flex-1 px-4 py-3 text-center">
                  <div className="h-4 w-[50px] bg-neutral-100 rounded animate-pulse mx-auto" />
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              <div className="h-6 w-[200px] bg-neutral-100 rounded mb-4 animate-pulse" />

              {/* Mobile Bundle Cards */}
              <div className="grid-cols-3 space-y-4 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ConnectsBundleCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Purchase Summary */}
          <PurchaseSummarySkeleton />
        </div>
      </section>
    </>
  );
}
