"use client";

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
  Mail,
  MapPin,
  PhoneCall,
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
import { useRouter, useSearchParams } from "next/navigation";
import TwentyFourSevenPowerIconSvg from "public/icons/amenities/24x7-power.svg";
import ClubhouseIconSvg from "public/icons/amenities/clubhouse.svg";
import DedicatedWorkspaceIconSvg from "public/icons/amenities/dedicated-workspace.svg";
import FireExtinguisherIconSvg from "public/icons/amenities/fire-extinguisher.svg";
import FirstAidKitIconSvg from "public/icons/amenities/first-aid-kit.svg";
import GymIconSvg from "public/icons/amenities/gym.svg";
import LiftIconSvg from "public/icons/amenities/lift.svg";
import OutdoorDiningAreaIconSvg from "public/icons/amenities/outdoor-dining-area.svg";
import ParkingSpaceIconSvg from "public/icons/amenities/parking-space.svg";
import PoolTableIconSvg from "public/icons/amenities/pool-table.svg";
import SecurityIconSvg from "public/icons/amenities/security.svg";
import SmokeAlarmIconSvg from "public/icons/amenities/smoke-alarm.svg";
import SwimmingPoolIconSvg from "public/icons/amenities/swimming-pool.svg";
import WifiIconSvg from "public/icons/amenities/wifi.svg";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/base-components";
import {
  BHK_TYPE_OPTIONS,
  DRINKING_PREFERENCE_OPTIONS,
  FACING_OPTIONS,
  FLOOR_NUMERIC_OPTIONS,
  FURNISHING_OPTIONS,
  getOptionLabel,
  getOptionLabels,
  PARKING_OPTIONS,
  PREFERRED_TENANTS_OPTIONS,
  PROPERTY_AGE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  SMOKING_PREFERENCE_OPTIONS,
  TOTAL_FLOORS_NUMERIC_OPTIONS,
  WATER_SUPPLY_OPTIONS,
} from "@/common/dataConstants/options";
import { LeadCategory, PropertyCategory, PropertyStatus } from "@/common/enums";
import {
  formatDateToReadable,
  formatINRCurrency,
  pascalCase,
  processPropertyImages,
  shimmer,
  toBase64,
} from "@/common/utils";
import Carousel2D from "@/components/Carousel2D";
import { ActionDialog } from "@/dialogs/action-dialog";
import { Footer, MobileFooter, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useDeactivatePropertyMutation,
  useGenerateLeadMutation,
  useGetMyPropertyByIdQuery,
} from "@/store/apiSlice";
import { setHideHeader } from "@/store/appSlice";
import { setHideFooter } from "@/store/appSlice";
import { setHideStickyNavBar } from "@/store/appSlice";
import {
  FullscreenPhotoViewer,
  ImageWithLoader,
  Tab,
  TabContent,
  TabHeader,
  Tabs,
} from "@/utility-components";

import PostedAndRentDetails from "./components/PostedAndRentDetails";
import { RenderPropertyStatus } from "./components/RenderPropertyStatus";
import UpgradePropertyBanner from "./components/UpgradePropertyBanner";
import PropertyDetailsLoading from "./loading";

interface MyPropertyDetailsClientProps {
  propertyCategory: string;
  propertyID: string;
}

type PropertyData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propertyUpdates?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contactUsers?: any[];
};

const LiftIcon = LiftIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const ClubhouseIcon = ClubhouseIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const GymIcon = GymIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const OutdoorDiningAreaIcon = OutdoorDiningAreaIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
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
  "Fire Extinguisher": {
    label: "Fire Extinguisher",
    icon: <FireExtinguisherIcon />,
  },
  "Smoke Alarm": { label: "Smoke Alarm", icon: <SmokeAlarmIcon /> },
  "Swimming Pool": { label: "Swimming Pool", icon: <SwimmingPoolIcon /> },
  "24/7 Power": { label: "24/7 Power", icon: <TwentyFourSevenPowerIcon /> },
  Security: { label: "Security", icon: <SecurityIcon /> },
  "Visitor Parking": { label: "Visitor Parking", icon: <ParkingSpaceIcon /> },
  "Dedicated Workspace": {
    label: "Dedicated Workspace",
    icon: <DedicatedWorkspaceIcon />,
  },
  Wifi: { label: "Wifi", icon: <WifiIcon /> },
  "Pool Table": { label: "Pool Table", icon: <PoolTableIcon /> },
  "First Aid Kit": { label: "First Aid Kit", icon: <FirstAidKitIcon /> },
};

const ACTION_DIALOG_ID = "mark-as-action-dialog-id";

export function MyPropertyDetailsClient({
  propertyCategory,
  propertyID,
}: MyPropertyDetailsClientProps): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isMobile } = useDeviceContext();
  const searchParams = useSearchParams();
  const [deactivatingProperty] = useDeactivatePropertyMutation();
  const {
    data: propertyDataRaw,
    isLoading: isPropertyLoading,
    refetch,
  } = useGetMyPropertyByIdQuery(propertyID, {
    skip: !propertyID,
    refetchOnMountOrArgChange: true,
  });

  const propertyData = propertyDataRaw as PropertyData | undefined;
  const property = propertyData?.property;
  const propertyUpdates = propertyData?.propertyUpdates ?? [];
  const contactedUsers = propertyData?.contactUsers ?? [];

  const bhkType = getOptionLabel(BHK_TYPE_OPTIONS, property?.bhkType);
  const propertyType = getOptionLabel(
    PROPERTY_TYPE_OPTIONS,
    property?.propertyType,
  );
  const propertyAge = getOptionLabel(
    PROPERTY_AGE_OPTIONS,
    property?.propertyAge,
  );
  const propertyFacing =
    property?.facing === "dont-know"
      ? "Not Specified"
      : getOptionLabel(FACING_OPTIONS, property?.facing);
  const propertyFloor = getOptionLabel(FLOOR_NUMERIC_OPTIONS, property?.floor);
  const totalFloors = getOptionLabel(
    TOTAL_FLOORS_NUMERIC_OPTIONS,
    property?.totalFloors,
  );
  const furnishingStatus = getOptionLabel(
    FURNISHING_OPTIONS,
    property?.furnishing,
  );
  const parking = getOptionLabel(PARKING_OPTIONS, property?.parking);
  const waterSupply = getOptionLabel(
    WATER_SUPPLY_OPTIONS,
    property?.waterSupply,
  );
  const preferredTenants = getOptionLabels(
    PREFERRED_TENANTS_OPTIONS.RENT,
    property?.preferredTenants,
  ).join(", ");
  const smokingPreference = getOptionLabel(
    SMOKING_PREFERENCE_OPTIONS,
    property?.smokingPreference,
  );
  const drinkingPreference = getOptionLabel(
    DRINKING_PREFERENCE_OPTIONS,
    property?.drinkingPreference,
  );

  const bedrooms = bhkType
    ? bhkType === "Studio" || bhkType === "1-bhk"
      ? "1 Bedroom"
      : `${bhkType.split("BHK")[0]} Bedrooms`
    : "N/A";
  const bathrooms = property?.bathrooms
    ? `${property?.bathrooms} ${property?.bathrooms > 1 ? "Bathrooms" : "Bathroom"}`
    : "N/A";
  const availableFrom = `${property?.availableFrom ? formatDateToReadable(property?.availableFrom) : "N/A"}`;
  const formattedMaintenanceCharges = `${
    property?.maintenanceCharges
      ? formatINRCurrency(property?.maintenanceCharges)
      : "N/A"
  }`;

  const formattedDeposit = `${
    property?.deposit || property?.depositCharges
      ? formatINRCurrency(property.deposit || property.depositCharges)
      : "-"
  }`;

  // TODO: add balcony to add property
  const balcony = property?.balcony
    ? `${property?.balcony} ${property?.balcony > 1 ? "Balconies" : "Balcony"}`
    : "N/A";

  const propertyImages = processPropertyImages(property?.images);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [generateLead, { isLoading: _isGeneratingLead }] =
    useGenerateLeadMutation();

  const { openDialog, isDialogOpen, closeDialog } = useDialog();

  console.log(propertyCategory);

  // const handleEdit = async () => {
  //   router.push(
  //     `/edit-property/${propertyCategory.toLowerCase()}/${propertyID}`,
  //   );
  // };

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

  const handleImageClick = (imgUrl: string, index: number) => {
    setSelectedImage(imgUrl);
    setCurrentImageIndex(index);
  };

  const handleCloseFullscreen = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const handleNavigateImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleUpgrade = async () => {
    try {
      const response = await generateLead({
        leadCategory: LeadCategory.UPGRADE_PROPERTY,
      });
      console.log(response);
      openDialog("upgrade-property-dialog");
    } catch (error) {
      console.error("Error generating lead:", error);
    }
  };

  const handleDeactivatingProperty = async () => {
    const response = await deactivatingProperty({ propertyID }).unwrap();
    console.log(response);
  };

  if (isPropertyLoading) {
    return <PropertyDetailsLoading />;
  }

  return (
    <>
      {/* Mobile Header Section */}
      <MobileHeader>
        <MobileHeader.LeftAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={() => {
              if (searchParams.get("from") === "list-property") {
                router.push("/");
              } else {
                router.back();
              }
            }}
          >
            <ChevronLeft size={24} />
          </Button>
        </MobileHeader.LeftAction>
        <MobileHeader.Title>
          {bhkType} in {property?.locationOrSocietyName} for{" "}
          {pascalCase(property?.propertyCategory)} in {property?.city}
        </MobileHeader.Title>
      </MobileHeader>

      {/* Desktop Section */}
      <section className="flex w-full xl:gap-16 lg:gap-8 md:gap-8 gap-8 xl:px-28 lg:px-14 md:px-8 px-8 max-md:pt-4 max-md:pb-4">
        <section className="w-3/4 max-md:w-full">
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="py-12 mx-auto">
              <div>
                <h1 className="text-3xl text-gray-900 flex items-center justify-between">
                  {bhkType} in {property?.locationOrSocietyName} for{" "}
                  {pascalCase(property?.propertyCategory)} in {property?.city}
                  <RenderPropertyStatus status={property?.propertyState} />
                </h1>
              </div>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden">
            <div className="py-0 mx-auto flex">
              <Tabs defaultActive="details">
                <TabHeader tabsClassName="inline-flex gap-2 border-b border-gray-200 max-md:w-full max-md:justify-between max-md:border max-md:rounded-lg max-md:p-2">
                  <Tab
                    label="Details"
                    value="details"
                    containerClassName="px-4 py-2 max-md:py-1.5 max-md:w-1/2 text-base font-medium max-md:font-normal focus:outline-none"
                    activeClassName="text-red-600 md:border-b-2 border-red-500 max-md:border max-md:rounded-lg"
                    inactiveClassName="text-gray-700 hover:text-red-500"
                  />
                  {/* <Tab
                    label="Upgrades"
                    value="upgrades"
                    containerClassName="px-4 py-2 max-md:py-1.5 text-base font-medium max-md:font-normal focus:outline-none"
                    activeClassName="text-red-600 md:border-b-2 border-red-500 max-md:border max-md:rounded-lg"
                    inactiveClassName="text-gray-700 hover:text-red-500"
                  /> */}
                  <Tab
                    label="Prospects"
                    value="prospects"
                    containerClassName="px-4 py-2 max-md:py-1.5 max-md:w-1/2 text-base font-medium max-md:font-normal focus:outline-none"
                    activeClassName="text-red-600 md:border-b-2 border-red-500 max-md:border max-md:rounded-lg"
                    inactiveClassName="text-gray-700 hover:text-red-500"
                  />
                  {/* <NonTab className="max-md:hidden">
                    <div className="flex items-center gap-2">
                      <button
                        className="border bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"
                        onClick={handleEdit}
                      >
                        <EditIcon size={20} /> Edit
                      </button>
                    </div>
                  </NonTab> */}
                </TabHeader>
                <TabContent value="details">
                  <section className="py-3 md:hidden">
                    <UpgradePropertyBanner onUpgrade={handleUpgrade} />
                    <PostedAndRentDetails
                      property={property}
                      propertyUpdates={propertyUpdates}
                    />
                  </section>
                  {/* Description Section */}
                  <section className="py-6 max-md:py-3">
                    <h2 className="text-xl">Description</h2>
                    <p className="text-gray-700 mb-6">
                      {property?.description}
                    </p>
                    <div className="flex flex-col justify-between items-start">
                      <h2 className="text-xl flex gap-1 items-center">
                        <span className="">Property Location</span>
                        <MapPin size={16} />
                      </h2>
                      <div className="flex items-center gap-2 text-gray-500">
                        {property?.locationOrSocietyName}, {property?.city}
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-2 text-gray-500 text-base">
                      <MapPin size={16} />
                      <span>
                        {property?.locationOrSocietyName}, {property?.city}
                      </span>
                    </div> */}
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
                            {propertyType}
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
                            {bedrooms}
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
                            {property?.builtUpArea} Sq. Ft
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
                            {propertyFloor} of {totalFloors}
                          </div>
                        </div>
                      </div>
                      {(property?.propertyCategory ===
                        PropertyCategory.RESALE ||
                        property?.propertyCategory ===
                          PropertyCategory.RENT) && (
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
                              {propertyFacing}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory ===
                        PropertyCategory.RESALE ||
                        property?.propertyCategory ===
                          PropertyCategory.RENT) && (
                        <div className="flex w-full justify-start items-start gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <ClipboardPen size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex gap-2 items-center font-nunito">
                              Bathrooms
                            </div>
                            <div className="text-gray-900 font-bold font-nunito">
                              {bathrooms}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory ===
                        PropertyCategory.RESALE ||
                        property?.propertyCategory ===
                          PropertyCategory.RENT) && (
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
                              {propertyAge}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory ===
                        PropertyCategory.RESALE ||
                        property?.propertyCategory ===
                          PropertyCategory.RENT) && (
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
                              {pascalCase(property?.floorType)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                  {/* Rental/Sale/Flatmate Details Section */}
                  <section className="py-6 my-6 max-md:py-3 max-md:my-3">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-base justify-items-start items-center">
                      {property?.propertyCategory === PropertyCategory.RENT && (
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
                      {(property?.propertyCategory === PropertyCategory.RENT ||
                        property?.propertyCategory ===
                          PropertyCategory.FLATMATE) && (
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
                              {formattedMaintenanceCharges}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory === PropertyCategory.RENT ||
                        property?.propertyCategory ===
                          PropertyCategory.FLATMATE) && (
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
                              {formattedDeposit}
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
                          <div className="text-gray-900">{availableFrom}</div>
                        </div>
                      </div>
                      {property?.propertyCategory ===
                        PropertyCategory.RESALE && (
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
                            <div className="text-gray-900">{bathrooms}</div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory ===
                        PropertyCategory.RESALE && (
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
                            <div className="text-gray-900">{balcony}</div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory ===
                        PropertyCategory.RESALE && (
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
                      {property?.propertyCategory ===
                        PropertyCategory.RESALE && (
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
                            {furnishingStatus}
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
                          <div className="text-gray-900">{waterSupply}</div>
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
                          <div className="text-gray-900">{parking}</div>
                        </div>
                      </div>
                      {(property?.propertyCategory === PropertyCategory.RENT ||
                        property?.propertyCategory ===
                          PropertyCategory.FLATMATE) && (
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
                      {property?.propertyCategory === PropertyCategory.RENT && (
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
                              {preferredTenants}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory ===
                        PropertyCategory.FLATMATE && (
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
                              {pascalCase(property?.tenantType)}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory ===
                        PropertyCategory.FLATMATE && (
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
                      {property?.propertyCategory ===
                        PropertyCategory.FLATMATE && (
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
                      {property?.propertyCategory ===
                        PropertyCategory.FLATMATE && (
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
                              {smokingPreference}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory ===
                        PropertyCategory.FLATMATE && (
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
                              {drinkingPreference}
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
                  {propertyImages?.length > 0 && (
                    <section className="py-6 my-6 max-md:py-3 max-md:my-3">
                      <h2 className="text-xl mb-4">Images</h2>
                      <div className="min-w-full">
                        <Carousel2D
                          gap={4}
                          showDots={false}
                          autoScroll={false}
                          showArrows
                          responsiveSlidesPerView
                        >
                          {propertyImages?.map(
                            (imgUrl: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border cursor-zoom-in"
                                onClick={() => handleImageClick(imgUrl, idx)}
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
                        {/* <Carousel images={propertyImages || []}></Carousel> */}
                      </div>
                    </section>
                  )}
                </TabContent>
                {/* <TabContent value="upgrades">
                  <section className="py-6 w-full">
                    <h2 className="text-lg font-semibold mb-2">Upgrades</h2>
                    <p className="text-gray-700">
                      No upgrades information available yet. I am a disco dance.
                      Zindagi na milegi dobara. Hello How are you? I am a
                      student who is working to make an app. A life changing app
                    </p>
                  </section>
                </TabContent> */}
                <TabContent value="prospects">
                  <section className="py-6">
                    <h2 className="text-lg font-semibold mb-2">Prospects</h2>

                    {contactedUsers.length
                      ? contactedUsers.map((user) => (
                          <div
                            key={user.phoneNo}
                            className="flex max-lg:flex-col w-full bg-gray-100 rounded-lg py-3 px-4 text-lg mb-4 max-lg:gap-2"
                          >
                            <div className="flex-1 lg:border-r border-gray-400 px-4">
                              {user.name}
                            </div>
                            <a
                              href={`tel:${user.phoneNo}`}
                              className="flex-1 lg:border-r border-gray-400 px-4 flex gap-1 items-center"
                            >
                              <PhoneCall size={20} />
                              <span className="hover:underline">
                                {user.phoneNo}
                              </span>
                            </a>
                            {user.email && (
                              <a
                                href={`mailto:${user.email}`}
                                className="flex-1 px-4 flex gap-1 items-center"
                              >
                                <Mail size={20} />
                                <span className="hover:underline">
                                  {user.email}
                                </span>
                              </a>
                            )}
                          </div>
                        ))
                      : "Currently no prospects!"}
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
                  {contactedUsers.length ?? 0}{" "}
                  <span className="text-gray-500 text-base">
                    People Connected
                  </span>{" "}
                  <span>
                    <TrendingUp size={16} className="text-green-500" />
                  </span>
                </h1>
              </div>
            </div>
            {property?.propertyState === PropertyStatus.INACTIVE ? null : (
              <div className="flex py-0 ml-auto justify-end">
                <button
                  className="border border-green-500 text-green-500 px-4 py-2 rounded-lg flex items-center gap-2"
                  onClick={() => openDialog(ACTION_DIALOG_ID)}
                >
                  <Stamp size={20} />{" "}
                  {property?.propertyCategory === PropertyCategory.RESALE
                    ? "Mark as Sold"
                    : "Mark as Rented"}
                </button>
              </div>
            )}
            <div className="pt-4">
              <PostedAndRentDetails
                property={property}
                propertyUpdates={propertyUpdates}
              />
            </div>
            <UpgradePropertyBanner onUpgrade={handleUpgrade} />
          </section>
        </section>
      </section>
      <Footer />

      {/* Mobile Footer Section */}
      <MobileFooter>
        <div className="flex justify-end w-full">
          {/* <button
          type="button"
          className="flex gap-2 items-center px-6 py-3 border border-gray-300 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleEdit}
        >
          <EditIcon size={20} /> Edit
        </button> */}

          {property?.propertyState === PropertyStatus.INACTIVE ? null : (
            <button
              type="submit"
              className="flex gap-2 items-center px-6 py-3 border border-green-500 text-green-500 rounded-xl hover:bg-green-600 hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300"
              onClick={() => openDialog(ACTION_DIALOG_ID)}
            >
              <Stamp size={20} />{" "}
              {property?.propertyCategory === PropertyCategory.RESALE
                ? "Mark as Sold"
                : "Mark as Rented"}
            </button>
          )}
        </div>
      </MobileFooter>

      {/* Fullscreen Photo Viewer */}
      <FullscreenPhotoViewer
        images={propertyImages || []}
        currentIndex={currentImageIndex}
        isOpen={!!selectedImage}
        onClose={handleCloseFullscreen}
        onNavigate={handleNavigateImage}
        showThumbnails={true}
        thumbnailPosition="bottom"
      />

      {isDialogOpen(ACTION_DIALOG_ID) && (
        <ActionDialog
          id={ACTION_DIALOG_ID}
          title="Mark as rented out"
          prompt="Are you sure you want to mark this property as Rented out?"
          confirmLabel="Yes, mark as rented!"
          colour="red"
          requireComment={false}
          onConfirm={handleDeactivatingProperty}
          onSuccess={async () => await refetch()}
          onClose={() => closeDialog(ACTION_DIALOG_ID)}
        />
      )}
    </>
  );
}
