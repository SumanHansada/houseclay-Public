import Skeleton from "react-loading-skeleton";

export default function PropertyDetailsLoading() {
  return (
    <>
      <section className="flex w-full gap-16 xl:px-28 lg:px-14 md:px-8 px-8">
        <section className="w-3/4">
          {/* Header Section */}
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="py-12 mx-auto">
              <Skeleton height={40} width="80%" />
            </div>
          </section>

          {/* Tabs Section */}
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden">
            <div className="py-0 mx-auto flex">
              <div className="w-full">
                {/* Tab Headers */}
                <div className="flex justify-between items-center border-b mb-6">
                  <div className="flex gap-8">
                    <Skeleton width={80} height={40} />
                    <Skeleton width={80} height={40} />
                    <Skeleton width={80} height={40} />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton width={120} height={40} />
                  </div>
                </div>

                {/* Description Section */}
                <section className="py-6">
                  <Skeleton height={32} width={200} className="mb-4" />
                  <Skeleton
                    height={20}
                    width="100%"
                    count={3}
                    className="mb-2"
                  />
                  <Skeleton height={20} width={300} />
                </section>

                {/* Property Details Section */}
                <section className="p-6 border rounded-xl shadow-md mb-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton circle height={24} width={24} />
                        <div className="flex flex-col gap-1">
                          <Skeleton height={16} width={120} />
                          <Skeleton height={20} width={80} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Additional Details Section */}
                <section className="py-6 my-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton circle height={28} width={28} />
                        <div className="flex flex-col gap-1">
                          <Skeleton height={16} width={120} />
                          <Skeleton height={20} width={80} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Amenities Section */}
                <section className="py-6 border-b">
                  <Skeleton height={32} width={200} className="mb-4" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton circle height={20} width={20} />
                        <Skeleton height={20} width={120} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Images Section */}
                <section className="py-6">
                  <Skeleton height={32} width={200} className="mb-4" />
                  <div className="flex gap-4 overflow-x-auto">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-shrink-0">
                        <Skeleton
                          height={225}
                          width={300}
                          className="rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
        </section>

        {/* Right Sidebar */}
        <section className="w-1/4">
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="py-12 mx-auto">
              <div className="flex justify-end">
                <Skeleton height={32} width={200} />
              </div>
            </div>
          </section>

          <section>
            <div className="flex py-0 ml-auto justify-end">
              <Skeleton height={40} width={120} />
            </div>
          </section>

          <div className="pt-4">
            <section className="flex flex-wrap gap-2 w-full py-6">
              <div className="flex-col flex-1 px-4 py-2 border rounded-xl">
                <Skeleton height={16} width={80} className="mx-auto mb-2" />
                <Skeleton height={24} width={120} className="mx-auto" />
              </div>
              <div className="flex-col flex-1 px-4 py-2 border rounded-xl">
                <Skeleton height={16} width={80} className="mx-auto mb-2" />
                <Skeleton height={24} width={120} className="mx-auto" />
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
              <div className="relative z-10">
                <Skeleton height={100} width={100} className="mb-4" />
                <Skeleton height={32} width="80%" className="mb-2" />
                <Skeleton height={20} width="100%" count={2} className="mb-4" />
                <div className="flex flex-col gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton circle height={20} width={20} />
                      <Skeleton height={20} width={150} />
                    </div>
                  ))}
                </div>
                <Skeleton height={48} width="100%" className="mt-4" />
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
