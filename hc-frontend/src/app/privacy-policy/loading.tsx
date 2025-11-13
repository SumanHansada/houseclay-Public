function ParagraphBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-neutral-200"
          style={{ width: `${85 - i * 8}%` }}
        />
      ))}
    </div>
  );
}

function ListBlock({ items = 4 }: { items?: number }) {
  return (
    <ul className="list-none space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="mt-2 h-2.5 w-2.5 rounded-full bg-neutral-200" />
          <div
            className="h-4 rounded bg-neutral-200"
            style={{ width: `${90 - (i % 3) * 12}%` }}
          />
        </li>
      ))}
    </ul>
  );
}

export default function Loading() {
  return (
    <>
      {/* Mobile header skeleton (matches MobileHeader height) */}
      <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white md:hidden">
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
        className="w-full animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="tc-loading-title"
      >
        <h1 id="tc-loading-title" className="sr-only">
          Loading Privacy Policy
        </h1>

        {/* Desktop title */}
        <section
          className="w-full text-center mb-8 max-md:hidden"
          aria-labelledby="tc-hero"
        >
          <h2 id="tc-hero" className="sr-only">
            Privacy title
          </h2>
          <div className="py-24">
            <div className="h-10 w-[320px] mx-auto rounded bg-neutral-200" />
          </div>
        </section>

        {/* Mobile spacer under fixed header */}
        <div className="md:hidden h-[55px]" />

        {/* Content sections (mirror page structure) */}
        <section
          className="flex flex-col gap-8 xl:w-1/2 lg:w-2/3 md:w-3/4 max-md:px-8 mb-16 pb-5 mx-auto"
          aria-labelledby="tc-content"
        >
          <h2 id="tc-content" className="sr-only">
            Policy content
          </h2>

          {/* Section 1: heading + paragraph */}
          <article aria-label="Section 1">
            <div className="space-y-3">
              <div className="h-7 w-[260px] rounded bg-neutral-200" />
              <ParagraphBlock lines={3} />
            </div>
          </article>

          {/* Section 2: heading + list */}
          <article aria-label="Section 2">
            <div className="space-y-3">
              <div className="h-7 w-[220px] rounded bg-neutral-200" />
              <ListBlock items={4} />
            </div>
          </article>

          {/* Section 3 */}
          <article aria-label="Section 3">
            <div className="space-y-3">
              <div className="h-7 w-[240px] rounded bg-neutral-200" />
              <ListBlock items={2} />
            </div>
          </article>

          {/* Section 4 */}
          <article aria-label="Section 4">
            <div className="space-y-3">
              <div className="h-7 w-[230px] rounded bg-neutral-200" />
              <ListBlock items={5} />
            </div>
          </article>

          {/* Section 5 */}
          <article aria-label="Section 5">
            <div className="space-y-3">
              <div className="h-7 w-[220px] rounded bg-neutral-200" />
              <div className="h-4 w-[140px] rounded bg-neutral-200" />
              <ListBlock items={4} />
            </div>
          </article>

          {/* Section 6 */}
          <article aria-label="Section 6">
            <div className="space-y-3">
              <div className="h-7 w-[230px] rounded bg-neutral-200" />
              <ParagraphBlock lines={3} />
            </div>
          </article>
        </section>
      </section>

      {/* Desktop footer placeholder (real Footer renders only on desktop) */}
      <section className="max-md:hidden" aria-label="Loading footer">
        <div className="border-top border-gray-200 py-10 px-8">
          <div className="container mx-auto flex items-center justify-between gap-6">
            <div className="h-5 w-[30%] rounded bg-neutral-200" />
            <div className="h-5 w-[20%] rounded bg-neutral-200" />
          </div>
        </div>
      </section>
    </>
  );
}
