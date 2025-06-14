// pages/index.js
import { Crown, Heart, MapPin, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { BadgeType } from "@/common/enums";
import { Property } from "@/interfaces/Property";

import ImageWithLoader from "./common/ImageWithLoader";

interface PropertiesProps {
  property: Property;
  badgeType?: string;
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

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  }, [property.images.length]);

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
  }, [autoplay, autoplayInterval, nextImage]);

  return (
    <div className="flex-col gap-8 bg-white border border-gray-100 rounded-lg drop-shadow relative p-3">
      {/* Image Carousel */}
      <div className="relative h-72 max-md:h-60">
        <ImageWithLoader
          src={property?.images[currentImageIndex]}
          alt={`Property ${property?.id}`}
          fill
          className="rounded-lg"
          loading="lazy"
        />

        {/* Badge: Featured or Exclusive */}
        {badgeType && (
          <div
            className={`absolute top-3 left-3 px-2 py-2 rounded-lg text-xs text-black bg-white`}
          >
            {badgeType === BadgeType.Featured ? (
              <span className="flex items-center">
                <i className="mr-1 ">
                  <Star
                    size={16}
                    className="bg-red-200 text-red-600 rounded-full"
                  />
                </i>{" "}
                Featured
              </span>
            ) : (
              <span className="flex items-center">
                <i className="mr-1">
                  <Crown
                    size={16}
                    className="bg-yellow-200 text-yellow-600 rounded-full"
                  />
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
          <p className="text-gray-500 text-xs">Apartment</p>
          <p className="text-gray-500 text-xs">{property.complex}</p>
        </div>

        <div className="flex justify-between items-center mb-2">
          <p className="font-medium text-xs">
            {property.beds} Beds | {property.baths} Bath | Semi furnished
          </p>
          <p className="font-bold">₹ {property.price} Cr</p>
        </div>

        <div className="flex justify-between items-center text-xs">
          <p className="text-gray-600">Buildup Area {property.area} sq.ft.</p>
        </div>

        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <i className="mr-1">
            <MapPin size={12} />
          </i>
          <p className="truncate">{property.location}</p>
        </div>
      </div>
    </div>
  );
};

export default Properties;
