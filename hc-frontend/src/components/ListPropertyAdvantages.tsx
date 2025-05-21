import Image from "next/image";

const ListPropertyAdvantages: React.FC = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-8 px-8 py-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-center">
          Why List Your Property With Us?
        </h1>
        <div className="text-center text-gray-600">
          Listing your property has never been easier or more effective.
          Here&apos;s why thousands of property owners trust us:
        </div>
      </div>
      <div className="flex flex-wrap xl:gap-12 lg:gap-6 gap-6 justify-between">
        <div className="flex flex-1 flex-col bg-white rounded-3xl  border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3 py-6 justify-between items-center gap-4">
          <Image
            src="/icons/fast-results.svg"
            alt="Fast Results"
            width={150}
            height={150}
            placeholder="blur"
          />
          <h1 className="font-bold text-center">Fast Results</h1>
          <p className="text-center">Find tenants or buyers in under 3 days.</p>
        </div>
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3  py-6 justify-between items-center gap-4">
          <Image
            src="/icons/affordable-upgrades.svg"
            alt="Affordable Upgrades"
            width={150}
            height={150}
            placeholder="blur"
          />
          <h1 className="font-bold text-center">Affordable Upgrades</h1>
          <p className="text-center">
            Access premium listing tag options to enhance visibility.
          </p>
        </div>
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3  py-6 justify-between items-center gap-4">
          <Image
            src="/icons/wide-reach.svg"
            alt="Wide Reach"
            width={150}
            height={150}
            placeholder="blur"
          />
          <h1 className="font-bold text-center">Wide Reach</h1>
          <p className="text-center">
            Showcase your property to thousands across top cities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListPropertyAdvantages;
