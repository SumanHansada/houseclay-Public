import bannerBackground from "public/images/banner-background.webp";
import ImageWithLoader from "@/components/common/ImageWithLoader";

const HeroSection = () => {
  return (
    <>
      <div className="absolute inset-0">
        <ImageWithLoader
          // TODO: replace this banner with the what are connects banner after it is fixed in figma
          src={bannerBackground.src}
          alt="Banner Background"
          fill
          className="object-cover object-right"
          sizes="100vw"
          fetchPriority="high"
          priority
        />
      </div>
      <div className="absolute h-full flex flex-col justify-center xl:pl-40 lg:pl-14 pl-14 xl:w-7/12 lg:w-7/12 md:w-4/5 w-4/5">
        {/* Headings */}
        <div className="mb-8">
          <h1 className="xl:text-6xl lg:text-5xl text-5xl font-bold text-gray-900 mb-2">
            Say Goodbye to Subscriptions.
          </h1>
          <h2 className="xl:text-5xl lg:text-4xl text-4xl text-gray-800">
            Say Hello to Connects.
          </h2>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
