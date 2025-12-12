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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

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
  twentyFourXSevenIconURL,
  wifiIconURL,
} from "@/common/dataConstants/cdnURL";
import {
  BALCONY_NUMERIC_OPTIONS,
  BATHROOM_NUMERIC_OPTIONS,
  FURNISHING_OPTIONS,
  PARKING_OPTIONS,
  POWER_BACKUP_OPTIONS,
  WATER_SUPPLY_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/dataConstants/options";
import {
  FormCalendarField,
  FormCheckbox,
  FormCurrencyField,
  FormRadioGroup,
  FormSelectDropdown,
} from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import { setFormValidity, setResaleDetails } from "@/store/editPropertySlice";
import { RootState } from "@/store/store";
import RemoteSvg from "@/utility-components/RemoteSvg";
import {
  getResaleDetailsErrors,
  getResaleDetailsTouched,
} from "@/utils/formHelpers";

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
    parking: Yup.string().required("Parking is required"),
  }),
});

const ResaleDetailsClient: React.FC = () => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const formState = useSelector((state: RootState) => state.editProperty.form);
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  // Helper function to safely access optional fields
  const resaleDetailsErrors = getResaleDetailsErrors(errors);
  const resaleDetailsTouched = getResaleDetailsTouched(touched);

  const resaleDetailsString = JSON.stringify(values.resaleDetails);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await resaleSchema.validate(values, { abortEarly: false });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        if (values.resaleDetails) {
          dispatch(
            setResaleDetails({
              resaleDetails: values.resaleDetails,
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
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
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
        />
      </div>
    </>
  );
};

export default ResaleDetailsClient;
