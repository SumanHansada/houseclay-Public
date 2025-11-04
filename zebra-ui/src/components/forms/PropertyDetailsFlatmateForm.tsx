"use client";

import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  FormSelectDropdown,
  FormTextArea,
  FormTextField,
} from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import { setFormValidity, setPropertyDetails } from "@/store/editPropertySlice";
import { RootState } from "@/store/store";
import {
  getPropertyDetailsErrors,
  getPropertyDetailsTouched,
} from "@/utils/formHelpers";

interface PropertyDetailsFormProps {
  disabled: boolean;
}

const propertySchema = Yup.object({
  propertyDetails: Yup.object({
    propertyType: Yup.string().required("Property type is required"),
    builtUpArea: Yup.number()
      .required("Built up area is required")
      .positive("Area must be positive"),
    bhkType: Yup.string().required("BHK type is required"),
    floor: Yup.number().required("Floor is required"),
    totalFloors: Yup.number().required("Total floors is required"),
  }),
});

const PropertyDetailsFlatmateForm: React.FC<PropertyDetailsFormProps> = ({
  disabled,
}) => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );
  const formState = useSelector((state: RootState) => state.listProperty.form);
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  // Get property details errors and touched states
  const propertyDetailsErrors = getPropertyDetailsErrors(errors);
  const propertyDetailsTouched = getPropertyDetailsTouched(touched);

  const propertyDetailsString = JSON.stringify(values.propertyDetails);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await propertySchema.validate(values, {
          abortEarly: false,
          context: { propertyCategory },
        });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        if (values.propertyDetails) {
          dispatch(
            setPropertyDetails({
              propertyDetails: values.propertyDetails,
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
    propertyDetailsString,
    dispatch,
    propertyCategory,
    setErrors,
    setFieldError,
    isFormValid,
    values,
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl text-gray-800">Property Details</h1>
      <p className="text-gray-500 mt-2">
        Review and edit key property details for an accurate, appealing listing.
      </p>

      {/* PROPERTY TYPE */}
      <FormSelectDropdown
        label="Property Type"
        name="propertyDetails.propertyType"
        id="propertyDetails.propertyType"
        options={[
          { value: "Apartment", label: "Apartment" },
          { value: "Villa", label: "Villa" },
          { value: "House", label: "House" },
          { value: "Plot", label: "Plot" },
          { value: "Commercial", label: "Commercial" },
        ]}
        required
        placeholder="Select property type"
        aria-describedby={
          propertyDetailsErrors?.propertyType &&
          propertyDetailsTouched?.propertyType
            ? "propertyDetails.propertyType-error"
            : undefined
        }
      />

      {/* BUILT UP AREA + BHK TYPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormTextField
          name="propertyDetails.builtUpArea"
          id="propertyDetails.builtUpArea"
          label="Built Up Area"
          dataType="number"
          placeholder="Enter built up area"
          suffix="Sq.ft"
          required
        />

        <FormSelectDropdown
          label="BHK Type"
          name="propertyDetails.bhkType"
          id="propertyDetails.bhkType"
          options={[
            { value: "1BHK", label: "1 BHK" },
            { value: "2BHK", label: "2 BHK" },
            { value: "3BHK", label: "3 BHK" },
            { value: "4BHK", label: "4 BHK" },
            { value: "5+BHK", label: "5+ BHK" },
          ]}
          required
          placeholder="Select BHK Type"
          aria-describedby={
            propertyDetailsErrors?.bhkType && propertyDetailsTouched?.bhkType
              ? "propertyDetails.bhkType-error"
              : undefined
          }
        />
      </div>

      {/* FLOOR, TOTAL FLOOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelectDropdown
          label="Total Floor"
          name="propertyDetails.totalFloors"
          id="totalFloors"
          options={Array.from({ length: 50 }, (_, i) => i + 1).map((value) => ({
            value: value,
            label: value.toString(),
          }))}
          required
          placeholder="Select total floors"
          aria-describedby={
            propertyDetailsErrors?.totalFloors &&
            propertyDetailsTouched?.totalFloors
              ? "totalFloors-error"
              : undefined
          }
        />

        <FormSelectDropdown
          label="Floor"
          name="propertyDetails.floor"
          id="propertyDetails.floor"
          options={[
            { value: 0, label: "Ground" },
            ...Array.from({ length: 50 }, (_, i) => i + 1).map((value) => ({
              value: value,
              label: value.toString(),
            })),
          ]}
          required
          placeholder="Select floor"
          aria-describedby={
            propertyDetailsErrors?.floor && propertyDetailsTouched?.floor
              ? "propertyDetails.floor-error"
              : undefined
          }
        />
      </div>

      <div className="mb-6">
        <FormTextArea
          name="propertyDetails.description"
          id="propertyDetails.description"
          label="Description"
          placeholder="Enter property description"
          rows={5}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsFlatmateForm;
