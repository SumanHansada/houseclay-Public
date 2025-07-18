import Image from "next/image";

const HowToUseConnects = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-14 px-8 py-20 bg-gray-100">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-center">
          How Can You Use Connects?
        </h1>
        <p className="text-center text-gray-800 text-xl font-light w-3/4">
          Listing your property has never been easier or more effective. Here's
          why thousands of property owners trust us:
        </p>
      </div>
      <div className="flex flex-wrap xl:gap-28 lg:gap-6 gap-6 justify-between px-16">
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-10 lg:px-6 px-3 py-6 justify-between items-center">
          <Image
            src="/icons/static-pages/connect-with-owners.svg"
            alt="Find & Connect with Owners"
            width={150}
            height={150}
          />
          <div className="flex flex-col gap-2 mt-6 text-center items-center">
            <h1 className="font-semibold text-2xl w-2/3">
              Find & Connect with Owners
            </h1>
            <p className="text-gray-800 text-balance text-lg">
              Unlock verified owner details and contact them directly—no
              middlemen, no extra charges.
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-10 lg:px-6 px-3 py-6 justify-between items-center">
          <Image
            src="/icons/static-pages/simplify-rental-processes.svg"
            alt="Simplify Rental Processes"
            width={160}
            height={150}
          />
          <div className="flex flex-col gap-2 mt-6 text-center items-center">
            <h1 className="font-semibold text-2xl w-2/3">
              Simplify Rental Processes
            </h1>
            <p className="text-gray-800 text-balance text-lg">
              Use Connects for rent agreements, tenant verification, and
              seamless property transactions.
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-10 lg:px-6 px-3 py-6 justify-between items-center">
          <Image
            src="/icons/static-pages/access-property-services.svg"
            alt="Exclusive Listings"
            width={150}
            height={150}
          />
          <div className="flex flex-col gap-2 mt-6 text-center items-center">
            <h1 className="font-semibold text-2xl w-2/3">
              Access Property Services
            </h1>
            <p className="text-gray-800 text-balance text-lg">
              Redeem Connects for maintenance, cleaning, painting, and expert
              property management.
            </p>
          </div>
        </div>
      </div>
      <button className="bg-red-500 text-white text-xl xl:px-6  lg:px-5 lg:py-3 md:px-3 px-3 py-2 rounded-xl size-fit">
        Buy Connects Now
      </button>
    </div>
  );
};

export default HowToUseConnects;
