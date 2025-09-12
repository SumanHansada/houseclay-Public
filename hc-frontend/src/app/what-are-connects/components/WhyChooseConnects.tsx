import { SvgIcon } from "@/utility-components";
import { useRouter } from "next/navigation";
const WhyChoose = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between lg:gap-10 xl:px-28 lg:px-14 md:px-14 px-6 md:py-20 py-5 pb-16">
      <div className="w-full md:w-3/5 lg:px-12 md:px-4">
        <h1 className="mb-2 md:mb-4 xl:text-5xl lg:text-4xl sm:text-3xl text-2xl md:font-bold font-medium">
          Why Choose Connects?
        </h1>
        <p className="mb-4 md:mb-8 lg:3/4 md:w-4/5 p-1 md:text-gray-800 text-gray-600 md:font-light lg:text-xl text-lg">
          Enjoy a hassle-free, pay-as-you-go model with no subscriptions—just
          access what you need, when you need it.
        </p>
        <div className="flex max-md:mb-6 items-center">
          <div className="md:hidden w-1/2 flex justify-center">
            <SvgIcon iconSize="large" name="why-choose-connects" size={200} />
          </div>
          <div className="space-y-4 lg:space-y-10 sm:space-y-6 lg:px-8 md:px-4 text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-2 max-md:w-1/2">
            <div className="flex md:gap-4 gap-1 items-center">
              <SvgIcon
                iconSize="small"
                name="real-owners"
                size={45}
                color="#ef4444"
                className="scale-90 md:scale-100 xl:scale-125"
              />
              <span>Real Owners</span>
            </div>
            <div className="flex md:gap-4 gap-1 items-center">
              <SvgIcon
                iconSize="small"
                name="instant-access"
                size={45}
                color="#ef4444"
                className="scale-90 md:scale-100 xl:scale-125"
              />
              <span>Instant Access</span>
            </div>
            <div className="flex md:gap-4 gap-1 items-center">
              <SvgIcon
                iconSize="medium"
                name="no-forced-plans"
                size={45}
                // className="text-red-500"
                color="#ef4444"
                className="scale-90 md:scale-100 xl:scale-125"
              />
              <span>No Forced Plans</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 xl:gap-3 items-center px-2">
          <button
            className="bg-red-500 text-white text-lg xl:px-6  lg:px-5 lg:py-3 px-3 py-2 rounded-xl size-fit max-md:hidden"
            onClick={() => router.push("/buy-connects")}
          >
            Buy Connects Now
          </button>
          <div className="size-32 max-md:hidden">
            <SvgIcon
              iconSize="small"
              name="curly-arrow"
              size={125}
              color="#ef4444"
              className="scale-90 md:scale-100 xl:scale-110"
            />
          </div>
        </div>
      </div>
      <div className="w-2/5 max-md:hidden">
        <SvgIcon iconSize="large" name="why-choose-connects" size={500} />
      </div>
    </div>
  );
};

export default WhyChoose;
