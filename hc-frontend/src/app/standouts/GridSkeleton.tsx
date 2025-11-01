export default function GridSkeleton({
  cardCount = 8,
}: {
  cardCount?: number;
}) {
  return (
    <section
      className="animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading properties"
    >
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
        {Array.from({ length: cardCount }).map((_, i) => (
          <article
            key={i}
            className="rounded-xl border bg-white shadow-sm overflow-hidden"
          >
            <div className="h-44 w-full bg-neutral-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/5 rounded bg-neutral-200" />
              <div className="flex gap-3">
                <div className="h-4 w-20 rounded bg-neutral-200" />
                <div className="h-4 w-24 rounded bg-neutral-200" />
                <div className="h-4 w-28 rounded bg-neutral-200" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded bg-neutral-200" />
                <div className="h-6 w-20 rounded bg-neutral-200" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <div className="h-9 w-28 rounded-md bg-neutral-200" />
                <div className="h-9 w-36 rounded-md bg-neutral-200" />
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="sr-only">Loading…</p>
    </section>
  );
}
