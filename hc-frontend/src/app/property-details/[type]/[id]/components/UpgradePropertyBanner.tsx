import { BadgeCheck, TrendingUp, Users } from "lucide-react";
import Image from "next/image";

export default function UpgradePropertyBanner({
  onUpgrade,
}: {
  onUpgrade: () => void;
}) {
  return (
    <div
      className="relative p-6 mb-6 max-md:p-3 max-md:mb-3 rounded-xl border bg-white overflow-hidden flex flex-col gap-4"
      style={{ minHeight: 300 }}
    >
      {/* Gradient background in the top right corner */}
      <div
        className="absolute right-0 top-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at 75% 0%, #FFCFEC 0%, #FFFAD2 40%, #FFFFFF 50%, rgba(255,255,255,1) 100%)",
          zIndex: 0,
        }}
      />
      {/* Image Placeholder */}
      <div className="relative z-10 flex max-md:gap-2 justify-start items-start mb-2 mt-2">
        <Image
          src={"/icons/high-rental.svg"}
          alt="high-rental"
          width={100}
          height={100}
        />
        <div className="flex flex-col gap-2 md:hidden">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Looking for verified tenants paying higher rental ?
          </h3>
          <p className="text-gray-500 text-sm mb-2">
            Upgrade to Discover and let us handle your property with care.
          </p>
        </div>
      </div>
      {/* Card Content */}
      <div className="relative z-10 flex flex-col gap-2 items-start">
        <div className="max-md:hidden flex flex-col gap-2">
          <h3 className="xl:text-2xl text-xl font-semibold text-gray-900 mb-1">
            Looking for verified tenants paying higher rental ?
          </h3>
          <p className="text-gray-500 xl:text-base text-sm mb-2">
            Upgrade to Discover and let us handle your property with care.
          </p>
        </div>
        <div className="flex flex-col gap-2 items-start mt-2 mb-4 max-md:m-1">
          <div className="flex items-center gap-2 text-gray-800 text-base">
            <BadgeCheck size={20} className="text-green-500" />
            <span className="">Verified Tenants</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800 text-base">
            <TrendingUp size={20} className="text-blue-500" />
            <span className="">Higher Rental Income</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800 text-base">
            <Users size={20} className="text-yellow-500" />
            <span className="">Hassle-Free Management</span>
          </div>
        </div>
        <button
          className="mt-2 px-8 py-3 border border-red-500 text-red-500 rounded-xl w-full text-base max-md:text-sm hover:bg-red-50 transition-colors"
          onClick={onUpgrade}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
