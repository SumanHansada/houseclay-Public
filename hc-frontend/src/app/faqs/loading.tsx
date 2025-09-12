import Skeleton from "react-loading-skeleton";
import { default as ACCORDION_DATA } from "@/data/SupportAccordionData.json";

const COUNT =
  Array.isArray(ACCORDION_DATA) && ACCORDION_DATA.length > 0
    ? ACCORDION_DATA.length
    : 5;

const widths = [72, 64, 80, 58, 70];

export default function Loading() {
  return (
    <>
      {/* Mobile header */}
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

      <section className="space-y-12 md:space-y-24 xl:w-1/2 lg:w-2/3 md:w-3/4 md:py-20 max-md:px-8 pb-16 pt-12">
        {/* Desktop hero */}
        <div className="mx-auto w-11/12 text-center max-md:hidden">
          <Skeleton height={40} width={360} className="mx-auto mb-6" />
          <Skeleton height={20} width={"80%"} className="mx-auto" />
        </div>

        {/* Mobile intro text */}
        <div className="mx-auto w-11/12 text-center md:hidden">
          <Skeleton height={16} width={"90%"} className="mx-auto" />
        </div>

        {/* Accordion list */}
        <div className="flex flex-col gap-5">
          {Array.from({ length: COUNT }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border shadow-sm md:text-xl py-3 md:py-6 px-4 md:px-8"
            >
              <div className="flex justify-between items-center">
                <div className="pr-4 w-full">
                  <Skeleton
                    height={20}
                    width={`${widths[i % widths.length]}%`}
                  />
                </div>
                <Skeleton circle width={32} height={32} />
              </div>

              {/* Collapsible body placeholder */}
              <div className="mt-3 md:mt-4">
                <Skeleton height={14} width={"90%"} className="mb-2" />
                <Skeleton height={14} width={"75%"} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop footer placeholder */}
      <div className="max-md:hidden">
        <div className="border-t border-gray-200 py-10 px-8">
          <div className="container mx-auto flex items-center justify-between gap-6">
            <Skeleton height={20} width={"30%"} />
            <Skeleton height={20} width={"20%"} />
          </div>
        </div>
      </div>
    </>
  );
}
