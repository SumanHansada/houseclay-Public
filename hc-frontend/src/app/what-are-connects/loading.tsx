function TextLines({
  lines = 3,
  base = 85,
  step = 8,
}: {
  lines?: number;
  base?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-neutral-200"
          style={{ width: `${Math.max(20, base - i * step)}%` }}
        />
      ))}
    </div>
  );
}

function CardList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <article
          key={i}
          className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm"
          aria-label={`Loading card ${i + 1}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-11 w-11 rounded-full bg-neutral-200" />
            <div className="h-[18px] w-[40%] rounded bg-neutral-200" />
          </div>
          <TextLines lines={3} />
        </article>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <>
      {/* Mobile header skeleton (matches <MobileHeader /> height) */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-gray-200 shadow-sm bg-white md:hidden">
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
      {/* Spacer below fixed header (mobile) */}
      <div className="md:hidden h-14 border-b border-gray-200 shadow-sm" />

      <section
        className="w-full animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="connects-loading-title"
      >
        <h1 id="connects-loading-title" className="sr-only">
          Loading Connects page
        </h1>

        {/* Hero Section */}
        <section
          className="relative w-full overflow-hidden"
          aria-labelledby="hero-loading"
        >
          <h2 id="hero-loading" className="sr-only">
            Hero banner
          </h2>
          <div className="h-[220px] md:h-[500px] xl:h-[600px] bg-neutral-200" />
          {/* Optional hero text hint (desktop only) */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
            <div className="w-1/2 text-center space-y-3">
              <div className="h-8 w-[70%] mx-auto rounded bg-neutral-100/70" />
              <div className="h-4 w-[60%] mx-auto rounded bg-neutral-100/70" />
            </div>
          </div>
        </section>

        {/* What are connects? */}
        <section className="w-full" aria-labelledby="what-heading">
          <h2 id="what-heading" className="sr-only">
            What are Connects
          </h2>
          <div className="container mx-auto xl:px-28 lg:px-14 md:px-8 px-8 py-10 md:py-14">
            <div className="text-center mb-8 md:mb-12">
              <div className="h-7 w-[40%] mx-auto mb-3 rounded bg-neutral-200" />
              <div className="h-4 w-[70%] mx-auto rounded bg-neutral-200" />
            </div>
            <div className="mx-auto xl:w-1/2 lg:w-2/3 md:w-3/4">
              <TextLines lines={4} />
            </div>
          </div>
        </section>

        {/* How can you use connects? */}
        <section className="w-full" aria-labelledby="how-heading">
          <h2 id="how-heading" className="sr-only">
            How to use Connects
          </h2>
          <div className="container mx-auto xl:px-28 lg:px-14 md:px-8 px-8 py-10 md:py-14">
            <div className="mb-8 md:mb-12">
              <div className="h-6 w-[35%] mb-2 rounded bg-neutral-200" />
              <div className="h-4 w-[55%] rounded bg-neutral-200" />
            </div>
            <CardList count={4} />
          </div>
        </section>

        {/* Why choose connects? */}
        <section className="w-full" aria-labelledby="why-heading">
          <h2 id="why-heading" className="sr-only">
            Why choose Connects
          </h2>
          <div className="container mx-auto xl:px-28 lg:px-14 md:px-8 px-8 py-10 md:py-14">
            <div className="mb-8 md:mb-12">
              <div className="h-6 w-[30%] mb-2 rounded bg-neutral-200" />
              <div className="h-4 w-[50%] rounded bg-neutral-200" />
            </div>
            <CardList count={6} />
          </div>
        </section>

        {/* Fixed mobile CTA skeleton (matches ConnectsMobileFooter) */}
        <footer
          className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-sm"
          aria-labelledby="mobile-cta-loading"
        >
          <h2 id="mobile-cta-loading" className="sr-only">
            Mobile call to action
          </h2>
          <div className="flex items-center justify-end px-4 py-3">
            <div className="h-10 w-1/2 rounded-lg bg-neutral-200" />
          </div>
        </footer>
        {/* Spacer above fixed mobile CTA so content doesn't hide behind it */}
        <div className="md:hidden h-[64px]" />

        {/* SR-only fallback text */}
        <p className="sr-only">Loading…</p>
      </section>
    </>
  );
}
