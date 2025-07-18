import Image from "next/image";

const WhatAreConnects = () => {
  return (
    <div className="flex items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-14 px-8 py-20">
      <div className="w-2/5">
        <Image
          // TODO: replace this image with the what are connects image after it is fixed in figma
          src="/images/why-choose-connects.svg"
          alt="Property Graphic"
          width={500}
          height={500}
          className="w-full h-full object-cover max-xl:hidden"
        />
      </div>
      <div className="w-1/2 px-12 flex flex-col gap-6">
        <h1 className="text-5xl font-bold">What Are Connects?</h1>
        <div className="text-gray-800 font-light text-xl space-y-6 leading-relaxed p-2">
          <p>
            Connects are a smarter way to access property services without the
            commitment of a subscription. Whether you're looking to contact a
            verified owner, create a rent agreement, or avail additional
            property-related services, Connects give you complete flexibility.
          </p>
          <p>
            Use them only when needed, ensuring a cost-effective and hassle-free
            experience. Say goodbye to recurring fees and hello to a
            pay-as-you-go model designed for your convenience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatAreConnects;
