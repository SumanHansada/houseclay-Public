export default function ListPropertyLoading() {
  return (
    <>
      <section className="md:hidden">
        <div className="flex flex-col items-start justify-around bg-white px-8 pt-4 pb-2 gap-8 w-full mx-auto animate-pulse">
          <div className="h-8 w-56 rounded-full bg-gray-200 mb-4 mt-2" />
          <div className="flex flex-col gap-6 w-full mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-5 w-32 rounded-full bg-gray-200" />
                  <div className="h-3.5 w-44 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full mx-auto mt-auto">
            <div className="flex items-center bg-green-100 rounded-lg p-4 gap-4 mb-4">
              <div className="h-6 w-16 rounded-full bg-green-200" />
              <div className="h-3.5 flex-1 rounded-full bg-green-200" />
            </div>
            <div className="h-12 w-full rounded-lg bg-gray-200" />
          </div>
        </div>
      </section>
      <section className="xl:min-h-[500px] min-h-[400px] w-full overflow-hidden max-md:hidden">
        <div className="container pt-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 flex justify-between gap-16 animate-pulse">
          <div className="flex xl:hidden w-2/5 justify-around items-start">
            <div className="h-[250px] w-[275px] rounded-3xl bg-gray-200" />
          </div>
          <div className="hidden xl:flex w-2/5 justify-around items-start">
            <div className="h-[475px] w-[550px] rounded-3xl bg-gray-200" />
          </div>
          <div className="flex w-3/5 items-start">
            <div className="w-full xl:max-w-xl my-0 flex flex-col gap-8">
              <div className="h-16 w-full rounded-2xl bg-gray-200" />
              <div className="h-16 w-full rounded-2xl bg-gray-200" />
              <div className="h-10 w-full rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container py-0 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 animate-pulse">
          <div className="flex justify-around items-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="h-6 w-40 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container pt-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 animate-pulse">
          <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm flex items-center w-full justify-between gap-16">
            <div className="h-[150px] w-[150px] rounded-2xl bg-gray-200" />
            <div className="flex flex-col w-1/2 gap-4">
              <div className="h-7 w-4/5 rounded-full bg-gray-200" />
              <div className="h-5 w-full rounded-full bg-gray-200" />
              <div className="h-11 w-52 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container pt-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 animate-pulse">
          <div className="flex justify-around items-center gap-16">
            <div className="flex flex-col w-1/2 gap-4">
              <div className="h-8 w-4/5 rounded-full bg-gray-200" />
              <div className="h-5 w-full rounded-full bg-gray-200" />
            </div>
            <div className="flex w-1/2 justify-center">
              <div className="h-[250px] w-full rounded-3xl bg-gray-200" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="container mx-auto flex flex-col items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-8 px-8 py-12 animate-pulse">
          <div className="h-8 w-3/5 rounded-full bg-gray-200" />
          <div className="h-5 w-4/5 rounded-full bg-gray-200" />
          <div className="flex flex-wrap xl:gap-12 lg:gap-6 gap-6 justify-between w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3 py-6 justify-between items-center gap-4"
              >
                <div className="h-[150px] w-[150px] rounded-full bg-gray-200" />
                <div className="h-6 w-3/5 rounded-full bg-gray-200" />
                <div className="h-4 w-4/5 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
