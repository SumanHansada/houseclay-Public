import Skeleton from "react-loading-skeleton";

export default function ListPropertyLoading() {
  return (
    <>
      <section className="md:hidden">
        <div className="flex flex-col items-start justify-around min-h-[calc(100svh-55px)] bg-white px-8 pt-4 pb-2 gap-8 w-full mx-auto">
          <Skeleton height={32} width={220} className="mb-4 mt-2" />
          <div className="flex flex-col gap-6 w-full mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton circle height={48} width={48} />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton height={20} width={120} />
                  <Skeleton height={14} width={180} />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full mx-auto mt-auto">
            <div className="flex items-center bg-green-100 rounded-lg p-4 gap-4 mb-8">
              <Skeleton height={24} width={60} />
              <Skeleton height={14} width={180} />
            </div>
            <Skeleton height={48} width={340} className="rounded-lg" />
          </div>
        </div>
      </section>
      <section className="xl:min-h-[500px] min-h-[400px] w-full overflow-hidden max-md:hidden">
        <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 flex justify-between gap-16">
          <div className="flex xl:hidden w-2/5 justify-around items-start ">
            <Skeleton height={250} width={275} />
          </div>
          <div className="hidden xl:flex w-2/5 justify-around items-start">
            <Skeleton height={475} width={550} />
          </div>
          <div className="flex w-3/5 justify-end items-start">
            <div className="max-w-lg xl:max-w-xl lg:w-full my-0 flex flex-col gap-8">
              <Skeleton height={60} width="100%" />
              <Skeleton height={60} width="100%" />
              <Skeleton height={40} width="100%" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container py-8 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
          <div className="flex justify-around items-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton circle width={48} height={48} />
                <Skeleton width={160} height={24} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
          <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm flex items-center w-full justify-between gap-16">
            <Skeleton width={150} height={150} />
            <div className="flex flex-col w-1/2 gap-4">
              <Skeleton height={30} width="80%" />
              <Skeleton height={20} width="100%" />
              <Skeleton height={45} width={200} />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
          <div className="flex justify-around items-center gap-16">
            <div className="flex flex-col w-1/2 gap-4">
              <Skeleton height={32} width="80%" />
              <Skeleton height={20} width="100%" />
            </div>
            <div className="flex w-1/2 justify-center">
              <Skeleton height={250} width="100%" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container mx-auto flex flex-col items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-8 px-8 py-12">
          <Skeleton height={32} width="60%" />
          <Skeleton height={20} width="80%" />
          <div className="flex flex-wrap xl:gap-12 lg:gap-6 gap-6 justify-between w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3 py-6 justify-between items-center gap-4"
              >
                <Skeleton circle height={150} width={150} />
                <Skeleton height={24} width="60%" />
                <Skeleton height={16} width="80%" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
