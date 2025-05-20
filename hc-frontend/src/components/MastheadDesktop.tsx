import Image from "next/image";

import HomeSearchBar from "@/components/HomeSearchBar";

interface MastHeadDesktopProps {
  activeTab: string;
  setActiveTab: (tab: "rent" | "sale") => void;
}

const MastHeadDesktop: React.FC<MastHeadDesktopProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src="/images/banner-background.svg"
          alt="Banner Background"
          fill
          priority
          className="object-cover object-right"
          sizes="100vw"
        />
      </div>
      <div className="absolute h-full flex flex-col justify-center xl:pl-40 lg:pl-14 pl-14 xl:w-2/3 lg:w-4/5 md:w-5/6 w-5/6">
        {/* Headings */}
        <div className="max-w-md mb-8">
          <h1 className="xl:text-6xl lg:text-5xl text-5xl font-bold text-gray-900 mb-2">
            No Middlemen
          </h1>
          <h2 className="xl:text-5xl lg:text-4xl text-4xl text-gray-800">
            Just Connects
          </h2>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl flex justify-start pl-8 mb-4">
          <button
            className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${activeTab === "rent" ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"}`}
            onClick={() => setActiveTab("rent")}
          >
            Rent
          </button>
          <button
            className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${activeTab === "sale" ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"}`}
            onClick={() => setActiveTab("sale")}
          >
            Buy
          </button>
        </div>

        {/* Search Form */}
        <HomeSearchBar />
      </div>
    </>
  );
};

export default MastHeadDesktop;
