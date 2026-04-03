export default function HomeLoading() {
  return (
    <>
      {/* Masthead Desktop Section Skeleton */}
      <section className="relative xl:h-[700px] lg:h-[600px] h-[500px] w-full overflow-hidden max-md:hidden">
        {/* Background Image Skeleton */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-r from-[#FCF3F8] via-[#F2F2E8] to-[#C6E34D] animate-pulse" />
        </div>

        {/* Content Overlay Skeleton */}
        <div className="absolute h-full flex flex-col justify-center xl:pl-40 lg:pl-14 pl-14 xl:w-7/12 lg:w-7/12 md:w-4/5 w-4/5">
          {/* Headings Skeleton */}
          <div className="max-w-md mb-8">
            <div className="flex xl:text-4xl lg:text-4xl text-4xl max-lg:flex-col gap-2">
              <div className="h-10 w-60 bg-neutral-200 rounded animate-pulse" />
              <div className="h-10 w-64 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="max-w-5xl flex justify-start pl-8 mb-4">
            <div className="px-6 py-2 border-b-2 border-gray-200 animate-pulse">
              <div className="h-6 w-32 bg-neutral-200 rounded" />
            </div>
            <div className="px-6 py-2 border-b-2 border-gray-200 animate-pulse">
              <div className="h-6 w-28 bg-neutral-200 rounded" />
            </div>
          </div>

          {/* Search Form Skeleton */}
          <div className="max-w-5xl animate-pulse">
            <div className="h-14 w-full bg-neutral-200 rounded-full" />
          </div>
        </div>
      </section>
      {/* Masthead Mobile Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden md:hidden">
        <div className="relative flex flex-col px-4 pt-8 pb-14 gap-6">
          {/* Tabs and Search */}
          <div className="w-full">
            {/* Tabs Skeleton */}
            <div className="flex justify-center w-4/5 mx-auto">
              <div className="w-1/2 py-2 border-b-2 border-gray-200 animate-pulse">
                <div className="h-5 w-24 mx-auto bg-neutral-200 rounded" />
              </div>
              <div className="w-1/2 py-2 border-b-2 border-gray-200 animate-pulse">
                <div className="h-5 w-20 mx-auto bg-neutral-200 rounded" />
              </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="mt-4 animate-pulse">
              <div className="h-12 w-full bg-neutral-100 rounded-full" />
            </div>
          </div>

          {/* Tagline Skeleton */}
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="h-7 w-32 bg-neutral-200 rounded animate-pulse" />
              <div className="h-7 w-36 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Feature Grid Skeleton */}
          <div className="grid grid-cols-4 gap-4 sm:gap-4 place-items-start">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex flex-col items-center justify-center self-start justify-self-center"
              >
                <div className="bg-neutral-100 p-4 border border-gray-100 rounded-2xl shadow-sm w-20 h-20 animate-pulse" />
                <div className="text-center mt-2">
                  <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse mt-2 sm:hidden" />
                </div>
              </div>
            ))}
          </div>

          {/* Banner Skeleton */}
          <div className="relative w-full flex justify-center">
            <div className="rounded-2xl p-5 relative overflow-hidden w-full min-h-36">
              {/* Image Skeleton */}
              <div className="absolute inset-0 bg-neutral-100 animate-pulse" />

              {/* Content Skeleton */}
              <div className="w-full relative z-10 mt-2">
                <div className="h-5 w-40 bg-neutral-200 rounded animate-pulse" />
                <div className="h-3 w-48 bg-neutral-200 rounded mt-2 animate-pulse" />

                <div className="flex items-center mt-2 gap-2">
                  <div className="h-4 w-4 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-neutral-200 rounded animate-pulse" />
                </div>

                <div className="flex items-center mt-2 gap-3">
                  <div className="h-4 w-4 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            {/* Know More Button Skeleton */}
            <div className="absolute right-6 -bottom-6 h-12 w-32 bg-neutral-200 rounded-2xl border-4 border-gray-100 animate-pulse" />
          </div>
        </div>
      </section>
      {/* Advantages Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <div className="flex flex-col items-center justify-between gap-10 xl:px-24 lg:px-12 md:px-8 px-4 py-12">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-10 w-48 bg-neutral-300 rounded animate-pulse" />
            <div className="h-5 w-96 bg-neutral-200 rounded animate-pulse" />
          </div>

          {/* Cards Skeleton */}
          <div className="flex flex-nowrap xl:gap-12 lg:gap-6 gap-6 justify-between w-11/12 mx-auto">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3 py-6 justify-between items-center gap-4"
              >
                {/* Image Skeleton */}
                <div className="w-40 h-40 bg-neutral-200 rounded-2xl animate-pulse" />
                {/* Heading Skeleton */}
                <div className="h-6 w-32 bg-neutral-300 rounded animate-pulse" />
                {/* Paragraph Skeleton */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-full bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Standouts Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <div className="h-full w-full animate-pulse bg-neutral-200" />
      </section>
      {/* Neighbourhoods Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <div className="h-full w-full animate-pulse bg-neutral-200" />
      </section>
      {/* Testimonials Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden">
        <div className="mx-auto xl:px-24 lg:px-14 md:px-14 px-6 max-md:py-6 py-12">
          {/* Top user avatars row Skeleton */}
          <div className="mb-8 flex justify-center">
            <div className="h-16 w-[403px] max-w-full bg-neutral-100 rounded animate-pulse" />
          </div>

          {/* Heading section Skeleton */}
          <div className="mb-10 text-center">
            <div className="mb-4 h-12 w-full max-w-4xl mx-auto bg-neutral-200 rounded animate-pulse" />
            <div className="mx-auto max-w-3xl h-6 w-full bg-neutral-100 rounded animate-pulse" />
          </div>
        </div>
      </section>
      {/* Property Owners Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <div className="h-full w-full animate-pulse bg-neutral-200" />
      </section>
      {/* Footer Skeleton */}
      <footer className="min-h-[100px] w-full overflow-hidden">
        <div className="h-full w-full animate-pulse bg-neutral-200" />
      </footer>
    </>
  );
}
