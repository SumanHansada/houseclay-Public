import Skeleton from "react-loading-skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Masthead Desktop Section Skeleton */}
      <section className="relative xl:h-[600px] lg:h-[500px] h-[500px] w-full overflow-hidden max-md:hidden">
        <Skeleton height="100%" />
      </section>
      {/* Masthead Mobile Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden md:hidden">
        <Skeleton height="100%" />
      </section>
      {/* Advantages Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Skeleton height="100%" />
      </section>
      {/* Standouts Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Skeleton height="100%" />
      </section>
      {/* Neighbourhoods Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden">
        <Skeleton height="100%" />
      </section>
      {/* Testimonials Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden">
        <Skeleton height="100%" />
      </section>
      {/* Property Owners Section Skeleton */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Skeleton height="100%" />
      </section>
      {/* Footer Skeleton */}
      <footer className="min-h-[100px] w-full overflow-hidden">
        <Skeleton height="100%" />
      </footer>
    </>
  );
}
