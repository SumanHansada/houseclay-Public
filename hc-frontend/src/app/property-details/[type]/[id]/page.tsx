"use client";

import { format } from "date-fns";
import {
  BadgeCheck,
  BanknoteArrowUp,
  Bath,
  BedDouble,
  BrushCleaning,
  Building2,
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
  Sun,
  SwatchBook,
  TrendingUp,
  Users,
  UserSearch,
  Wine,
} from "lucide-react";
import { EditIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
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
import { useEffect } from "react";
import React from "react";
import { useDispatch } from "react-redux";

import { formatINRCurrency, pascalCase } from "@/common/utils";
import Carousel2D from "@/components/Carousel2D";
import {
  NonTab,
  Tab,
  TabContent,
  TabHeader,
  Tabs,
} from "@/components/common/Tabs";
import Footer from "@/components/Footer";
import { PropertyUpdate } from "@/interfaces/PropertyUpdate";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import { setHideHeader } from "@/store/appSlice";
import { setHideFooter } from "@/store/appSlice";
import { setHideStickyNavBar } from "@/store/appSlice";

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

const PropertyDetailsPage = ({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) => {
  const dispatch = useDispatch();
  const { isMobile } = useDeviceContext();
  const { type, id } = React.use(params);
  const { data: property, isLoading: _isPropertyLoading } =
    useGetPropertyByIdQuery(id);
  console.log("Type", type);
  console.log("Id", id);
  const router = useRouter();

  const propertyUpdates: PropertyUpdate[] = property?.propertyUpdates;
  const lastPropertyUpdate: PropertyUpdate | null =
    propertyUpdates && propertyUpdates.length > 0
      ? propertyUpdates[propertyUpdates.length - 1]
      : null;

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

  return (
    <>
      {/* Header Section */}
      <section className=" flex w-full gap-16 xl:px-28 lg:px-14 md:px-8 px-8">
        <section className="w-3/4">
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
                  <NonTab>
                    <div className="flex items-center gap-2">
                      <button className="border border-red-500 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                        <EyeIcon size={20} /> Preview
                      </button>
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
                  {/* Description Section */}
                  <section className="py-6">
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
                  <section className="p-6 border rounded-xl shadow-md">
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
                  <section className="py-6 my-6">
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
                  <section className="py-6 border-b">
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
                  <section className="py-6">
                    <h2 className="text-lg mb-4">Images</h2>
                    <Carousel2D
                      slideWidth={300}
                      gap={4}
                      showArrows={true}
                      showDots={true}
                      autoScroll={false}
                    >
                      {property?.images?.map((imgUrl: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border"
                        >
                          {/* <Image 
                            src={imgUrl} 
                            alt={`Property image ${idx + 1}`} 
                            fill
                            className="object-cover"
                          /> */}
                        </div>
                      ))}
                    </Carousel2D>
                  </section>
                </TabContent>
                <TabContent value="upgrades">
                  <section className="py-6 w-full">
                    <h2 className="text-lg font-semibold mb-2">Upgrades</h2>
                    <p className="text-gray-700">
                      No upgrades information available yet.
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
        <section className="w-1/4">
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
          </section>
          <section>
            <div className="flex py-0 ml-auto justify-end">
              <button className="border border-red-500 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                <EyeIcon size={20} /> Preview
              </button>
            </div>
          </section>
          <div className="pt-4">
            <section className="flex flex-wrap gap-2 w-full py-6">
              <div className="flex-col flex-1 px-4 py-2 border rounded-xl">
                <div className="text-sm text-gray-500 text-center">
                  Posted On
                </div>
                <div className="text-center text-lg">
                  {lastPropertyUpdate?.updateTime
                    ? format(lastPropertyUpdate.updateTime, "MMM d, yyyy")
                    : "-"}
                </div>
              </div>
              <div className="flex-col flex-1 px-4 py-2 border rounded-xl">
                <div className="text-sm text-gray-500 text-center">
                  {property?.propertyCategory === "Sale" ? "Price" : "Rent"}
                </div>
                <div className="text-center text-lg">
                  {property?.propertyCategory === "Sale"
                    ? formatINRCurrency(property?.price)
                    : formatINRCurrency(property?.rent)}
                </div>
              </div>
            </section>
          </div>
          <div>
            <div
              className="relative p-6 mb-6 rounded-xl border bg-white overflow-hidden flex flex-col gap-4"
              style={{ minHeight: 360 }}
            >
              {/* Gradient background in the top right corner */}
              <div
                className="absolute right-0 top-0 w-full h-full"
                style={{
                  background:
                    "radial-gradient(circle at 75% 0%, #FFCFEC 0%, #FFFAD2 40%, #FFFFFF 50%, rgba(255,255,255,1) 100%)",
                  zIndex: 0,
                }}
              />
              {/* Image Placeholder */}
              <div className="relative z-10 flex justify-start items-start mb-2 mt-2">
                <Image
                  src={"/icons/high-rental.svg"}
                  alt="high-rental"
                  width={100}
                  height={100}
                />
              </div>
              {/* Card Content */}
              <div className="relative z-10 flex flex-col gap-2 items-start">
                <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                  Looking for verified tenants paying higher rental ?
                </h3>
                <p className="text-gray-500 text-base mb-2">
                  Upgrade to Discover and let us handle your property with care.
                </p>
                <div className="flex flex-col gap-2 items-start mt-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-800 text-base">
                    <BadgeCheck size={20} className="text-green-500" />
                    <span className="">Verified Tenants</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800 text-base">
                    <TrendingUp size={20} className="text-blue-500" />
                    <span className="">Higher Rental Income</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800 text-base">
                    <Users size={20} className="text-yellow-500" />
                    <span className="">Hassle-Free Management</span>
                  </div>
                </div>
                <button className="mt-2 px-8 py-3 border border-red-500 text-red-500 rounded-xl w-full text-lg hover:bg-red-50 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
};

export default PropertyDetailsPage;
