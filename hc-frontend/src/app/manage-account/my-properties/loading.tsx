function Bar({
  w = "100%",
  h = 16,
  className = "",
}: {
  w?: string;
  h?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded bg-gray-200 ${className}`}
      style={{ width: w, height: h }}
    />
  );
}

export default function Loading() {
  return (
    <section
      className="animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-labelledby="props-loading-title"
    >
      <h1 id="props-loading-title" className="sr-only">
        Loading My Properties
      </h1>

      {/* ---------- Desktop ---------- */}
      <section className="max-md:hidden" aria-labelledby="desktop-loading">
        <h2 id="desktop-loading" className="sr-only">
          Desktop layout
        </h2>

        {/* Header row: title + "Only Active" toggle */}
        <div className="mb-8 flex items-center justify-between border-b-2 pb-2">
          <Bar w="12rem" h={32} />
          <div className="flex items-center gap-2">
            <Bar w="20px" h={20} className="rounded-sm" />
            <Bar w="8rem" h={28} />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="mb-8 flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bar key={i} w="6rem" h={40} className="rounded-lg" />
          ))}
        </div>
      </section>

      {/* ---------- Mobile ---------- */}
      <section className="md:hidden" aria-labelledby="mobile-loading">
        <h2 id="mobile-loading" className="sr-only">
          Mobile layout
        </h2>

        {/* MobileHeader (55px) */}
        <header className="fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex items-center px-4">
          <Bar w="9rem" h={22} />
        </header>
        {/* Spacer under fixed header */}
        <div className="h-[55px]" />

        {/* Filters container */}
        <div className="mx-8 m-3 flex rounded-xl border p-1.5 sm:p-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bar key={i} w="100%" h={32} className="mx-1 rounded-lg" />
          ))}
        </div>
      </section>

      {/* ---------- Table skeleton for ≥ 2xl ---------- */}
      <div className="max-2xl:hidden">
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
              ].map((h) => (
                <Bar key={h} w="6rem" h={16} />
              ))}
            </div>

            {/* Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,0.6fr] items-center gap-2 px-6 py-4 border-b"
              >
                <Bar w="16rem" h={16} />
                <Bar w="4rem" h={16} />
                <Bar w="6rem" h={16} />
                <Bar w="7rem" h={16} />
                <Bar w="5rem" h={16} />
                <Bar w="6rem" h={24} />
                <Bar w="2rem" h={32} className="mx-auto rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Card list skeleton for < 2xl ---------- */}
      <div className="2xl:hidden max-md:px-6 pt-4 pb-16">
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, g) => (
            <div key={g} className="space-y-4">
              {/* Date group title */}
              <Bar w="7rem" h={20} />

              <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-white p-4 shadow-sm space-y-3"
                  >
                    <Bar w="60%" h={20} />
                    <div className="flex gap-3">
                      <Bar w="5rem" h={16} />
                      <Bar w="6rem" h={16} />
                      <Bar w="7rem" h={16} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Bar w="6rem" h={16} />
                      <Bar w="5rem" h={24} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Bar w="7rem" h={36} className="rounded-md" />
                      <Bar w="9rem" h={36} className="rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
