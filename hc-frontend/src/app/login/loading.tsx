export default function LoginLoading() {
  return (
    <>
      <div className="flex w-full h-full top-14">
        {/* Left side image skeleton */}
        <div className="left-0 top-14 bottom-0 w-1/3 fixed bg-gray-50 max-md:hidden">
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        </div>

        {/* Right side content skeleton */}
        <div className="container right-0 ml-[33.33%] max-md:ml-auto top-14 py-20 mx-auto relative xl:px-28 lg:px-14 md:px-8 px-6 h-full flex justify-center">
          <div className="flex flex-col h-full justify-center gap-8 w-full max-w-md animate-pulse">
            {/* Phone number label + input */}
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-4 w-32 rounded-full bg-gray-200" />
              <div className="h-10 w-full rounded-lg bg-gray-200" />
            </div>

            {/* Terms checkbox + text */}
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded-full bg-gray-200" />
            </div>

            {/* Login button + helper text */}
            <div className="flex flex-col items-center gap-3 w-full animate-pulse">
              <div className="h-11 w-full rounded-md bg-gray-200" />
              <div className="h-4 w-2/3 rounded-full bg-gray-200" />
            </div>

            {/* Shield / trust text */}
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="h-4 w-4/5 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
