"use client";

function Lines({ n = 3 }: { n?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-neutral-200 dark:bg-neutral-700"
          style={{ width: `${85 - i * 8}%` }}
        />
      ))}
    </div>
  );
}

function ValueCardSkeleton() {
  return (
    <article className="flex-1 basis-0 min-w-0 2xl:max-w-[420px]">
      <div className="h-full flex flex-col items-center text-center gap-4 sm:px-6 md:px-0 lg:px-6">
        <div className="h-[110px] w-[110px] rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="space-y-2 w-full">
          <div className="h-6 w-[55%] mx-auto rounded bg-neutral-200 dark:bg-neutral-700" />
          <Lines n={3} />
        </div>
        <div className="mt-auto" />
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <>
      {/* Mobile header skeleton */}
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
        className="w-full h-full"
        role="status"
        aria-live="polite"
        aria-label="Loading About Us content"
        aria-busy="true"
      >
        <div className="py-8 max-md:mb-16 md:py-12 xl:py-20 xl:px-28 lg:px-14 md:px-14 px-8 animate-pulse">
          {/* Spacer below fixed mobile header */}
          <div className="md:hidden h-[55px]" />

          {/* HERO */}
          <section className="relative w-full h-[240px] sm:h-[360px] md:h-[460px] lg:h-[620px]">
            <div className="absolute inset-0 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="absolute left-1/2 -translate-x-1/2 top-2 sm:top-6 md:top-8 xl:top-10 w-full max-w-5xl sm:px-4 flex items-center justify-center">
              <div className="text-center flex flex-col gap-3 w-4/5">
                <div className="h-9 max-w-[520px] mx-auto rounded bg-neutral-100/70 dark:bg-neutral-600" />
                <div className="h-9 max-w-[520px] mx-auto rounded bg-neutral-100/70 dark:bg-neutral-600" />
              </div>
            </div>
          </section>

          {/* MISSION */}
          <section className="space-y-3 mt-4 md:mt-6 lg:mt-10 xl:mt-16">
            <div className="mx-auto w-fit">
              <div className="h-9 w-[150px] rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
            <div className="mx-auto md:w-4/5 text-center space-y-3">
              <div className="h-7 w-4/5 mx-auto rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-7 w-3/5 mx-auto rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </section>

          {/* VALUES */}
          <section className="relative bg-neutral-100 dark:bg-neutral-800/40 w-full h-full rounded-lg py-8 sm:py-12 px-10 lg:px-20 mt-16 md:mt-14 lg:mt-16 xl:mt-28">
            <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2">
              <div className="h-8 w-[140px] rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>

            <div className="flex flex-col md:flex-row md:flex-nowrap gap-6 md:gap-10 xl:gap-12 2xl:justify-between">
              <ValueCardSkeleton />
              <ValueCardSkeleton />
              <ValueCardSkeleton />
            </div>
          </section>

          {/* CTA */}
          <section className="mt-10 md:mt-16 lg:mt-24 w-11/12 lg:w-2/3 2xl:w-2/5 mx-auto text-center space-y-4">
            <div className="h-7 w-3/4 mx-auto rounded bg-neutral-200 dark:bg-neutral-700" />
            <Lines n={3} />
            <div className="flex justify-center">
              <div className="h-11 w-[200px] rounded-[10px] bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </section>

          {/* sr-only text for screen readers */}
          <p className="sr-only">Loading…</p>
        </div>
      </section>
    </>
  );
}
