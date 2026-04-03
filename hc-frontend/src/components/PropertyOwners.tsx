import Link from "next/link";

import { ownersImageURL } from "@/common/cdnURLs";
import { ImageWithLoader } from "@/utility-components";

const PropertyOwners: React.FC = () => {
  return (
    <div className="mx-auto xl:px-24 lg:px-12 md:px-8 px-4 max-md:py-6 py-12 flex flex-col md:flex-row items-center justify-between bg-white">
      {/* Left Side - Text Content */}
      <div className="flex-col flex-1 text-left items-center">
        <span className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm ">
          For Property Owners
        </span>
        <h1 className="text-3xl font-bold mt-4">
          Rent out your <span className="text-black">property</span>{" "}
          <span className="text-red-600">quickly</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Our platform ensures fast, hassle-free closures, connecting you to the
          right tenants in no time.
        </p>
        <Link
          href="/list-property"
          className="inline-block text-center mt-4 px-6 py-2 border-2 border-red-600 text-red-600 rounded-xl font-medium hover:bg-red-600 hover:text-white transition duration-200"
        >
          List Your Property
        </Link>
      </div>

      {/* Right Side - Image Content */}
      <div className="flex w-full md:flex-1 md:min-w-0 justify-center items-center shrink-0">
        <div className="relative mx-auto w-full max-w-[492px] aspect-[492/509]">
          <ImageWithLoader
            src={ownersImageURL}
            alt="Property Owners"
            fill
            sizes="(max-width: 768px) 100vw, min(492px, 50vw)"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="!object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyOwners;
