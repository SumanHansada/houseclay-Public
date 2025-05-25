"use client";

import { useFormikContext } from "formik";
import { IndianRupee } from "lucide-react";
import { useParams } from "next/navigation";
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
import BachelorIconSvg from "public/icons/preferred-tenants/bachelor.svg";
import CompanyIconSvg from "public/icons/preferred-tenants/company.svg";
import CoupleIconSvg from "public/icons/preferred-tenants/couple.svg";
import FamilyIconSvg from "public/icons/preferred-tenants/family.svg";
import FemaleIconSvg from "public/icons/preferred-tenants/female.svg";
import MaleIconSvg from "public/icons/preferred-tenants/male.svg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormCalendarField from "@/components/common/FormCalendarField";
import FormCheckbox from "@/components/common/FormCheckbox";
import FormDropdown from "@/components/common/FormDropdown";
import FormINRCurrencyField from "@/components/common/FormINRCurrencyField";
import FormRadioGroup from "@/components/common/FormRadioGroup";
import { FormValues } from "@/interfaces/FormValues";
import {
  FormType,
  setFormValidity,
  setRentalDetails,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

export const dynamicParams = true;

const FamilyIcon = FamilyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CompanyIcon = CompanyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const BachelorIcon = BachelorIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CoupleIcon = CoupleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const MaleIcon = MaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const FemaleIcon = FemaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
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
      .when("$formKey", {
        is: "rentForm",
        then: (schema) =>
          schema
            .required("Preferred tenant is required")
            .min(1, "Select at least one preferred tenant"),
        otherwise: (schema) => schema.optional(),
      }),
    waterSupply: Yup.string().required("Water supply is required"),
    powerBackup: Yup.string().required("Power backup is required"),
    parking: Yup.boolean().required("Parking is required"),
    nonVegAllowed: Yup.boolean().required("Non veg allowed is required"),
    tenantType: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.required("Preferred tenant is required"),
      otherwise: (schema) => schema.optional(),
    }),
    attachedBathroom: Yup.boolean().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.required("Attached bathroom is required"),
      otherwise: (schema) => schema.optional(),
    }),
    bathroomType: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.required("Bathroom type is required"),
      otherwise: (schema) => schema.optional(),
    }),
    smokingPreference: Yup.boolean().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.required("Smoking preference is required"),
      otherwise: (schema) => schema.optional(),
    }),
    drinkingPreference: Yup.boolean().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.required("Drinking preference is required"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
});

const RentalDetailsPage: React.FC = () => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const params = useParams();
  const formKey = `${params?.type}Form` as FormType;
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  const rentalDetailsString = JSON.stringify(values.rentalDetails);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await rentalSchema.validate(values, {
          abortEarly: false,
          context: { formKey },
        });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        dispatch(
          setRentalDetails({
            type: formKey,
            rentalDetails: values.rentalDetails,
          }),
        );
        // Form is valid
        if (!isFormValid) {
          dispatch(setFormValidity({ type: formKey, isValid: true }));
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
            dispatch(setFormValidity({ type: formKey, isValid: false }));
          }
        }
      }
    };

    validateAndDispatch();
  }, [
    rentalDetailsString,
    dispatch,
    formKey,
    setErrors,
    setFieldError,
    isFormValid,
    values,
  ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800">
          Provide rental details about your property
        </h1>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormINRCurrencyField
              name="rentalDetails.rent"
              id="rentalDetails.rent"
              label="Rent"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
              required
            />
          </div>
          <div className="col-span-1">
            {formKey === "rentForm" && (
              <FormRadioGroup
                name="rentalDetails.rentNegotiable"
                label="Rent Negotiable"
                columns={2}
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                horizontal
              />
            )}
            {formKey === "flatmatesForm" && (
              <FormDropdown
                label="Parking"
                name="rentalDetails.parking"
                id="rentalDetails.parking"
                options={[
                  { value: true, label: "Yes" },
                  {
                    value: false,
                    label: "No",
                  },
                ]}
                required={true}
                placeholder="Select Parking"
                aria-describedby={
                  errors?.rentalDetails?.parking &&
                  touched?.rentalDetails?.parking
                    ? "rentalDetails.parking-error"
                    : undefined
                }
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormINRCurrencyField
              name="rentalDetails.maintenanceCharges"
              id="rentalDetails.maintenanceCharges"
              label="Maintenance Charges"
              prefix={<IndianRupee size={20} />}
              suffix="/month"
            />
          </div>
          <div className="col-span-1">
            <FormINRCurrencyField
              name="rentalDetails.deposit"
              id="rentalDetails.deposit"
              label="Deposit"
              prefix={<IndianRupee size={20} />}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            <FormDropdown
              label="Furnishing"
              name="rentalDetails.furnishing"
              id="rentalDetails.furnishing"
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
                errors?.rentalDetails?.furnishing &&
                touched?.rentalDetails?.furnishing
                  ? "rentalDetails.furnishing-error"
                  : undefined
              }
            />
          </div>
        </div>
        {formKey === "rentForm" && (
          <div className="mb-6">
            <FormCheckbox
              name="rentalDetails.preferredTenants"
              label="Preferred Tenant"
              columns={4}
              options={[
                {
                  value: "Family",
                  label: "Family",
                  icon: <FamilyIcon />,
                },
                {
                  value: "Company",
                  label: "Company",
                  icon: <CompanyIcon />,
                },
                {
                  value: "Bachelor",
                  label: "Bachelor",
                  icon: <BachelorIcon />,
                },
                {
                  value: "Couple",
                  label: "Couple",
                  icon: <CoupleIcon />,
                },
              ]}
              withIcons={true}
              required
            />
          </div>
        )}
        {formKey === "flatmatesForm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormRadioGroup
              name="rentalDetails.tenantType"
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
              name="rentalDetails.nonVegAllowed"
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
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormDropdown
              label="Water Supply"
              name="rentalDetails.waterSupply"
              id="rentalDetails.waterSupply"
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
                errors?.rentalDetails?.waterSupply &&
                touched.rentalDetails?.waterSupply
                  ? "rentalDetails.waterSupply-error"
                  : undefined
              }
            />
          </div>
          <div className="col-span-1">
            <FormDropdown
              label="Power Backup"
              name="rentalDetails.powerBackup"
              id="rentalDetails.powerBackup"
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
                errors?.rentalDetails?.powerBackup &&
                touched?.rentalDetails?.powerBackup
                  ? "rentalDetails.powerBackup-error"
                  : undefined
              }
            />
          </div>
        </div>
        {formKey === "rentForm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormDropdown
                label="Parking"
                name="rentalDetails.parking"
                id="rentalDetails.parking"
                options={[
                  { value: true, label: "Yes" },
                  {
                    value: false,
                    label: "No",
                  },
                ]}
                required={true}
                placeholder="Select Parking"
                aria-describedby={
                  errors?.rentalDetails?.parking &&
                  touched?.rentalDetails?.parking
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
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                required
                horizontal
              />
            </div>
          </div>
        )}
        {formKey === "flatmatesForm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormRadioGroup
                name="rentalDetails.attachedBathroom"
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
                name="rentalDetails.bathroomType"
                label="Bathroom Type"
                columns={2}
                options={[
                  { value: "Western", label: "Western" },
                  { value: "Indian", label: "Indian" },
                ]}
                required
                horizontal
              />
            </div>
          </div>
        )}
        {formKey === "flatmatesForm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormRadioGroup
                name="rentalDetails.smokingPreference"
                label="Smoking Allowed"
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
                name="rentalDetails.drinkingPreference"
                label="Drinking Allowed"
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
        )}
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

export default RentalDetailsPage;
