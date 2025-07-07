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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormCalendarField from "@/components/common/FormCalendarField";
import FormCurrencyField from "@/components/common/FormCurrencyField";
import FormFormNumberField from "@/components/common/FormNumberField";
import FormCheckbox from "@/form-components/FormCheckbox";
import FormRadioGroup from "@/form-components/FormRadioGroup";
import FormSelectDropdown from "@/form-components/FormSelectDropdown";
import { FormValues } from "@/interfaces/FormValues";
import { setFormValidity, setResaleDetails } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

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

const resaleSchema = Yup.object().shape({
  resaleDetails: Yup.object().shape({
    price: Yup.string()
      .required("Price is required")
      .test(
        "is-greater-than-zero",
        "Price must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    availableFrom: Yup.string().required("Available from is required"),
    bathrooms: Yup.number().required("Bathrooms is required"),
    furnishing: Yup.string().required("Furnishing is required"),
    parking: Yup.boolean().required("Parking is required"),
  }),
});

const ResaleDetailsClient: React.FC = () => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const formState = useSelector((state: RootState) => state.listProperty.form);
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  const resaleDetailsString = JSON.stringify(values.resaleDetails);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await resaleSchema.validate(values, { abortEarly: false });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        dispatch(
          setResaleDetails({
            resaleDetails: values.resaleDetails,
          }),
        );
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
    resaleDetailsString,
    dispatch,
    setErrors,
    setFieldError,
    isFormValid,
    values,
  ]);

  return (
    <>
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
            />
          </div>
          <div className="col-span-1">
            <FormCalendarField
              name="resaleDetails.availableFrom"
              label="Available From"
              dateFormat="yyyy-MM-dd"
              className="w-full"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFormNumberField
              name="resaleDetails.bathrooms"
              id="resaleDetails.bathrooms"
              label="Bathroom(s)"
              required
            />
          </div>
          <div className="col-span-1">
            <FormFormNumberField
              name="resaleDetails.balcony"
              id="resaleDetails.balcony"
              label="Balcony"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormRadioGroup
              name="resaleDetails.priceNegotiable"
              label="Price Negotiable"
              columns={2}
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
              horizontal
            />
          </div>
          <div className="col-span-1">
            <FormRadioGroup
              name="resaleDetails.underLoan"
              label="Currently Under Loan"
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
            <FormSelectDropdown
              label="Water Supply"
              name="resaleDetails.waterSupply"
              id="resaleDetails.waterSupply"
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
              placeholder="Select Water supply"
              aria-describedby={
                errors?.resaleDetails?.waterSupply &&
                touched.resaleDetails?.waterSupply
                  ? "resaleDetails.waterSupply-error"
                  : undefined
              }
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Power Backup"
              name="resaleDetails.powerBackup"
              id="resaleDetails.powerBackup"
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
              placeholder="Select Power backup"
              aria-describedby={
                errors?.resaleDetails?.powerBackup &&
                touched?.resaleDetails?.powerBackup
                  ? "resaleDetails.powerBackup-error"
                  : undefined
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Furnishing"
              name="resaleDetails.furnishing"
              id="resaleDetails.furnishing"
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
                errors?.resaleDetails?.furnishing &&
                touched?.resaleDetails?.furnishing
                  ? "resaleDetails.furnishing-error"
                  : undefined
              }
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Parking"
              name="resaleDetails.parking"
              id="resaleDetails.parking"
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
                errors?.resaleDetails?.parking &&
                touched?.resaleDetails?.parking
                  ? "resaleDetails.parking-error"
                  : undefined
              }
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

export default ResaleDetailsClient;
