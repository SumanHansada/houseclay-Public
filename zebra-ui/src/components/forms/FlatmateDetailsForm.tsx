"use client";

import { useFormikContext } from "formik";
import { IndianRupee } from "lucide-react";
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
import SwimmingPoolIconSvg from "public/icons/amenities/swimming-pool.svg";

import {
  BALCONY_OPTIONS,
  BATHROOM_OPTIONS,
  DRINKING_PREFERENCE_OPTIONS,
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  ROOM_TYPE_OPTIONS,
  SMOKING_PREFERENCE_OPTIONS,
  WATER_SUPPLY_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/constants/options/normalOptions";
import { FLATMATE_PREFERRED_TENANTS } from "@/common/enums";
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
            <FormSelectDropdown
              label="Room Type"
              name="flatmateDetails.roomType"
              id="flatmateDetails.roomType"
              options={ROOM_TYPE_OPTIONS}
              required={true}
              placeholder="Select room type"
              aria-describedby={
                flatmateDetailsErrors?.roomType &&
                flatmateDetailsTouched?.roomType
                  ? "flatmateDetails.roomType-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
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
              options={FURNISHING_OPTIONS}
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
                value: FLATMATE_PREFERRED_TENANTS.FEMALE,
                label: "Female",
                icon: <SvgIcon name="female" iconSize="medium" size={75} />,
              },
              {
                value: FLATMATE_PREFERRED_TENANTS.MALE,
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
              label="Balcony(s)"
              name="flatmateDetails.balcony"
              id="flatmateDetails.balcony"
              options={BALCONY_OPTIONS}
              optionsType="number"
              required
              placeholder="Select balcony(s)"
              aria-describedby={
                flatmateDetailsErrors?.balcony &&
                flatmateDetailsTouched?.balcony
                  ? "flatmateDetails.balcony-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Bathroom(s)"
              name="flatmateDetails.bathrooms"
              id="flatmateDetails.bathrooms"
              options={BATHROOM_OPTIONS}
              optionsType="number"
              required
              placeholder="Select bathroom(s)"
              aria-describedby={
                flatmateDetailsErrors?.bathrooms &&
                flatmateDetailsTouched?.bathrooms
                  ? "flatmateDetails.bathrooms-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormRadioGroup
              name="flatmateDetails.attachedBalcony"
              label="Attached Balcony"
              columns={2}
              options={YES_NO_OPTIONS}
              required
              horizontal
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormRadioGroup
              name="flatmateDetails.attachedBathroom"
              label="Attached Bathroom"
              columns={2}
              options={YES_NO_OPTIONS}
              required
              horizontal
              disabled={disabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Parking"
              name="flatmateDetails.parking"
              id="flatmateDetails.parking"
              options={PARKING_OPTIONS}
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
          <div className="col-span-1">
            <FormSelectDropdown
              label="Water Supply"
              name="flatmateDetails.waterSupply"
              id="flatmateDetails.waterSupply"
              options={WATER_SUPPLY_OPTIONS}
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
              options={POWER_BACKUP_OPTIONS}
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
              name="flatmateDetails.smokingPreference"
              label="Smoking Allowed"
              columns={2}
              options={SMOKING_PREFERENCE_OPTIONS}
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
              options={DRINKING_PREFERENCE_OPTIONS}
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
              value: "Visitor Parking",
              label: "Visitor Parking",
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
