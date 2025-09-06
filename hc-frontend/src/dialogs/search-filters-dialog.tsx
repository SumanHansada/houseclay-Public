"use client";

import {
  Bath,
  BedSingle,
  Binoculars,
  CalendarDays,
  CarFront,
  Gem,
  Home,
  IndianRupee,
  Mars,
  RefreshCcw,
  Salad,
  Sofa,
  Venus,
  X,
} from "lucide-react";
import Image from "next/image";
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
import NonVegIconSvg from "public/icons/food-preferences/non-veg.svg";
import VegIconSvg from "public/icons/food-preferences/veg.svg";
import BachelorIconSvg from "public/icons/preferred-tenants/bachelor.svg";
import CompanyIconSvg from "public/icons/preferred-tenants/company.svg";
import CoupleIconSvg from "public/icons/preferred-tenants/couple.svg";
import FamilyIconSvg from "public/icons/preferred-tenants/family.svg";
import FemaleIconSvg from "public/icons/preferred-tenants/female.svg";
import MaleIconSvg from "public/icons/preferred-tenants/male.svg";
import ApartmentIcon from "public/icons/property-types/apartment.webp";
import CommunityVillaIcon from "public/icons/property-types/community-villa.webp";
import IndependentHouseIcon from "public/icons/property-types/independent-house.webp";
import StandaloneBuildingIcon from "public/icons/property-types/standalone-building.webp";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";

const VegIcon = VegIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const NonVegIcon = NonVegIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const FamilyIcon = FamilyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CompanyIcon = CompanyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const BachelorIcon = BachelorIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CoupleIcon = CoupleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

import { useDispatch, useSelector } from "react-redux";

import { Button, RadioGroup, RangeSlider } from "@/base-components";
import { PropertyCategory } from "@/common/enums";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  resetPropertySearch,
  setAmenities,
  setAvailability,
  setBathroomType,
  setBhkType,
  setFoodPref,
  setFurnishing,
  setLookingFor,
  setParking,
  setPriceRangeForBuy,
  setPriceRangeForRent,
  setPropertyCategory,
  setPropertyTypeFilter,
  setTenant,
} from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { Tab, TabContent, TabHeader, Tabs } from "@/utility-components";

interface SearchFiltersDialogProps {
  id: string;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
}

const availabilityTypes = [
  { label: "Any", value: "Any" },
  { label: "Immediate", value: "Immediate" },
  { label: "Within 15 Days", value: "Within 15 Days" },
  { label: "Within 30 Days", value: "Within 30 Days" },
  { label: "After 45 Days", value: "After 45 Days" },
];

const bhkTypes = [
  { label: "1 BHK", value: "1BHK" },
  { label: "2 BHK", value: "2BHK" },
  { label: "3 BHK", value: "3BHK" },
  { label: "4 BHK", value: "4BHK" },
  { label: "5+ BHK", value: "5+BHK" },
];

const parkingTypes = [
  { label: "Both", value: "Both" },
  { label: "2 Wheeler", value: "2 Wheeler" },
  { label: "4 Wheeler", value: "4 Wheeler" },
  { label: "None", value: "None" },
];

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

const MaleIcon = MaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const FemaleIcon = FemaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

const amenities = [
  { label: "Lift", icon: <LiftIcon /> },
  { label: "Club house", icon: <ClubhouseIcon /> },
  { label: "Gym", icon: <GymIcon /> },
  { label: "Outdoor Dining Area", icon: <OutdoorDiningAreaIcon /> },
  { label: "Gated Security", icon: <GatedSecurityIcon /> },
  { label: "Pool", icon: <PoolIcon /> },
  { label: "Fire Extinguisher", icon: <FireExtinguisherIcon /> },
  { label: "Smoke Alarm", icon: <SmokeAlarmIcon /> },
  { label: "Swimming Pool", icon: <SwimmingPoolIcon /> },
  { label: "24/7 Power", icon: <TwentyFourSevenPowerIcon /> },
  { label: "Security", icon: <SecurityIcon /> },
  { label: "Parking Space", icon: <ParkingSpaceIcon /> },
  { label: "Dedicated Workspace", icon: <DedicatedWorkspaceIcon /> },
  { label: "Wifi", icon: <WifiIcon /> },
  { label: "BBQ Grill", icon: <BBQGrillIcon /> },
  { label: "Pool Table", icon: <PoolTableIcon /> },
  { label: "First Aid Kit", icon: <FirstAidKitIcon /> },
];

const SearchFiltersDialog: React.FC<SearchFiltersDialogProps> = ({
  id,
  onClose,
  onReset,
  onApply,
}) => {
  // Redux state selectors
  const {
    propertyCategory,
    propertyTypeFilter,
    tenant,
    foodPref,
    bathroomType,
    furnishing,
    availability,
    amenities: stateAmenities,
    parking,
    priceRangeForRent,
    priceRangeForBuy,
    bhkType,
  } = useSelector((state: RootState) => state.propertySearch);

  console.log("propertyCategory", propertyCategory);

  const marksForRent = [
    { value: 0, label: "0" },
    { value: 200000, label: "200K" },
    { value: 400000, label: "400K" },
    { value: 800000, label: "800K" },
    { value: 1000000, label: "1M" },
  ];

  const marksForBuy = [
    { value: 0, label: "0" },
    { value: 10000000, label: "10M" },
    { value: 20000000, label: "20M" },
    { value: 40000000, label: "40M" },
    { value: 80000000, label: "80M" },
    { value: 100000000, label: "100M" },
  ];

  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetPropertySearch());
    onReset();
  };

  const handleTabChange = (value: string) => {
    dispatch(setLookingFor(value as string));
    dispatch(setPropertyCategory(value as PropertyCategory));
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation="animate-fade-in"
      exitAnimation="animate-fade-out"
    >
      <DialogHeader>
        <div className="flex border-gray-200 items-center w-full justify-between py-4 px-6 max-md:py-2 max-md:px-4">
          <span className="text-xl max-md:hidden">More Filters</span>
          <div className="flex justify-center text-xl ml-auto md:hidden">
            <button
              onClick={() =>
                dispatch(setPropertyCategory(PropertyCategory.RENT))
              }
              className={`px-8 py-1 border-b-2 text-base border-gray-300 ${propertyCategory === PropertyCategory.RENT || propertyCategory === PropertyCategory.FLATMATE ? "text-red-500 border-red-500" : "text-gray-700 "}`}
            >
              Rent
            </button>
            <button
              onClick={() =>
                dispatch(setPropertyCategory(PropertyCategory.RESALE))
              }
              className={`px-8 py-1 border-b-2 text-base border-gray-300 ${propertyCategory === PropertyCategory.RESALE ? "text-red-500 border-red-500" : "text-gray-700 "}`}
            >
              Buy
            </button>
          </div>
          <button
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 ml-auto max-md:border max-md:border-gray-200"
          >
            <X size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col gap-6 px-6 py-2">
          {/* Looking For */}
          {propertyCategory !== PropertyCategory.RESALE && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-lg">
                <Binoculars size={20} /> Looking For
              </div>
              <Tabs
                defaultActive={propertyCategory}
                onTabChange={handleTabChange}
              >
                <TabHeader tabsClassName="justify-between border rounded-xl p-2 w-full flex gap-2">
                  <Tab
                    label="Full House"
                    value={PropertyCategory.RENT}
                    containerClassName="w-1/2 p-3 text-base font-medium max-md:font-normal rounded-xl border transition-colors duration-300"
                    activeClassName="text-red-600 border-red-500"
                    inactiveClassName="text-gray-700 border-transparent"
                  />
                  <Tab
                    label="Flatmates"
                    value={PropertyCategory.FLATMATE}
                    containerClassName="w-1/2 p-3 text-base font-medium max-md:font-normal rounded-xl border transition-colors duration-300"
                    activeClassName="text-red-600 border-red-500"
                    inactiveClassName="text-gray-700 border-transparent"
                  />
                </TabHeader>
                <TabContent value={PropertyCategory.RENT} className="gap-4">
                  {/* Property Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Home size={20} /> Property Type
                    </div>
                    <RadioGroup
                      name="propertyType"
                      columns={4}
                      options={[
                        {
                          value: "Apartment",
                          label: "Apartment",
                          icon: (
                            <Image
                              src={ApartmentIcon}
                              alt="Apartment"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: "Independent House/Villa",
                          label: "Independent House/Villa",
                          icon: (
                            <Image
                              src={IndependentHouseIcon}
                              alt="Independent House/Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: "Community Villa",
                          label: "Community Villa",
                          icon: (
                            <Image
                              src={CommunityVillaIcon}
                              alt="Community Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: "Standalone Building",
                          label: "Standalone Building",
                          icon: (
                            <Image
                              src={StandaloneBuildingIcon}
                              alt="Standalone Building"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                      ]}
                      withIcons={true}
                      value={propertyTypeFilter}
                      onChange={(value) =>
                        dispatch(setPropertyTypeFilter(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* BHK Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <BedSingle size={20} /> BHK Type
                    </div>
                    <div>
                      <RadioGroup
                        name="bhkType"
                        columns={4}
                        options={bhkTypes}
                        value={bhkType}
                        onChange={(value) => {
                          dispatch(setBhkType(value as string));
                        }}
                      />
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Availability */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <CalendarDays size={20} /> Availability
                    </div>
                    <RadioGroup
                      name="availability"
                      columns={4}
                      options={availabilityTypes}
                      value={availability}
                      onChange={(value) =>
                        dispatch(setAvailability(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Preferred Tenants */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <span className="flex">
                        <Mars size={20} />
                        <Venus size={20} />
                      </span>{" "}
                      Preferred Tenants
                    </div>

                    <RadioGroup
                      name="preferredTenants"
                      columns={4}
                      options={[
                        {
                          value: "Family",
                          label: "Family",
                          icon: <FamilyIcon />,
                        },
                        {
                          value: "Company",
                          label: "Company",
                          icon: <CompanyIcon />,
                        },
                        {
                          value: "Bachelor",
                          label: "Bachelor",
                          icon: <BachelorIcon />,
                        },
                        {
                          value: "Couple",
                          label: "Couple",
                          icon: <CoupleIcon />,
                        },
                      ]}
                      withIcons={true}
                      value={tenant}
                      onChange={(value) => dispatch(setTenant(value as string))}
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Price Range */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <IndianRupee size={20} /> Price Range
                    </div>
                    <RangeSlider
                      name="priceRangeForRent"
                      label=""
                      min={0}
                      max={1000000}
                      step={50000}
                      value={priceRangeForRent}
                      onChange={(value) =>
                        dispatch(
                          setPriceRangeForRent(value as [number, number]),
                        )
                      }
                      marks={marksForRent}
                      rangeClassName="absolute h-2 bg-red-500 rounded-full top-1/2 transform -translate-y-1/2"
                      thumbClassName="absolute w-6 h-6 flex justify-center items-center bg-white border-2 border-white-500 rounded-full shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      containerClassName="mb-8"
                      showInputs={isMobile ? false : true}
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Furnishing */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Sofa size={20} /> Furnishing
                    </div>
                    <RadioGroup
                      name="furnishing"
                      columns={4}
                      options={[
                        { value: "Any", label: "Any" },
                        { value: "Fully-furnished", label: "Fully Furnished" },
                        { value: "Semi-furnished", label: "Semi Furnished" },
                        { value: "Unfurnished", label: "Unfurnished" },
                      ]}
                      value={furnishing}
                      onChange={(value) =>
                        dispatch(setFurnishing(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Amenities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Gem size={20} /> Amenities
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity.label}
                          className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenity.label) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                          onClick={() =>
                            dispatch(
                              setAmenities(
                                stateAmenities.includes(amenity.label)
                                  ? stateAmenities.filter(
                                      (a) => a !== amenity.label,
                                    )
                                  : [...stateAmenities, amenity.label],
                              ),
                            )
                          }
                        >
                          {amenity.icon}
                          <span className="text-sm text-left">
                            {amenity.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Parking */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <CarFront size={20} /> Parking
                    </div>
                    <RadioGroup
                      name="parking"
                      columns={2}
                      options={parkingTypes}
                      value={parking}
                      onChange={(value) =>
                        dispatch(setParking(value as string))
                      }
                    />
                  </div>
                </TabContent>
                <TabContent value={PropertyCategory.FLATMATE}>
                  {/* Property Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Home size={20} /> Property Type
                    </div>
                    <RadioGroup
                      name="propertyType"
                      columns={4}
                      options={[
                        {
                          value: "Apartment",
                          label: "Apartment",
                          icon: (
                            <Image
                              src={ApartmentIcon}
                              alt="Apartment"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: "Independent House/Villa",
                          label: "Independent House/Villa",
                          icon: (
                            <Image
                              src={IndependentHouseIcon}
                              alt="Independent House/Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: "Community Villa",
                          label: "Community Villa",
                          icon: (
                            <Image
                              src={CommunityVillaIcon}
                              alt="Community Villa"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                        {
                          value: "Standalone Building",
                          label: "Standalone Building",
                          icon: (
                            <Image
                              src={StandaloneBuildingIcon}
                              alt="Standalone Building"
                              height={75}
                              width={75}
                            />
                          ),
                        },
                      ]}
                      withIcons={true}
                      value={propertyTypeFilter}
                      onChange={(value) =>
                        dispatch(setPropertyTypeFilter(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Availability */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <CalendarDays size={20} /> Availability
                    </div>
                    <RadioGroup
                      name="availability"
                      columns={4}
                      options={availabilityTypes}
                      value={availability}
                      onChange={(value) =>
                        dispatch(setAvailability(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Preferred Tenants & Preferences */}
                  <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-lg">
                        <span className="flex">
                          <Mars size={20} />
                          <Venus size={20} />
                        </span>{" "}
                        Preferred Tenants
                      </div>

                      <RadioGroup
                        name="preferredTenants"
                        columns={2}
                        options={[
                          {
                            value: "Female",
                            label: "Female",
                            icon: <FemaleIcon />,
                          },
                          {
                            value: "Male",
                            label: "Male",
                            icon: <MaleIcon />,
                          },
                        ]}
                        withIcons={true}
                        value={tenant}
                        onChange={(value) =>
                          dispatch(setTenant(value as string))
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-lg">
                        <Salad size={20} /> Food Preferences
                      </div>
                      <RadioGroup
                        name="foodPreferences"
                        columns={2}
                        options={[
                          {
                            value: false,
                            label: "Veg",
                            icon: <VegIcon />,
                          },
                          {
                            value: true,
                            label: "Non-Veg",
                            icon: <NonVegIcon />,
                          },
                        ]}
                        withIcons={true}
                        horizontal
                        value={foodPref}
                        onChange={(value) =>
                          dispatch(setFoodPref(value as string))
                        }
                      />
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Price Range */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <IndianRupee size={20} /> Price Range
                    </div>
                    <RangeSlider
                      name="priceRangeForRent"
                      label=""
                      min={0}
                      max={1000000}
                      step={50000}
                      value={priceRangeForRent}
                      onChange={(value) =>
                        dispatch(
                          setPriceRangeForRent(value as [number, number]),
                        )
                      }
                      marks={marksForRent}
                      rangeClassName="absolute h-2 bg-red-500 rounded-full top-1/2 transform -translate-y-1/2"
                      thumbClassName="absolute w-6 h-6 flex justify-center items-center bg-white border-2 border-white-500 rounded-full shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      containerClassName="mb-8"
                      showInputs={isMobile ? false : true}
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Furnishing */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Sofa size={20} /> Furnishing
                    </div>
                    <RadioGroup
                      name="furnishing"
                      columns={4}
                      options={[
                        { value: "Any", label: "Any" },
                        { value: "Fully-furnished", label: "Fully Furnished" },
                        { value: "Semi-furnished", label: "Semi Furnished" },
                        { value: "Unfurnished", label: "Unfurnished" },
                      ]}
                      value={furnishing}
                      onChange={(value) =>
                        dispatch(setFurnishing(value as string))
                      }
                    />
                  </div>
                  {/* Amenities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Gem size={20} /> Amenities
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity.label}
                          className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenity.label) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                          onClick={() =>
                            dispatch(
                              setAmenities(
                                stateAmenities.includes(amenity.label)
                                  ? stateAmenities.filter(
                                      (a) => a !== amenity.label,
                                    )
                                  : [...stateAmenities, amenity.label],
                              ),
                            )
                          }
                        >
                          {amenity.icon}
                          <span className="text-sm text-left">
                            {amenity.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Bathroom Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <Bath size={20} /> Bathroom Type
                    </div>
                    <RadioGroup
                      name="bathroomType"
                      columns={2}
                      options={[
                        { value: true, label: "Attached" },
                        { value: false, label: "Non-Attached" },
                      ]}
                      containerClassName="w-1/2 max-md:w-full"
                      value={bathroomType}
                      onChange={(value) =>
                        dispatch(setBathroomType(value as string))
                      }
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Parking */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-lg">
                      <CarFront size={20} /> Parking
                    </div>
                    <RadioGroup
                      name="parking"
                      columns={2}
                      options={parkingTypes}
                      value={parking}
                      onChange={(value) =>
                        dispatch(setParking(value as string))
                      }
                    />
                  </div>
                </TabContent>
              </Tabs>
            </div>
          )}

          {propertyCategory === PropertyCategory.RESALE && (
            <div>
              {/* Property Type */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <Home size={20} /> Property Type
                </div>
                <RadioGroup
                  name="propertyType"
                  columns={4}
                  options={[
                    {
                      value: "Apartment",
                      label: "Apartment",
                      icon: (
                        <Image
                          src={ApartmentIcon}
                          alt="Apartment"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: "Independent House/Villa",
                      label: "Independent House/Villa",
                      icon: (
                        <Image
                          src={IndependentHouseIcon}
                          alt="Independent House/Villa"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: "Community Villa",
                      label: "Community Villa",
                      icon: (
                        <Image
                          src={CommunityVillaIcon}
                          alt="Community Villa"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                    {
                      value: "Standalone Building",
                      label: "Standalone Building",
                      icon: (
                        <Image
                          src={StandaloneBuildingIcon}
                          alt="Standalone Building"
                          height={75}
                          width={75}
                        />
                      ),
                    },
                  ]}
                  withIcons={true}
                  value={propertyTypeFilter}
                  onChange={(value) =>
                    dispatch(setPropertyTypeFilter(value as string))
                  }
                />
              </div>
              <hr className="my-4" />
              {/* BHK Type */}

              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <BedSingle size={20} /> BHK Type
                </div>
                <div>
                  <RadioGroup
                    name="bhkType"
                    columns={4}
                    options={bhkTypes}
                    value={bhkType}
                    onChange={(value) => {
                      dispatch(setBhkType(value as string));
                    }}
                  />
                </div>
              </div>
              <hr className="my-4" />
              {/* Availability */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <CalendarDays size={20} /> Availability
                </div>
                <RadioGroup
                  name="availability"
                  columns={4}
                  options={availabilityTypes}
                  value={availability}
                  onChange={(value) =>
                    dispatch(setAvailability(value as string))
                  }
                />
              </div>
              <hr className="my-4" />
              {/* Preferred Tenants */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <span className="flex">
                    <Mars size={20} />
                    <Venus size={20} />
                  </span>{" "}
                  Preferred Tenants
                </div>

                <RadioGroup
                  name="preferredTenants"
                  columns={4}
                  options={[
                    {
                      value: "Family",
                      label: "Family",
                      icon: <FamilyIcon />,
                    },
                    {
                      value: "Company",
                      label: "Company",
                      icon: <CompanyIcon />,
                    },
                    {
                      value: "Bachelor",
                      label: "Bachelor",
                      icon: <BachelorIcon />,
                    },
                    {
                      value: "Couple",
                      label: "Couple",
                      icon: <CoupleIcon />,
                    },
                  ]}
                  withIcons={true}
                  value={tenant}
                  onChange={(value) => dispatch(setTenant(value as string))}
                />
              </div>
              <hr className="my-4" />
              {/* Furnishing */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <Sofa size={20} /> Furnishing
                </div>
                <RadioGroup
                  name="furnishing"
                  columns={4}
                  options={[
                    { value: "Any", label: "Any" },
                    { value: "Fully-furnished", label: "Fully Furnished" },
                    { value: "Semi-furnished", label: "Semi Furnished" },
                    { value: "Unfurnished", label: "Unfurnished" },
                  ]}
                  value={furnishing}
                  onChange={(value) => dispatch(setFurnishing(value as string))}
                />
              </div>
              <hr className="my-4" />
              {/* Price Range */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <IndianRupee size={20} /> Price Range
                </div>
                <RangeSlider
                  name="priceRangeForBuy"
                  label=""
                  min={0}
                  max={100000000}
                  step={5000000}
                  value={priceRangeForBuy}
                  onChange={(value) =>
                    dispatch(setPriceRangeForBuy(value as [number, number]))
                  }
                  marks={marksForBuy}
                  rangeClassName="absolute h-2 bg-red-500 rounded-full top-1/2 transform -translate-y-1/2"
                  thumbClassName="absolute w-6 h-6 flex justify-center items-center bg-white border-2 border-white-500 rounded-full shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  containerClassName="mb-8"
                  showInputs={isMobile ? false : true}
                />
              </div>
              <hr className="my-4" />
              {/* Amenities */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <Gem size={20} /> Amenities
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity.label}
                      className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${stateAmenities.includes(amenity.label) ? "border-red-500" : "border-gray-200 text-gray-700"}`}
                      onClick={() =>
                        dispatch(
                          setAmenities(
                            stateAmenities.includes(amenity.label)
                              ? stateAmenities.filter(
                                  (a) => a !== amenity.label,
                                )
                              : [...stateAmenities, amenity.label],
                          ),
                        )
                      }
                    >
                      {amenity.icon}
                      <span className="text-sm text-left">{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <hr className="my-4" />
              {/* Parking */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <CarFront size={20} /> Parking
                </div>
                <RadioGroup
                  name="parking"
                  columns={2}
                  options={parkingTypes}
                  value={parking}
                  onChange={(value) => dispatch(setParking(value as string))}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex border-t border-gray-200 w-full px-6 py-2 md:py-3 justify-between max-md:px-4">
          <Button
            variant="outline"
            leftIcon={<RefreshCcw size={20} />}
            size="md"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white hover:bg-gray-100"
            onClick={handleReset}
          >
            Reset All
          </Button>
          <Button
            variant="primary"
            size="md"
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={onApply}
          >
            Show Results
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default SearchFiltersDialog;
