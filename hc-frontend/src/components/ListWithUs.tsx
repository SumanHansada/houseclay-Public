import BuyersConnectionsSvg from "public/icons/buyers-connections.svg";
import FasterDealClosuresSvg from "public/icons/faster-deal-closures.svg";
import HassleFreeListingsSvg from "public/icons/hassle-free-listings.svg";

const BuyersConnections = BuyersConnectionsSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const FasterDealClosures = FasterDealClosuresSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const HassleFreeListings = HassleFreeListingsSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const ListWithUs: React.FC = () => {
  return (
    <div className="container py-8 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
      <div className="flex justify-around items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 bg-green-50 rounded-full">
            <div className="flex  w-12 h-12 items-center justify-center bg-green-100 rounded-full">
              <HassleFreeListings
                height={32}
                width={32}
                className=" bg-green-100 rounded-full"
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
              <FasterDealClosures
                height={32}
                width={32}
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
              <BuyersConnections
                height={32}
                width={32}
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
