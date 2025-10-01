"use client";

import { floorPlan } from "@lucide/lab";
import { motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  Building2,
  ChevronLeft,
  Compass,
  Crown,
  Eye,
  Flag,
  Heart,
  Hourglass,
  House,
  HousePlus,
  Icon,
  KeyRound,
  MapPin,
  ParkingCircle,
  Phone,
  Share,
  Sofa,
  SquareStar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import TwentyFourSevenPowerIconSvg from "public/icons/amenities/24x7-power.svg";
import BBQGrillIconSvg from "public/icons/amenities/bbq-grill.svg";
import ClubhouseIconSvg from "public/icons/amenities/clubhouse.svg";
import DedicatedWorkspaceIconSvg from "public/icons/amenities/dedicated-workspace.svg";
import FireExtinguisherIconSvg from "public/icons/amenities/fire-extinguisher.svg";
import FirstAidKitIconSvg from "public/icons/amenities/first-aid-kit.svg";
import GatedSecurityIconSvg from "public/icons/amenities/gated-security.svg";
import GymIconSvg from "public/icons/amenities/gym.svg";
import LiftIconSvg from "public/icons/amenities/lift.svg";
import OutdoorDiningAreaIconSvg from "public/icons/amenities/outdoor-dining-area.svg";
import ParkingSpaceIconSvg from "public/icons/amenities/parking-space.svg";
import PoolIconSvg from "public/icons/amenities/pool.svg";
import PoolTableIconSvg from "public/icons/amenities/pool-table.svg";
import SecurityIconSvg from "public/icons/amenities/security.svg";
import SmokeAlarmIconSvg from "public/icons/amenities/smoke-alarm.svg";
import SwimmingPoolIconSvg from "public/icons/amenities/swimming-pool.svg";
import WifiIconSvg from "public/icons/amenities/wifi.svg";
import BalconyIconSvg from "public/icons/common/balcony.svg";
import BuildUpAreaIconSvg from "public/icons/common/build-up-area.svg";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { PlacesAutocomplete } from "@/base-components";
import { PropertyCategory } from "@/common/enums";
import {
  formatDateToReadable,
  formatINRCurrency,
  pascalCase,
} from "@/common/utils";
import { ContactOwnerLoginDialog, PhotoGalleryDialog } from "@/dialogs";
import ReportListingDialog from "@/dialogs/report-listing-dialog";
import { MobileFooter } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetPublicPropertyByIdQuery } from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { RootState } from "@/store/store";
import { PhotoGallery } from "@/utility-components";
import { GoogleMapsDirection } from "@/utility-components";

const BalconyIcon = BalconyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const BuildUpAreaIcon = BuildUpAreaIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const ParkingSpaceIcon = ParkingSpaceIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

// Amenity Icons
const LiftIcon = LiftIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const ClubhouseIcon = ClubhouseIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const GymIcon = GymIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const OutdoorDiningAreaIcon = OutdoorDiningAreaIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const GatedSecurityIcon = GatedSecurityIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const PoolIcon = PoolIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const FireExtinguisherIcon = FireExtinguisherIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const SmokeAlarmIcon = SmokeAlarmIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const SwimmingPoolIcon = SwimmingPoolIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const TwentyFourSevenPowerIcon = TwentyFourSevenPowerIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const SecurityIcon = SecurityIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const DedicatedWorkspaceIcon = DedicatedWorkspaceIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const WifiIcon = WifiIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const BBQGrillIcon = BBQGrillIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const PoolTableIcon = PoolTableIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const FirstAidKitIcon = FirstAidKitIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const AmenitiesMap = {
  Lift: { label: "Lift", icon: <LiftIcon /> },
  Clubhouse: { label: "Club house", icon: <ClubhouseIcon /> },
  Gym: { label: "Gym", icon: <GymIcon /> },
  "Outdoor Dining Area": {
    label: "Outdoor Dining Area",
    icon: <OutdoorDiningAreaIcon />,
  },
  "Gated Security": { label: "Gated Security", icon: <GatedSecurityIcon /> },
  Pool: { label: "Pool", icon: <PoolIcon /> },
  "Fire Extinguisher": {
    label: "Fire Extinguisher",
    icon: <FireExtinguisherIcon />,
  },
  "Smoke Alarm": { label: "Smoke Alarm", icon: <SmokeAlarmIcon /> },
  "Swimming Pool": { label: "Swimming Pool", icon: <SwimmingPoolIcon /> },
  "24/7 Power": { label: "24/7 Power", icon: <TwentyFourSevenPowerIcon /> },
  Security: { label: "Security", icon: <SecurityIcon /> },
  "Parking Space": { label: "Parking Space", icon: <ParkingSpaceIcon /> },
  "Dedicated Workspace": {
    label: "Dedicated Workspace",
    icon: <DedicatedWorkspaceIcon />,
  },
  Wifi: { label: "Wifi", icon: <WifiIcon /> },
  "BBQ Grill": { label: "BBQ Grill", icon: <BBQGrillIcon /> },
  "Pool Table": { label: "Pool Table", icon: <PoolTableIcon /> },
  "First Aid Kit": { label: "First Aid Kit", icon: <FirstAidKitIcon /> },
};

const propertyAgeMap = {
  "Under Construction": "Under Construction",
  "Less than 1 year": "< 1 year",
  "1-5 years": "1-5 years",
  "5-10 years": "5-10 years",
  "More than 10 year": "10+ years",
};

interface PropertyDetailsClientProps {
  propertyID: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
}

export function PropertyDetailsClient({
  propertyID,
  initialData,
}: PropertyDetailsClientProps) {
  const { data: property = initialData, isLoading: _isPropertyLoading } =
    useGetPublicPropertyByIdQuery(propertyID, {
      skip: !!initialData, // Skip the query if we have initial data
    });

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [origin, setOrigin] = useState<string>("");
  const [showDirections, setShowDirections] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const router = useRouter();
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { isDialogOpen, closeDialog, openDialog } = useDialog();

  const handleShare = async () => {
    try {
      const propertyUrl = window.location.href;

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: property?.title || "Property Details",
          text: `Check out this property: ${property?.title || "Property"}`,
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

  const handleContactOwnerClick = () => {
    openDialog(
      token ? "unlock-owner-details-dialog" : "contact-owner-login-dialog",
    );
  };

  const handleContactLoginSuccess = () => {
    closeDialog("contact-owner-login-dialog");
    openDialog("unlock-owner-details-dialog");
  };

  // Split description into sentences array
  const descriptionSentences = property?.description
    ? property.description
        .split(/[.!?] +/)
        .filter((sentence: string) => sentence.trim().length > 0)
    : [];

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideStickyNavBar(true));
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideStickyNavBar(true));
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [dispatch, isMobile]);

  return (
    <>
      <section
        className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-between items-center w-full md:hidden`}
      >
        <button className="rounded-full md:border-none items-center justify-center">
          <ChevronLeft onClick={() => router.back()} size={25} />
        </button>
        <div className="flex gap-2 items-center">
          {property.managed && (
            <button className="rounded-full border md:border-none items-center justify-center p-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 fill-current">
              <Crown onClick={() => console.log("Crown Clicked")} size={18} />
            </button>
          )}
          {property.featured && (
            <button className="rounded-full border md:border-none items-center justify-center p-2 bg-gradient-to-br from-red-400 via-red-400 to-red-500 fill-current">
              <SquareStar
                onClick={() => console.log("Crown Clicked")}
                size={18}
              />
            </button>
          )}
          <button className="rounded-full border md:border-none items-center justify-center p-2">
            <Share onClick={handleShare} size={18} />
          </button>
          <motion.button
            onClick={() => setIsShortlisted(!isShortlisted)}
            className={`rounded-full border md:border-none items-center justify-center p-2 relative overflow-hidden ${
              isShortlisted ? "text-pink-500" : "text-gray-600"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {/* Heart icon with scale animation */}
            <motion.div
              animate={{
                scale: isShortlisted ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={18}
                className={isShortlisted ? "fill-current" : ""}
              />
            </motion.div>
          </motion.button>
        </div>
      </section>
      <section className="overflow-x-hidden flex-grow max-md:pb-16">
        {/* Photo Gallery Section Mobile */}
        <section className="h-60 w-full md:hidden">
          <PhotoGallery
            images={property?.images}
            className="md:h-[60vh] h-60 rounded-none"
          />
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
                  {property?.bhkType} {property?.propertyType}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 max-md:hidden">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors underline hover:bg-gray-100 rounded-md px-2 py-1"
                >
                  <Share size={16} />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setIsShortlisted(!isShortlisted)}
                  className={`flex items-center gap-2 transition-colors underline hover:bg-gray-100 rounded-md px-2 py-1 ${
                    isShortlisted
                      ? "text-pink-600 hover:text-pink-700"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isShortlisted ? "fill-current" : ""}
                  />
                  <span>{isShortlisted ? "Sortlisted" : "Sortlist"}</span>
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <div className="flex justify-between items-center mb-2">
                <p className="text-black text-sm border border-gray-200 py-1 px-1.5 rounded-full bg-gray-100">
                  {property.propertyType}
                </p>
                <p className="text-gray-500 text-sm md:hidden">
                  {property.locationOrSocietyName}, {property.city}
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-2xl text-gray-900 flex items-center gap-2">
                {property?.bhkType} in {property?.locationOrSocietyName} for{" "}
                {pascalCase(property?.propertyCategory)} in {property?.city}
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
            <PhotoGallery
              images={property?.images}
              maxDisplayImages={5}
              className="md:h-[60vh] h-96 rounded-xl"
              thumbnailPosition="bottom"
            />
          </section>

          {/* Main Content Section Desktop*/}
          <section className="flex w-full xl:gap-16 lg:gap-8 md:gap-8 gap-0 max-md:pt-4 max-md:hidden">
            {/* Left Section - 3/4 width */}
            <section className="md:w-1/2 lg:w-3/5 2xl:w-3/4 max-md:w-full">
              {/* Property Details Grid */}
              <section className="bg-white p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <House size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Property Type
                        </div>
                        <div className="font-medium text-gray-900">
                          {property?.propertyType}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Hourglass size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Age of Building
                        </div>
                        <div className="font-medium text-gray-900">
                          {
                            propertyAgeMap[
                              property?.propertyAge as keyof typeof propertyAgeMap
                            ]
                          }
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Compass size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Facing</div>
                        <div className="font-medium text-gray-900">
                          {property?.facing}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Building2 size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Floor</div>
                        <div className="font-medium text-gray-900">
                          {property?.floor}/{property?.totalFloors}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex  gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <KeyRound size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Ownership Type
                        </div>
                        <div className="font-medium text-gray-900">
                          {property?.ownershipType || "NA"}
                        </div>
                      </div>
                    </div>

                    <div className="flex  gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Sofa size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Furnishing Status
                        </div>
                        <div className="font-medium text-gray-900">
                          {property?.furnishing}
                        </div>
                      </div>
                    </div>

                    <div className="flex  gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Icon iconNode={floorPlan} size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Flooring</div>
                        <div className="font-medium text-gray-900">
                          {property?.floorType}
                        </div>
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
                <div className="flex flex-col lg:flex-row justify-between  items-start lg:items-center mb-6">
                  <h2 className="text-xl mb-4">Where you&apos;ll be</h2>
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <MapPin size={16} />
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
                <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
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
                        {property?.bhkType?.split("BHK")[0]} Bedroom
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
                      <div className="flex gap-2 items-center font-nunito text-sm">
                        No. of Bathroom
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-base">
                        {property?.bathrooms} Bathroom
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
                  <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <BalconyIcon />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-sm">
                        No. of Balcony
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-base">
                        {property?.balcony} Balcony
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                    <div className="flex-col">
                      <div className="p-0.5">
                        <BuildUpAreaIcon />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="flex gap-2 items-center font-nunito text-sm">
                        Buildup Area
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-base">
                        {property?.builtUpArea} sqft
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 justify-items-center items-center mb-4 divide-x">
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
                        {property?.parking}
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
                      <div className="flex gap-2 items-center font-nunito text-sm">
                        Available From
                      </div>
                      <div className="text-gray-900 font-semibold font-nunito text-base">
                        {formatDateToReadable(property?.availableFrom)}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-6" />

                {/* Price & Contact Section */}
                <div className="">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">
                      {property?.propertyCategory === PropertyCategory.RESALE
                        ? "Price"
                        : "Rent"}
                    </div>
                    <div>
                      {property?.propertyCategory === PropertyCategory.RESALE
                        ? property?.price
                          ? formatINRCurrency(property.price)
                          : "-"
                        : property?.rent
                          ? formatINRCurrency(property.rent)
                          : "-"}
                    </div>
                  </div>
                  <button
                    className="mt-4 px-8 py-3 border bg-red-500 border-red-500 text-white rounded-xl w-full text-base max-md:text-sm hover:bg-red-600 transition-colors"
                    onClick={handleContactOwnerClick}
                  >
                    Contact Owner
                  </button>
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
                        161
                      </div>
                      <div className="text-sm text-gray-500">Unique Views</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 pl-4">
                    <Heart size={24} className="text-red-500" />
                    <div className="text-start">
                      <div className="font-semibold text-gray-900 mb-1">2</div>
                      <div className="text-sm text-gray-500">Shortlists</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 pl-4">
                    <Phone size={24} className="text-red-500" />
                    <div className="text-start">
                      <div className="font-semibold text-gray-900 mb-1">10</div>
                      <div className="text-sm text-gray-500">Contacted</div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Exclusive listing */}
              {property.managed && (
                <section className="flex flex-col justify-between items-center gap-4 mb-6">
                  <button className="px-8 py-3 flex justify-around border rounded-xl w-full text-base max-md:text-sm hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Crown size={24} className="text-yellow-500" />
                      <span>This is an Exclusive listing</span>
                    </div>
                  </button>
                </section>
              )}
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
              <section className="flex flex-col justify-between items-center mb-6">
                <button
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
                  onClick={handleReportListingClick}
                >
                  <Flag size={14} />
                  <span className="underline">Report this listing</span>
                </button>
              </section>
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
                      {property?.bhkType?.split("BHK")[0]} Bedroom
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
                      {property?.bathrooms} Bathroom
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 justify-items-center items-center divide-x mb-2">
                <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <BalconyIcon />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      No. of Balcony
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {property?.balcony} Balcony
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-start items-start gap-2 text-gray-600 pl-2">
                  <div className="flex-col">
                    <div className="p-0.5">
                      <BuildUpAreaIcon />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex gap-2 items-center font-nunito text-xs">
                      Buildup Area
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {property?.builtUpArea}sqft
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
                      {property?.parking}
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
                      {formatDateToReadable(property?.availableFrom)}
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
                      {property?.propertyType}
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
                      {
                        propertyAgeMap[
                          property?.propertyAge as keyof typeof propertyAgeMap
                        ]
                      }
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
                      {property?.facing}
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
                      {property?.floor}/{property?.totalFloors}
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
                      Ownership Type
                    </div>
                    <div className="text-gray-900 font-semibold font-nunito text-sm">
                      {property?.ownershipType || "NA"}
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
                      {property?.furnishing}
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
                      {property?.floorType}
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl mb-4">Where you&apos;ll be</h2>
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <MapPin size={16} />
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

            {/* Activity On This Property */}
            <section className="bg-white border rounded-xl px-4 py-6 mb-6">
              <h3 className="text-xl mb-4">Activity On This Property</h3>
              <div className="grid grid-cols-3 gap-4 divide-x">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <Eye size={20} className="text-red-500" />
                    <span className="text-base font-semibold text-gray-900 mb-1">
                      161
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
                      2
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
                      10
                    </span>
                  </div>
                  <div className="text-start">
                    <div className="text-xs text-gray-500">Contacted</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Exclusive listing */}
            <section className="flex flex-col justify-between items-center gap-4">
              <button className="px-8 py-3 flex justify-around border rounded-xl w-full text-base max-md:text-sm max-md:hidden hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Crown size={24} className="text-yellow-500" />
                  <span>This is an Exclusive listing</span>
                </div>
              </button>
            </section>

            {/* Report this listing */}
            <section className="flex justify-around items-center">
              <button
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
                onClick={handleReportListingClick}
              >
                <Flag size={14} />
                <span className="underline">Report this listing</span>
              </button>
            </section>
          </section>
        </section>
      </section>

      {/* Contact Owner Section */}
      <MobileFooter>
        <div className="flex-col justify-between items-center w-full">
          <div className="text-gray-600 text-xs">
            {property?.propertyCategory === PropertyCategory.RESALE
              ? "Price"
              : "Rent"}
          </div>
          <div className="text-lg">
            {property?.propertyCategory === PropertyCategory.RESALE
              ? property?.price
                ? formatINRCurrency(property.price)
                : "-"
              : property?.rent
                ? formatINRCurrency(property.rent)
                : "-"}
          </div>
        </div>
        <button
          className="px-8 py-3 border bg-red-500 border-red-500 text-white rounded-xl w-full hover:bg-red-600 transition-colors"
          onClick={handleContactOwnerClick}
        >
          Contact Owner
        </button>
      </MobileFooter>
      {/* Mobile Photo Gallery Dialog */}
      {isDialogOpen("photo-gallery-dialog") && (
        <PhotoGalleryDialog
          id="photo-gallery-dialog"
          images={property?.images || []}
          onClose={() => closeDialog("photo-gallery-dialog")}
        />
      )}

      {/* Report this listing dialog */}
      {isDialogOpen("report-listing-dialog") && (
        <ReportListingDialog
          id="report-listing-dialog"
          onClose={() => {
            closeDialog("report-listing-dialog");
            dispatch(setHideStickyNavBar(true));
          }}
        />
      )}

      {/* Contact owner login dialog */}
      {isDialogOpen("contact-owner-login-dialog") && (
        <ContactOwnerLoginDialog
          id="contact-owner-login-dialog"
          onSuccess={handleContactLoginSuccess}
          onClose={() => closeDialog("contact-owner-login-dialog")}
        />
      )}

      {/* Unlock owner details dialog */}
      {isDialogOpen("unlock-owner-details-dialog") && (
        <UnlockOwnerDetailsDialog
          id="unlock-owner-details-dialog"
          propertyID={propertyID}
          onClose={() => closeDialog("unlock-owner-details-dialog")}
        />
      )}
    </>
  );
}
