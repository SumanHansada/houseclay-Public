import { default as ACCORDION_DATA } from "@/data/SupportAccordionData.json";

const COUNT =
  Array.isArray(ACCORDION_DATA) && ACCORDION_DATA.length > 0
    ? ACCORDION_DATA.length
    : 5;

const widths = [72, 64, 80, 58, 70];

export default function Loading() {
  return (
    <>
      {/* Mobile header skeleton (matches MobileHeader height) */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-gray-200 shadow-sm bg-white md:hidden">
        <div className="animate-pulse flex items-center h-full px-6 gap-2">
          <div className="shrink-0 w-10 h-10 grid place-items-center">
            <div className="h-9 w-9 rounded-full bg-neutral-200" />
          </div>
          <div className="flex-1 px-2">
            <div className="h-5 w-[180px] mx-auto rounded bg-neutral-200" />
          </div>
          <div className="shrink-0 w-10 h-10" />
        </div>
      </header>

      <section
        className="space-y-12 md:space-y-24 xl:w-1/2 lg:w-2/3 md:w-3/4 md:py-20 max-md:px-8 pb-16 pt-12 animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="faq-loading-title"
      >
        <h1 id="faq-loading-title" className="sr-only">
          Loading Frequently Asked Questions
        </h1>

        {/* Desktop title + subtitle */}
        <section
          className="mx-auto w-11/12 text-center max-md:hidden"
          aria-labelledby="faq-hero-heading"
        >
          <h2 id="faq-hero-heading" className="sr-only">
            FAQ hero
          </h2>
          <div className="h-10 w-[360px] mx-auto mb-6 rounded bg-neutral-200" />
          <div className="h-5 w-[80%] mx-auto rounded bg-neutral-200" />
        </section>

        {/* Mobile intro text */}
        <section
          className="mx-auto w-11/12 text-center md:hidden"
          aria-labelledby="faq-intro-heading"
        >
          <h2 id="faq-intro-heading" className="sr-only">
            FAQ intro
          </h2>
          <div className="h-4 w-[90%] mx-auto rounded bg-neutral-200" />
        </section>

        {/* Accordion list */}
        <section
          className="flex flex-col gap-5"
          aria-labelledby="faq-list-heading"
        >
          <h2 id="faq-list-heading" className="sr-only">
            Questions list
          </h2>

          {Array.from({ length: COUNT }).map((_, i) => (
            <article
              key={i}
              className="rounded-xl border shadow-sm md:text-xl py-3 md:py-6 px-4 md:px-8"
              aria-label={`Loading question ${i + 1}`}
            >
              <div className="flex justify-between items-center">
                <div className="pr-4 w-full">
                  <div
                    className="h-5 rounded bg-neutral-200"
                    style={{ width: `${widths[i % widths.length]}%` }}
                  />
                </div>
                <div className="h-8 w-8 rounded-full bg-neutral-200" />
              </div>

              {/* Collapsible body placeholder */}
              <div className="mt-3 md:mt-4">
                <div className="h-3 w-[90%] mb-2 rounded bg-neutral-200" />
                <div className="h-3 w-[75%] rounded bg-neutral-200" />
              </div>
            </article>
          ))}
        </section>
      </section>

      {/* Desktop footer placeholder (page shows real Footer only on desktop) */}
      <section className="max-md:hidden" aria-label="Loading footer">
        <div className="border-t border-gray-200 py-10 px-8">
          <div className="container mx-auto flex items-center justify-between gap-6">
            <div className="h-5 w-[30%] rounded bg-neutral-200" />
            <div className="h-5 w-[20%] rounded bg-neutral-200" />
          </div>
        </div>
      </section>
    </>
  );
}
