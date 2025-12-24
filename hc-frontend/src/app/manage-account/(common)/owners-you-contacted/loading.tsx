export default function Loading() {
  return (
    <section
      className="animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading contacted properties"
    >
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Header */}
        <header className="border-b-2 pb-2 mb-8 flex justify-between">
          <div className="h-8 w-72 rounded-md bg-gray-200" />
          <div className="inline-flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm border border-gray-300 bg-gray-200" />
            <div className="h-6 w-48 rounded-md bg-gray-200" />
          </div>
        </header>

        {/* Filters */}
        <div className="mb-8 flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-lg bg-gray-200" />
          ))}
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden">
        {/* Mobile header placeholder (matches MobileHeader height) */}
        <div className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white">
          <div className="h-full flex items-center px-6">
            <div className="h-5 w-56 rounded-md bg-gray-200" />
          </div>
        </div>

        {/* Filters */}
        <div className="mx-8 mt-3 mb-4 flex rounded-xl border p-1.5 sm:p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mx-1 h-8 flex-1 rounded-lg bg-gray-200" />
          ))}
        </div>
      </section>

      {/* Card grid (shared) */}
      <section className="max-md:px-6 pt-4 pb-16">
        <div className="mx-auto w-full py-5">
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
        <p className="sr-only">Loading…</p>
      </section>
    </section>
  );
}

function CardSkeleton() {
  return (
    <article className="rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Image / carousel area */}
      <div className="h-44 w-full bg-gray-200" />
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/5 rounded bg-gray-200" />
        {/* Meta row */}
        <div className="flex gap-3">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-28 rounded bg-gray-200" />
        </div>
        {/* Price / status */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-6 w-20 rounded bg-gray-200" />
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <div className="h-9 w-28 rounded-md bg-gray-200" />
          <div className="h-9 w-36 rounded-md bg-gray-200" />
        </div>
      </div>
    </article>
  );
}
