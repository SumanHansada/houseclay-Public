import { motion } from "framer-motion";
import { Crown, Heart, MapPin, Star, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BALCONY_TYPE_OPTIONS,
  BATHROOM_TYPE_OPTIONS,
  BHK_TYPE_OPTIONS,
  FURNISHING_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  TENANT_TYPE_OPTIONS,
} from "@/common/dataConstants/formOptions";
import { BadgeType, PropertyCategory } from "@/common/enums";
import { formatINRCurrency, processPropertyImages } from "@/common/utils";
import { useShortlist } from "@/hooks/useShortlist";
import { PropertySearch } from "@/interfaces/PropertySearch";
import { PropertyCardWithImages } from "@/interfaces/User";
import { ImageWithFallback } from "@/utility-components";
import { getOptionLabel } from "@/utils/formOptionHelpers";

interface PropertiesProps {
  property: PropertySearch;
  badgeType?: string | null;
  autoplay?: boolean;
  autoplayInterval?: number;
  showCarouselDots?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onClose?: () => void;
  className?: string;
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
  onClose,
  className,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleShortlist, isShortlisted } = useShortlist();
  const shortlistStatus = isShortlisted(property.propertyID);
  const [isShortlistedProperty, setIsShortlistedProperty] =
    useState(shortlistStatus);

  const propertyCategory = useMemo(
    () => property?.propertyCategory ?? PropertyCategory.RENT,
    [property],
  );
  const propertyType = getOptionLabel(
    PROPERTY_TYPE_OPTIONS,
    property.propertyType,
  );
  const bhkType = getOptionLabel(BHK_TYPE_OPTIONS, property.bhkType);
  const furnishing = getOptionLabel(FURNISHING_OPTIONS, property.furnishing);
  const formattedPriceOrRentAmount = formatINRCurrency(
    property?.price || property?.rent || 0,
  );
  const tenantType = getOptionLabel(TENANT_TYPE_OPTIONS, property.tenantType);
  const roomType = getOptionLabel(ROOM_TYPE_OPTIONS, property.roomType);
  const bathroomType = getOptionLabel(
    BATHROOM_TYPE_OPTIONS,
    property.bathroomType,
  );
  const balconyType = getOptionLabel(
    BALCONY_TYPE_OPTIONS,
    property.balconyType,
  );

  const bedrooms = bhkType
    ? bhkType === "Studio" || bhkType === "1 BHK"
      ? "1 Bed"
      : `${bhkType.split("BHK")[0]} Beds`
    : "N/A";
  const bathrooms = property.bathrooms
    ? `${property.bathrooms} ${property?.bathrooms > 1 ? "Baths" : "Bath"}`
    : "N/A";

  // Process images with fallback
  const propertyImages = useMemo(() => {
    return processPropertyImages(property.images);
  }, [property.images]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  }, [propertyImages.length]);

  // const prevImage = () => {
  //   setCurrentImageIndex(
  //     (prev) => (prev - 1 + property.images.length) % property.images.length,
  //   );
  // };

  useEffect(() => {
    if (autoplay && propertyImages.length > 1) {
      const interval = setInterval(nextImage, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayInterval, nextImage, propertyImages.length]);

  return (
    <div
      onClick={onClick}
      className={`flex-col gap-8 bg-white rounded-xl drop-shadow relative cursor-pointer ${className}`}
    >
      {/* Image Carousel */}
      <div className="relative h-60 max-md:h-60">
        <ImageWithFallback
          src={propertyImages[currentImageIndex]}
          alt={`Property ${property?.propertyID}`}
          fill
          className="rounded-t-xl bg-gray-200 object-cover"
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

        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          {/* Favorite Button */}
          <motion.button
            className={`bg-white/75 rounded-full p-2 shadow-md ${isShortlistedProperty ? "text-pink-500" : "text-gray-500"}`}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const newStatus = await toggleShortlist(
                property as PropertyCardWithImages,
              );
              setIsShortlistedProperty(newStatus);
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Shortlist Property"
          >
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

          {onClose && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="bg-white/75 rounded-full p-2 shadow-md text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Carousel Dots */}
        {showCarouselDots && propertyImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {propertyImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="flex-col p-4">
        <div className="flex justify-between items-center mb-2 gap-8">
          <p className="text-black text-xs border border-gray-200 py-1 px-1.5 rounded-full bg-gray-100 text-nowrap">
            {propertyCategory === PropertyCategory.RENT
              ? propertyType
              : propertyCategory === PropertyCategory.FLATMATE
                ? `${roomType} Room for ${tenantType}`
                : null}
          </p>
          <p className="text-gray-500 text-xs truncate">
            {property.locationOrSocietyName}
          </p>
        </div>

        <div className="flex justify-between items-center mb-2">
          {propertyCategory === PropertyCategory.RENT ? (
            <p className="font-medium text-xs">
              {bedrooms} | {bathrooms} | {furnishing}
            </p>
          ) : propertyCategory === PropertyCategory.FLATMATE ? (
            <p className="font-medium text-xs">
              {bhkType === "Studio" ? "1 RK" : bhkType} | {bathroomType} |{" "}
              {balconyType}
            </p>
          ) : null}
          <p className="font-bold">{formattedPriceOrRentAmount}</p>
        </div>

        <div className="flex justify-between items-center text-xs">
          {propertyCategory === PropertyCategory.RENT ? (
            <p className="text-gray-600">
              Buildup Area {property.builtUpArea} Sq. Ft
            </p>
          ) : propertyCategory === PropertyCategory.FLATMATE ? (
            <p className="text-gray-600">{furnishing}</p>
          ) : null}
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
