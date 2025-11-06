import { SvgIcon } from "@/utility-components";

const ListWithUs: React.FC = () => {
  return (
    <div className="container py-0 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
      <div className="flex justify-around items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 bg-green-50 rounded-full">
            <div className="flex  w-12 h-12 items-center justify-center bg-green-100 rounded-full">
              <SvgIcon
                name="hassle-free-listings"
                size={32}
                className="bg-green-100 rounded-full"
              />
            </div>
          </div>
          <div className="text-lg font-medium text-gray-800">
            Hassle-Free Listings
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 bg-blue-50 rounded-full">
            <div className="flex  w-12 h-12 items-center justify-center bg-blue-100 rounded-full">
              <SvgIcon
                name="faster-deal-closures"
                size={32}
                className="bg-blue-100 rounded-full"
              />
            </div>
          </div>
          <div className="text-lg font-medium text-gray-800">
            Faster Deal Closures
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 bg-amber-50 rounded-full">
            <div className="flex w-12 h-12 items-center justify-center  bg-amber-100 rounded-full">
              <SvgIcon
                name="buyers-connections"
                size={32}
                className="bg-amber-100 rounded-full"
              />
            </div>
          </div>
          <div className="text-lg font-medium text-gray-800">
            1 lac+ tenants/buyers connections
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListWithUs;
