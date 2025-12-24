function Bar({
  w,
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
      style={{ ...(w ? { width: w } : {}), height: h }}
    />
  );
}

function Pill({
  w, // omit for flexible width (works with flex-1)
  className = "",
}: {
  w?: string;
  className?: string;
}) {
  return <Bar w={w} h={36} className={`rounded-lg ${className}`} />;
}

function Chip({
  w = "5.5rem",
  className = "",
}: {
  w?: string;
  className?: string;
}) {
  return <Bar w={w} h={28} className={`rounded-md ${className}`} />;
}

export default function Loading() {
  return (
    <section
      className="animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-labelledby="req-loading-title"
    >
      <h1 id="req-loading-title" className="sr-only">
        Loading My Requirements
      </h1>

      {/* ---------- Desktop ---------- */}
      <section className="max-md:hidden" aria-labelledby="desktop-loading">
        <h2 id="desktop-loading" className="sr-only">
          Desktop layout
        </h2>

        {/* Header row: title + Edit btn */}
        <div className="mb-8 flex items-center justify-between border-b-2 pb-2">
          <Bar w="12rem" h={28} />
          <Bar w="5.5rem" h={36} className="rounded-lg" />
        </div>

        <div className="space-y-8">
          {/* Who am I (radio pills) */}
          <div className="flex items-center gap-3">
            <Bar w="6.5rem" h={24} />
            <div className="flex gap-2">
              <Pill w="7rem" />
              <Pill w="7rem" />
            </div>
          </div>

          {/* Locations: label + chips + input bar */}
          <div>
            <Bar w="6rem" h={18} className="mb-2" />
            <div className="w-full border rounded-xl p-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Chip key={i} />
                ))}
              </div>
              <Bar w="60%" h={36} className="rounded-lg" />
            </div>
          </div>

          {/* Property Type (checkbox grid w/ icons look) */}
          <div>
            <Bar w="8rem" h={18} className="mb-3" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Bar key={i} h={64} className="rounded-xl" />
              ))}
            </div>
          </div>

          {/* BHK type */}
          <div className="w-4/5 space-y-3">
            <Bar w="6rem" h={18} />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Pill key={i} w="5.5rem" />
              ))}
            </div>
          </div>

          {/* Looking for a room + Preferred Tenants (show generic placeholders) */}
          <div className="w-2/5 space-y-6">
            <div>
              <Bar w="10rem" h={18} className="mb-3" />
              <div className="flex gap-2">
                <Pill w="5.5rem" />
                <Pill w="5.5rem" />
              </div>
            </div>
            <div>
              <Bar w="10rem" h={18} className="mb-3" />
              <div className="grid grid-cols-2 gap-2">
                <Pill />
                <Pill />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="w-fit space-y-3">
            <Bar w="7rem" h={18} />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Pill key={i} w="7rem" />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 border-t-2 pt-4 flex items-center justify-between shadow-sm">
            <Bar w="6.5rem" h={40} className="rounded-lg" />
            <div className="flex gap-6">
              <Bar w="3.5rem" h={24} className="rounded" />
              <Bar w="6.5rem" h={40} className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Mobile ---------- */}
      <section className="md:hidden" aria-labelledby="mobile-loading">
        <h2 id="mobile-loading" className="sr-only">
          Mobile layout
        </h2>

        <div className="px-6 pt-4 pb-16 space-y-6">
          {/* Who am I */}
          <div className="space-y-2">
            <Bar w="5rem" h={20} />
            <div className="border p-2 rounded-xl flex gap-2">
              <Pill className="flex-1" />
              <Pill className="flex-1" />
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-2">
            <Bar w="6rem" h={18} />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Chip key={i} />
              ))}
            </div>
            <Bar w="100%" h={44} className="rounded-xl" />
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Bar w="7rem" h={18} />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Bar key={i} h={56} className="rounded-xl" />
              ))}
            </div>
          </div>

          {/* BHK */}
          <div className="space-y-2">
            <Bar w="6rem" h={18} />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Pill key={i} w="5.5rem" />
              ))}
            </div>
          </div>

          {/* Looking for a room + Preferred Tenants (generic) */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Bar w="10rem" h={18} />
              <div className="border p-2 rounded-xl flex gap-2">
                <Pill className="flex-1" />
                <Pill className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Bar w="10rem" h={18} />
              <div className="grid grid-cols-2 gap-2">
                <Pill />
                <Pill />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Bar w="7rem" h={18} />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Pill key={i} w="7rem" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <p className="sr-only">Loading…</p>
    </section>
  );
}
