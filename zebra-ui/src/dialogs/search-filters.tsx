"use client";

import {
  Bath,
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
import FemaleIconSvg from "public/icons/preferred-tenants/female.svg";
import MaleIconSvg from "public/icons/preferred-tenants/male.svg";
import ApartmentIcon from "public/icons/property-types/apartment.webp";
import CommunityVillaIcon from "public/icons/property-types/community-villa.webp";
import IndependentHouseIcon from "public/icons/property-types/independent-house.webp";
import StandaloneBuildingIcon from "public/icons/property-types/standalone-building.webp";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";

const VegIcon = VegIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const NonVegIcon = NonVegIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

import Button from "@/components/common/Button";
import RadioGroup from "@/components/common/RadioGroup";
import RangeSlider from "@/components/common/RangeSlider";
import { useDeviceContext } from "@/providers/DeviceContextProvider";

interface SearchFilterDialogProps {
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

const SearchFilterDialog: React.FC<SearchFilterDialogProps> = ({
  id,
  onClose,
  onReset,
  onApply,
}) => {
  // Stub state for each filter
  const [lookingFor, setLookingFor] = useState("Full House");
  const [selectedPropertyType, setSelectedPropertyType] = useState(
    "Independent House/Villa",
  );
  const [selectedTenant, setSelectedTenant] = useState("Female");
  const [selectedFoodPref, setSelectedFoodPref] = useState("Veg");
  const [selectedBathroomType, setSelectedBathroomType] =
    useState("Non-Attached");
  const [selectedFurnishing, setSelectedFurnishing] =
    useState("Fully Furnished");
  const [selectedAvailability, setSelectedAvailability] =
    useState("Within 15 Days");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedParking, setSelectedParking] = useState("2 Wheeler");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    10000, 80000,
  ]);
  const { isMobile } = useDeviceContext();

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation="animate-fade-in"
      exitAnimation="animate-fade-out"
      height={72}
      width={40}
    >
      <DialogHeader>
        <div className="flex md:border-b border-gray-200 items-center w-full justify-between py-4 px-6 max-md:py-2 max-md:px-4">
          <span className="text-xl max-md:py-1.5">More Filters</span>
          <button onClick={onClose} className="rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="flex flex-col gap-6 px-6 py-2">
          {/* Looking For */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-lg">
              <Binoculars size={20} /> Looking For
            </div>
            <div className="flex border border-gray-200 rounded-xl p-2">
              <RadioGroup
                name="lookingFor"
                columns={2}
                options={[
                  { value: "Full House", label: "Full House" },
                  { value: "Flatmates", label: "Flatmates" },
                ]}
                value={lookingFor}
                containerClassName="w-full"
                onChange={(value) => setLookingFor(value as string)}
              />
            </div>
          </div>
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
              value={selectedPropertyType}
              onChange={(value) => setSelectedPropertyType(value as string)}
            />
          </div>
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
                value={selectedTenant}
                onChange={(value) => setSelectedTenant(value as string)}
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
                value={selectedFoodPref}
                onChange={(value) => setSelectedFoodPref(value as string)}
              />
            </div>
          </div>
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
              value={selectedBathroomType}
              onChange={(value) => setSelectedBathroomType(value as string)}
            />
          </div>
          {/* Price Range */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-lg">
              <IndianRupee size={20} /> Price Range
            </div>
            <RangeSlider
              min={0}
              max={100000}
              step={10000}
              value={priceRange}
              onChange={(value) => setPriceRange(value as [number, number])}
              marks={[
                { value: 0, label: "0" },
                { value: 25000, label: "25K" },
                { value: 50000, label: "50K" },
                { value: 75000, label: "75K" },
                { value: 100000, label: "100K" },
              ]}
              rangeClassName="absolute h-2 bg-red-500 rounded-full top-1/2 transform -translate-y-1/2"
              thumbClassName="absolute w-6 h-6 flex justify-center items-center bg-white border-2 border-white-500 rounded-full shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              showInputs={isMobile ? false : true}
            />
          </div>
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
              value={selectedFurnishing}
              onChange={(value) => setSelectedFurnishing(value as string)}
            />
          </div>
          {/* Availability */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-lg">
              <CalendarDays size={20} /> Availability
            </div>
            <RadioGroup
              name="availability"
              columns={4}
              options={availabilityTypes}
              value={selectedAvailability}
              onChange={(value) => setSelectedAvailability(value as string)}
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
                  className={`flex flex-col items-start justify-center border rounded-xl p-3 gap-2 ${selectedAmenities.includes(amenity.label) ? "border-red-500 text-red-500" : "border-gray-200 text-gray-700"}`}
                  onClick={() =>
                    setSelectedAmenities(
                      selectedAmenities.includes(amenity.label)
                        ? selectedAmenities.filter((a) => a !== amenity.label)
                        : [...selectedAmenities, amenity.label],
                    )
                  }
                >
                  {amenity.icon}
                  <span className="text-sm text-left">{amenity.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Parking */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-lg">
              <CarFront size={20} /> Parking
            </div>
            <RadioGroup
              name="parking"
              columns={2}
              options={[
                { label: "Available", value: true },
                { label: "Not Available", value: false },
              ]}
              containerClassName="w-1/2 max-md:w-full"
              value={selectedParking}
              onChange={(value) => setSelectedParking(value as string)}
            />
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full px-6 py-3 justify-between max-md:px-4">
          <Button
            variant="outline"
            leftIcon={<RefreshCcw size={20} />}
            size="md"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white hover:bg-gray-100"
            onClick={onReset}
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

export default SearchFilterDialog;
