export default function Loading() {
  return (
    <main>
      {/* Desktop header skeleton */}
      <section className="max-md:hidden">
        <div className="mb-8 flex items-center justify-between border-b-2 pb-2">
          <div className="h-8 w-48 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-8 w-40 rounded-md bg-gray-200 animate-pulse" />
        </div>

        {/* Filter buttons skeleton */}
        <div className="mb-8 flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </section>

      {/* Mobile header + filters skeleton */}
      <section className="md:hidden">
        <div className="mx-8 my-4 h-7 w-40 rounded-md bg-gray-200 animate-pulse" />
        <div className="mx-8 m-3 flex rounded-xl border p-1.5 sm:p-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="mx-1 h-8 flex-1 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </section>

      {/* Table skeleton for ≥ 2xl (matches your visibility rules) */}
      <div className="max-2xl:hidden">
        <TableSkeleton rows={8} />
      </div>

      {/* Card list skeleton for < 2xl */}
      <div className="2xl:hidden max-md:px-6 pt-4 pb-16">
        <CardListSkeleton groups={3} cardsPerGroup={3} />
      </div>
    </main>
  );
}

/* ------------------------ helpers ------------------------ */

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="bg-white overflow-x-auto 2xl:overflow-visible rounded-xl border">
      <div className="min-w-[1100px]">
        {/* Header */}
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,0.6fr] px-6 py-3 border-b text-sm">
          {[
            "Property",
            "Type",
            "Price",
            "Listed on",
            "Built-up",
            "Status",
            "Action",
          ].map((label) => (
            <div
              key={label}
              className="h-4 w-24 rounded bg-gray-200 animate-pulse"
            />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,0.6fr] items-center gap-2 px-6 py-4 border-b"
          >
            {/* Property */}
            <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
            {/* Type */}
            <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
            {/* Price */}
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            {/* Listed on */}
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            {/* Built-up */}
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            {/* Status */}
            <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
            {/* Action */}
            <div className="mx-auto h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardListSkeleton({
  groups = 3,
  cardsPerGroup = 3,
}: {
  groups?: number;
  cardsPerGroup?: number;
}) {
  return (
    <div className="space-y-8">
      {Array.from({ length: groups }).map((_, g) => (
        <div key={g} className="space-y-4">
          {/* Date group title */}
          <div className="h-5 w-28 rounded bg-gray-200 animate-pulse" />

          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: cardsPerGroup }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white p-4 shadow-sm space-y-3"
              >
                {/* Title line */}
                <div className="h-5 w-3/5 rounded bg-gray-200 animate-pulse" />
                {/* Meta lines */}
                <div className="flex gap-3">
                  <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
                </div>
                {/* Price / status row */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  <div className="h-6 w-20 rounded bg-gray-200 animate-pulse" />
                </div>
                {/* Action row */}
                <div className="flex justify-end gap-2">
                  <div className="h-9 w-28 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-9 w-36 rounded-md bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
