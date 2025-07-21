import Image from "next/image";
import bannerBackground from "public/images/banner-background.webp";

const HeroSection = () => (
  <>
    {/* Desktop background */}
    <div className="absolute inset-0 hidden md:block">
      <Image
        src={bannerBackground.src}
        alt="Banner Background"
        fill
        sizes="100vw"
        className="object-cover object-right"
        priority
        fetchPriority="high"
      />
    </div>

    {/* Common + mobile image */}
    <div
      className="flex flex-col justify-center px-8 py-6 gap-2
                    md:absolute md:h-full md:pl-8 lg:pl-14 xl:pl-40
                    md:w-3/5 lg:w-7/12 xl:w-7/12 w-full"
    >
      <div>
        <h1 className="font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          Say Goodbye to Subscriptions.
        </h1>
        <h2 className="font-medium md:font-normal text-gray-800 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
          Say Hello to Connects.
        </h2>
      </div>

      <Image
        src="/images/what-are-connects-mobile.svg"
        alt="Property Graphic"
        width={500}
        height={500}
        className="w-full md:hidden"
      />
    </div>
  </>
);

export default HeroSection;
