function InputSkeleton() {
  return <div className="h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />;
}

function FormCardSkeleton() {
  return (
    <div className="rounded-xl bg-white lg:shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
      <div className="h-7 w-40 mb-6 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="space-y-4">
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
        <div className="h-24 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-10 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      {/* Mobile header skeleton (55px high, matches MobileHeader) */}
      <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white md:hidden">
        <div className="animate-pulse flex items-center h-full px-4 gap-2">
          <div className="shrink-0 w-10 h-10 grid place-items-center">
            <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="flex-1 px-2">
            <div className="h-5 w-[160px] mx-auto rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="shrink-0 w-10 h-10" />
        </div>
      </header>

      <section
        className="relative w-full animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="contact-loading-title"
      >
        <h1 id="contact-loading-title" className="sr-only">
          Loading Contact Us content
        </h1>

        {/* ── UNIFIED UPPER Section ── */}
        <section className="relative w-full">
          {/* Desktop */}
          <div className="hidden lg:block">
            <div className="absolute inset-0 -z-10">
              <div className="h-full w-full bg-neutral-200 dark:bg-neutral-700" />
            </div>

            <div className="xl:px-28 lg:px-14 md:px-14 px-8 pt-12 md:pt-16 lg:pt-20">
              <div className="w-2/3 space-y-4">
                <div className="h-9 w-64 rounded bg-neutral-100/70 dark:bg-neutral-600" />
                <div className="h-7 w-1/2 rounded bg-neutral-100/70 dark:bg-neutral-600" />
                <div className="mt-8 h-80 md:w-1/2 lg:w-7/12 xl:w-1/2 rounded bg-neutral-100/70 dark:bg-neutral-600" />
              </div>
            </div>
          </div>

          {/* Mobile/Tablet */}
          <div className="relative h-96 sm:h-[400px] md:h-[500px] lg:hidden">
            <div className="absolute inset-0 -z-10">
              <div className="h-full w-full bg-neutral-200 dark:bg-neutral-700" />
            </div>
            <div className="absolute inset-0 top-5 flex justify-center p-4 sm:p-8 h-fit">
              <div className="space-y-3 w-full md:w-3/4">
                <div className="h-7 w-3/4 mx-auto rounded bg-neutral-100/70 dark:bg-neutral-600" />
                <div className="h-7 w-2/3 mx-auto rounded bg-neutral-100/70 dark:bg-neutral-600" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Form Section (overlays on desktop) ── */}
        <section
          className="
            px-6 sm:px-8 lg:px-0 -mt-10
            sm:-mt-8 md:-mt-6 lg:mt-0
            lg:absolute lg:z-10
            lg:top-20
            lg:right-14 xl:right-28
            lg:w-[45%] xl:w-2/5
          "
          aria-labelledby="form-skel-heading"
        >
          <h2 id="form-skel-heading" className="sr-only">
            Contact form
          </h2>
          <FormCardSkeleton />
        </section>

        {/* Spacer below fixed mobile header */}
        <div className="md:hidden h-[55px]" />

        {/* ── LOWER Section ── */}
        <section
          className="w-full bg-white max-md:mb-16"
          aria-labelledby="channels-skel"
        >
          <h2 id="channels-skel" className="sr-only">
            Contact channels
          </h2>
          <div className="xl:px-28 lg:px-14 md:px-14 px-8 py-8 sm:py-12 lg:py-24 lg:pt-16 lg:pb-36 xl:pb-56">
            <div className="text-lg lg:w-1/2">
              <div className="w-full lg:w-4/5 xl:w-2/3 mb-8 space-y-2">
                <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-5 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>

              {/* Email row */}
              <div className="flex items-center gap-2 mb-4 w-fit">
                <div className="h-[25px] w-[25px] rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-5 w-48 rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>

              {/* Phone row */}
              <div className="flex gap-2 items-start w-fit">
                <div className="h-[25px] w-[25px] rounded-full bg-neutral-200 dark:bg-neutral-700 mt-1" />
                <div className="space-y-1">
                  <div className="h-5 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-4 w-56 rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SR-only text for screen readers */}
        <p className="sr-only">Loading…</p>
      </section>
    </>
  );
}
