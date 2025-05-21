import Image from "next/image";

const Advantages: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-14 px-8 py-20">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-center">Why Choose Us?</h1>
        <div className="text-center text-gray-600">
          Discover the advantages of using our platform to find your perfect
          property.
        </div>
      </div>
      <div className="flex flex-wrap xl:gap-12 lg:gap-6 gap-6 justify-between">
        <div className="flex flex-1 flex-col bg-white rounded-3xl  border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3 py-6 justify-between items-center gap-4">
          <Image
            src="/icons/direct-owner-access.svg"
            alt="Direct Owner Accesss"
            width={150}
            height={150}
            placeholder="blur"
          />
          <h1 className="font-bold text-center">Direct Owner Access</h1>
          <p className="text-center">
            Skip the brokers — connect straight to property owners with ease.
          </p>
        </div>
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3  py-6 justify-between items-center gap-4">
          <Image
            src="/icons/pay-as-you-go.svg"
            alt="Pay-As-You-Go"
            width={150}
            height={150}
            placeholder="blur"
          />
          <h1 className="font-bold text-center">Pay-As-You-Go</h1>
          <p className="text-center">
            Buy connects only when you need them. No subscriptions, no hidden
            fees.
          </p>
        </div>
        <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3  py-6 justify-between items-center gap-4">
          <Image
            src="/icons/exclusive-listings.svg"
            alt="Exclusive Listings"
            width={150}
            height={150}
            placeholder="blur"
          />
          <h1 className="font-bold text-center">Exclusive Listings</h1>
          <p className="text-center">
            Access properties you won’t find anywhere else, only on HouseClay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
