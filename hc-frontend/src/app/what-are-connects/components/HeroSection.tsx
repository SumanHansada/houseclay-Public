import { ImageWithLoader } from "@/utility-components";

const HeroSection = () => (
  <>
    {/* Desktop background */}
    <div className="absolute inset-0 max-md:hidden">
      <ImageWithLoader
        src="/images/banner-what-are-connects.webp"
        alt="Banner Background"
        fill
        className="object-center"
        sizes="100vw"
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
        <h1 className="font-bold text-gray-900 text-xl md:text-3xl xl:text-6xl">
          Say Goodbye to Subscriptions.
        </h1>
        <h1 className="font-medium md:font-normal text-gray-800 text-xl md:text-3xl xl:text-6xl">
          Say Hello to Connects.
        </h1>
      </div>

      <div className="relative aspect-[16/9] md:hidden rounded-xl shadow-lg overflow-hidden">
        <ImageWithLoader
          src="/images/banner-what-are-connects-mobile.webp"
          alt="What are connects"
          fill
          className="object-center rounded-xl shadow-lg"
          sizes="100vw"
        />
      </div>
    </div>
  </>
);

export default HeroSection;
