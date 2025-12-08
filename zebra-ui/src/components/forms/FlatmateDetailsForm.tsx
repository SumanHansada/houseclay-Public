"use client";

import { useFormikContext } from "formik";
import {
  BedSingle,
  Blocks,
  BrushCleaning,
  CloudHail,
  Dam,
  Headset,
  IndianRupee,
  Landmark,
} from "lucide-react";

import {
  clubhouseIconURL,
  dedicatedWorkspaceIconURL,
  femaleIconURL,
  fireExtinguisherIconURL,
  firstAidKitIconURL,
  gymIconURL,
  liftIconURL,
  maleIconURL,
  nonVegIconURL,
  outdoorDiningAreaIconURL,
  parkingSpaceIconURL,
  poolTableIconURL,
  securityIconURL,
  smokeAlarmIconURL,
  swimmingPoolIconURL,
  twentyFourXSevenIconURL,
  vegIconURL,
  wifiIconURL,
} from "@/common/constants/cdnURL";
import {
  BALCONY_TYPE_OPTIONS,
  BATHROOM_TYPE_OPTIONS,
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  ROOM_TYPE_OPTIONS,
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
import RemoteSvg from "@/utility-components/RemoteSvg";
import {
  getFlatmateDetailsErrors,
  getFlatmateDetailsTouched,
} from "@/utils/formHelpers";

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
                icon: <RemoteSvg src={femaleIconURL} />,
              },
              {
                value: FLATMATE_PREFERRED_TENANTS.MALE,
                label: "Male",
                icon: <RemoteSvg src={maleIconURL} />,
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
                icon: <RemoteSvg src={vegIconURL} />,
              },
              {
                value: true,
                label: "Non-Veg",
                icon: <RemoteSvg src={nonVegIconURL} />,
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
              label="Bathroom Type"
              name="flatmateDetails.bathroomType"
              id="flatmateDetails.bathroomType"
              options={BATHROOM_TYPE_OPTIONS}
              required={true}
              placeholder="Select bathroom type"
              aria-describedby={
                flatmateDetailsErrors?.bathroomType &&
                flatmateDetailsTouched?.bathroomType
                  ? "flatmateDetails.bathroomType-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Balcony Type"
              name="flatmateDetails.balconyType"
              id="flatmateDetails.balconyType"
              options={BALCONY_TYPE_OPTIONS}
              required={true}
              placeholder="Select balcony type"
              aria-describedby={
                flatmateDetailsErrors?.balconyType &&
                flatmateDetailsTouched?.balconyType
                  ? "flatmateDetails.balconyType-error"
                  : undefined
              }
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
              options={YES_NO_OPTIONS}
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
              options={YES_NO_OPTIONS}
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
            {
              value: "Lift",
              label: "Lift",
              icon: <RemoteSvg src={liftIconURL} />,
            },
            {
              value: "Clubhouse",
              label: "Club house",
              icon: <RemoteSvg src={clubhouseIconURL} />,
            },
            {
              value: "Gym",
              label: "Gym",
              icon: <RemoteSvg src={gymIconURL} />,
            },
            {
              value: "Outdoor Dining Area",
              label: "Outdoor Dining Area",
              icon: <RemoteSvg src={outdoorDiningAreaIconURL} />,
            },
            {
              value: "Fire Extinguisher",
              label: "Fire Extinguisher",
              icon: <RemoteSvg src={fireExtinguisherIconURL} />,
            },
            {
              value: "Smoke Alarm",
              label: "Smoke Alarm",
              icon: <RemoteSvg src={smokeAlarmIconURL} />,
            },
            {
              value: "Swimming Pool",
              label: "Swimming Pool",
              icon: <RemoteSvg src={swimmingPoolIconURL} />,
            },
            {
              value: "24/7 Power",
              label: "24/7 Power",
              icon: <RemoteSvg src={twentyFourXSevenIconURL} />,
            },
            {
              value: "Security",
              label: "Security",
              icon: <RemoteSvg src={securityIconURL} />,
            },
            {
              value: "Visitor Parking",
              label: "Visitor Parking",
              icon: <RemoteSvg src={parkingSpaceIconURL} />,
            },
            {
              value: "Dedicated Workspace",
              label: "Dedicated Workspace",
              icon: <RemoteSvg src={dedicatedWorkspaceIconURL} />,
            },
            {
              value: "Wifi",
              label: "Wifi",
              icon: <RemoteSvg src={wifiIconURL} />,
            },
            {
              value: "Pool Table",
              label: "Pool Table",
              icon: <RemoteSvg src={poolTableIconURL} />,
            },
            {
              value: "First Aid Kit",
              label: "First Aid Kit",
              icon: <RemoteSvg src={firstAidKitIconURL} />,
            },
            {
              value: "Intercom",
              label: "Intercom",
              icon: <Headset size={24} strokeWidth={1.5} />,
            },
            {
              value: "Sewage Treatment",
              label: "Sewage Treatment",
              icon: <Dam size={24} strokeWidth={1.5} />,
            },
            {
              value: "House Keeping",
              label: "House Keeping",
              icon: <BrushCleaning size={24} strokeWidth={1.5} />,
            },
            {
              value: "Rain Water Harvesting",
              label: "Rain Water Harvesting",
              icon: <CloudHail size={24} strokeWidth={1.5} />,
            },
            {
              value: "Children Play Area",
              label: "Children Play Area",
              icon: <Blocks size={24} strokeWidth={1.5} />,
            },
            {
              value: "Guest Room",
              label: "Guest Room",
              icon: <BedSingle size={24} strokeWidth={1.5} />,
            },
            {
              value: "Community Hall",
              label: "Community Hall",
              icon: <Landmark size={24} strokeWidth={1.5} />,
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
