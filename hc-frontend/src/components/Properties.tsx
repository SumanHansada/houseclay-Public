// pages/index.js
import { Crown, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type BadgeType = "Featured" | "Exclusive" | null;

export interface Property {
  id: number;
  complex: string;
  beds: number;
  baths: number;
  price: string;
  area: string;
  location: string;
  images: string[];
  type: BadgeType;
}

interface PropertiesProps {
  property: Property;
  badgeType?: BadgeType;
  autoplay?: boolean;
  autoplayInterval?: number;
}

// Properties Component
const Properties: React.FC<PropertiesProps> = ({
  property,
  badgeType,
  autoplay = false,
  autoplayInterval = 3000,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  // const prevImage = () => {
  //   setCurrentImageIndex(
  //     (prev) => (prev - 1 + property.images.length) % property.images.length,
  //   );
  // };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(nextImage, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayInterval]);

  return (
    <div className="flex-col gap-8 bg-white rounded-lg shadow-md relative p-3">
      {/* Image Carousel */}
      <div className="relative h-72">
        <Image
          src={property?.images[currentImageIndex]}
          alt={`Property ${property?.id}`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />

        {/* Badge: Featured or Exclusive */}
        {badgeType && (
          <div
            className={`absolute top-3 left-3 px-2 py-2 rounded-lg text-xs text-black bg-white`}
          >
            {badgeType === "Featured" ? (
              <span className="flex items-center">
                <i className="mr-1 ">
                  <Star
                    size={16}
                    className="bg-red-100 text-red-600 rounded-full"
                  />
                </i>{" "}
                Featured
              </span>
            ) : (
              <span className="flex items-center">
                <i className="mr-1">
                  <Crown size={16} className="bg-yellow-100 text-yellow-600" />
                </i>{" "}
                Exclusive
              </span>
            )}
          </div>
        )}

        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 bg-gray-50/30 rounded-full p-2 shadow-md"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? (
            <Heart size={16} className="text-red-500 fill-red-500" />
          ) : (
            <Heart size={16} className="text-white" />
          )}
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
          {property.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Property Info */}
      <div className="flex-col mt-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-500 text-sm">Apartment</p>
          <p className="text-gray-500 text-sm">{property.complex}</p>
        </div>

        <div className="flex justify-between items-center mb-2">
          <p className="font-medium">
            {property.beds} Beds | {property.baths} Bath | Semi furnished
          </p>
          <p className="font-bold">₹ {property.price} Cr</p>
        </div>

        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-600">Buildup Area {property.area} sq.ft.</p>
        </div>

        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <i className="mr-1">
            <MapPin size={16} />
          </i>
          <p>{property.location}</p>
        </div>
      </div>
    </div>
  );
};

export default Properties;
