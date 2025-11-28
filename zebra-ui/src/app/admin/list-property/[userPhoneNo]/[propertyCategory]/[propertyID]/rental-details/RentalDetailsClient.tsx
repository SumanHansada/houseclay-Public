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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  BALCONY_OPTIONS,
  BATHROOM_OPTIONS,
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
import { setFormValidity, setRentalDetails } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { SvgIcon } from "@/utility-components";
import {
  getRentalDetailsErrors,
  getRentalDetailsTouched,
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

const rentalSchema = Yup.object().shape({
  rentalDetails: Yup.object().shape({
    rent: Yup.string()
      .required("Rent is required")
      .test(
        "is-greater-than-zero",
        "Rent must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    deposit: Yup.string()
      .required("Deposit is required")
      .test(
        "is-greater-than-zero",
        "Deposit must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    availableFrom: Yup.string().required("Available from is required"),
    furnishing: Yup.string().required("Furnishing is required"),
    preferredTenants: Yup.array()
      .of(Yup.string())
      .required("Preferred tenant is required")
      .min(1, "Select at least one preferred tenant"),
    bathrooms: Yup.number().required("Bathroom(s) is required"),
    balcony: Yup.number().required("Balcony(s) is required"),
    waterSupply: Yup.string().required("Water supply is required"),
    powerBackup: Yup.string().required("Power backup is required"),
    parking: Yup.string().required("Parking is required"),
    nonVegAllowed: Yup.boolean().required("Non veg allowed is required"),
  }),
});

export const RentalDetailsClient: React.FC = () => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );
  const formState = useSelector((state: RootState) => state.listProperty.form);
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  // Helper function to safely access optional fields
  const rentalDetailsErrors = getRentalDetailsErrors(errors);
  const rentalDetailsTouched = getRentalDetailsTouched(touched);

  const rentalDetailsString = JSON.stringify(values.rentalDetails);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await rentalSchema.validate(values, {
          abortEarly: false,
          context: { propertyCategory },
        });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        if (values.rentalDetails) {
          dispatch(
            setRentalDetails({
              rentalDetails: values.rentalDetails,
            }),
          );
        }
        // Form is valid
        if (!isFormValid) {
          dispatch(setFormValidity({ isValid: true }));
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          // Clear any previous errors
          setErrors({});
          // Set individual field errors
          err.inner.forEach((validationError) => {
            if (validationError.path && validationError.message) {
              setFieldError(validationError.path, validationError.message);
            }
          });
          // Form is invalid
          if (isFormValid) {
            dispatch(setFormValidity({ isValid: false }));
          }
        }
      }
    };

    validateAndDispatch();
  }, [
    rentalDetailsString,
    dispatch,
    propertyCategory,
    setErrors,
    setFieldError,
    isFormValid,
    values,
  ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800 md:text-3xl">
          Provide rental details about your property
        </h1>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div className="col-span-1">
            <FormCurrencyField
              name="rentalDetails.rent"
              id="rentalDetails.rent"
              label="Rent"
              placeholder="Enter rent"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
              required
            />
          </div>
          <div className="col-span-1">
            <FormRadioGroup
              name="rentalDetails.rentNegotiable"
              label="Rent Negotiable"
              columns={2}
              options={YES_NO_OPTIONS}
              horizontal
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div className="col-span-1">
            <FormCurrencyField
              name="rentalDetails.maintenanceCharges"
              id="rentalDetails.maintenanceCharges"
              label="Maintenance Charges"
              placeholder="Enter maintenance charges"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
            />
          </div>
          <div className="col-span-1">
            <FormCurrencyField
              name="rentalDetails.deposit"
              id="rentalDetails.deposit"
              label="Deposit"
              placeholder="Enter deposit"
              prefix={<IndianRupee size={20} />}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div className="col-span-1">
            <FormCalendarField
              name="rentalDetails.availableFrom"
              label="Available From"
              dateFormat="yyyy-MM-dd"
              className="w-full"
              required
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
            />
          </div>
        </div>
        <div className="mb-6">
          <FormCheckbox
            name="rentalDetails.preferredTenants"
            label="Preferred Tenant"
            columns={4}
            options={[
              {
                value: RENT_PREFERRED_TENANTS.FAMILY,
                label: "Family",
                icon: <SvgIcon iconSize="large" name="family" size={68} />,
              },
              {
                value: RENT_PREFERRED_TENANTS.COMPANY,
                label: "Company",
                icon: <SvgIcon iconSize="large" name="company" size={68} />,
              },
              {
                value: RENT_PREFERRED_TENANTS.BACHELOR,
                label: "Bachelor",
                icon: <SvgIcon iconSize="large" name="bachelor" size={68} />,
              },
              {
                value: RENT_PREFERRED_TENANTS.COUPLE,
                label: "Couple",
                icon: <SvgIcon iconSize="large" name="couple" size={68} />,
              },
            ]}
            withIcons={true}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Balcony(s)"
              name="rentalDetails.balcony"
              id="rentalDetails.balcony"
              options={BALCONY_OPTIONS}
              optionsType="number"
              required
              placeholder="Select Balcony(s)"
              aria-describedby={
                rentalDetailsErrors?.balcony && rentalDetailsTouched?.balcony
                  ? "rentalDetails.balcony-error"
                  : undefined
              }
            />
          </div>

          <div className="col-span-1">
            <FormSelectDropdown
              label="Bathroom(s)"
              name="rentalDetails.bathrooms"
              id="rentalDetails.bathrooms"
              options={BATHROOM_OPTIONS}
              optionsType="number"
              required
              placeholder="Select Bathroom(s)"
              aria-describedby={
                rentalDetailsErrors?.bathrooms &&
                rentalDetailsTouched?.bathrooms
                  ? "rentalDetails.bathrooms-error"
                  : undefined
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
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
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
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
            />
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800">
          Select the available amenities
        </h1>
        <FormCheckbox
          name="rentalDetails.amenities"
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
        />
      </div>
    </>
  );
};

export default RentalDetailsClient;
