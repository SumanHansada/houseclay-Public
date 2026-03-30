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
  twentyFourSevenIconURL,
  wifiIconURL,
} from "@/common/constants/cdnURLs";
import {
  AMENITY_LABELS,
  AMENITY_VALUES,
  BALCONY_NUMERIC_OPTIONS,
  BATHROOM_NUMERIC_OPTIONS,
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  WATER_SUPPLY_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/constants/formOptions";
import { PreferredTenantValue } from "@/common/enums";
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
                value: PreferredTenantValue.FAMILY,
                label: "Family",
                icon: <RemoteSvg src={familyIconURL} />,
              },
              {
                value: PreferredTenantValue.COMPANY,
                label: "Company",
                icon: <RemoteSvg src={companyIconURL} />,
              },
              {
                value: PreferredTenantValue.BACHELOR,
                label: "Bachelor",
                icon: <RemoteSvg src={bachelorIconURL} />,
              },
              {
                value: PreferredTenantValue.COUPLE,
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
              value: AMENITY_VALUES.LIFT,
              label: AMENITY_LABELS[AMENITY_VALUES.LIFT],
              icon: <RemoteSvg src={liftIconURL} />,
            },
            {
              value: AMENITY_VALUES.CLUB_HOUSE,
              label: AMENITY_LABELS[AMENITY_VALUES.CLUB_HOUSE],
              icon: <RemoteSvg src={clubhouseIconURL} />,
            },
            {
              value: AMENITY_VALUES.GYM,
              label: AMENITY_LABELS[AMENITY_VALUES.GYM],
              icon: <RemoteSvg src={gymIconURL} />,
            },
            {
              value: AMENITY_VALUES.OUTDOOR_DINING,
              label: AMENITY_LABELS[AMENITY_VALUES.OUTDOOR_DINING],
              icon: <RemoteSvg src={outdoorDiningAreaIconURL} />,
            },
            {
              value: AMENITY_VALUES.FIRE_EXTINGUISHER,
              label: AMENITY_LABELS[AMENITY_VALUES.FIRE_EXTINGUISHER],
              icon: <RemoteSvg src={fireExtinguisherIconURL} />,
            },
            {
              value: AMENITY_VALUES.SMOKE_ALARM,
              label: AMENITY_LABELS[AMENITY_VALUES.SMOKE_ALARM],
              icon: <RemoteSvg src={smokeAlarmIconURL} />,
            },
            {
              value: AMENITY_VALUES.SWIMMING_POOL,
              label: AMENITY_LABELS[AMENITY_VALUES.SWIMMING_POOL],
              icon: <RemoteSvg src={swimmingPoolIconURL} />,
            },
            {
              value: AMENITY_VALUES.POWER_BACKUP,
              label: AMENITY_LABELS[AMENITY_VALUES.POWER_BACKUP],
              icon: <RemoteSvg src={twentyFourSevenIconURL} />,
            },
            {
              value: AMENITY_VALUES.SECURITY,
              label: AMENITY_LABELS[AMENITY_VALUES.SECURITY],
              icon: <RemoteSvg src={securityIconURL} />,
            },
            {
              value: AMENITY_VALUES.VISITOR_PARKING,
              label: AMENITY_LABELS[AMENITY_VALUES.VISITOR_PARKING],
              icon: <RemoteSvg src={parkingSpaceIconURL} />,
            },
            {
              value: AMENITY_VALUES.DEDICATED_WORKSPACE,
              label: AMENITY_LABELS[AMENITY_VALUES.DEDICATED_WORKSPACE],
              icon: <RemoteSvg src={dedicatedWorkspaceIconURL} />,
            },
            {
              value: AMENITY_VALUES.WIFI,
              label: AMENITY_LABELS[AMENITY_VALUES.WIFI],
              icon: <RemoteSvg src={wifiIconURL} />,
            },
            {
              value: AMENITY_VALUES.POOL_TABLE,
              label: AMENITY_LABELS[AMENITY_VALUES.POOL_TABLE],
              icon: <RemoteSvg src={poolTableIconURL} />,
            },
            {
              value: AMENITY_VALUES.FIRST_AID,
              label: AMENITY_LABELS[AMENITY_VALUES.FIRST_AID],
              icon: <RemoteSvg src={firstAidKitIconURL} />,
            },
            {
              value: AMENITY_VALUES.INTERCOM,
              label: AMENITY_LABELS[AMENITY_VALUES.INTERCOM],
              icon: <Headset size={24} strokeWidth={1.5} />,
            },
            {
              value: AMENITY_VALUES.SEWAGE_TREATMENT,
              label: AMENITY_LABELS[AMENITY_VALUES.SEWAGE_TREATMENT],
              icon: <Dam size={24} strokeWidth={1.5} />,
            },
            {
              value: AMENITY_VALUES.HOUSE_KEEPING,
              label: AMENITY_LABELS[AMENITY_VALUES.HOUSE_KEEPING],
              icon: <BrushCleaning size={24} strokeWidth={1.5} />,
            },
            {
              value: AMENITY_VALUES.RAIN_WATER,
              label: AMENITY_LABELS[AMENITY_VALUES.RAIN_WATER],
              icon: <CloudHail size={24} strokeWidth={1.5} />,
            },
            {
              value: AMENITY_VALUES.PLAY_AREA,
              label: AMENITY_LABELS[AMENITY_VALUES.PLAY_AREA],
              icon: <Blocks size={24} strokeWidth={1.5} />,
            },
            {
              value: AMENITY_VALUES.GUEST_ROOM,
              label: AMENITY_LABELS[AMENITY_VALUES.GUEST_ROOM],
              icon: <BedSingle size={24} strokeWidth={1.5} />,
            },
            {
              value: AMENITY_VALUES.COMMUNITY_HALL,
              label: AMENITY_LABELS[AMENITY_VALUES.COMMUNITY_HALL],
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
