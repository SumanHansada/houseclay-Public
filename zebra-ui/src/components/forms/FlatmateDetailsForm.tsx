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
  twentyFourSevenIconURL,
  vegIconURL,
  wifiIconURL,
} from "@/common/constants/cdnURLs";
import {
  AMENITY_LABELS,
  AMENITY_VALUES,
  BALCONY_TYPE_OPTIONS,
  BATHROOM_TYPE_OPTIONS,
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  ROOM_TYPE_OPTIONS,
  WATER_SUPPLY_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/constants/formOptions";
import { TenantTypeValue } from "@/common/enums";
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
                value: TenantTypeValue.FEMALE,
                label: "Female",
                icon: <RemoteSvg src={femaleIconURL} />,
              },
              {
                value: TenantTypeValue.MALE,
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

export default FlatmateDetailsForm;
