function Lines({ n = 3 }: { n?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-neutral-200"
          style={{ width: `${85 - i * 8}%` }}
        />
      ))}
    </div>
  );
}

function CardSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`flex h-full flex-col ${wide ? "max-md:p-4" : ""}`}>
      <div className="px-6 md:px-8 pt-8 md:pt-10 pb-4 rounded-t-2xl rounded-es-2xl bg-gray-50 h-[220px] md:h-[280px]">
        <div className="h-10 w-10 mb-4 rounded bg-neutral-200" />
        <Lines n={4} />
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-3 bg-white pt-4 pr-4 pb-2 pl-2 rounded-se-2xl basis-[45%]">
          <div className="h-12 w-12 rounded-full bg-neutral-200" />
          <div className="h-4 w-28 rounded bg-neutral-200" />
        </div>
        <div className="flex-1 h-full flex items-center justify-center rounded-b-2xl bg-gray-50">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 w-5 rounded-full bg-neutral-200" />
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
        <div className="animate-pulse flex items-center h-full px-6 gap-2">
          <div className="shrink-0 w-10 h-10 grid place-items-center">
            <div className="h-9 w-9 rounded-full bg-neutral-200" />
          </div>
          <div className="flex-1 px-2">
            <div className="h-5 w-[220px] mx-auto rounded bg-neutral-200" />
          </div>
          <div className="shrink-0 w-10 h-10" />
        </div>
      </header>

      {/* Desktop skeleton (visible on lg+) */}
      <section
        className="w-full h-full max-md:hidden animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="testimonials-loading-title"
      >
        <h1 id="testimonials-loading-title" className="sr-only">
          Loading testimonials
        </h1>

        {/* Hero */}
        <section
          className="relative w-full md:aspect-[15/4]"
          aria-labelledby="hero-sk"
        >
          <h2 id="hero-sk" className="sr-only">
            Hero banner
          </h2>
          <div className="absolute inset-0 hidden md:block">
            <div className="h-full w-full bg-neutral-200" />
          </div>
          <div className="absolute flex items-center pl-14 h-full xl:pl-40 w-1/4 lg:w-1/3 xl:w-2/5">
            <div className="h-11 w-[360px] rounded bg-neutral-100/70" />
          </div>
        </section>

        {/* Intro */}
        <section
          className="w-2/3 xl:w-2/5 mx-auto text-center py-16"
          aria-labelledby="intro-sk"
        >
          <h2 id="intro-sk" className="sr-only">
            Intro
          </h2>
          <div className="h-5 w-[80%] mx-auto rounded bg-neutral-200" />
        </section>

        {/* List/Carousel section */}
        <section
          className="w-full xl:px-28 lg:px-14 md:px-14 px-8 py-8"
          aria-labelledby="cards-sk"
        >
          <h2 id="cards-sk" className="sr-only">
            Testimonials list
          </h2>
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
                    <CardSkeleton wide />
                  </div>
                ))}
              </div>
              <div className="py-4 flex justify-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full bg-neutral-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="lg:flex w-full justify-center py-6 max-lg:hidden"
          aria-labelledby="cta-sk"
        >
          <h2 id="cta-sk" className="sr-only">
            Load more
          </h2>
          <div className="h-11 w-40 rounded-[12px] bg-neutral-200" />
        </section>
      </section>

      {/* Mobile skeleton */}
      <section
        className="w-full h-full px-6 sm:px-8 md:hidden pt-[55px] animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="mobile-testimonials-loading-title"
      >
        <h2 id="mobile-testimonials-loading-title" className="sr-only">
          Loading testimonials (mobile)
        </h2>

        {/* Mobile hero */}
        <section
          className="relative w-full aspect-[9/4]"
          aria-labelledby="mobile-hero-sk"
        >
          <h3 id="mobile-hero-sk" className="sr-only">
            Mobile hero banner
          </h3>
          <div className="absolute inset-0 bg-neutral-200" />
        </section>

        {/* Mobile intro */}
        <section
          className="pt-6 pb-8 px-4 sm:px-6 text-center"
          aria-labelledby="mobile-intro-sk"
        >
          <h3 id="mobile-intro-sk" className="sr-only">
            Mobile intro
          </h3>
          <div className="h-4 w-[90%] mx-auto rounded bg-neutral-200" />
        </section>

        {/* Mobile carousel placeholder */}
        <section className="mb-16 py-5" aria-labelledby="mobile-cards-sk">
          <h3 id="mobile-cards-sk" className="sr-only">
            Mobile testimonials list
          </h3>
          <div className="relative w-full">
            <div className="grid grid-flow-col auto-cols-max gap-2 py-2 overflow-x-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ width: 320 }}>
                  <CardSkeleton wide />
                </div>
              ))}
            </div>
            <div className="py-4 flex justify-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-neutral-200" />
              ))}
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
