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
} from "@/common/constants/options/normalOptions";
import { FormCalendarField } from "@/form-components";
import {
  FormCheckbox,
  FormCurrencyField,
  FormRadioGroup,
  FormSelectDropdown,
} from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import RemoteSvg from "@/utility-components/RemoteSvg";
import {
  getResaleDetailsErrors,
  getResaleDetailsTouched,
} from "@/utils/formHelpers";

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
            <FormSelectDropdown
              label="Balcony(s)"
              name="rentalDetails.balcony"
              id="rentalDetails.balcony"
              options={BALCONY_NUMERIC_OPTIONS}
              optionsType="number"
              required
              placeholder="Select balcony(s)"
              aria-describedby={
                resaleDetailsErrors?.balcony && resaleDetailsTouched?.balcony
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
                resaleDetailsErrors?.bathrooms &&
                resaleDetailsTouched?.bathrooms
                  ? "rentalDetails.bathrooms-error"
                  : undefined
              }
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
        />
      </div>
    </div>
  );
};

export default ResaleDetailsForm;
