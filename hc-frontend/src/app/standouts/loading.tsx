export default function Loading() {
  return (
    <section
      className="w-full h-full max-md:hidden animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-labelledby="standouts-loading-title"
    >
      <h1 id="standouts-loading-title" className="sr-only">
        Loading standouts
      </h1>
      <section className="relative w-full md:aspect-[15/4]">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="h-full w-full bg-neutral-200" />
        </div>
        <div className="absolute flex items-center pl-14 h-full xl:pl-40 w-1/4 lg:w-1/3 xl:w-2/5">
          <div className="h-10 w-48 bg-neutral-100/70 rounded" />
        </div>
      </section>
    </section>
  );
}
