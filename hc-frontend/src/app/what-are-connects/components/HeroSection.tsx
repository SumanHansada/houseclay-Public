import Image from "next/image";

import { ImageWithLoader } from "@/utility-components";

const HeroSection = () => (
  <>
    {/* Desktop background */}
    <div className="absolute inset-0 max-md:hidden">
      <ImageWithLoader
        src="/images/banner-what-are-connects.svg"
        alt="Banner Background"
        fill
        className="!object-contain object-center"
        sizes="(min-width:1536px) 1440px, 100vw"
        fetchPriority="high"
        priority
      />
    </div>

    {/* Common + mobile image */}
    <div
      className="flex flex-col justify-center px-6 py-6 gap-2
                    md:absolute md:h-full md:pl-8 lg:pl-14 xl:pl-40
                    md:w-3/5 lg:w-7/12 xl:w-7/12 w-full"
    >
      <div>
        <h1 className="font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          Say Goodbye to Subscriptions.
        </h1>
        <h1 className="font-medium md:font-normal text-gray-800 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl">
          Say Hello to Connects.
        </h1>
      </div>

      <Image
        src="/images/banner-what-are-connects-mobile.svg"
        alt="Property Graphic"
        width={500}
        height={500}
        className="w-full md:hidden"
      />
    </div>
  </>
);

export default HeroSection;
