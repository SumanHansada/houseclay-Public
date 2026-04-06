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
        <div className="mx-4 mt-3 mb-4 flex rounded-xl border p-1.5 sm:p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mx-1 h-10 flex-1 rounded-lg bg-gray-200" />
          ))}
        </div>
      </section>

      {/* Card grid (shared) */}
      <section className="space-y-4 overflow-y-auto max-md:px-4 pt-4 pb-16">
        <div className="mx-auto w-full">
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
    <div className="flex-col gap-8 bg-white border border-gray-100 rounded-lg drop-shadow relative animate-pulse">
      <div className="relative h-72 max-md:h-60 mb-4">
        <div className="h-full w-full rounded-xl bg-gray-200" />
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-2/4 mb-2 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 mb-2 bg-gray-200 rounded" />
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-3/5 mb-2 bg-gray-200 rounded" />
        <div className="h-5 w-1/5 mb-2 bg-gray-200 rounded" />
      </div>
      <div className="h-4 w-1/2 mb-2 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-200 rounded" />
    </div>
  );
}
