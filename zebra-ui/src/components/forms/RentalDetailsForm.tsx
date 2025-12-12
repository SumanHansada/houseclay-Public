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
  bachelorIconURL,
  clubhouseIconURL,
  companyIconURL,
  coupleIconURL,
  dedicatedWorkspaceIconURL,
  familyIconURL,
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
  twentyFourXSevenIconURL,
  wifiIconURL,
} from "@/common/constants/cdnURL";
import {
  BALCONY_NUMERIC_OPTIONS,
  BATHROOM_NUMERIC_OPTIONS,
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  WATER_SUPPLY_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/constants/options/normalOptions";
import { RENT_PREFERRED_TENANTS } from "@/common/enums";
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
  getRentalDetailsErrors,
  getRentalDetailsTouched,
} from "@/utils/formHelpers";

interface RentalDetailsFormProps {
  disabled: boolean;
}

const RentalDetailsForm: React.FC<RentalDetailsFormProps> = ({ disabled }) => {
  const { errors, touched } = useFormikContext<FormValues>();

  // Helper function to safely access optional fields
  const rentalDetailsErrors = getRentalDetailsErrors(errors);
  const rentalDetailsTouched = getRentalDetailsTouched(touched);

  // console.log("<-- RentalDetails (Form 3) - Rent -->");

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">
          Provide rental details about your property
        </h1>
      </div>

      <div>
        {/* Rent, Rent Negotiable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCurrencyField
              name="rentalDetails.rent"
              id="rentalDetails.rent"
              label="Rent"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
              required
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormRadioGroup
              name="rentalDetails.rentNegotiable"
              label="Rent Negotiable"
              columns={2}
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
              horizontal
              disabled={disabled}
            />
          </div>
        </div>

        {/* Maintenance, Deposit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCurrencyField
              name="rentalDetails.maintenanceCharges"
              id="rentalDetails.maintenanceCharges"
              label="Maintenance Charges"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormCurrencyField
              name="rentalDetails.deposit"
              id="rentalDetails.deposit"
              label="Deposit"
              prefix={<IndianRupee size={20} />}
              required
              disabled={disabled}
            />
          </div>
        </div>

        {/* Available From, Furnishing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormCalendarField
              name="rentalDetails.availableFrom"
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
              name="rentalDetails.furnishing"
              id="rentalDetails.furnishing"
              options={FURNISHING_OPTIONS}
              required={true}
              placeholder="Select furnishing"
              aria-describedby={
                rentalDetailsErrors?.furnishing &&
                rentalDetailsTouched?.furnishing
                  ? "rentalDetails.furnishing-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        </div>

        {/* Preferred Tenants */}
        <div className="mb-6">
          <FormCheckbox
            name="rentalDetails.preferredTenants"
            label="Preferred Tenant"
            columns={4}
            options={[
              {
                value: RENT_PREFERRED_TENANTS.FAMILY,
                label: "Family",
                icon: <RemoteSvg src={familyIconURL} />,
              },
              {
                value: RENT_PREFERRED_TENANTS.COMPANY,
                label: "Company",
                icon: <RemoteSvg src={companyIconURL} />,
              },
              {
                value: RENT_PREFERRED_TENANTS.BACHELOR,
                label: "Bachelor",
                icon: <RemoteSvg src={bachelorIconURL} />,
              },
              {
                value: RENT_PREFERRED_TENANTS.COUPLE,
                label: "Couple",
                icon: <RemoteSvg src={coupleIconURL} />,
              },
            ]}
            withIcons={true}
            required
            disabled={disabled}
          />
        </div>

        {/* Balcony, Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Balcony(s)"
              name="rentalDetails.balcony"
              id="rentalDetails.balcony"
              options={BALCONY_NUMERIC_OPTIONS}
              optionsType="number"
              required
              placeholder="Select balcony(s)"
              aria-describedby={
                rentalDetailsErrors?.balcony && rentalDetailsTouched?.balcony
                  ? "rentalDetails.balcony-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Bathroom(s)"
              name="rentalDetails.bathrooms"
              id="rentalDetails.bathrooms"
              options={BATHROOM_NUMERIC_OPTIONS}
              optionsType="number"
              required
              placeholder="Select bathroom(s)"
              aria-describedby={
                rentalDetailsErrors?.bathrooms &&
                rentalDetailsTouched?.bathrooms
                  ? "rentalDetails.bathrooms-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        </div>

        {/* Water Supply, Power Backup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Water Supply"
              name="rentalDetails.waterSupply"
              id="rentalDetails.waterSupply"
              options={WATER_SUPPLY_OPTIONS}
              required={true}
              placeholder="Select Water supply"
              aria-describedby={
                rentalDetailsErrors?.waterSupply &&
                rentalDetailsTouched?.waterSupply
                  ? "rentalDetails.waterSupply-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Power Backup"
              name="rentalDetails.powerBackup"
              id="rentalDetails.powerBackup"
              options={POWER_BACKUP_OPTIONS}
              required={true}
              placeholder="Select Power backup"
              aria-describedby={
                rentalDetailsErrors?.powerBackup &&
                rentalDetailsTouched?.powerBackup
                  ? "rentalDetails.powerBackup-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        </div>

        {/* Parking, Non Veg Allowed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Parking"
              name="rentalDetails.parking"
              id="rentalDetails.parking"
              options={PARKING_OPTIONS}
              required={true}
              placeholder="Select Parking"
              aria-describedby={
                rentalDetailsErrors?.parking && rentalDetailsTouched?.parking
                  ? "rentalDetails.parking-error"
                  : undefined
              }
              disabled={disabled}
            />
          </div>
          <div className="col-span-1">
            <FormRadioGroup
              name="rentalDetails.nonVegAllowed"
              label="Non Veg Allowed"
              columns={2}
              options={YES_NO_OPTIONS}
              required
              horizontal
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800">
          Select the available amenities
        </h1>
        <FormCheckbox
          name="rentalDetails.amenities"
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

export default RentalDetailsForm;
