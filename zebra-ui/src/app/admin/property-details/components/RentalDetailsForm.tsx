"use client";

import { IndianRupee } from "lucide-react";
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
import { useSelector } from "react-redux";

import { PropertyCategoryEnum } from "@/common/enums";
import FormCalendarField from "@/components/common/FormCalendarField";
import FormCurrencyField from "@/components/common/FormCurrencyField";
import FormCheckbox from "@/form-components/FormCheckbox";
import FormRadioGroup from "@/form-components/FormRadioGroup";
import FormSelectDropdown from "@/form-components/FormSelectDropdown";
import { selectPropertyCategory } from "@/store/propertyDetailsSlice";

interface RentalDetailsFormProps {
  disabled: boolean;
}

const FamilyIcon = FamilyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CompanyIcon = CompanyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const BachelorIcon = BachelorIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CoupleIcon = CoupleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const MaleIcon = MaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const FemaleIcon = FemaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const VegIcon = VegIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const NonVegIcon = NonVegIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
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

const RentalDetailsForm: React.FC<RentalDetailsFormProps> = ({ disabled }) => {
  const propertyCategory = useSelector(selectPropertyCategory);
  if (!propertyCategory) {
    return null;
  }
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">
          Provide rental details about your property
        </h1>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCurrencyField
              name={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.rent"
                  : "flatmateDetails.rent"
              }
              id={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.rent"
                  : "flatmateDetails.rent"
              }
              label="Rent"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
              required
              // disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            {propertyCategory === PropertyCategoryEnum.RENT && (
              <FormRadioGroup
                name="rentalDetails.rentNegotiable"
                label="Rent Negotiable"
                columns={2}
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                horizontal
                // disabled={disabled}
              />
            )}
            {propertyCategory === PropertyCategoryEnum.FLATMATE && (
              <FormSelectDropdown
                label="Parking"
                name="flatmateDetails.parking"
                id="flatmateDetails.parking"
                options={[
                  { value: "Both", label: "Both" },
                  { value: "2 Wheeler", label: "2 Wheeler" },
                  { value: "4 Wheeler", label: "4 Wheeler" },
                  { value: "None", label: "None" },
                ]}
                required={true}
                placeholder="Select Parking"
                disabled={disabled}
                // aria-describedby={
                //   errors?.flatmateDetails?.parking &&
                //   touched?.flatmateDetails?.parking
                //     ? "flatmateDetails.parking-error"
                //     : undefined
                // }
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCurrencyField
              name={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.maintenanceCharges"
                  : "flatmateDetails.maintenanceCharges"
              }
              id={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.maintenanceCharges"
                  : "flatmateDetails.maintenanceCharges"
              }
              label="Maintenance Charges"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
              // disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormCurrencyField
              name={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.deposit"
                  : "flatmateDetails.depositCharges"
              }
              id={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.deposit"
                  : "flatmateDetails.depositCharges"
              }
              label="Deposit"
              prefix={<IndianRupee size={20} />}
              required
              // disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCalendarField
              name={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.availableFrom"
                  : "flatmateDetails.availableFrom"
              }
              label="Available From"
              dateFormat="yyyy-MM-dd"
              className="w-full"
              required
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Furnishing"
              name={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.furnishing"
                  : "flatmateDetails.furnishing"
              }
              id={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.furnishing"
                  : "flatmateDetails.furnishing"
              }
              options={[
                {
                  value: "Fully-furnished",
                  label: "Fully Furnished",
                },
                {
                  value: "Semi-funnished",
                  label: "Semi Furnished",
                },
                { value: "Unfurnished", label: "UnFurnished" },
              ]}
              required={true}
              placeholder="Select furnishing"
              disabled={disabled}
              // aria-describedby={
              //   propertyCategory === PropertyCategoryEnum.RENT
              //     ? errors?.rentalDetails?.furnishing &&
              //       touched?.rentalDetails?.furnishing
              //       ? "rentalDetails.furnishing-error"
              //       : undefined
              //     : errors?.flatmateDetails?.furnishing &&
              //         touched?.flatmateDetails?.furnishing
              //       ? "flatmateDetails.furnishing-error"
              //       : undefined
              // }
            />
          </div>
        </div>
        {propertyCategory === PropertyCategoryEnum.RENT && (
          <div className="mb-6">
            <FormCheckbox
              name="rentalDetails.preferredTenants"
              label="Preferred Tenant"
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
              required
              // disabled={disabled}
            />
          </div>
        )}
        {propertyCategory === PropertyCategoryEnum.FLATMATE && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormRadioGroup
              name="flatmateDetails.tenantType"
              label="Preferred Tenant"
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
              required
              horizontal
              // disabled={disabled}
            />
            <FormRadioGroup
              name="flatmateDetails.nonVegAllowed"
              label="Food Preferences"
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
              // disabled={disabled}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Water Supply"
              name={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.waterSupply"
                  : "flatmateDetails.waterSupply"
              }
              id={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.waterSupply"
                  : "flatmateDetails.waterSupply"
              }
              options={[
                { value: "borewell", label: "Borewell" },
                {
                  value: "tanker",
                  label: "Tanker",
                },
                {
                  value: "Ground-water",
                  label: "Ground Water",
                },
              ]}
              required={true}
              placeholder="Select Water supply"
              disabled={disabled}
              // aria-describedby={
              //   propertyCategory === PropertyCategoryEnum.RENT
              //     ? errors?.rentalDetails?.waterSupply &&
              //       touched?.rentalDetails?.waterSupply
              //       ? "rentalDetails.waterSupply-error"
              //       : undefined
              //     : errors?.flatmateDetails?.waterSupply &&
              //         touched?.flatmateDetails?.waterSupply
              //       ? "flatmateDetails.waterSupply-error"
              //       : undefined
              // }
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Power Backup"
              name={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.powerBackup"
                  : "flatmateDetails.powerBackup"
              }
              id={
                propertyCategory === PropertyCategoryEnum.RENT
                  ? "rentalDetails.powerBackup"
                  : "flatmateDetails.powerBackup"
              }
              options={[
                { value: "full", label: "Full" },
                {
                  value: "partial",
                  label: "Partial",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
              required={true}
              placeholder="Select Power backup"
              disabled={disabled}
              // aria-describedby={
              //   propertyCategory === PropertyCategoryEnum.RENT
              //     ? errors?.rentalDetails?.powerBackup &&
              //       touched?.rentalDetails?.powerBackup
              //       ? "rentalDetails.powerBackup-error"
              //       : undefined
              //     : errors?.flatmateDetails?.powerBackup &&
              //         touched?.flatmateDetails?.powerBackup
              //       ? "flatmateDetails.powerBackup-error"
              //       : undefined
              // }
            />
          </div>
        </div>
        {propertyCategory === PropertyCategoryEnum.RENT && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormSelectDropdown
                label="Parking"
                name="rentalDetails.parking"
                id="rentalDetails.parking"
                options={[
                  { value: "Both", label: "Both" },
                  { value: "2 Wheeler", label: "2 Wheeler" },
                  { value: "4 Wheeler", label: "4 Wheeler" },
                  { value: "None", label: "None" },
                ]}
                required={true}
                placeholder="Select Parking"
                disabled={disabled}
                // aria-describedby={
                //   errors?.rentalDetails?.parking &&
                //   touched?.rentalDetails?.parking
                //     ? "rentalDetails.parking-error"
                //     : undefined
                // }
              />
            </div>
            <div className="col-span-1">
              <FormRadioGroup
                name="rentalDetails.nonVegAllowed"
                label="Non Veg Allowed"
                columns={2}
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                required
                horizontal
                // disabled={disabled}
              />
            </div>
          </div>
        )}
        {propertyCategory === PropertyCategoryEnum.FLATMATE && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormRadioGroup
                name="flatmateDetails.attachedBathroom"
                label="Attached Bathroom"
                columns={2}
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                required
                horizontal
                // disabled={disabled}
              />
            </div>
            <div className="col-span-1">
              <FormRadioGroup
                name="flatmateDetails.attachedBalcony"
                label="Attached Balcony"
                columns={2}
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                required
                horizontal
                // disabled={disabled}
              />
            </div>
          </div>
        )}
        {propertyCategory === PropertyCategoryEnum.FLATMATE && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormRadioGroup
                name="flatmateDetails.smokingPreference"
                label="Smoking Allowed"
                columns={2}
                options={[
                  { value: "Not Allowed", label: "Not Allowed" },
                  { value: "Allowed", label: "Allowed" },
                ]}
                required
                horizontal
                // disabled={disabled}
              />
            </div>
            <div className="col-span-1">
              <FormRadioGroup
                name="flatmateDetails.drinkingPreference"
                label="Drinking Allowed"
                columns={2}
                options={[
                  { value: "No", label: "No" },
                  { value: "Occasionally", label: "Occasionally" },
                ]}
                required
                horizontal
                // disabled={disabled}
              />
            </div>
          </div>
        )}
      </div>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800">
          Select the available amenities
        </h1>
        <FormCheckbox
          name={
            propertyCategory === PropertyCategoryEnum.RENT
              ? "rentalDetails.amenities"
              : "flatmateDetails.amenities"
          }
          columns={4}
          options={[
            { value: "Lift", label: "Lift", icon: <LiftIcon /> },
            {
              value: "Clubhouse",
              label: "Club house",
              icon: <ClubhouseIcon />,
            },
            { value: "Gym", label: "Gym", icon: <GymIcon /> },
            {
              value: "Outdoor Dining Area",
              label: "Outdoor Dining Area",
              icon: <OutdoorDiningAreaIcon />,
            },
            {
              value: "Gated Security",
              label: "Gated Security",
              icon: <GatedSecurityIcon />,
            },
            { value: "Pool", label: "Pool ", icon: <PoolIcon /> },
            {
              value: "Fire Extinguisher",
              label: "Fire Extinguisher",
              icon: <FireExtinguisherIcon />,
            },
            {
              value: "Smoke Alarm",
              label: "Smoke Alarm",
              icon: <SmokeAlarmIcon />,
            },
            {
              value: "Swimming Pool",
              label: "Swimming Pool",
              icon: <SwimmingPoolIcon />,
            },
            {
              value: "24/7 Power",
              label: "24/7 Power",
              icon: <TwentyFourSevenPowerIcon />,
            },
            {
              value: "Security",
              label: "Security",
              icon: <SecurityIcon />,
            },
            {
              value: "Parking Space",
              label: "Parking Space",
              icon: <ParkingSpaceIcon />,
            },
            {
              value: "Dedicated Workspace",
              label: "Dedicated Workspace",
              icon: <DedicatedWorkspaceIcon />,
            },
            { value: "Wifi", label: "Wifi", icon: <WifiIcon /> },
            {
              value: "BBQ Grill",
              label: "BBQ Grill",
              icon: <BBQGrillIcon />,
            },
            {
              value: "Pool Table",
              label: "Pool Table",
              icon: <PoolTableIcon />,
            },
            {
              value: "First Aid Kit",
              label: "First Aid Kit",
              icon: <FirstAidKitIcon />,
            },
          ]}
          withIcons={true}
          alignment="start"
          required
          // disabled={disabled}
        />
      </div>
    </div>
  );
};

export default RentalDetailsForm;
