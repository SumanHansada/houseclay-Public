import Skeleton from "react-loading-skeleton";

function ParagraphBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={16} width={`${85 - i * 8}%`} />
      ))}
    </div>
  );
}

function ListBlock({ items = 4 }: { items?: number }) {
  return (
    <ul className="list-none space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <li key={i} className="flex items-start gap-3">
          <Skeleton circle width={10} height={10} className="mt-2" />
          <Skeleton height={16} width={`${90 - (i % 3) * 12}%`} />
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
        <div className="flex items-center h-full px-6 gap-2">
          <div className="shrink-0 w-10 h-10 grid place-items-center">
            <Skeleton circle width={36} height={36} />
          </div>
          <div className="flex-1 px-2">
            <Skeleton height={20} width={180} className="mx-auto" />
          </div>
          <div className="shrink-0 w-10 h-10" />
        </div>
      </header>

      <section className="w-full">
        {/* Desktop title */}
        <div className="w-full text-center mb-8 max-md:hidden">
          <div className="py-24">
            <Skeleton height={40} width={320} className="mx-auto" />
          </div>
        </div>

        {/* Mobile spacer under fixed header */}
        <div className="md:hidden h-[55px]" />

        <div className="flex flex-col gap-8 xl:w-1/2 lg:w-2/3 md:w-3/4 max-md:px-8 mb-16 pb-5 mx-auto">
          {/* Section 1: heading + paragraph */}
          <div className="space-y-3">
            <Skeleton height={28} width={260} />
            <ParagraphBlock lines={3} />
          </div>

          {/* Section 2: heading + list */}
          <div className="space-y-3">
            <Skeleton height={28} width={220} />
            <ListBlock items={4} />
          </div>

          {/* Section 3: heading + list (short) */}
          <div className="space-y-3">
            <Skeleton height={28} width={240} />
            <ListBlock items={2} />
          </div>

          {/* Section 4: heading + list (longer) */}
          <div className="space-y-3">
            <Skeleton height={28} width={230} />
            <ListBlock items={5} />
          </div>

          {/* Section 5: heading + intro + list */}
          <div className="space-y-3">
            <Skeleton height={28} width={220} />
            <Skeleton height={16} width={140} />
            <ListBlock items={4} />
          </div>

          {/* Section 6: heading + paragraph */}
          <div className="space-y-3">
            <Skeleton height={28} width={230} />
            <ParagraphBlock lines={3} />
          </div>
        </div>
      </section>
    </>
  );
}
