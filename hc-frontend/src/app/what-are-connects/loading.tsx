import Skeleton from "react-loading-skeleton";

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
        <Skeleton key={i} height={16} width={`${base - i * step}%`} />
      ))}
    </div>
  );
}

function CardList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <Skeleton circle width={44} height={44} />
            <Skeleton width={"40%"} height={18} />
          </div>
          <TextLines lines={3} />
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <>
      {/* Mobile header skeleton (to match <MobileHeader /> height) */}
      <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white md:hidden">
        <div className="flex items-center h-full px-4 gap-2">
          <div className="shrink-0 w-10 h-10 grid place-items-center">
            <Skeleton circle width={36} height={36} />
          </div>
          <div className="flex-1 px-2">
            <Skeleton height={20} width={180} className="mx-auto" />
          </div>
          <div className="shrink-0 w-10 h-10" />
        </div>
      </header>
      {/* Spacer below fixed header (mobile) */}
      <div className="md:hidden h-[55px]" />

      <div className="w-full">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden">
          <div className="h-[220px] md:h-[500px] xl:h-[600px]">
            <Skeleton height="100%" />
          </div>
          {/* Optional hero text hint */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none max-md:hidden">
            <div className="w-1/2 text-center space-y-3">
              <Skeleton height={32} width={"70%"} className="mx-auto" />
              <Skeleton height={18} width={"60%"} className="mx-auto" />
            </div>
          </div>
        </section>

        {/* What are connects? */}
        <section className="w-full">
          <div className="container mx-auto xl:px-28 lg:px-14 md:px-8 px-8 py-10 md:py-14">
            <div className="text-center mb-8 md:mb-12">
              <Skeleton height={28} width={"40%"} className="mx-auto mb-3" />
              <Skeleton height={16} width={"70%"} className="mx-auto" />
            </div>
            <div className="mx-auto xl:w-1/2 lg:w-2/3 md:w-3/4">
              <TextLines lines={4} />
            </div>
          </div>
        </section>

        {/* How can you use connects? */}
        <section className="w-full">
          <div className="container mx-auto xl:px-28 lg:px-14 md:px-8 px-8 py-10 md:py-14">
            <div className="mb-8 md:mb-12">
              <Skeleton height={26} width={"35%"} className="mb-2" />
              <Skeleton height={16} width={"55%"} />
            </div>
            <CardList count={4} />
          </div>
        </section>

        {/* Why choose connects? */}
        <section className="w-full">
          <div className="container mx-auto xl:px-28 lg:px-14 md:px-8 px-8 py-10 md:py-14">
            <div className="mb-8 md:mb-12">
              <Skeleton height={26} width={"30%"} className="mb-2" />
              <Skeleton height={16} width={"50%"} />
            </div>
            <CardList count={6} />
          </div>
        </section>

        {/* Desktop footer: render real footer later, skeleton not needed */}
      </div>

      {/* Fixed mobile CTA skeleton (matches ConnectsMobileFooter) */}
      <footer className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-sm">
        <div className="flex items-center justify-end px-4 py-3">
          <Skeleton width={"50%"} height={40} borderRadius={8} />
        </div>
      </footer>
      {/* Spacer above fixed mobile CTA so content doesn't hide behind it */}
      <div className="md:hidden h-[64px]" />
    </>
  );
}
