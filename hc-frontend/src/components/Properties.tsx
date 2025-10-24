// pages/index.js
import { motion } from "framer-motion";
import { Crown, Heart, MapPin, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { BadgeType } from "@/common/enums";
import { formatBhkType, formatINRCurrency } from "@/common/utils";
import { useShortlist } from "@/hooks/useShortlist";
import { PropertySearch } from "@/interfaces/PropertySearch";
import { ImageWithLoader } from "@/utility-components";

interface PropertiesProps {
  property: PropertySearch;
  badgeType?: string | null;
  autoplay?: boolean;
  autoplayInterval?: number;
  showCarouselDots?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

// Properties Component
// TODO: Add arrow to move left and right
const Properties: React.FC<PropertiesProps> = ({
  property,
  badgeType,
  autoplay = false,
  autoplayInterval = 3000,
  showCarouselDots = true,
  onClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleShortlist, isShortlisted } = useShortlist();
  const shortlistStatus = isShortlisted(property.propertyID);
  const [isShortlistedProperty, setIsShortlistedProperty] =
    useState(shortlistStatus);

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
    <div
      onClick={onClick}
      className="flex-col gap-8 bg-white border border-gray-100 rounded-xl drop-shadow relative p-3 cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="relative h-72 max-md:h-60">
        <ImageWithLoader
          src={property?.images[currentImageIndex]}
          alt={`Property ${property?.propertyID}`}
          fill
          className="rounded-xl"
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
        <motion.button
          className={`absolute top-2 right-2 bg-gray-50/30 rounded-full p-2 shadow-md ${isShortlistedProperty ? "text-pink-500" : "text-gray-500"}`}
          onClick={async (e) => {
            e.stopPropagation();
            const newStatus = await toggleShortlist(property.propertyID);
            setIsShortlistedProperty(newStatus);
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Heart icon with scale animation */}
          <motion.div
            animate={{
              scale: isShortlistedProperty ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={16}
              className={isShortlistedProperty ? "fill-current" : ""}
            />
          </motion.div>
        </motion.button>

        {/* Carousel Dots */}
        {showCarouselDots && (
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
        )}
      </div>

      {/* Property Info */}
      <div className="flex-col mt-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-black text-xs border border-gray-200 py-1 px-1.5 rounded-full bg-gray-100">
            {property.propertyType}
          </p>
          <p className="text-gray-500 text-xs">
            {property.locationOrSocietyName}
          </p>
        </div>

        <div className="flex justify-between items-center mb-2">
          <p className="font-medium text-xs">
            {formatBhkType(property.bhkType)} Beds |{" "}
            {property.bathrooms ? `${property.bathrooms} Bath |` : ""}
            {property.furnishing}
          </p>
          <p className="font-bold">
            {formatINRCurrency(property?.price || property?.rent || 0)}
          </p>
        </div>

        <div className="flex justify-between items-center text-xs">
          <p className="text-gray-600">
            Buildup Area {property.builtUpArea} sq.ft.
          </p>
        </div>

        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <i className="mr-1">
            <MapPin size={12} />
          </i>
          <p className="truncate">{property.landmark}</p>
        </div>
      </div>
    </div>
  );
};

export default Properties;
