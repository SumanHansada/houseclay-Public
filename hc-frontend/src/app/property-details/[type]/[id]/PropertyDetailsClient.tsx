"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  BanknoteArrowUp,
  Bath,
  BedDouble,
  BrushCleaning,
  Building2,
  ChevronLeft,
  Cigarette,
  CircleParking,
  ClipboardPen,
  DoorOpen,
  Droplets,
  Drumstick,
  Flower2,
  HandCoins,
  Hourglass,
  House,
  Landmark,
  MapPin,
  PlugZap,
  Ruler,
  Sofa,
  Stamp,
  Sun,
  SwatchBook,
  TrendingUp,
  UserSearch,
  Wine,
} from "lucide-react";
import { EditIcon } from "lucide-react";
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
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch } from "react-redux";

import {
  formatINRCurrency,
  pascalCase,
  shimmer,
  toBase64,
} from "@/common/utils";
import Carousel2D from "@/components/Carousel2D";
import ImageWithLoader from "@/components/common/ImageWithLoader";
import {
  NonTab,
  Tab,
  TabContent,
  TabHeader,
  Tabs,
} from "@/components/common/Tabs";
import Footer from "@/components/Footer";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import { setHideHeader } from "@/store/appSlice";
import { setHideFooter } from "@/store/appSlice";
import { setHideStickyNavBar } from "@/store/appSlice";

import PostedAndRentDetails from "./components/PostedAndRentDetails";
import UpgradePropertyBanner from "./components/UpgradePropertyBanner";

interface PropertyDetailsClientProps {
  type: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any; // Replace 'any' with your property type
}

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
const ParkingSpaceIcon = ParkingSpaceIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
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

export function PropertyDetailsClient({
  type,
  id,
  initialData,
}: PropertyDetailsClientProps): React.ReactElement {
  const dispatch = useDispatch();
  const { isMobile } = useDeviceContext();
  const { data: property = initialData, isLoading: _isPropertyLoading } =
    useGetPropertyByIdQuery(id, {
      skip: !!initialData, // Skip the query if we have initial data
    });
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const handleEdit = async () => {
    router.push(`/list-property/${type}/`);
  };

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
      dispatch(setHideStickyNavBar(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
      dispatch(setHideStickyNavBar(false));
    }
  }, [dispatch, isMobile]);

  const handleImageClick = (imgUrl: string) => {
    setSelectedImage(imgUrl);
  };

  const handleCloseFullscreen = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {/* Mobile Header Section */}
      <section
        className={`py-2 px-8 fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-center items-center w-full md:hidden`}
      >
        <button className="border border-gray-200 rounded-full md:border-none items-center justify-center">
          <ChevronLeft onClick={() => router.back()} size={25} />
        </button>
        <h1 className="text-base text-gray-900 flex-1 items-center gap-2 truncate w-[calc(100%-2rem)]">
          {property?.bhkType} in {property?.locationOrSocietyName} for{" "}
          {property?.propertyCategory} in {property?.city}
        </h1>
      </section>
      {/* Desktop Section */}
      <section className="flex w-full xl:gap-16 lg:gap-8 md:gap-0 gap-0 xl:px-28 lg:px-14 md:px-8 px-8 max-md:pt-4 max-md:pb-8">
        <section className="w-3/4 max-md:w-full">
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="py-12 mx-auto">
              <div>
                <h1 className="text-3xl text-gray-900 flex items-center gap-2">
                  {property?.bhkType} in {property?.locationOrSocietyName} for{" "}
                  {property?.propertyCategory} in {property?.city}
                  <span className="bg-green-500 rounded-lg text-white px-2 py-1 text-sm">
                    Active
                  </span>
                </h1>
              </div>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden">
            <div className="py-0 mx-auto flex">
              <Tabs defaultActive="details">
                <TabHeader>
                  <Tab label="Details" value="details" />
                  <Tab label="Upgrades" value="upgrades" />
                  <Tab label="Prospects" value="prospects" />
                  <NonTab className="max-md:hidden">
                    <div className="flex items-center gap-2">
                      <button
                        className="border bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"
                        onClick={handleEdit}
                      >
                        <EditIcon size={20} /> Edit
                      </button>
                    </div>
                  </NonTab>
                </TabHeader>
                <TabContent value="details">
                  <section className="py-3 md:hidden">
                    <UpgradePropertyBanner />
                    <PostedAndRentDetails property={property} />
                  </section>
                  {/* Description Section */}
                  <section className="py-6 max-md:py-3">
                    <h2 className="text-xl mb-2">Description</h2>
                    <p className="text-gray-700 mb-2">
                      {property?.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-base">
                      <MapPin size={16} />
                      <span>
                        {property?.locationOrSocietyName}, {property?.city}
                      </span>
                    </div>
                  </section>
                  {/* Property Details Section */}
                  <section className="p-6 border rounded-xl shadow-md max-md:p-3 max-md:my-3">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-base justify-items-center items-center">
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <House size={24} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            Property Type
                          </div>
                          <div className="text-gray-900 font-bold font-nunito">
                            {property?.propertyType || "Apartment"}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <BedDouble size={24} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            No. of Bedroom
                          </div>
                          <div className="text-gray-900 font-bold font-nunito">
                            {property?.bhkType.split("BHK")[0] || "-"} Bedroom
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <Ruler size={20} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            Built Up Area
                          </div>
                          <div className="text-gray-900 font-bold font-nunito">
                            {property?.builtUpArea}sqft
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <Building2 size={20} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            Floor
                          </div>
                          <div className="text-gray-900 font-bold font-nunito">
                            {property?.floor} of {property?.totalFloors}
                          </div>
                        </div>
                      </div>
                      {(property?.propertyCategory === "Sale" ||
                        property?.propertyCategory === "Rent") && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Sun size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Facing
                            </div>
                            <div className="text-gray-900 font-bold font-nunito">
                              {property?.facing}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory === "Sale" ||
                        property?.propertyCategory === "Rent") && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <ClipboardPen size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Ownership Type
                            </div>
                            <div className="text-gray-900 font-bold font-nunito">
                              {property?.ownershipType || "NA"}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory === "Sale" ||
                        property?.propertyCategory === "Rent") && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Hourglass size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Property Age
                            </div>
                            <div className="text-gray-900 font-bold font-nunito">
                              {property?.propertyAge}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory === "Sale" ||
                        property?.propertyCategory === "Rent") && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <SwatchBook size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Floor Type
                            </div>
                            <div className="text-gray-900 font-bold font-nunito">
                              {property?.floorType}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                  {/* Rental/Sale/Flatmate Details Section */}
                  <section className="py-6 my-6 max-md:py-3 max-md:my-3">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-base justify-items-start items-center">
                      {property?.propertyCategory === "Rent" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <HandCoins size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Rent Negotiable
                            </div>
                            <div className="text-gray-900">
                              {property?.rentNegotiable ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory === "Rent" ||
                        property?.propertyCategory === "Flatmate") && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <BrushCleaning size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Maintenance Charges
                            </div>
                            <div className="text-gray-900">
                              {property?.maintenanceCharges
                                ? formatINRCurrency(
                                    property?.maintenanceCharges,
                                  )
                                : "-"}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory === "Rent" ||
                        property?.propertyCategory === "Flatmate") && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <BanknoteArrowUp size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Deposit
                            </div>
                            <div className="text-gray-900">
                              {property?.deposit || property?.depositCharges
                                ? formatINRCurrency(
                                    property?.deposit ||
                                      property?.depositCharges,
                                  )
                                : "-"}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <DoorOpen size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            Available From
                          </div>
                          <div className="text-gray-900">
                            {property?.availableFrom
                              ? format(
                                  new Date(property?.availableFrom),
                                  "MMM d, yyyy",
                                )
                              : "-"}
                          </div>
                        </div>
                      </div>
                      {property?.propertyCategory === "Sale" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Bath size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Bathrooms
                            </div>
                            <div className="text-gray-900">
                              {property?.bathrooms}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Sale" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Flower2 size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Balcony
                            </div>
                            <div className="text-gray-900">
                              {property?.balcony}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Sale" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <HandCoins size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Price Negotiable
                            </div>
                            <div className="text-gray-900">
                              {property?.priceNegotiable ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Sale" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Landmark size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Under Loan
                            </div>
                            <div className="text-gray-900">
                              {property?.underLoan ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <Sofa size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            Furnishing
                          </div>
                          <div className="text-gray-900">
                            {property?.furnishing}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <Droplets size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            Water Supply
                          </div>
                          <div className="text-gray-900">
                            {pascalCase(property?.waterSupply)}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <PlugZap size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            Power Backup
                          </div>
                          <div className="text-gray-900">
                            {pascalCase(property?.powerBackup)}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <CircleParking size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex gap-2 items-center font-nunito">
                            Parking
                          </div>
                          <div className="text-gray-900">
                            {property?.parking ? "Yes" : "No"}
                          </div>
                        </div>
                      </div>
                      {(property?.propertyCategory === "Rent" ||
                        property?.propertyCategory === "Flatmate") && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Drumstick size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Non-Veg Allowed
                            </div>
                            <div className="text-gray-900">
                              {property?.nonVegAllowed ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Rent" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <UserSearch size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Preferred Tenants
                            </div>
                            <div className="text-gray-900">
                              {property?.preferredTenants.join(", ")}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Flatmate" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <UserSearch size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Tenant Type
                            </div>
                            <div className="text-gray-900">
                              {property?.tenantType}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Flatmate" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Bath size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Attached Bathroom
                            </div>
                            <div className="text-gray-900">
                              {property?.attachedBathroom ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Flatmate" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Flower2 size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Attached Balcony
                            </div>
                            <div className="text-gray-900">
                              {property?.attachedBalcony ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Flatmate" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Cigarette size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center text-gray-500 font-nunito">
                              Smoking Preference
                            </div>
                            <div className="text-gray-900">
                              {property?.smokingPreference}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === "Flatmate" && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Wine size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Drinking Preference
                            </div>
                            <div className="text-gray-900">
                              {property?.drinkingPreference}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                  {/* Amenities Section */}
                  <section className="py-6 my-6 max-md:py-3 max-md:my-3">
                    <h2 className="text-xl mb-4">Amenities</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {property?.amenities?.map((amenity: string) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          {
                            AmenitiesMap[amenity as keyof typeof AmenitiesMap]
                              .icon
                          }
                          <span>
                            {
                              AmenitiesMap[amenity as keyof typeof AmenitiesMap]
                                .label
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                  {/* Images Section */}
                  {property?.images?.length > 0 && (
                    <section className="py-6 my-6 max-md:py-3 max-md:my-3">
                      <h2 className="text-lg mb-4">Images</h2>
                      <div className="flex">
                        <Carousel2D
                          slideWidth={300}
                          gap={4}
                          showArrows={true}
                          showDots={false}
                          autoScroll={false}
                        >
                          {property?.images?.map(
                            (imgUrl: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border cursor-zoom-in"
                                onClick={() => handleImageClick(imgUrl)}
                              >
                                <ImageWithLoader
                                  src={imgUrl}
                                  alt={`Property image ${idx + 1}`}
                                  fill
                                  loading="lazy"
                                  className="object-cover transition-transform duration-300 ease-in-out"
                                  placeholder="blur"
                                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 400))}`}
                                />
                              </div>
                            ),
                          )}
                        </Carousel2D>
                      </div>
                    </section>
                  )}
                </TabContent>
                <TabContent value="upgrades">
                  <section className="py-6 w-full">
                    <h2 className="text-lg font-semibold mb-2">Upgrades</h2>
                    <p className="text-gray-700">
                      No upgrades information available yet. I am a disco dance.
                      Zindagi na milegi dobara. Hello How are you? I am a
                      student who is working to make an app. A life changing app
                    </p>
                  </section>
                </TabContent>
                <TabContent value="prospects">
                  <section className="py-6">
                    <h2 className="text-lg font-semibold mb-2">Prospects</h2>
                    <p className="text-gray-700">
                      No prospects information available yet.
                    </p>
                  </section>
                </TabContent>
              </Tabs>
            </div>
          </section>
        </section>
        <section className="w-1/4 max-md:hidden">
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="py-12 mx-auto">
              <div className="flex justify-end">
                <h1 className="text-xl text-gray-900 m-1 flex items-center gap-2">
                  10{" "}
                  <span className="text-gray-500 text-base">
                    People Connected
                  </span>{" "}
                  <span>
                    <TrendingUp size={16} className="text-green-500" />
                  </span>
                </h1>
              </div>
            </div>
            <div className="flex py-0 ml-auto justify-end">
              <button className="border border-green-500 text-green-500 px-4 py-2 rounded-lg flex items-center gap-2">
                <Stamp size={20} />{" "}
                {property?.propertyCategory === "Sale"
                  ? "Mark as Sold"
                  : "Mark as Rented"}
              </button>
            </div>
            <div className="pt-4">
              <PostedAndRentDetails property={property} />
            </div>
            <UpgradePropertyBanner />
          </section>
        </section>
        <section className="md:hidden">
          <div className="fixed bottom-0 left-0 ml-[33.33%] max-md:ml-auto right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 border-t border-t-gray-300 bg-white">
            <button
              type="button"
              className="flex gap-2 items-center px-6 py-3 border border-gray-300 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleEdit}
            >
              <EditIcon size={20} /> Edit
            </button>

            <button
              type="submit"
              className="flex gap-2 items-center px-6 py-3 border border-green-500 text-green-500 rounded-xl hover:bg-green-600 hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300"
            >
              <Stamp size={20} />{" "}
              {property?.propertyCategory === "Sale"
                ? "Mark as Sold"
                : "Mark as Rented"}
            </button>
          </div>
        </section>
      </section>
      <Footer />

      {/* Fullscreen Image View */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={handleCloseFullscreen}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              onClick={handleCloseFullscreen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh] p-4"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <ImageWithLoader
                  src={selectedImage}
                  alt="Fullscreen property image"
                  fill
                  className="object-contain transition-transform duration-300 ease-in-out"
                  priority
                  style={{ transformOrigin: "center" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}
