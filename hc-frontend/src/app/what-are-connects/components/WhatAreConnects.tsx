import Image from "next/image";

const WhatAreConnects = () => {
  return (
    <>
      <div className="flex items-center justify-evenly lg:gap-10 xl:px-28 lg:px-14 md:px-14 px-8 md:py-20 pt-6">
        <div className="w-2/5 max-md:hidden">
          <Image
            // TODO: replace this image with the what are connects image after it is fixed in figma
            src="/images/why-choose-connects.svg"
            alt="Property Graphic"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-3/5 xl:px-10 lg:px-6 flex flex-col lg:gap-6 md:gap-4 gap-2">
          <h1 className="xl:text-5xl lg:text-4xl sm:text-3xl text-2xl md:font-bold font-medium">
            What Are Connects?
          </h1>
          <div className="md:text-gray-800 text-gray-600 md:font-light sm:text-xl text-lg lg:space-y-6 sm:space-y-2 md:leading-relaxed leading-7 md:p-2">
            <p>
              Connects are a smarter way to access property services without the
              commitment of a subscription. Whether you&apos;re looking to
              contact a verified owner, create a rent agreement, or avail
              additional property-related services, Connects give you complete
              flexibility.
            </p>
            <p>
              Use them only when needed, ensuring a cost-effective and
              hassle-free experience. Say goodbye to recurring fees and hello to
              a pay-as-you-go model designed for your convenience!
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/6 md:hidden ml-auto mr-8">
        <Image
          src="/icons/coin-stack.svg"
          alt="Property Graphic"
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};

export default WhatAreConnects;
