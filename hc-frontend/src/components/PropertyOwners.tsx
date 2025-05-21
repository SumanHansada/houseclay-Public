import Image from "next/image";
import Link from "next/link";

const PropertyOwners: React.FC = () => {
  return (
    <div className="mx-auto xl:px-28 lg:px-14 md:px-14 px-8 py-20 flex flex-col md:flex-row items-center justify-between bg-white">
      {/* Left Side - Text Content */}
      <div className="flex-col flex-1 text-left items-center">
        <span className="bg-red-50 text-red-500 px-4 py-2 rounded-full text-sm ">
          For Property Owners
        </span>
        <h1 className="text-3xl font-bold mt-4">
          Sell or Rent your <span className="text-black">property</span>{" "}
          <span className="text-red-500">quickly</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Easily sell or rent your property. Our platform ensures fast,
          hassle-free transactions, connecting you with the right buyers or
          tenants in no time.
        </p>
        <Link
          href="/list-property"
          className="inline-block mt-4 px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500 hover:text-white transition"
        >
          List Your Property
        </Link>
      </div>

      {/* Right Side - Image Content */}
      <div className="flex flex-1 justify-between items-center">
        <Image
          src={"/images/owners.webp"}
          alt="Property Owners"
          height={500}
          width={500}
          className="my-0 mx-auto"
        />
      </div>
    </div>
  );
};

export default PropertyOwners;
