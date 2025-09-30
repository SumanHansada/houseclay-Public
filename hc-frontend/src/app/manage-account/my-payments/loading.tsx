export default function Loading() {
  return (
    <main>
      {/* Desktop header */}
      <section className="max-md:hidden">
        <div className="border-b-2 pb-2 mb-8 flex justify-between">
          <div className="h-8 w-48 rounded-md bg-gray-200 animate-pulse" />
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </section>

      {/* Mobile header + filters */}
      <section className="md:hidden">
        <div className="mx-8 my-4 h-7 w-44 rounded-md bg-gray-200 animate-pulse" />
        <div className="mx-8 m-3 flex rounded-xl border p-1.5 sm:p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="mx-1 h-8 flex-1 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </section>

      {/* Table skeleton for ≥ 2xl */}
      <div className="hidden 2xl:block">
        <PaymentsTableSkeleton rows={8} />
      </div>

      {/* Card list skeleton for < 2xl */}
      <div className="2xl:hidden max-md:px-6 pt-4 pb-16">
        <PaymentsCardListSkeleton groups={3} cardsPerGroup={3} />
      </div>
    </main>
  );
}

/* ------------------------ helpers ------------------------ */

function PaymentsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="bg-white overflow-x-auto 2xl:overflow-visible rounded-xl border">
      <div className="min-w-[900px]">
        {/* Header */}
        <div className="grid grid-cols-[1.2fr,1.6fr,1fr,1fr,1.2fr,0.8fr] px-6 py-3 border-b text-sm">
          {[
            "Type",
            "Date & Time",
            "Connects",
            "Amount",
            "Status",
            "Invoice",
          ].map((h) => (
            <div
              key={h}
              className="h-4 w-24 rounded bg-gray-200 animate-pulse"
            />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1.2fr,1.6fr,1fr,1fr,1.2fr,0.8fr] items-center gap-2 px-6 py-4 border-b"
          >
            {/* Type */}
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            {/* Date & Time */}
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
            {/* Connects */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
            </div>
            {/* Amount */}
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            {/* Status */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            </div>
            {/* Invoice button */}
            <div className="h-9 w-9 rounded-md bg-gray-200 animate-pulse justify-self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsCardListSkeleton({
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
          <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />

          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: cardsPerGroup }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white p-4 shadow-sm space-y-3"
              >
                {/* Header: Type + Amount */}
                <div className="flex items-center justify-between">
                  <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
                  <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
                </div>

                {/* Connects row */}
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-5 w-14 rounded bg-gray-200 animate-pulse" />
                </div>

                {/* Footer: Status + Invoice */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  </div>
                  <div className="h-9 w-40 rounded-md bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Empty state spacer */}
      <div className="hidden text-center py-12 text-gray-500">
        No transactions found
      </div>
    </div>
  );
}
