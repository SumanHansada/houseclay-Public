"use client";

import { floorPlan } from "@lucide/lab";
import { motion } from "framer-motion";
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
  Icon,
  InspectionPanel,
  KeyRound,
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
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

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
  poolTableIconURL,
  securityIconURL,
  smokeAlarmIconURL,
  swimmingPoolIconURL,
  twentyFourXSevenIconURL,
  wifiIconURL,
} from "@/common/dataConstants/cdnURL";
import {
  BALCONY_TYPE_OPTIONS,
  BATHROOM_TYPE_OPTIONS,
  BHK_TYPE_OPTIONS,
  FACING_OPTIONS,
  FLOOR_NUMERIC_OPTIONS,
  FURNISHING_OPTIONS,
  getOptionLabel,
  getOptionLabels,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  PREFERRED_TENANTS_OPTIONS,
  PROPERTY_AGE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  TOTAL_FLOORS_NUMERIC_OPTIONS,
  WATER_SUPPLY_OPTIONS,
} from "@/common/dataConstants/options";
import { PropertyCategory } from "@/common/enums";
import {
  formatDateToReadable,
  formatINRCurrency,
  pascalCase,
  processPropertyImages,
} from "@/common/utils";
import { ContactOwnerLoginDialog, PhotoGalleryDialog } from "@/dialogs";
import ReportListingDialog from "@/dialogs/report-listing-dialog";
import UnlockOwnerDetailsDialog from "@/dialogs/unlock-owner-details-dialog";
import { useShortlist } from "@/hooks/useShortlist";
import { PropertyCardWithImages } from "@/interfaces/User";
import { MobileFooter } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGetAuthenticatedPropertyByIdQuery,
  useGetPublicPropertyByIdQuery,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { PhotoGallery, RemoteSvg, SvgIcon } from "@/utility-components";
import { GoogleMapsDirection } from "@/utility-components";

import { DetailRow } from "./components/DetailRow";
import Loading from "./loading";

const AmenitiesMap = {
  Lift: { label: "Lift", icon: <RemoteSvg src={liftIconURL} /> },
  Clubhouse: {
    label: "Club house",
    icon: <RemoteSvg src={clubhouseIconURL} />,
  },
  Gym: { label: "Gym", icon: <RemoteSvg src={gymIconURL} /> },
  "Outdoor Dining Area": {
    label: "Outdoor Dining Area",
    icon: <RemoteSvg src={outdoorDiningAreaIconURL} />,
  },
  "Fire Extinguisher": {
    label: "Fire Extinguisher",
    icon: <RemoteSvg src={fireExtinguisherIconURL} />,
  },
  "Smoke Alarm": {
    label: "Smoke Alarm",
    icon: <RemoteSvg src={smokeAlarmIconURL} />,
  },
  "Swimming Pool": {
    label: "Swimming Pool",
    icon: <RemoteSvg src={swimmingPoolIconURL} />,
  },
  "24/7 Power": {
    label: "24/7 Power",
    icon: <RemoteSvg src={twentyFourXSevenIconURL} />,
  },
  Security: { label: "Security", icon: <RemoteSvg src={securityIconURL} /> },
  "Visitor Parking": {
    label: "Visitor Parking",
    icon: <RemoteSvg src={parkingSpaceIconURL} />,
  },
  "Dedicated Workspace": {
    label: "Dedicated Workspace",
    icon: <RemoteSvg src={dedicatedWorkspaceIconURL} />,
  },
  Wifi: { label: "Wifi", icon: <RemoteSvg src={wifiIconURL} /> },
  "Pool Table": {
    label: "Pool Table",
    icon: <RemoteSvg src={poolTableIconURL} />,
  },
  "First Aid Kit": {
    label: "First Aid Kit",
    icon: <RemoteSvg src={firstAidKitIconURL} />,
  },
  Intercom: {
    label: "Intercom",
    icon: <Headset size={24} strokeWidth={1.5} />,
  },
  "Sewage Treatment": {
    label: "Sewage Treatment",
    icon: <Dam size={24} strokeWidth={1.5} />,
  },
  "House Keeping": {
    label: "House Keeping",
    icon: <BrushCleaning size={24} strokeWidth={1.5} />,
  },
  "Rain Water Harvesting": {
    label: "Rain Water Harvesting",
    icon: <CloudHail size={24} strokeWidth={1.5} />,
  },
  "Children Play Area": {
    label: "Children Play Area",
    icon: <Blocks size={24} strokeWidth={1.5} />,
  },
  "Guest Room": {
    label: "Guest Room",
    icon: <BedSingle size={24} strokeWidth={1.5} />,
  },
  "Community Hall": {
    label: "Community Hall",
    icon: <Landmark size={24} strokeWidth={1.5} />,
  },
};

const CONTACT_LOGIN_DIALOG_ID = "contact-owner-login-dialog";
const UNLOCK_DETAILS_DIALOG_ID = "unlock-owner-details-dialog";

interface PropertyDetailsClientProps {
  propertyID: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
}

export function PropertyDetailsClient({
  propertyID,
  initialData,
}: PropertyDetailsClientProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  // const { data: propertyData = initialData, isLoading: _isPropertyLoading } =
  //   useGetPublicPropertyByIdQuery(propertyID, {
  //     skip: !!initialData, // Skip the query if we have initial data
  //   });

  // call both hooks, but skip the ones we don't need
  const { data: publicPropertyData = initialData, isLoading: isPublicLoading } =
    useGetPublicPropertyByIdQuery(propertyID, {
      skip: isAuthenticated,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const {
    data: authenticatedPropertyData,
    isLoading: isAuthLoading,
    refetch: refetchAuthPropertyDetails,
  } = useGetAuthenticatedPropertyByIdQuery(propertyID, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Merge the data based on authentication status
  const propertyData = useMemo(() => {
    if (isAuthenticated && authenticatedPropertyData) {
      return {
        property: authenticatedPropertyData.property.property,
        contactUserCount: authenticatedPropertyData.property.contactUserCount,
        shortlistUserCount:
          authenticatedPropertyData.property.shortlistUserCount,
        viewUserCount: authenticatedPropertyData.property.viewUserCount,
        owner: authenticatedPropertyData.owner,
        reported: authenticatedPropertyData.reported,
        propertyOwner: authenticatedPropertyData.propertyOwner,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return publicPropertyData as any;
  }, [isAuthenticated, authenticatedPropertyData, publicPropertyData]);

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

  const isLoading = isAuthenticated ? isAuthLoading : isPublicLoading;

  if (isLoading) {
    <Loading />;
  }

  const {
    property,
    contactUserCount,
    shortlistUserCount,
    viewUserCount,
    owner,
    reported,
    propertyOwner,
  } = propertyData;

  const propertyCategory = useMemo(
    () => property?.propertyCategory ?? PropertyCategory.RENT,
    [property],
  );

  // Common derivations
  const commonDerivations = useMemo(
    () => ({
      bhkType: getOptionLabel(BHK_TYPE_OPTIONS, property?.bhkType),
      propertyType: getOptionLabel(
        PROPERTY_TYPE_OPTIONS,
        property?.propertyType,
      ),
      propertyFacing:
        property?.facing === "dont-know"
          ? "Not Specified"
          : getOptionLabel(FACING_OPTIONS, property?.facing),
      propertyFloor: getOptionLabel(FLOOR_NUMERIC_OPTIONS, property?.floor),
      totalFloors: getOptionLabel(
        TOTAL_FLOORS_NUMERIC_OPTIONS,
        property?.totalFloors,
      ),
      furnishingStatus: getOptionLabel(
        FURNISHING_OPTIONS,
        property?.furnishing,
      ),
      parking: (() => {
        return property?.parking === "both"
          ? "Car and Bike"
          : getOptionLabel(PARKING_OPTIONS, property?.parking);
      })(),
      bedrooms: (() => {
        const bhk = getOptionLabel(BHK_TYPE_OPTIONS, property?.bhkType);
        return bhk
          ? bhk === "Studio" || bhk === "1-bhk"
            ? "1 Bedroom"
            : `${bhk.split("BHK")[0]} Bedrooms`
          : "";
      })(),
      builtUpArea: `${property?.builtUpArea || 0} Sq. Ft`,
      availableFrom: property?.availableFrom
        ? formatDateToReadable(property?.availableFrom)
        : "",
      maintenance: formatINRCurrency(property?.maintenanceCharges || 0),
      waterSupply: getOptionLabel(WATER_SUPPLY_OPTIONS, property?.waterSupply),
      powerBackup: getOptionLabel(POWER_BACKUP_OPTIONS, property?.powerBackup),
      nonVegAllowed: property?.nonVegAllowed ? "Yes" : "No",
      // whoWillShow: getOptionLabel(
      //   WHO_WILL_SHOW_PROPERTY_OPTIONS,
      //   property?.whoWillShowProperty,
      // ),
    }),
    [property],
  );

  // Category-specific derivations
  const categoryDerivations = useMemo(() => {
    switch (propertyCategory) {
      case PropertyCategory.FLATMATE:
        return {
          roomType: getOptionLabel(ROOM_TYPE_OPTIONS, property?.roomType),
          tenantType: getOptionLabel(
            PREFERRED_TENANTS_OPTIONS.FLATMATE,
            property?.tenantType,
          ),
          balconyType: getOptionLabel(
            BALCONY_TYPE_OPTIONS,
            property?.balconyType,
          ),
          bathroomType: getOptionLabel(
            BATHROOM_TYPE_OPTIONS,
            property?.bathroomType,
          ),
          smokingAllowed: property?.smokingPreference ? "Yes" : "No",
          drinkingAllowed: property?.drinkingPreference ? "Yes" : "No",
        };
      case PropertyCategory.RENT:
        return {
          propertyAge:
            propertyCategory !== PropertyCategory.FLATMATE
              ? getOptionLabel(PROPERTY_AGE_OPTIONS, property?.propertyAge)
              : "",
          flooring: pascalCase(property?.floorType || ""),
          bathrooms:
            propertyCategory !== PropertyCategory.FLATMATE
              ? `${property?.bathrooms || 0} ${property?.bathrooms > 1 ? "Bathrooms" : "Bathroom"}`
              : "",
          balcony:
            propertyCategory !== PropertyCategory.FLATMATE
              ? `${property?.balcony || 0} ${property?.balcony > 1 ? "Balconies" : "Balcony"}`
              : "",
          // rentNegotiable: property?.rentNegotiable ? "Yes" : "No",
          // ownershipType: getOptionLabel(
          //   OWNERSHIP_TYPE_OPTIONS,
          //   property?.ownershipType,
          // ),
          preferredTenants: getOptionLabels(
            PREFERRED_TENANTS_OPTIONS.RENT,
            property?.preferredTenants,
          ).join(", "),
        };
      default:
        return {};
    }
  }, [property, propertyCategory]);

  // Price/Rent/Deposit
  const priceDerivations = useMemo(
    () => ({
      tag: propertyCategory === PropertyCategory.RESALE ? "Price:" : "Rent:",
      amount:
        propertyCategory === PropertyCategory.RESALE
          ? formatINRCurrency(property?.price)
          : formatINRCurrency(property?.rent),
      deposit: formatINRCurrency(
        property?.deposit || property?.depositCharges || 0,
      ),
    }),
    [property, propertyCategory],
  );

  const propertyImages = useMemo(
    () => processPropertyImages(property?.images),
    [property],
  );

  // Destructure for use in JSX
  const {
    bhkType,
    propertyType,
    propertyFacing,
    propertyFloor,
    totalFloors,
    furnishingStatus,
    parking,
    bedrooms,
    builtUpArea,
    availableFrom,
    // TODO: show maintenance charges on hover
    maintenance,
    waterSupply,
    powerBackup,
    nonVegAllowed,
  } = commonDerivations;

  console.log(maintenance);

  const {
    balconyType,
    propertyAge,
    roomType,
    bathrooms,
    balcony,
    tenantType,
    bathroomType,
    smokingAllowed,
    drinkingAllowed,
    flooring,
    preferredTenants,
  } = categoryDerivations;

  const {
    tag: catBasedPriceOrRentTag,
    amount: formattedPriceOrRentAmount,
    deposit: formattedDeposit,
  } = priceDerivations;

  // Title
  const propertyTitle = useMemo(() => {
    switch (propertyCategory) {
      case PropertyCategory.FLATMATE:
        return `${roomType + " Room"} for ${tenantType} in a ${bhkType} in ${property?.locationOrSocietyName}, ${property?.city}`;
      default:
      case PropertyCategory.RENT:
        return `${bhkType} in ${property?.locationOrSocietyName} for ${pascalCase(propertyCategory)} in ${property?.city}`;
    }
  }, [property, propertyCategory, bhkType, roomType, tenantType]);

  const getCategorySpecificFields = () => {
    switch (propertyCategory) {
      case PropertyCategory.RENT:
        // Use the destructured variables from categoryDerivations
        return {
          leftFields: [],
          rightFields: [
            { label: "Furnishing", value: furnishingStatus, icon: Sofa },
            {
              label: "Preferred Tenants",
              value: preferredTenants,
              icon: Users,
            },
            { label: "Flooring", value: flooring, icon: InspectionPanel },
            { label: "Non-Veg Allowed", value: nonVegAllowed, icon: Utensils },
            { label: "Property Age", value: propertyAge, icon: Hourglass },
          ],
        };
      case PropertyCategory.FLATMATE:
        return {
          leftFields: [],
          rightFields: [
            { label: "Tenant Type", value: tenantType, icon: Users },
            {
              label: "Smoking Allowed",
              value: smokingAllowed,
              icon: Cigarette,
            },
            { label: "Drinking Allowed", value: drinkingAllowed, icon: Wine },
            { label: "Parking", value: parking, icon: ParkingCircle },
          ],
        };
      default:
        return { leftFields: [], rightFields: [] };
    }
  };

  const categoryFields = getCategorySpecificFields();

  const leftColumnData = [
    // Common fields
    { label: "Property Type", value: propertyType, icon: House },
    { label: "Facing", value: propertyFacing, icon: Compass },
    {
      label: "Floor",
      value: `${propertyFloor}/${totalFloors}`,
      icon: Building2,
    },
    { label: "Water Supply", value: waterSupply, icon: Droplets },
    { label: "Power Backup", value: powerBackup, icon: SmartphoneCharging },

    // Category-specific fields
    ...categoryFields.leftFields,
  ];

  const rightColumnData = [
    // Category-specific fields
    ...categoryFields.rightFields,
  ];

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

  // Split description into sentences array
  const descriptionSentences = property?.description
    ? property.description
        .split(/[.!?] +/)
        .filter((sentence: string) => sentence.trim().length > 0)
    : [];

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
          {/* {property.managed && (
            <button className="rounded-full border md:border-none items-center justify-center p-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 fill-current">
              <Crown onClick={() => console.log("Crown Clicked")} size={20} />
            </button>
          )} */}
          {property.featured && (
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
              <SvgIcon
                iconSize="medium"
                name="property-placeholder-icon"
                size={80}
              />
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
                <span>
                  Properties for {pascalCase(property?.propertyCategory)}
                </span>
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
                  {property.locationOrSocietyName}, {property.city}
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
                {property.landmark}
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
                <SvgIcon
                  iconSize="medium"
                  name="property-placeholder-icon"
                  size={120}
                />
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
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Property type, Age of building, Facing, Flooring */}
                  <div className="space-y-4">
                    {leftColumnData.map((item, index) => (
                      <DetailRow
                        key={item.label + index}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>

                  {/* Right Column - Bathrooms, Furnishing, Floor*/}
                  <div className="space-y-4">
                    {rightColumnData.map((item, index) => (
                      <DetailRow
                        key={item.label + index}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
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
              <section className="py-6 mb-6">
                <h2 className="text-xl mb-4">What this place offers</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {property?.amenities?.map((amenity: string) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      {AmenitiesMap[amenity as keyof typeof AmenitiesMap]?.icon}
                      <span>
                        {AmenitiesMap[amenity as keyof typeof AmenitiesMap]
                          ?.label || amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

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

                {/* Parking, Available from */}
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
                      <div className="text-gray-900 font-semibold font-nunito text-base">
                        {formattedPriceOrRentAmount}
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
                                href={`https://wa.me/${owner?.phoneNo}`}
                                target="_blank"
                                rel="noreferrer"
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
              {/* {property.managed ? (
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
              {property.featured && (
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
              <div className="grid grid-cols-2 gap-2 justify-items-center items-center divide-x mb-2">
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
              </div>

              <div className="grid grid-cols-2 gap-2 justify-items-center items-center divide-x mb-2">
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
              </div>

              <div className="grid grid-cols-2 gap-2 justify-items-center items-center divide-x mb-2">
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
            <section className="bg-white px-4 py-6 border rounded-xl shadow-md">
              <h2 className="text-xl mb-4">Other Details</h2>
              <div className="grid grid-cols-2 gap-2 divide-x mb-2">
                {/* Left Column */}
                <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <House size={20} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Property Type
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {propertyType}
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <Hourglass size={20} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Age of Building
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {propertyAge}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 divide-x mb-2">
                <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <Compass size={20} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Facing
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {propertyFacing}
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <Building2 size={20} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Floor
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {propertyFloor}/{totalFloors}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 divide-x mb-2">
                <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <KeyRound size={20} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Bathrooms
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {bathrooms}
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <Sofa size={20} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Furnishing Status
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {furnishingStatus}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 divide-x mb-2">
                <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <Icon iconNode={floorPlan} size={20} />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Flooring
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {pascalCase(property?.floorType)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Amenities Section */}
            <section className="py-6">
              <h2 className="text-xl mb-4">What this place offers</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {property?.amenities?.map((amenity: string) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    {AmenitiesMap[amenity as keyof typeof AmenitiesMap]?.icon}
                    <span>
                      {AmenitiesMap[amenity as keyof typeof AmenitiesMap]
                        ?.label || amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

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
                    if (origin) {
                      const destination = `${property?.latitude || 12.9716},${property?.longitude || 77.5946}`;

                      // Try Google Maps first, then Apple Maps, then web
                      const googleMapsUrl = `comgooglemaps://?saddr=${encodeURIComponent(origin)}&daddr=${destination}&directionsmode=driving`;
                      // const appleMapsUrl = `maps://?saddr=${encodeURIComponent(origin)}&daddr=${destination}&dirflg=d`;

                      // Try to open Google Maps first
                      const link = document.createElement("a");
                      link.href = googleMapsUrl;
                      link.click();

                      // Fallback to Apple Maps after a short delay
                      // setTimeout(() => {
                      //   const appleLink = document.createElement("a");
                      //   appleLink.href = appleMapsUrl;
                      //   appleLink.click();

                      //   // Final fallback to web version
                      //   setTimeout(() => {
                      //     setShowDirections(!!origin);
                      //   }, 1000);
                      // }, 1000);

                      setTimeout(() => {
                        setShowDirections(!!origin);
                      }, 1000);
                    } else {
                      setShowDirections(!!origin);
                    }
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
              <div className="text-gray-900">{formattedPriceOrRentAmount}</div>
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
                    href={`https://wa.me/${owner?.phoneNo}`}
                    target="_blank"
                    rel="noreferrer"
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
      {isDialogOpen("photo-gallery-dialog") && (
        <PhotoGalleryDialog
          id="photo-gallery-dialog"
          images={propertyImages || []}
          onClose={() => closeDialog("photo-gallery-dialog")}
        />
      )}

      {/* Contact owner login dialog */}
      {isDialogOpen(CONTACT_LOGIN_DIALOG_ID) && (
        <ContactOwnerLoginDialog
          id={CONTACT_LOGIN_DIALOG_ID}
          // onSuccess={async () => {
          //   if (authenticatedPropertyData) {
          //     await refetchAuthPropertyDetails();
          //   }
          // }}
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
            await refetchAuthPropertyDetails();
          }}
        />
      )}

      {/* Report this listing dialog */}
      {isDialogOpen("report-listing-dialog") && (
        <ReportListingDialog
          id="report-listing-dialog"
          propertyId={propertyID}
          onClose={async () => {
            closeDialog("report-listing-dialog");
            await refetchAuthPropertyDetails();
          }}
        />
      )}
    </>
  );
}
