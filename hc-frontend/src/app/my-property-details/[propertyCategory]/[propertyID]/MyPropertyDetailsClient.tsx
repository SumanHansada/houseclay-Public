"use client";

import {
  BanknoteArrowUp,
  Bath,
  BedDouble,
  BedSingle,
  Blocks,
  BrushCleaning,
  Building2,
  ChevronLeft,
  Cigarette,
  CircleParking,
  ClipboardPen,
  CloudHail,
  Dam,
  DoorOpen,
  Droplets,
  Drumstick,
  EditIcon,
  Flower2,
  HandCoins,
  Headset,
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
import { useState } from "react";
import React from "react";

import { Button } from "@/base-components";
import {
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
  twentyFourSevenIconURL,
  wifiIconURL,
} from "@/common/cdnURLs";
import {
  AMENITY_LABELS,
  AMENITY_VALUES,
  BHK_TYPE_OPTIONS,
  FACING_OPTIONS,
  FLOOR_NUMERIC_OPTIONS,
  FURNISHING_OPTIONS,
  getOptionLabel,
  PARKING_OPTIONS,
  PROPERTY_AGE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  TOTAL_FLOORS_NUMERIC_OPTIONS,
  WATER_SUPPLY_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/dataConstants/options";
import {
  MARK_RENTED_ACTION_DIALOG_ID,
  UPGRADE_PROPERTY_DIALOG_ID,
} from "@/common/dialogConstants";
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
import { UpgradePropertyDialog } from "@/dialogs";
import { ActionDialog } from "@/dialogs/action-dialog";
import { Footer, MobileFooter, MobileHeader } from "@/layout-components";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useDeactivatePropertyMutation,
  useGenerateLeadMutation,
  useGetMyPropertyByIdQuery,
} from "@/store/apiSlice";
import {
  FullscreenPhotoViewer,
  ImageWithLoader,
  NonTab,
  RemoteSvg,
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

export function MyPropertyDetailsClient({
  propertyCategory,
  propertyID,
}: MyPropertyDetailsClientProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deactivatingProperty] = useDeactivatePropertyMutation();
  const {
    data: propertyDataRaw,
    isLoading: isPropertyLoading,
    isError,
    refetch,
  } = useGetMyPropertyByIdQuery(propertyID, {
    // skip: !propertyID,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
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
  const preferredTenants = property?.preferredTenants
    ? property.preferredTenants
        .map((value: string) => pascalCase(value))
        .join(", ")
    : "N/A";
  const smokingPreference = getOptionLabel(
    YES_NO_OPTIONS,
    property?.smokingPreference,
  );
  const drinkingPreference = getOptionLabel(
    YES_NO_OPTIONS,
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

  const handleEdit = async () => {
    router.push(
      `/edit-property/${propertyCategory.toLowerCase()}/${propertyID}`,
    );
  };

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

  if (isPropertyLoading || isError) {
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
            className="p-1 rounded-full"
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
      <section className="flex w-full gap-8 px-8 xl:gap-16 lg:gap-8 md:gap-8 xl:px-28 lg:px-14 md:px-8 max-md:pt-4 max-md:pb-4">
        <section className="w-3/4 max-md:w-full">
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
            <div className="py-12 mx-auto">
              <div className="flex items-center justify-between gap-3">
                <h1 className="flex items-center justify-between text-3xl text-gray-900">
                  {bhkType} in {property?.locationOrSocietyName} for{" "}
                  {pascalCase(property?.propertyCategory)} in {property?.city}
                </h1>
                <RenderPropertyStatus status={property?.propertyState} />
              </div>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="max-md:min-h-[fit-content] w-full overflow-hidden">
            <div className="flex py-0 mx-auto">
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
                  <NonTab className="max-md:hidden">
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded-lg"
                        onClick={handleEdit}
                      >
                        <EditIcon size={20} /> Edit
                      </button>
                    </div>
                  </NonTab>
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
                    <div className="flex justify-between text-base xl:text-xl mb-4 md:hidden">
                      <h1 className="flex items-center gap-1 lg:gap-2 m-1 text-gray-900">
                        <span className="font-semibold">
                          {contactedUsers.length ?? 0}
                        </span>
                        <span className="text-gray-500 text-nowrap">
                          People Connected
                        </span>{" "}
                        <span>
                          <TrendingUp size={16} className="text-green-500" />
                        </span>
                      </h1>
                      <RenderPropertyStatus status={property?.propertyState} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl">Description</h2>
                      <p className="mb-6 text-gray-700">
                        {property?.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <h2 className="flex items-center gap-1 text-xl">
                        <span className="">Property Location</span>
                        <MapPin size={16} />
                      </h2>
                      <div className="flex items-center gap-2 text-gray-500">
                        {property?.locationOrSocietyName}, {property?.city}
                      </div>
                    </div>
                  </section>
                  {/* Property Details Section */}
                  <section className="p-6 border shadow-md rounded-xl max-md:p-3 max-md:my-3">
                    <div className="grid items-center gap-4 text-base md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <House size={24} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            Property Type
                          </div>
                          <div className="font-bold text-gray-900 font-nunito">
                            {propertyType}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <BedDouble size={24} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            No. of Bedroom
                          </div>
                          <div className="font-bold text-gray-900 font-nunito">
                            {bedrooms}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <Ruler size={20} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            Built Up Area
                          </div>
                          <div className="font-bold text-gray-900 font-nunito">
                            {property?.builtUpArea} Sq. Ft
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <Building2 size={20} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            Floor
                          </div>
                          <div className="font-bold text-gray-900 font-nunito">
                            {propertyFloor} of {totalFloors}
                          </div>
                        </div>
                      </div>
                      {(property?.propertyCategory ===
                        PropertyCategory.RESALE ||
                        property?.propertyCategory ===
                          PropertyCategory.RENT) && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Sun size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Facing
                            </div>
                            <div className="font-bold text-gray-900 font-nunito">
                              {propertyFacing}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory ===
                        PropertyCategory.RESALE ||
                        property?.propertyCategory ===
                          PropertyCategory.RENT) && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <ClipboardPen size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Bathrooms
                            </div>
                            <div className="font-bold text-gray-900 font-nunito">
                              {bathrooms}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory ===
                        PropertyCategory.RESALE ||
                        property?.propertyCategory ===
                          PropertyCategory.RENT) && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Hourglass size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Property Age
                            </div>
                            <div className="font-bold text-gray-900 font-nunito">
                              {propertyAge}
                            </div>
                          </div>
                        </div>
                      )}
                      {(property?.propertyCategory ===
                        PropertyCategory.RESALE ||
                        property?.propertyCategory ===
                          PropertyCategory.RENT) && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <SwatchBook size={20} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Floor Type
                            </div>
                            <div className="font-bold text-gray-900 font-nunito">
                              {pascalCase(property?.floorType)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                  {/* Rental/Sale/Flatmate Details Section */}
                  <section className="py-6 my-6 max-md:py-3 max-md:my-3">
                    <div className="grid items-center gap-4 text-base md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-start">
                      {property?.propertyCategory === PropertyCategory.RENT && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <HandCoins size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
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
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <BrushCleaning size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
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
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <BanknoteArrowUp size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Deposit
                            </div>
                            <div className="text-gray-900">
                              {formattedDeposit}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <DoorOpen size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            Available From
                          </div>
                          <div className="text-gray-900">{availableFrom}</div>
                        </div>
                      </div>
                      {property?.propertyCategory ===
                        PropertyCategory.RESALE && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Bath size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Bathrooms
                            </div>
                            <div className="text-gray-900">{bathrooms}</div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory ===
                        PropertyCategory.RESALE && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Flower2 size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Balcony
                            </div>
                            <div className="text-gray-900">{balcony}</div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory ===
                        PropertyCategory.RESALE && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <HandCoins size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
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
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Landmark size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Under Loan
                            </div>
                            <div className="text-gray-900">
                              {property?.underLoan ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <Sofa size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            Furnishing
                          </div>
                          <div className="text-gray-900">
                            {furnishingStatus}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <Droplets size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            Water Supply
                          </div>
                          <div className="text-gray-900">{waterSupply}</div>
                        </div>
                      </div>
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <PlugZap size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            Power Backup
                          </div>
                          <div className="text-gray-900">
                            {pascalCase(property?.powerBackup)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                        <div className="flex-col">
                          <div className="p-0.5">
                            <CircleParking size={28} strokeWidth={1.25} />
                          </div>
                        </div>
                        <div className="flex-col">
                          <div className="flex items-center gap-2 font-nunito">
                            Parking
                          </div>
                          <div className="text-gray-900">{parking}</div>
                        </div>
                      </div>
                      {(property?.propertyCategory === PropertyCategory.RENT ||
                        property?.propertyCategory ===
                          PropertyCategory.FLATMATE) && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Drumstick size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
                              Non-Veg Allowed
                            </div>
                            <div className="text-gray-900">
                              {property?.nonVegAllowed ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      )}
                      {property?.propertyCategory === PropertyCategory.RENT && (
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <UserSearch size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
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
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <UserSearch size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
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
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Bath size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
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
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Flower2 size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
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
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Cigarette size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 text-gray-500 font-nunito">
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
                        <div className="flex items-start justify-start w-full gap-2 text-gray-600">
                          <div className="flex-col">
                            <div className="p-0.5">
                              <Wine size={28} strokeWidth={1.25} />
                            </div>
                          </div>
                          <div className="flex-col">
                            <div className="flex items-center gap-2 font-nunito">
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
                  {property?.amenities.length > 0 ? (
                    <section className="py-6 my-6 max-md:py-3 max-md:my-3">
                      <h2 className="mb-4 text-xl">Amenities</h2>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  {/* Images Section */}
                  {propertyImages?.length > 0 && (
                    <section className="py-6 my-6 max-md:py-3 max-md:my-3">
                      <h2 className="mb-4 text-xl">Images</h2>
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
                      </div>
                    </section>
                  )}
                </TabContent>
                {/* <TabContent value="upgrades">
                  <section className="w-full py-6">
                    <h2 className="mb-2 text-lg font-semibold">Upgrades</h2>
                    <p className="text-gray-700">
                      No upgrades information available yet. I am a disco dance.
                      Zindagi na milegi dobara. Hello How are you? I am a
                      student who is working to make an app. A life changing app
                    </p>
                  </section>
                </TabContent> */}
                <TabContent value="prospects">
                  <section className="py-6">
                    <h2 className="mb-2 text-lg font-semibold">Prospects</h2>

                    {contactedUsers.length
                      ? contactedUsers.map((user) => (
                          <div
                            key={user.phoneNo}
                            className="flex w-full px-4 py-3 mb-4 text-lg bg-gray-100 rounded-lg max-lg:flex-col max-lg:gap-2"
                          >
                            <div className="flex-1 px-4 border-gray-400 lg:border-r">
                              {user.name}
                            </div>
                            <a
                              href={`tel:${user.phoneNo}`}
                              className="flex items-center flex-1 gap-1 px-4 border-gray-400 lg:border-r"
                            >
                              <PhoneCall size={20} />
                              <span className="hover:underline">
                                {user.phoneNo}
                              </span>
                            </a>
                            {user.email && (
                              <a
                                href={`mailto:${user.email}`}
                                className="flex items-center flex-1 gap-1 px-4"
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
            <div className="flex justify-end text-base xl:text-xl py-12">
              <h1 className="flex items-center gap-1 lg:gap-2 m-1 text-gray-900">
                <span className="font-semibold">
                  {contactedUsers.length ?? 0}
                </span>
                <span className="text-gray-500 text-nowrap">
                  People Connected
                </span>{" "}
                <span>
                  <TrendingUp size={16} className="text-green-500" />
                </span>
              </h1>
            </div>
            {property?.propertyState === PropertyStatus.INACTIVE ? null : (
              <div className="flex justify-end py-0 ml-auto">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-green-500 border border-green-500 rounded-lg"
                  onClick={() => openDialog(MARK_RENTED_ACTION_DIALOG_ID)}
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
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleEdit}
        >
          <EditIcon size={20} /> Edit
        </button>

        {property?.propertyState === PropertyStatus.INACTIVE ? null : (
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 text-green-500 border border-green-500 rounded-xl hover:bg-green-600 hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300"
            onClick={() => openDialog(MARK_RENTED_ACTION_DIALOG_ID)}
          >
            <Stamp size={20} />{" "}
            {property?.propertyCategory === PropertyCategory.RESALE
              ? "Mark as Sold"
              : "Mark as Rented"}
          </button>
        )}
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

      {isDialogOpen(MARK_RENTED_ACTION_DIALOG_ID) && (
        <ActionDialog
          id={MARK_RENTED_ACTION_DIALOG_ID}
          title="Mark as rented out"
          prompt="Are you sure you want to mark this property as Rented out?"
          confirmLabel="Yes, mark as rented!"
          colour="red"
          requireComment={false}
          onConfirm={handleDeactivatingProperty}
          onSuccess={async () => await refetch()}
          onClose={() => closeDialog(MARK_RENTED_ACTION_DIALOG_ID)}
        />
      )}

      {/* Upgrade Property Dialog */}
      {isDialogOpen(UPGRADE_PROPERTY_DIALOG_ID) && (
        <UpgradePropertyDialog id={UPGRADE_PROPERTY_DIALOG_ID} />
      )}
    </>
  );
}
