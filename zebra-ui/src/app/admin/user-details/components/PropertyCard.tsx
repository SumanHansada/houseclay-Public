import { UserPropertyInfo } from "@/interfaces/User";
import {
  Heart,
  MoreVertical,
  MapPin,
  Bed,
  Bath,
  Compass,
  Car,
} from "lucide-react";

interface PropertyCardProps {
  currentProperty: UserPropertyInfo;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  currentProperty,
}) => {
  return (
    <li className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md relative">
      <div className="flex">
        {/* IMAGE + DOTS */}
        <div className="relative bg-gray-400 w-2/5 rounded-xl my-4 ml-5">
          <img
            src="https://via.placeholder.com/400x250"
            alt="Property"
            className="w-full h-60 object-cover"
          />
          {/* dummy slider dots */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-3/5 flex flex-col justify-between py-8 px-8">
          {/* TITLE & LOCATION */}
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-medium pr-16">
              4 BHK Cityscape Penthouse For Sale
            </h3>
            <div className="flex items-center text-gray-600 text-xl">
              <MapPin size={16} className="mr-1" />
              <span>Sobha Eternia, 12th Main</span>
            </div>
            <h3>
              Property Type:
              {currentProperty.title
                ? currentProperty.title
                : "Not present in the properties we create from the add-property flow"}
              ?? is it an actual field?
            </h3>
          </div>

          <hr className="my-4" />

          {/* PRICE / EMI / AREA */}
          <div className="flex text-center text-gray-600 text-xl">
            <div className="flex-1 border-r-2">
              <div className="font-medium text-gray-800">₹8 Cr</div>
              <div>88,000/sq. ft.</div>
            </div>
            <div className="flex-1 border-r-2">
              <div className="font-medium text-gray-800">Estimated EMI</div>
              <div>₹12,875/Month</div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Buildup Area</div>
              <div>2,180 sqft</div>
            </div>
          </div>
        </div>
      </div>

      {/* favorite + menu */}
      <div className="absolute top-4 right-6 flex space-x-2">
        <button className="p-1 bg-white rounded-full shadow">
          <Heart size={24} className="text-red-600" />
        </button>
        <button className="p-1 bg-white rounded-full shadow">
          <MoreVertical size={24} className="text-gray-600" />
        </button>
      </div>

      <hr className="my-2" />

      <div className="flex flex-col px-4 py-3">
        <h3 className="text-xl font-medium text-gray-800">Description</h3>
        <p className="text-gray-700 text-lg">
          {currentProperty.description ??
            "Top floor nicely placed. This lovely three bedroom for sale is only 1.95 Crores rupees without any extra brokerage & could be your new home. This West facing home is over 1536 sqft. & is in a convenient location. Situated on the 29th floor this home can comfortably serve your space for car and bike parking needs."}
        </p>
      </div>

      {/* FEATURES ROW */}
      <ul className="flex gap-4 px-4 text-gray-600 text-xl mb-4">
        <li className="flex items-center flex-1 border-r-2">
          <span className="text-gray-800">Bedrooms: &nbsp;</span>
          <Bed size={20} className="mr-1" /> 6 Bed
        </li>
        <li className="flex items-center flex-1 border-r-2">
          <span className="text-gray-800">Bathrooms: &nbsp;</span>
          <Bath size={20} className="mr-1" /> 2 Bath
        </li>
        <li className="flex items-center flex-1 border-r-2">
          <span className="text-gray-800">Facing: &nbsp;</span>
          <Compass size={20} className="mr-1" /> East
        </li>
        <li className="flex items-center flex-1 border-r-2">
          <span className="text-gray-800">Parking: &nbsp;</span>
          <Car size={20} className="mr-1" /> Bike &amp; Car
        </li>
      </ul>

      {/* ACTION BUTTONS */}
      <div className="px-4 pb-4 flex space-x-4">
        <button className="flex-1 flex items-center justify-center border border-red-500 text-red-500 rounded-lg py-2 font-medium hover:bg-red-50 transition">
          Report
        </button>
        <button className="flex-1 flex items-center justify-center border border-green-500 text-green-500 rounded-lg py-2 font-medium hover:bg-green-50 transition">
          Verify
        </button>
      </div>
    </li>
  );
};
