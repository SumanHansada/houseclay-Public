"use client";

import { useFormikContext } from "formik";
import { IndianRupee } from "lucide-react";
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

import { FormCalendarField } from "@/form-components";
import {
  FormCheckbox,
  FormCurrencyField,
  FormNumberField,
  FormRadioGroup,
  FormSelectDropdown,
} from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import {
  getResaleDetailsErrors,
  getResaleDetailsTouched,
} from "@/utils/formHelpers";
import {
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  WATER_SUPPLY_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/constants/options/normalOptions";

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

interface ResaleDetailsFormProps {
  disabled: boolean;
}

const ResaleDetailsForm: React.FC<ResaleDetailsFormProps> = ({ disabled }) => {
  const { errors, touched } = useFormikContext<FormValues>();

  // Helper function to safely access optional fields
  const resaleDetailsErrors = getResaleDetailsErrors(errors);
  const resaleDetailsTouched = getResaleDetailsTouched(touched);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">
          Set the Right Price for Your Property
        </h1>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCurrencyField
              name="resaleDetails.price"
              id="resaleDetails.price"
              label="Expected Price"
              prefix={<IndianRupee size={20} />}
              required
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormCalendarField
              name="resaleDetails.availableFrom"
              label="Available From"
              dateFormat="yyyy-MM-dd"
              className="w-full"
              required
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormNumberField
              name="resaleDetails.bathrooms"
              id="resaleDetails.bathrooms"
              label="Bathroom(s)"
              required
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormNumberField
              name="resaleDetails.balcony"
              id="resaleDetails.balcony"
              label="Balcony"
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormRadioGroup
              name="resaleDetails.priceNegotiable"
              label="Price Negotiable"
              columns={2}
              options={YES_NO_OPTIONS}
              horizontal
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormRadioGroup
              name="resaleDetails.underLoan"
              label="Currently Under Loan"
              columns={2}
              options={YES_NO_OPTIONS}
              required
              horizontal
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Water Supply"
              name="resaleDetails.waterSupply"
              id="resaleDetails.waterSupply"
              options={WATER_SUPPLY_OPTIONS}
              placeholder="Select Water supply"
              aria-describedby={
                resaleDetailsErrors?.waterSupply &&
                resaleDetailsTouched?.waterSupply
                  ? "resaleDetails.waterSupply-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Power Backup"
              name="resaleDetails.powerBackup"
              id="resaleDetails.powerBackup"
              options={POWER_BACKUP_OPTIONS}
              placeholder="Select Power backup"
              aria-describedby={
                resaleDetailsErrors?.powerBackup &&
                resaleDetailsTouched?.powerBackup
                  ? "resaleDetails.powerBackup-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Furnishing"
              name="resaleDetails.furnishing"
              id="resaleDetails.furnishing"
              options={FURNISHING_OPTIONS}
              required={true}
              placeholder="Select furnishing"
              aria-describedby={
                resaleDetailsErrors?.furnishing &&
                resaleDetailsTouched?.furnishing
                  ? "resaleDetails.furnishing-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Parking"
              name="resaleDetails.parking"
              id="resaleDetails.parking"
              options={PARKING_OPTIONS}
              required={true}
              placeholder="Select Parking"
              aria-describedby={
                resaleDetailsErrors?.parking && resaleDetailsTouched?.parking
                  ? "resaleDetails.parking-error"
                  : undefined
              }
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
          name="resaleDetails.amenities"
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
            { value: "Security", label: "Security", icon: <SecurityIcon /> },
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

export default ResaleDetailsForm;
