"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Bath,
  BedDouble,
  BedSingle,
  Blocks,
  BrushCleaning,
  Building2,
  ChevronLeft,
  Cigarette,
  CloudHail,
  Compass,
  CornerUpRight,
  Dam,
  Droplets,
  Eye,
  Flag,
  Headset,
  Heart,
  Hourglass,
  House,
  HousePlus,
  Info,
  InspectionPanel,
  Landmark,
  MapPin,
  ParkingCircle,
  Phone,
  PhoneCall,
  Share,
  SmartphoneCharging,
  Sofa,
  SquareStar,
  Users,
  Utensils,
  Wine,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { refreshPropertyCache } from "@/actions/refreshPropertyCache";
import { Button, PlacesAutocomplete } from "@/base-components";
import {
  balconyIconURL,
  builtUpAreaIconURL,
  clubhouseIconURL,
  dedicatedWorkspaceIconURL,
  fireExtinguisherIconURL,
  firstAidKitIconURL,
  gymIconURL,
  liftIconURL,
  outdoorDiningAreaIconURL,
  parkingSpaceIconURL,
  placeholderIconURL,
  poolTableIconURL,
  securityIconURL,
  smokeAlarmIconURL,
  swimmingPoolIconURL,
  twentyFourSevenIconURL,
  wifiIconURL,
} from "@/common/cdnURLs";
import { AMENITY_LABELS, AMENITY_VALUES } from "@/common/dataConstants/options";
import {
  MONTHLY_CHARGES_DIALOG_ID,
  PHOTO_GALLERY_DIALOG_ID,
  REPORT_LISTING_DIALOG_ID,
} from "@/common/dialogConstants";
import { PropertyCategory } from "@/common/enums";
import { openMapsDirections, pascalCase } from "@/common/utils";
import FullScreenLoader from "@/components/FullScreenLoader";
import {
  ContactOwnerLoginDialog,
  MonthlyChargesDialog,
  PhotoGalleryDialog,
} from "@/dialogs";
import ReportListingDialog from "@/dialogs/report-listing-dialog";
import UnlockOwnerDetailsDialog from "@/dialogs/unlock-owner-details-dialog";
import { useShortlist } from "@/hooks/useShortlist";
import { PropertyCardWithImages } from "@/interfaces/User";
import { MobileFooter } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { RootState } from "@/store/store";
import {
  PhotoGallery,
  Popover,
  RemoteSvg,
  SvgIcon,
} from "@/utility-components";
import { GoogleMapsDirection } from "@/utility-components";

import { PropertyDetailItem } from "./components/PropertyDetailItem";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  [AMENITY_VALUES.LIFT]: <RemoteSvg src={liftIconURL} />,
  [AMENITY_VALUES.GYM]: <RemoteSvg src={gymIconURL} />,
  [AMENITY_VALUES.SWIMMING_POOL]: <RemoteSvg src={swimmingPoolIconURL} />,
  [AMENITY_VALUES.POWER_BACKUP]: <RemoteSvg src={twentyFourSevenIconURL} />,
  [AMENITY_VALUES.CLUB_HOUSE]: <RemoteSvg src={clubhouseIconURL} />,
  [AMENITY_VALUES.SECURITY]: <RemoteSvg src={securityIconURL} />,
  [AMENITY_VALUES.VISITOR_PARKING]: <RemoteSvg src={parkingSpaceIconURL} />,
  [AMENITY_VALUES.COMMUNITY_HALL]: <Landmark size={24} strokeWidth={1.5} />,
  [AMENITY_VALUES.GUEST_ROOM]: <BedSingle size={24} strokeWidth={1.5} />,
  [AMENITY_VALUES.OUTDOOR_DINING]: <RemoteSvg src={outdoorDiningAreaIconURL} />,
  [AMENITY_VALUES.FIRE_EXTINGUISHER]: (
    <RemoteSvg src={fireExtinguisherIconURL} />
  ),
  [AMENITY_VALUES.SMOKE_ALARM]: <RemoteSvg src={smokeAlarmIconURL} />,

  [AMENITY_VALUES.DEDICATED_WORKSPACE]: (
    <RemoteSvg src={dedicatedWorkspaceIconURL} />
  ),
  [AMENITY_VALUES.WIFI]: <RemoteSvg src={wifiIconURL} />,
  [AMENITY_VALUES.POOL_TABLE]: <RemoteSvg src={poolTableIconURL} />,
  [AMENITY_VALUES.FIRST_AID]: <RemoteSvg src={firstAidKitIconURL} />,
  [AMENITY_VALUES.INTERCOM]: <Headset size={24} strokeWidth={1.5} />,
  [AMENITY_VALUES.SEWAGE_TREATMENT]: <Dam size={24} strokeWidth={1.5} />,
  [AMENITY_VALUES.HOUSE_KEEPING]: <BrushCleaning size={24} strokeWidth={1.5} />,
  [AMENITY_VALUES.RAIN_WATER]: <CloudHail size={24} strokeWidth={1.5} />,
  [AMENITY_VALUES.PLAY_AREA]: <Blocks size={24} strokeWidth={1.5} />,
};

const CONTACT_LOGIN_DIALOG_ID = "contact-owner-login-dialog";
const UNLOCK_DETAILS_DIALOG_ID = "unlock-owner-details-dialog";

interface PropertyDetailsClientProps {
  propertyID: string;
  initialPropertyData?: unknown;
  isAuthenticated?: boolean;
}

export function PropertyDetailsClient({
  propertyID,
  initialPropertyData,
  isAuthenticated: serverIsAuthenticated,
}: PropertyDetailsClientProps) {
  // Use server-provided authentication status, fallback to Redux state for client-side changes
  const clientIsAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const isAuthenticated = serverIsAuthenticated ?? clientIsAuthenticated;

  // All data is now processed server-side, so we just use the pre-processed data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processedData = initialPropertyData as any;

  const { toggleShortlist, isShortlisted } = useShortlist();
  const shortlistStatus = isShortlisted(propertyID);
  const [isShortlistedProperty, setIsShortlistedProperty] =
    useState(shortlistStatus);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [origin, setOrigin] = useState<string>("");
  const [showDirections, setShowDirections] = useState(false);
  const router = useRouter();
  const { isMobile } = useDeviceContext();
  const { isDialogOpen, closeDialog, openDialog } = useDialog();

  // Extract all pre-processed data from server
  if (!processedData) {
    return <FullScreenLoader />;
  }

  const {
    // Raw property data
    property,
    contactUserCount,
    shortlistUserCount,
    viewUserCount,
    owner,
    reported,
    propertyOwner,
    propertyCategory,
    // Processed data
    propertyImages,
    // Common derivations
    bhkType,
    propertyType,
    furnishingStatus,
    parking,
    bedrooms,
    builtUpArea,
    availableFrom,
    maintenance,
    nonVegAllowed,
    // Category derivations
    roomType,
    balconyType,
    bathroomType,
    bathrooms,
    balcony,
    // Price derivations
    tag: catBasedPriceOrRentTag,
    amount: formattedPriceOrRentAmount,
    deposit: formattedDeposit,
    // Computed values
    propertyTitle,
    descriptionSentences,
    propertyDetailLeftColumn,
    propertyDetailRightColumn,
  } = processedData;

  const handleShare = async () => {
    try {
      const propertyUrl = window.location.href;

      // Check if Web Share API is supported
      if (navigator.share && isMobile) {
        await navigator.share({
          title: `${propertyTitle ?? "Property Details"}`,
          text: `Check out this property: ${propertyTitle}`,
          url: propertyUrl,
        });
      } else {
        // Fallback to clipboard for browsers that don't support Web Share API
        await navigator.clipboard.writeText(propertyUrl);
        toast.success("Property Link copied to clipboard!");
      }
    } catch (error) {
      console.error(error);
      // Only show error toast if it's not a user cancellation
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share property");
      }
    }
  };

  const handleReportListingClick = () => {
    openDialog("report-listing-dialog");
  };

  // descriptionSentences is now pre-processed server-side

  // Map icons to property detail columns (icons can't be serialized from server)
  const propertyDetailLeftColumnWithIcons = [
    { ...propertyDetailLeftColumn[0], icon: House },
    { ...propertyDetailLeftColumn[1], icon: Compass },
    { ...propertyDetailLeftColumn[2], icon: Building2 },
    { ...propertyDetailLeftColumn[3], icon: Droplets },
    { ...propertyDetailLeftColumn[4], icon: SmartphoneCharging },
  ];

  const propertyDetailRightColumnWithIcons = propertyDetailRightColumn.map(
    (item: { label: string; value: string }) => {
      // Map icon based on label
      let icon: LucideIcon = Info; // default
      if (item.label === "Furnishing") icon = Sofa;
      else if (item.label === "Flooring") icon = InspectionPanel;
      else if (item.label === "Non-Veg Allowed") icon = Utensils;
      else if (item.label === "Property Age") icon = Hourglass;
      else if (item.label === "Preferred Tenants") icon = Users;
      else if (item.label === "Tenant Type") icon = Users;
      else if (item.label === "Smoking Allowed") icon = Cigarette;
      else if (item.label === "Drinking Allowed") icon = Wine;
      else if (item.label === "Parking") icon = ParkingCircle;

      return { ...item, icon };
    },
  );

  const propertyDetailRowCount = Math.max(
    propertyDetailLeftColumnWithIcons.length,
    propertyDetailRightColumnWithIcons.length,
  );

  return (
    <>
      <section
        className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-between items-center w-full md:hidden`}
      >
        <Button
          variant="secondary"
          size="custom"
          className="rounded-full p-1"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
        >
          <ChevronLeft size={24} />
        </Button>
        <div className="flex gap-2 items-center">
          {/* {property?.managed && (
            <button className="rounded-full border md:border-none items-center justify-center p-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 fill-current">
              <Crown onClick={() => console.log("Crown Clicked")} size={20} />
            </button>
          )} */}
          {property?.featured && (
            <button className="rounded-full border md:border-none items-center justify-center p-2 bg-gradient-to-br from-red-400 via-red-400 to-red-500 fill-current">
              <SquareStar
                onClick={() => console.log("Crown Clicked")}
                size={20}
              />
            </button>
          )}
          <button className="rounded-full border md:border-none items-center justify-center p-2">
            <Share onClick={handleShare} size={18} />
          </button>
          <motion.button
            onClick={async (e) => {
              e.stopPropagation();
              const newStatus = await toggleShortlist(
                property as PropertyCardWithImages,
              );
              setIsShortlistedProperty(newStatus);
            }}
            className={`rounded-full border md:border-none items-center justify-center p-2 relative overflow-hidden ${
              isShortlistedProperty ? "text-pink-500" : "text-gray-600"
            }`}
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
                size={20}
                className={isShortlistedProperty ? "fill-current" : ""}
              />
            </motion.div>
          </motion.button>
        </div>
      </section>
      <section className="overflow-x-hidden flex-grow max-md:pb-16">
        {/* Photo Gallery Section Mobile */}
        <section className="h-60 w-full md:hidden">
          {propertyImages?.length > 0 ? (
            <PhotoGallery
              images={propertyImages}
              className="md:h-[60vh] h-60 rounded-none"
            />
          ) : (
            <div className="w-full h-60 flex flex-col items-center justify-center bg-gray-100">
              <RemoteSvg src={placeholderIconURL} className="w-20" />
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </section>

        <section className="flex-col w-full xl:gap-16 lg:gap-8 md:gap-0 gap-0 xl:px-28 lg:px-14 md:px-8 px-6 max-md:pt-4">
          {/* Header Section */}
          <section className="py-6 max-md:py-2 mx-auto">
            {/* Breadcrumb and Actions Section */}
            <div className="flex justify-between items-center py-2 max-md:hidden">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <House size={16} className="text-gray-500" />
                <span>Properties for {pascalCase(propertyCategory)}</span>
                <span className="text-gray-400">›</span>
                <span>{property?.city}</span>
                <span className="text-gray-400">›</span>
                <span className="text-gray-900 font-medium">
                  {bhkType} {propertyType}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 max-md:hidden">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors underline hover:bg-gray-100 rounded-md px-2 py-1"
                >
                  <Share size={20} />
                  <span>Share</span>
                </button>
                <button
                  onClick={async () => {
                    const newStatus = await toggleShortlist(
                      property as PropertyCardWithImages,
                    );
                    setIsShortlistedProperty(newStatus);
                  }}
                  className={`flex items-center gap-2 transition-colors underline hover:bg-gray-100 rounded-md px-2 py-1 ${
                    isShortlistedProperty
                      ? "text-pink-600 hover:text-pink-700"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Heart
                    size={20}
                    className={isShortlistedProperty ? "fill-current" : ""}
                  />
                  <span>
                    {isShortlistedProperty ? "Shortlisted" : "Shortlist"}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <div className="flex justify-between items-center mb-2 gap-8">
                <p className="text-black text-sm border border-gray-200 py-1 px-1.5 rounded-full bg-gray-100 text-nowrap">
                  {propertyType}
                </p>
                <p className="text-gray-500 text-sm md:hidden truncate">
                  {property?.locationOrSocietyName}, {property?.city}
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-2xl text-gray-900 flex items-center gap-2">
                {propertyTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-base mt-2">
              <MapPin size={16} />
              <span className="max-md:hidden">
                {property?.locationOrSocietyName}, {property?.city}
              </span>
              <span className="md:hidden truncate flex-1">
                {property?.landmark}
              </span>
            </div>
          </section>

          {/* Photo Gallery Section Desktop */}
          <section className="mb-8 max-md:hidden">
            {propertyImages?.length > 0 ? (
              <PhotoGallery
                images={propertyImages}
                maxDisplayImages={5}
                className="md:h-[60vh] h-96 rounded-xl"
                thumbnailPosition="bottom"
              />
            ) : (
              <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-100">
                <RemoteSvg src={placeholderIconURL} className="w-32" />
                <p className="text-gray-500 text-xl">No images available</p>
              </div>
            )}
          </section>

          {/* Main Content Section Desktop*/}
          <section className="flex w-full xl:gap-16 lg:gap-8 md:gap-8 gap-0 max-md:pt-4 max-md:hidden">
            {/* Left Section - 3/4 width */}
            <section className="md:w-1/2 lg:w-3/5 2xl:w-3/4 max-md:w-full">
              {/* Property Details Grid */}
              <section className="bg-white p-6">
                {/* Other Details */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {propertyDetailLeftColumnWithIcons.map((item, index) => (
                      <PropertyDetailItem
                        key={item.label + index}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {propertyDetailRightColumnWithIcons.map(
                      (
                        item: {
                          label: string;
                          value: string;
                          icon: LucideIcon;
                        },
                        index: number,
                      ) => (
                        <PropertyDetailItem
                          key={item.label + index}
                          icon={item.icon}
                          label={item.label}
                          value={item.value}
                        />
                      ),
                    )}
                  </div>
                </div>
              </section>

              {/* Description Section */}
              <section className="py-6">
                <h2 className="text-xl mb-4">Description</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    {showFullDescription
                      ? property?.description
                      : descriptionSentences.slice(0, 3).join(". ") +
                        (descriptionSentences.length > 3 ? "..." : "")}
                  </p>
                  {descriptionSentences.length > 3 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="text-red-600 hover:text-red-600 font-medium"
                    >
                      {showFullDescription ? "Show less" : "Show more >"}
                    </button>
                  )}
                </div>
              </section>

              <hr />

              {/* Amenities Section */}
              {property?.amenities.length > 0 ? (
                <section className="py-6 mb-6">
                  <h2 className="text-xl mb-4">What this place offers</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {property?.amenities?.map((amenityValue: string) => {
                      const amenityIcon =
                        AMENITY_ICONS[
                          amenityValue as keyof typeof AMENITY_ICONS
                        ];
                      const amenityLabel =
                        AMENITY_LABELS[amenityValue] ?? amenityValue;
                      if (!amenityIcon) return null;
                      return (
                        <div
                          key={amenityValue}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          {amenityIcon}
                          <span>{amenityLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              <hr />

              {/* Map Section */}
              <section className="py-6 mb-6">
                <div className="flex flex-col 2xl:flex-row justify-between max-2xl:items-start max-2xl:mb-4 2xl:items-center 2xl:mb-10 2xl:gap-16 truncate">
                  <h2 className="text-xl max-2xl:mb-2">Where you&apos;ll be</h2>
                  <div className="flex items-center gap-2 text-gray-700 max-2xl:mb-2">
                    <MapPin size={20} />
                    <span>
                      {property?.locationOrSocietyName}, {property?.city}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <PlacesAutocomplete
                      id="destination"
                      name="destination"
                      placeholder="Type in place to get direction"
                      value={origin}
                      onChange={(value) => setOrigin(value)}
                      onLocationSelect={(location) =>
                        setOrigin(location.name || "")
                      }
                      containerClassName="w-full relative"
                      inputClassName="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dropdownClassName="absolute z-10 mt-1 py-1 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-b-xl"
                      dropdownItemClassName="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
                    />
                  </div>
                  <button
                    onClick={() => setShowDirections(!!origin)}
                    disabled={!origin}
                    className="bg-red-500 w-48 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Get Directions
                  </button>
                </div>
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <GoogleMapsDirection
                    mapId="property-details-map"
                    center={{
                      lat: property?.latitude || 12.9716,
                      lng: property?.longitude || 77.5946,
                    }}
                    zoom={15}
                    className="h-full w-full border rounded-xl shadow-lg"
                    origin={origin}
                    destination={{
                      lat: property?.latitude || 12.9716,
                      lng: property?.longitude || 77.5946,
                    }}
                    showDirections={showDirections}
                  />
                </div>
              </section>
            </section>

            {/* Right Section - 1/4 width */}
            <section className="md:w-1/2 lg:w-2/5 2xl:w-1/3 max-md:w-full">
              {/* Property Details Section */}
              <section className="border rounded-xl shadow-md px-4 py-6 mb-6">
                {/* Rent - Beds and Baths, Flatmate - Room Type, Bathroom Type */}
                <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
                  {propertyCategory === PropertyCategory.RENT ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <BedDouble size={20} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          No. of Bedroom
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {bedrooms}
                        </div>
                      </div>
                    </div>
                  ) : propertyCategory === PropertyCategory.FLATMATE ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <BedDouble size={20} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          Room Type
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {roomType} Room
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {propertyCategory === PropertyCategory.RENT ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <Bath size={20} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          No. of Bathroom
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {bathrooms}
                        </div>
                      </div>
                    </div>
                  ) : propertyCategory === PropertyCategory.FLATMATE ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <Bath size={20} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          Bathroom Type
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {bathroomType}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Rent - Balcony, Builtup area, Flatmate - Balcony Type, Non Veg Allowed */}
                <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
                  {propertyCategory === PropertyCategory.RENT ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <RemoteSvg src={balconyIconURL} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          Balcony
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {balcony}
                        </div>
                      </div>
                    </div>
                  ) : propertyCategory === PropertyCategory.FLATMATE ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <RemoteSvg src={balconyIconURL} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          Balcony Type
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {balconyType}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {propertyCategory === PropertyCategory.RENT ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <RemoteSvg src={builtUpAreaIconURL} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          Builtup Area
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {builtUpArea}
                        </div>
                      </div>
                    </div>
                  ) : propertyCategory === PropertyCategory.FLATMATE ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <Utensils size={20} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          Non-Veg Allowed
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {nonVegAllowed}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Rent - Parking, Available from, Flatmate - Furnishing, Available from */}
                <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
                  {propertyCategory === PropertyCategory.RENT ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <ParkingCircle size={20} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          Parking
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {parking}
                        </div>
                      </div>
                    </div>
                  ) : propertyCategory === PropertyCategory.FLATMATE ? (
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                      <div className="flex-col">
                        <div className="p-0.5">
                          <Sofa size={20} />
                        </div>
                      </div>
                      <div className="flex-col">
                        <div className="flex gap-2 items-center font-nunito text-sm">
                          Furnishing
                        </div>
                        <div className="text-gray-900 font-semibold font-nunito text-base">
                          {furnishingStatus}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <HousePlus size={20} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-sm">
                        Available From
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-base">
                        {availableFrom}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-6" />

                {/* Price & Contact Section */}
                <div className="">
                  <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x w-full">
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                      <div className="text-gray-600">
                        {catBasedPriceOrRentTag}
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-base flex items-center gap-1">
                        {formattedPriceOrRentAmount}
                        <Popover
                          id="maintenance-info-tip"
                          trigger="hover"
                          align="start"
                          content={
                            <div className="p-2 rounded-md bg-white border shadow-md text-sm">
                              Maintenance: {maintenance}
                            </div>
                          }
                        >
                          <Info
                            size={16}
                            className="text-gray-600 hover:cursor-pointer"
                          />
                        </Popover>
                      </div>
                    </div>
                    <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                      <div className="text-gray-600">Deposit:</div>
                      <div className="text-gray-900 font-semibold font-nunito text-base">
                        {formattedDeposit}
                      </div>
                    </div>
                  </div>
                  {isAuthenticated ? (
                    owner ? (
                      <div>
                        <div className="flex items-center gap-2 mt-4">
                          <div className="text-gray-600">Owner Name:</div>
                          <div className="text-gray-900 font-semibold font-nunito text-base">
                            {owner?.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-gray-600">Phone:</div>
                          <div className="text-gray-900 font-semibold font-nunito text-base">
                            {owner?.phoneNo}
                          </div>
                        </div>
                        <div className="flex">
                          {owner?.phoneNo && (
                            <div className="flex w-full mt-4 gap-2">
                              <Link
                                href={`tel:${owner?.phoneNo}`}
                                className="flex items-center justify-center flex-1 gap-2 border rounded-lg py-2 bg-red-500 hover:bg-red-600"
                              >
                                <PhoneCall size={20} className="text-white" />
                                <span className="text-white">Call Owner</span>
                              </Link>
                              <Link
                                className="flex items-center justify-center flex-1 gap-1 border rounded-lg py-2 hover:bg-green-600 bg-green-500"
                                href={`https://wa.me/${owner?.phoneNo}?text=${encodeURIComponent("Hey, I got your number regarding your property from HouseClay.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <SvgIcon
                                  iconSize="small"
                                  name="whatsapp"
                                  size={32}
                                  className="text-white"
                                />
                                <span className="text-white">WhatsApp</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        className="mt-4 px-8 py-3 border bg-red-500 border-red-500 text-white rounded-xl w-full text-base max-md:text-sm hover:bg-red-600 transition-colors"
                        onClick={() => openDialog(UNLOCK_DETAILS_DIALOG_ID)}
                      >
                        Contact Owner
                      </button>
                    )
                  ) : (
                    <button
                      className="mt-4 px-8 py-3 border bg-red-500 border-red-500 text-white rounded-xl w-full text-base max-md:text-sm hover:bg-red-600 transition-colors"
                      onClick={() => openDialog(CONTACT_LOGIN_DIALOG_ID)}
                    >
                      Log in to Contact Owner
                    </button>
                  )}
                </div>
              </section>

              {/* Activity Card */}
              <section className="bg-white border rounded-xl px-4 py-6 mb-6">
                <h3 className="text-xl mb-4">Activity On This Property</h3>
                <div className="grid grid-cols-3 gap-4 divide-x">
                  <div className="flex flex-col items-start gap-3">
                    <Eye size={24} className="text-red-500" />
                    <div className="text-start">
                      <div className="font-semibold text-gray-900 mb-1">
                        {viewUserCount ?? "-"}
                      </div>
                      <div className="text-sm text-gray-500">Unique Views</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 pl-4">
                    <Heart size={24} className="text-red-500" />
                    <div className="text-start">
                      <div className="font-semibold text-gray-900 mb-1">
                        {shortlistUserCount ?? "-"}
                      </div>
                      <div className="text-sm text-gray-500">Shortlists</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 pl-4">
                    <Phone size={24} className="text-red-500" />
                    <div className="text-start">
                      <div className="font-semibold text-gray-900 mb-1">
                        {contactUserCount ?? "-"}
                      </div>
                      <div className="text-sm text-gray-500">Contacted</div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Exclusive listing */}
              {/* {property?.managed ? (
                <section className="flex flex-col justify-between items-center gap-4 mb-6">
                  <button className="px-8 py-3 flex justify-around border rounded-xl w-full text-base max-md:text-sm hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Crown size={24} className="text-yellow-500" />
                      <span>This is an Exclusive listing</span>
                    </div>
                  </button>
                </section>
              ) : null} */}
              {/* Featured Property */}
              {property?.featured && (
                <section className="flex flex-col justify-between items-center gap-4 mb-6">
                  <button className="px-8 py-3 flex justify-around border rounded-xl w-full text-base max-md:text-sm hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <SquareStar size={24} className="text-red-500" />
                      <span>This is an Featured Property</span>
                    </div>
                  </button>
                </section>
              )}
              {owner && !reported && !propertyOwner ? (
                <section className="flex flex-col justify-between items-center mb-6">
                  <button
                    className="text-sm text-gray-700 hover:text-gray-700 flex items-center gap-2 disabled:cursor-not-allowed disabled:text-gray-400"
                    onClick={handleReportListingClick}
                    disabled={!isAuthenticated}
                  >
                    <Flag size={14} />
                    <span className="underline">Report this listing</span>
                  </button>
                </section>
              ) : null}
            </section>
          </section>

          {/* Main Content Section Mobile*/}
          <section className="flex-col w-full xl:gap-16 lg:gap-8 md:gap-0 gap-0 max-md:pt-4 md:hidden">
            {/* Property Details Section */}
            <section className="border rounded-xl shadow-md px-4 py-6">
              {/* Rent - Beds and Baths, Flatmate - Room Type, Bathroom Type */}
              <div className="grid grid-cols-2 gap-2 justify-items-center items-center divide-x mb-2">
                {propertyCategory === PropertyCategory.RENT ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <BedDouble size={20} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        No. of Bedroom
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {bedrooms}
                      </div>
                    </div>
                  </div>
                ) : propertyCategory === PropertyCategory.FLATMATE ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <BedDouble size={20} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        Room Type
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {roomType} Room
                      </div>
                    </div>
                  </div>
                ) : null}

                {propertyCategory === PropertyCategory.RENT ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <Bath size={20} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        No. of Bathroom
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {bathrooms}
                      </div>
                    </div>
                  </div>
                ) : propertyCategory === PropertyCategory.FLATMATE ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <Bath size={20} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        Bathroom Type
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {bathroomType}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Rent - Balcony, Builtup area, Flatmate - Balcony Type, Non Veg Allowed */}
              <div className="grid grid-cols-2 gap-2 justify-items-center items-center divide-x mb-2">
                {propertyCategory === PropertyCategory.RENT ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <RemoteSvg src={balconyIconURL} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        No. of Balcony
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {balcony}
                      </div>
                    </div>
                  </div>
                ) : propertyCategory === PropertyCategory.FLATMATE ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <RemoteSvg src={balconyIconURL} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        Balcony Type
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {balconyType}
                      </div>
                    </div>
                  </div>
                ) : null}

                {propertyCategory === PropertyCategory.RENT ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <RemoteSvg src={builtUpAreaIconURL} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        Builtup Area
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {property?.builtUpArea} Sq. Ft
                      </div>
                    </div>
                  </div>
                ) : propertyCategory === PropertyCategory.FLATMATE ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <Utensils size={20} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        Non-Veg Allowed
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {nonVegAllowed}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Rent - Parking, Available from, Flatmate - Furnishing, Available from */}
              <div className="grid grid-cols-2 gap-2 justify-items-center items-center divide-x mb-2">
                {propertyCategory === PropertyCategory.RENT ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <ParkingCircle size={20} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        Parking
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {parking}
                      </div>
                    </div>
                  </div>
                ) : propertyCategory === PropertyCategory.FLATMATE ? (
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <Sofa size={20} />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-xs">
                        Furnishing
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-sm">
                        {furnishingStatus}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <HousePlus size={20} />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Available From
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {availableFrom}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section className="py-6">
              <h2 className="text-xl mb-4">Description</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  {showFullDescription
                    ? property?.description
                    : descriptionSentences.slice(0, 3).join(". ") +
                      (descriptionSentences.length > 3 ? "..." : "")}
                </p>
                {descriptionSentences.length > 3 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-red-600 hover:text-red-600 font-medium"
                  >
                    {showFullDescription ? "Show less" : "Show more >"}
                  </button>
                )}
              </div>
            </section>

            {/* Property Details Grid */}
            <section className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 md:p-6">
                {/* Other details */}
                <h2 className="text-xl mb-4 font-semibold">Other Details</h2>

                <div className="flex flex-col gap-2 md:gap-6">
                  {Array.from({ length: propertyDetailRowCount }).map(
                    (_, index) => {
                      const leftItem = propertyDetailLeftColumnWithIcons[index];
                      const rightItem =
                        propertyDetailRightColumnWithIcons[index];

                      return (
                        <div key={index} className="grid grid-cols-2 pb-2">
                          {/* LEFT COLUMN ITEM */}
                          <div className="border-r border-gray-100 pr-2">
                            {leftItem ? (
                              <PropertyDetailItem
                                icon={leftItem.icon}
                                label={leftItem.label}
                                value={leftItem.value}
                              />
                            ) : (
                              <div className="h-full" />
                            )}
                          </div>

                          {/* RIGHT COLUMN ITEM */}
                          <div className="pl-3">
                            {rightItem && (
                              <PropertyDetailItem
                                icon={rightItem.icon}
                                label={rightItem.label}
                                value={rightItem.value}
                              />
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </section>

            {/* Amenities Section */}
            {property?.amenities.length > 0 ? (
              <section className="py-6">
                <h2 className="text-xl mb-4">What this place offers</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {property?.amenities?.map((amenityValue: string) => {
                    const amenityIcon =
                      AMENITY_ICONS[amenityValue as keyof typeof AMENITY_ICONS];
                    const amenityLabel =
                      AMENITY_LABELS[amenityValue] ?? amenityValue;
                    if (!amenityIcon) return null;
                    return (
                      <div
                        key={amenityValue}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        {amenityIcon}
                        <span>{amenityLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {/* Map Section */}
            <section className="py-6">
              <div className="flex flex-col justify-between items-start mb-6">
                <h2 className="text-xl mb-2 flex gap-1 items-center">
                  <span className="">Where you&apos;ll be</span>
                  <MapPin size={20} />
                </h2>
                <div className="flex items-center gap-2 text-gray-700">
                  {property?.locationOrSocietyName}, {property?.city}
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <PlacesAutocomplete
                    id="destination"
                    name="destination"
                    placeholder="Type in place to get direction"
                    value={origin}
                    onChange={(value) => setOrigin(value)}
                    onLocationSelect={(location) =>
                      setOrigin(location.name || "")
                    }
                    containerClassName="w-full relative flex-1"
                    inputClassName="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dropdownClassName="absolute z-10 mt-1 py-1 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-b-xl"
                    dropdownItemClassName="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!origin) return;

                    const destination = `${property?.latitude ?? 12.9716},${
                      property?.longitude ?? 77.5946
                    }`;

                    openMapsDirections(origin, destination);

                    setTimeout(() => setShowDirections(true), 1000);
                  }}
                  disabled={!origin}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <CornerUpRight size={20} />
                </button>
              </div>
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <GoogleMapsDirection
                  mapId="property-details-map"
                  center={{
                    lat: property?.latitude || 12.9716,
                    lng: property?.longitude || 77.5946,
                  }}
                  zoom={15}
                  className="h-full w-full border rounded-xl shadow-lg"
                  origin={origin}
                  destination={{
                    lat: property?.latitude || 12.9716,
                    lng: property?.longitude || 77.5946,
                  }}
                  showDirections={showDirections}
                />
              </div>
            </section>

            {/* Activity On This Property */}
            <section className="bg-white border rounded-xl px-4 py-6 mb-6">
              <h3 className="text-xl mb-4">Activity On This Property</h3>
              <div className="grid grid-cols-3 gap-4 divide-x">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <Eye size={20} className="text-red-500" />
                    <span className="text-base font-semibold text-gray-900 mb-1">
                      {viewUserCount ?? "-"}
                    </span>
                  </div>
                  <div className="text-start">
                    <div className="text-xs text-gray-500">Unique Views</div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1 pl-2">
                  <div className="flex items-center gap-2">
                    <Heart size={20} className="text-red-500" />
                    <span className="text-base font-semibold text-gray-900 mb-1">
                      {shortlistUserCount ?? "-"}
                    </span>
                  </div>
                  <div className="text-start">
                    <div className="text-xs text-gray-500">Shortlists</div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1 pl-2">
                  <div className="flex items-center gap-2">
                    <Phone size={20} className="text-red-500" />
                    <span className="text-base font-semibold text-gray-900 mb-1">
                      {contactUserCount ?? "-"}
                    </span>
                  </div>
                  <div className="text-start">
                    <div className="text-xs text-gray-500">Contacted</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Exclusive listing */}
            {/* <section className="flex flex-col justify-between items-center gap-4">
              <button className="px-8 py-3 flex justify-around border rounded-xl w-full text-base max-md:text-sm max-md:hidden hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Crown size={24} className="text-yellow-500" />
                  <span>This is an Exclusive listing</span>
                </div>
              </button>
            </section> */}

            {/* Report this listing */}
            {owner && !reported && !propertyOwner ? (
              <section className="flex justify-around items-center">
                <button
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
                  onClick={handleReportListingClick}
                >
                  <Flag size={14} />
                  <span className="underline">Report this listing</span>
                </button>
              </section>
            ) : null}
          </section>
        </section>
      </section>

      {/* Contact Owner Section */}
      <MobileFooter>
        <div className="flex w-full gap-2">
          <div className="flex flex-col justify-evenly items-start w-1/3">
            <div className="flex items-center gap-2">
              <div className="text-gray-600">{catBasedPriceOrRentTag}</div>
              <div className="text-gray-900 flex gap-1 items-center">
                {formattedPriceOrRentAmount}
                <Info
                  size={16}
                  className="text-gray-600 hover:cursor-pointer"
                  onClick={() => openDialog(MONTHLY_CHARGES_DIALOG_ID)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-gray-600">Deposit:</div>
              <div className="text-gray-900">{formattedDeposit}</div>
            </div>
          </div>

          {owner ? (
            <div className="flex flex-col justify-between w-2/3">
              {/* <div className="flex items-center gap-2">
                  <div className="text-gray-600">Owner:</div>
                  <div className="text-gray-900">{owner?.name}</div>
                </div> */}
              {owner?.phoneNo && (
                <div className="flex w-full gap-2">
                  <a
                    href={`tel:${owner?.phoneNo}`}
                    className="flex items-center justify-center gap-1 border rounded-lg px-4 py-2.5 border-red-500 hover:bg-red-100 w-1/2"
                  >
                    <PhoneCall size={20} className="text-red-500" />
                    Call
                  </a>
                  <a
                    className="flex items-center justify-center gap-1 border rounded-lg px-2 py-2.5 hover:bg-green-100 border-green-500 w-1/2"
                    href={`https://wa.me/${owner?.phoneNo}?text=${encodeURIComponent("Hey, I got your number regarding your property from HouseClay.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SvgIcon
                      iconSize="small"
                      name="whatsapp"
                      size={22}
                      className="text-green-500"
                    />
                    Whatsapp
                  </a>
                </div>
              )}
            </div>
          ) : (
            <button
              className="w-2/3 px-8 py-3 border bg-red-500 border-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              onClick={() =>
                isAuthenticated
                  ? openDialog(UNLOCK_DETAILS_DIALOG_ID)
                  : openDialog(CONTACT_LOGIN_DIALOG_ID)
              }
            >
              Contact Owner
            </button>
          )}
        </div>
      </MobileFooter>
      {/* Mobile Photo Gallery Dialog */}
      {isDialogOpen(PHOTO_GALLERY_DIALOG_ID) && (
        <PhotoGalleryDialog
          id={PHOTO_GALLERY_DIALOG_ID}
          images={propertyImages || []}
          onClose={() => closeDialog(PHOTO_GALLERY_DIALOG_ID)}
        />
      )}

      {/* Contact owner login dialog */}
      {isDialogOpen(CONTACT_LOGIN_DIALOG_ID) && (
        <ContactOwnerLoginDialog
          id={CONTACT_LOGIN_DIALOG_ID}
          onClose={() => closeDialog(CONTACT_LOGIN_DIALOG_ID)}
        />
      )}

      {/* Unlock owner details dialog */}
      {isDialogOpen(UNLOCK_DETAILS_DIALOG_ID) && (
        <UnlockOwnerDetailsDialog
          id={UNLOCK_DETAILS_DIALOG_ID}
          propertyID={propertyID}
          onClose={async () => {
            closeDialog(UNLOCK_DETAILS_DIALOG_ID);
            // Invalidate the server cache specific to this property
            await refreshPropertyCache(propertyID);
            // Refresh server-side data after unlocking owner details
            router.refresh();
          }}
        />
      )}

      {/* Monthly Charges mobile dialog */}
      {isDialogOpen(MONTHLY_CHARGES_DIALOG_ID) && (
        <MonthlyChargesDialog
          id={MONTHLY_CHARGES_DIALOG_ID}
          rent={formattedPriceOrRentAmount}
          maintenance={maintenance}
          onClose={() => closeDialog(MONTHLY_CHARGES_DIALOG_ID)}
        />
      )}

      {/* Report this listing dialog */}
      {isDialogOpen(REPORT_LISTING_DIALOG_ID) && (
        <ReportListingDialog
          id={REPORT_LISTING_DIALOG_ID}
          propertyId={propertyID}
          onClose={async () => {
            closeDialog(REPORT_LISTING_DIALOG_ID);
            // Invalidate the server cache specific to this property
            await refreshPropertyCache(propertyID);
            // Refresh server-side data after reporting property
            router.refresh();
          }}
        />
      )}
    </>
  );
}
