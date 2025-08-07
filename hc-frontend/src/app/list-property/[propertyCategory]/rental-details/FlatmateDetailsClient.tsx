"use client";

import { useFormikContext } from "formik";
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
import FemaleIconSvg from "public/icons/preferred-tenants/female.svg";
import MaleIconSvg from "public/icons/preferred-tenants/male.svg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormCalendarField from "@/components/common/FormCalendarField";
import {
  FormCheckbox,
  FormCurrencyField,
  FormRadioGroup,
  FormSelectDropdown,
} from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import { setFlatmateDetails, setFormValidity } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import {
  getFlatmateDetailsErrors,
  getFlatmateDetailsTouched,
} from "@/utils/formHelpers";

const FemaleIcon = FemaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const MaleIcon = MaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
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

const flatmateSchema = Yup.object().shape({
  flatmateDetails: Yup.object().shape({
    rent: Yup.string()
      .required("Rent is required")
      .test(
        "is-greater-than-zero",
        "Rent must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    maintenanceCharges: Yup.string()
      .required("Maintenance charges is required")
      .test(
        "is-greater-than-zero",
        "Maintenance charges must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    depositCharges: Yup.string()
      .required("Deposit is required")
      .test(
        "is-greater-than-zero",
        "Deposit must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    availableFrom: Yup.string().required("Available from is required"),
    furnishing: Yup.string().required("Furnishing is required"),
    waterSupply: Yup.string().required("Water supply is required"),
    powerBackup: Yup.string().required("Power backup is required"),
    parking: Yup.string().required("Parking is required"),
    nonVegAllowed: Yup.boolean().required("Non veg allowed is required"),
    tenantType: Yup.string().required("Preferred tenant is required"),
    attachedBathroom: Yup.boolean().required("Attached bathroom is required"),
    attachedBalcony: Yup.boolean().required("Attached balcony is required"),
    smokingPreference: Yup.string().required("Smoking preference is required"),
    drinkingPreference: Yup.string().required(
      "Drinking preference is required",
    ),
    amenities: Yup.array().of(Yup.string()).required("Amenities are required"),
  }),
});

export const FlatmateDetailsClient: React.FC = () => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );
  const formState = useSelector((state: RootState) => state.listProperty.form);
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  // Helper function to safely access optional fields
  const flatmateDetailsErrors = getFlatmateDetailsErrors(errors);
  const flatmateDetailsTouched = getFlatmateDetailsTouched(touched);

  const flatmateDetailsString = JSON.stringify(values.flatmateDetails);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await flatmateSchema.validate(values, {
          abortEarly: false,
          context: { propertyCategory },
        });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        if (values.flatmateDetails) {
          dispatch(
            setFlatmateDetails({
              flatmateDetails: values.flatmateDetails,
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
    flatmateDetailsString,
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
            />
          </div>
          <div className="col-span-1">
            <FormCurrencyField
              name="flatmateDetails.depositCharges"
              id="flatmateDetails.depositCharges"
              label="Deposit"
              prefix={<IndianRupee size={20} />}
              required
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
        />
      </div>
    </>
  );
};

export default FlatmateDetailsClient;
