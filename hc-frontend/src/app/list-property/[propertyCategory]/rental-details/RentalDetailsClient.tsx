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
} from "@/common/cdnURLs";
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
} from "@/common/dataConstants/options";
import { PreferredTenantValue } from "@/common/enums";
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
import RemoteSvg from "@/utility-components/RemoteSvg";
import {
  getRentalDetailsErrors,
  getRentalDetailsTouched,
} from "@/utils/formHelpers";

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
          />
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
    </>
  );
};

export default RentalDetailsClient;
