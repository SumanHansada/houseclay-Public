import { SvgIcon } from "@/utility-components";

const WhatAreConnects = () => {
  return (
    <>
      <div className="flex items-center justify-evenly lg:gap-10 xl:px-28 lg:px-14 md:px-14 px-6 md:py-20 pt-6">
        <div className="w-2/5 max-md:hidden">
          <SvgIcon iconSize="large" name="what-are-connects" size={500} />
        </div>
        <div className="w-full md:w-3/5 xl:px-10 lg:px-6 flex flex-col lg:gap-6 md:gap-4 gap-2">
          <h1 className="text-2xl md:text-4xl md:font-bold font-medium md:p-2">
            What Are Connects?
          </h1>
          <div className="md:text-gray-800 text-gray-600 md:font-light lg:text-xl text-lg lg:space-y-6 sm:space-y-2 md:leading-relaxed leading-7 md:p-2">
            <p className="max-md:text-base">
              Connects are a smarter way to access property services without the
              commitment of a subscription. Whether you&apos;re looking to
              contact a verified owner, create a rent agreement, or avail
              additional property-related services, Connects give you complete
              flexibility.
            </p>
            <p className="max-md:text-base">
              Use them only when needed, ensuring a cost-effective and
              hassle-free experience. Say goodbye to recurring fees and hello to
              a pay-as-you-go model designed for your convenience!
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/6 md:hidden ml-auto mr-8">
        <SvgIcon iconSize="large" name="coin-stack" size={100} />
      </div>
    </>
  );
};

export default WhatAreConnects;
