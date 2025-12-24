import { default as ACCORDION_DATA } from "@/data/SupportAccordionData.json";

const COUNT =
  Array.isArray(ACCORDION_DATA) && ACCORDION_DATA.length > 0
    ? ACCORDION_DATA.length
    : 6;

const widths = [72, 64, 80, 58, 70];

export default function Loading() {
  return (
    <>
      {/* Desktop */}
      <section
        className="max-md:hidden animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading support page"
      >
        {/* Page title */}
        <div className="border-b-2 pb-2 mb-8">
          <div className="h-8 w-56 rounded bg-gray-200" />
        </div>

        <div className="lg:px-8">
          {/* Support block */}
          <section
            className="flex max-lg:flex-col max-lg:items-center gap-3 2xl:justify-between pb-16"
            aria-labelledby="support-loading-heading"
          >
            <h2 id="support-loading-heading" className="sr-only">
              Support channels
            </h2>
            <p className="text-lg font-medium tracking-wide lg:hidden">
              {/* spacer to keep layout height roughly similar */}
              <span className="inline-block h-5 w-[85%] rounded bg-gray-200" />
            </p>
            <div className="flex items-center gap-4 w-full">
              {/* Icon area */}
              <div className="h-[220px] w-[360px] max-lg:w-[300px] rounded bg-gray-200" />
              {/* Text area */}
              <div className="flex-1 text-lg">
                <div className="w-11/12 mb-8 max-lg:hidden">
                  <div className="h-5 w-[75%] rounded bg-gray-200" />
                </div>

                {/* Email row */}
                <div className="flex items-center gap-2 mb-4 w-fit">
                  <div className="h-[25px] w-[25px] rounded-full bg-gray-200" />
                  <div className="h-5 w-64 rounded bg-gray-200" />
                </div>

                {/* Phone row */}
                <div className="flex gap-2 items-start w-fit">
                  <div className="h-[25px] w-[25px] rounded-full bg-gray-200 mt-1" />
                  <div className="flex flex-col gap-1">
                    <div className="h-5 w-40 rounded bg-gray-200" />
                    <div className="h-4 w-56 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-8" aria-labelledby="faq-loading-heading">
            <h2 id="faq-loading-heading" className="sr-only">
              Frequently asked questions
            </h2>

            {/* Centered hero */}
            <div className="w-11/12 lg:w-2/3 text-center mx-auto">
              <div className="h-8 w-[60%] mx-auto mb-4 rounded bg-gray-200" />
              <div className="h-5 w-[80%] mx-auto rounded bg-gray-200" />
            </div>

            {/* Accordion list */}
            <div className="flex flex-col gap-5">
              {Array.from({ length: COUNT }).map((_, i) => (
                <article
                  key={i}
                  className="rounded-xl border shadow-sm py-3 md:py-5 px-4 md:px-6"
                  aria-label={`Loading question ${i + 1}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="pr-4 w-full">
                      <div
                        className="h-5 rounded bg-gray-200"
                        style={{ width: `${widths[i % widths.length]}%` }}
                      />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  </div>

                  <div className="mt-3">
                    <div className="h-3 w-[90%] mb-2 rounded bg-gray-200" />
                    <div className="h-3 w-[75%] rounded bg-gray-200" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Mobile */}
      <section
        className="md:hidden animate-pulse mb-16"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading support page (mobile)"
      >
        {/* Mobile header placeholder (matches MobileHeader) */}
        <div className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white">
          <div className="h-full flex items-center px-6">
            <div className="h-5 w-28 rounded bg-gray-200" />
          </div>
        </div>
        {/* Spacer for fixed header */}
        <div className="h-[55px]" />

        <div className="px-8 space-y-6">
          {/* Support */}
          <section
            aria-labelledby="mobile-support-loading-heading"
            className="py-6"
          >
            <h2 id="mobile-support-loading-heading" className="sr-only">
              Support channels
            </h2>

            <div className="h-5 w-[85%] mb-6 rounded bg-gray-200" />

            <div className="flex gap-2 w-full items-center">
              <div className="w-1/3 sm:w-2/5">
                <div className="h-[150px] w-full rounded bg-gray-200" />
              </div>
              <div className="w-2/3 sm:w-3/5 p-1">
                {/* Email */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[25px] w-[25px] rounded-full bg-gray-200" />
                  <div className="h-5 w-56 rounded bg-gray-200" />
                </div>
                {/* Phone */}
                <div className="flex gap-2 items-start">
                  <div className="h-[25px] w-[25px] rounded-full bg-gray-200" />
                  <div className="flex flex-col gap-1">
                    <div className="h-5 w-40 rounded bg-gray-200" />
                    <div className="h-4 w-48 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="mobile-faq-loading-heading">
            <h2 id="mobile-faq-loading-heading" className="sr-only">
              Frequently asked questions
            </h2>

            <div className="space-y-2">
              <div className="h-6 w-56 rounded bg-gray-200 mb-4" />
              <div className="h-4 w-[90%] rounded bg-gray-200" />
            </div>

            <div className="flex flex-col gap-3 py-5">
              {Array.from({ length: COUNT }).map((_, i) => (
                <article
                  key={i}
                  className="rounded-xl border shadow-sm py-3 px-4"
                  aria-label={`Loading question ${i + 1}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="pr-4 w-full">
                      <div
                        className="h-4 rounded bg-gray-200"
                        style={{ width: `${widths[i % widths.length]}%` }}
                      />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  </div>

                  <div className="mt-3">
                    <div className="h-3 w-[92%] mb-2 rounded bg-gray-200" />
                    <div className="h-3 w-[70%] rounded bg-gray-200" />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <p className="sr-only">Loading…</p>
        </div>
      </section>
    </>
  );
}
