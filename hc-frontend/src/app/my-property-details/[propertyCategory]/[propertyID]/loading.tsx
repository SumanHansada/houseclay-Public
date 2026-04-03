export default function PropertyDetailsLoading() {
  return (
    <>
      <section className="flex w-full gap-16 xl:px-24 lg:px-12 md:px-8 px-4">
        <section className="w-3/4 max-md:w-full">
          {/* Header Section */}
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="py-12 mx-auto animate-pulse">
              <div className="h-10 w-4/5 bg-gray-300 rounded" />
            </div>
          </section>

          {/* Tabs + Content Section */}
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden">
            <div className="py-0 mx-auto flex">
              <div className="w-full">
                {/* Tab Headers */}
                <div className="flex justify-between items-center border-b mb-6 animate-pulse">
                  <div className="flex gap-2 max-md:w-full max-md:justify-between max-md:border max-md:rounded-lg max-md:p-2">
                    <div className="h-10 w-20 bg-gray-300 rounded" />
                    <div className="h-10 w-24 bg-gray-300 rounded" />
                    <div className="h-10 w-28 bg-gray-300 rounded" />
                  </div>
                  <div className="hidden md:flex gap-2">
                    <div className="h-10 w-28 bg-gray-300 rounded" />
                  </div>
                </div>

                {/* Description Section */}
                <section className="py-6 animate-pulse">
                  <div className="h-8 w-48 bg-gray-300 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-5 w-full bg-gray-300 rounded" />
                    <div className="h-5 w-11/12 bg-gray-300 rounded" />
                    <div className="h-5 w-10/12 bg-gray-300 rounded" />
                  </div>
                  <div className="h-5 w-72 bg-gray-300 rounded mt-3" />
                </section>

                {/* Property Details Section */}
                <section className="p-6 border rounded-xl shadow-md mb-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex w-full justify-start items-start gap-2 text-gray-600 animate-pulse"
                      >
                        <div className="h-6 w-6 bg-gray-300 rounded-full" />
                        <div className="flex flex-col gap-1 w-2/3">
                          <div className="h-4 w-24 bg-gray-300 rounded" />
                          <div className="h-5 w-20 bg-gray-300 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Additional Details Section */}
                <section className="py-6 my-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex w-full justify-start items-start gap-2 text-gray-600 animate-pulse"
                      >
                        <div className="h-7 w-7 bg-gray-300 rounded-full" />
                        <div className="flex flex-col gap-1 w-2/3">
                          <div className="h-4 w-28 bg-gray-300 rounded" />
                          <div className="h-5 w-24 bg-gray-300 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Amenities Section */}
                <section className="py-6">
                  <div className="h-8 w-48 bg-gray-300 rounded mb-4 animate-pulse" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 animate-pulse"
                      >
                        <div className="h-5 w-5 bg-gray-300 rounded-full" />
                        <div className="h-5 w-28 bg-gray-300 rounded" />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Images Section */}
                <section className="py-6">
                  <div className="h-8 w-48 bg-gray-300 rounded mb-4 animate-pulse" />
                  <div className="flex gap-4 overflow-x-auto">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-[300px] aspect-[4/3] bg-gray-300 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
        </section>

        {/* Right Sidebar */}
        <section className="w-1/4 max-md:hidden">
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden">
            <div className="py-12 mx-auto">
              <div className="flex justify-end animate-pulse">
                <div className="h-8 w-52 bg-gray-300 rounded" />
              </div>
            </div>

            <section>
              <div className="flex py-0 ml-auto justify-end animate-pulse">
                <div className="h-10 w-32 bg-gray-300 rounded" />
              </div>
            </section>

            <div className="pt-4">
              <section className="flex flex-wrap gap-2 w-full py-6">
                <div className="flex-col flex-1 px-4 py-2 border rounded-xl animate-pulse">
                  <div className="h-4 w-20 bg-gray-300 rounded mx-auto mb-2" />
                  <div className="h-6 w-28 bg-gray-300 rounded mx-auto" />
                </div>
                <div className="flex-col flex-1 px-4 py-2 border rounded-xl animate-pulse">
                  <div className="h-4 w-20 bg-gray-300 rounded mx-auto mb-2" />
                  <div className="h-6 w-28 bg-gray-300 rounded mx-auto" />
                </div>
              </section>
            </div>

            <div>
              <div
                className="relative p-6 mb-6 rounded-xl border bg-white overflow-hidden flex flex-col gap-4"
                style={{ minHeight: 360 }}
              >
                <div
                  className="absolute right-0 top-0 w-full h-full"
                  style={{
                    background:
                      "radial-gradient(circle at 75% 0%, #FFCFEC 0%, #FFFAD2 40%, #FFFFFF 50%, rgba(255,255,255,1) 100%)",
                    zIndex: 0,
                  }}
                />
                <div className="relative z-10 animate-pulse">
                  <div className="h-24 w-24 bg-gray-300 rounded mb-4" />
                  <div className="h-8 w-4/5 bg-gray-300 rounded mb-2" />
                  <div className="space-y-2 mb-4">
                    <div className="h-5 w-full bg-gray-300 rounded" />
                    <div className="h-5 w-11/12 bg-gray-300 rounded" />
                  </div>
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-gray-300 rounded-full" />
                        <div className="h-5 w-36 bg-gray-300 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="h-12 w-full bg-gray-300 rounded mt-4" />
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </>
  );
}
