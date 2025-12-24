function Line({
  w = "100%",
  h = 16,
  className = "",
}: {
  w?: string;
  h?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded bg-gray-200 ${className}`}
      style={{ width: w, height: h }}
    />
  );
}

function FeatureRow() {
  return (
    <div className="flex gap-4 items-center">
      <div className="h-[45px] w-[45px] rounded bg-gray-200" />
      <div className="space-y-2">
        <Line w="220px" />
        <Line w="300px" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      {/* Desktop */}
      <section
        className="max-md:hidden animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="connects-loading-title"
      >
        <h1 id="connects-loading-title" className="sr-only">
          Loading Connects page
        </h1>

        {/* Page title */}
        <section className="pb-2 mb-8">
          <div className="h-7 w-40 rounded bg-gray-200" />
        </section>

        {/* Balance banner */}
        <section className="flex justify-between w-full py-4 px-3 lg:px-8 rounded-lg mb-10 bg-gray-100">
          <div className="flex items-center gap-4">
            <Line w="180px" h={24} />
            <div className="flex gap-2 items-center">
              <div className="h-8 w-8 rounded bg-gray-200" />
              <Line w="60px" h={28} />
            </div>
          </div>
          <div className="h-10 w-28 rounded-xl bg-gray-200" />
        </section>

        {/* Two-column content */}
        <section className="flex">
          {/* Left column */}
          <div className="lg:w-2/3 space-y-6 px-4">
            {/* Intro */}
            <div className="space-y-4">
              <Line w="340px" h={28} />
              <div className="space-y-2">
                <Line w="95%" />
                <Line w="88%" />
                <Line w="76%" />
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-6 lg:space-y-8 md:px-2 lg:px-4 mb-2">
              <FeatureRow />
              <FeatureRow />
              <FeatureRow />
            </div>

            {/* CTA */}
            <div className="h-11 w-64 rounded-xl bg-gray-200" />
          </div>

          {/* Right column illustration */}
          <div className="lg:w-1/3 max-lg:hidden lg:pt-12 2xl:pt-0">
            <div className="h-[380px] w-full rounded bg-gray-200" />
          </div>
        </section>
      </section>

      {/* Mobile */}
      <section
        className="md:hidden px-6 pt-4 pb-16 animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="connects-loading-mobile-title"
      >
        <h2 id="connects-loading-mobile-title" className="sr-only">
          Loading Connects page (mobile)
        </h2>

        {/* Balance + small illo */}
        <section className="flex justify-between items-start w-full py-4 rounded-lg mb-4">
          <div className="flex flex-col gap-2">
            <Line w="140px" h={22} />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gray-200" />
              <Line w="80px" h={26} />
            </div>
          </div>
          <div className="h-[140px] w-[140px] rounded bg-gray-200" />
        </section>

        {/* Content */}
        <section className="w-full space-y-6">
          <div className="space-y-2">
            <Line w="220px" h={22} />
            <div className="space-y-2">
              <Line w="100%" />
              <Line w="86%" />
              <Line w="78%" />
            </div>
          </div>

          <div className="space-y-4 mb-2">
            {/* 3 feature rows */}
            <div className="flex gap-2 items-center">
              <div className="h-[45px] w-[45px] rounded bg-gray-200" />
              <div className="space-y-2">
                <Line w="200px" />
                <Line w="220px" />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-[45px] w-[45px] rounded bg-gray-200" />
              <div className="space-y-2">
                <Line w="190px" />
                <Line w="210px" />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-[45px] w-[45px] rounded bg-gray-200" />
              <div className="space-y-2">
                <Line w="240px" />
                <Line w="220px" />
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
