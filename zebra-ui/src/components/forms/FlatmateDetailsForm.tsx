"use client";

import { useFormikContext } from "formik";
import { IndianRupee } from "lucide-react";
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
import SwimmingPoolIconSvg from "public/icons/amenities/swimming-pool.svg";

import {
  FormCalendarField,
  FormCheckbox,
  FormCurrencyField,
  FormRadioGroup,
  FormSelectDropdown,
} from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import { SvgIcon } from "@/utility-components";
import {
  getFlatmateDetailsErrors,
  getFlatmateDetailsTouched,
} from "@/utils/formHelpers";

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
const SwimmingPoolIcon = SwimmingPoolIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const SecurityIcon = SecurityIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const ParkingSpaceIcon = ParkingSpaceIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const DedicatedWorkspaceIcon = DedicatedWorkspaceIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const PoolTableIcon = PoolTableIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const FirstAidKitIcon = FirstAidKitIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

interface FlatmateDetailsFormProps {
  disabled: boolean;
}

const FlatmateDetailsForm: React.FC<FlatmateDetailsFormProps> = ({
  disabled,
}) => {
  const { errors, touched } = useFormikContext<FormValues>();

  // Helper function to safely access optional fields
  const flatmateDetailsErrors = getFlatmateDetailsErrors(errors);
  const flatmateDetailsTouched = getFlatmateDetailsTouched(touched);

  // console.log("<-- FlatmateDetails (Form 3) - Flatmate -->");

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">
          Provide flatmate details about your property
        </h1>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCurrencyField
              name="flatmateDetails.rent"
              id="flatmateDetails.rent"
              label="Rent"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
              required
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
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
              aria-describedby={
                flatmateDetailsErrors?.parking &&
                flatmateDetailsTouched?.parking
                  ? "flatmateDetails.parking-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCurrencyField
              name="flatmateDetails.maintenanceCharges"
              id="flatmateDetails.maintenanceCharges"
              label="Maintenance Charges"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
              required
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormCurrencyField
              name="flatmateDetails.depositCharges"
              id="flatmateDetails.depositCharges"
              label="Deposit"
              prefix={<IndianRupee size={20} />}
              required
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCalendarField
              name="flatmateDetails.availableFrom"
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
              name="flatmateDetails.furnishing"
              id="flatmateDetails.furnishing"
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
              aria-describedby={
                flatmateDetailsErrors?.furnishing &&
                flatmateDetailsTouched?.furnishing
                  ? "flatmateDetails.furnishing-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormRadioGroup
            name="flatmateDetails.tenantType"
            label="Preferred Tenant"
            columns={2}
            options={[
              {
                value: "Female",
                label: "Female",
                icon: <SvgIcon name="female" iconSize="medium" size={75} />,
              },
              {
                value: "Male",
                label: "Male",
                icon: <SvgIcon name="male" iconSize="medium" size={75} />,
              },
            ]}
            withIcons={true}
            required
            horizontal
            disabled={disabled}
          />
          <FormRadioGroup
            name="flatmateDetails.nonVegAllowed"
            label="Food Preferences"
            columns={2}
            options={[
              {
                value: false,
                label: "Veg",
                icon: <SvgIcon name="veg" iconSize="large" size={68} />,
              },
              {
                value: true,
                label: "Non-Veg",
                icon: <SvgIcon name="non-veg" iconSize="large" size={68} />,
              },
            ]}
            withIcons={true}
            horizontal
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Water Supply"
              name="flatmateDetails.waterSupply"
              id="flatmateDetails.waterSupply"
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
              aria-describedby={
                flatmateDetailsErrors?.waterSupply &&
                flatmateDetailsTouched?.waterSupply
                  ? "flatmateDetails.waterSupply-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Power Backup"
              name="flatmateDetails.powerBackup"
              id="flatmateDetails.powerBackup"
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
              aria-describedby={
                flatmateDetailsErrors?.powerBackup &&
                flatmateDetailsTouched?.powerBackup
                  ? "flatmateDetails.powerBackup-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        </div>
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>
        </div>
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800">
          Select the available amenities
        </h1>
        <FormCheckbox
          name="flatmateDetails.amenities"
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
              icon: <SvgIcon name="smoke-alarm" iconSize="medium" size={28} />,
            },
            {
              value: "Swimming Pool",
              label: "Swimming Pool",
              icon: <SwimmingPoolIcon />,
            },
            {
              value: "24/7 Power",
              label: "24/7 Power",
              icon: <SvgIcon name="24x7-power" iconSize="small" size={28} />,
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
            {
              value: "Wifi",
              label: "Wifi",
              icon: <SvgIcon name="wifi" iconSize="small" size={28} />,
            },
            {
              value: "BBQ Grill",
              label: "BBQ Grill",
              icon: <SvgIcon name="bbq-grill" iconSize="medium" size={28} />,
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
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FlatmateDetailsForm;
