export default function Loading() {
  return (
    <section
      className="animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading shortlisted properties"
    >
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Header */}
        <header className="mb-8 flex justify-between border-b-2 pb-2">
          <div className="h-8 w-64 rounded-md bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm border border-gray-300 bg-gray-200" />
            <div className="h-6 w-40 rounded-md bg-gray-200" />
          </div>
        </header>

        {/* Filter buttons */}
        <div className="mb-8 flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-lg bg-gray-200" />
          ))}
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden">
        {/* Filters */}
        <div className="mx-6 mt-3 mb-4 flex rounded-xl border p-1.5 sm:p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mx-1 h-8 flex-1 rounded-lg bg-gray-200" />
          ))}
        </div>
      </section>

      {/* Card grid (shared) */}
      <section className="space-y-4 overflow-y-auto max-md:px-6 pt-4 pb-16">
        <div className="mx-auto w-full py-5">
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
            {Array.from({ length: 9 }).map((_, i) => (
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
        <div className="h-5 w-3/4 rounded bg-gray-200" />
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
