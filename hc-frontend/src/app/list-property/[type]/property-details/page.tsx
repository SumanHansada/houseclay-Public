"use client";

import { useFormikContext } from "formik";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormDropdown from "@/components/common/FormDropdown";
import FormInputField from "@/components/common/FormInputField";
import FormTextArea from "@/components/common/FormTextArea";
import { FormValues } from "@/interfaces/FormValues";
import {
  FormType,
  setFormValidity,
  setPropertyDetails,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

export const dynamicParams = true;

const propertySchema = Yup.object({
  propertyDetails: Yup.object({
    propertyType: Yup.string().required("Property type is required"),
    builtUpArea: Yup.number()
      .required("Built up area is required")
      .positive("Area must be positive"),
    facing: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Facing is required"),
    }),
    bhkType: Yup.string().required("BHK type is required"),
    ownershipType: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Ownership type is required"),
    }),
    propertyAge: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Property age is required"),
    }),
    floor: Yup.string().required("Floor is required"),
    totalFloor: Yup.string().required("Total floor is required"),
    floorType: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Floor type is required"),
    }),
  }),
});

const PropertyDetailsPage: React.FC = () => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const params = useParams();
  const formKey = `${params?.type}Form` as FormType; // Optional: add type assertion
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await propertySchema.validate(values, {
          abortEarly: false,
          context: { formKey },
        });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        dispatch(
          setPropertyDetails({
            type: formKey,
            propertyDetails: values.propertyDetails,
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
    JSON.stringify(values.propertyDetails),
    dispatch,
    formKey,
    setErrors,
    setFieldError,
  ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800">Tell Us About Your Property</h1>
        <p className="text-gray-500 mt-2">
          Share key property details to create an accurate, appealing listing.
        </p>
      </div>

      <div className="space-y-6">
        {/* PROPERTY TYPE */}
        <FormDropdown
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
            errors?.propertyDetails?.propertyType &&
            touched?.propertyDetails?.propertyType
              ? "propertyDetails.propertyType-error"
              : undefined
          }
        />

        {/* BUILT UP AREA + FACING */}
        {(formKey === "rentForm" || formKey === "resaleForm") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInputField
              name="propertyDetails.builtUpArea"
              id="propertyDetails.builtUpArea"
              label="Built Up Area"
              dataType="number"
              placeholder="Enter built up area"
              suffix="Sq.ft"
              required
            />

            <FormDropdown
              label="Facing"
              name="propertyDetails.facing"
              id="propertyDetails.facing"
              options={[
                { value: "East", label: "East" },
                { value: "West", label: "West" },
                { value: "North", label: "North" },
                { value: "South", label: "South" },
                { value: "North-East", label: "North-East" },
                { value: "North-West", label: "North-West" },
                { value: "South-East", label: "South-East" },
                { value: "South-West", label: "South-West" },
              ]}
              required
              placeholder="Select facing direction"
              aria-describedby={
                errors?.propertyDetails?.facing &&
                touched?.propertyDetails?.facing
                  ? "propertyDetails.facing-error"
                  : undefined
              }
            />
          </div>
        )}

        {/* BHK TYPE, OWNERSHIP, AGE */}
        {(formKey === "rentForm" || formKey === "resaleForm") && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <FormDropdown
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
                errors?.propertyDetails?.bhkType &&
                touched?.propertyDetails?.bhkType
                  ? "propertyDetails.bhkType-error"
                  : undefined
              }
            />

            <FormDropdown
              label="Ownership Type"
              name="propertyDetails.ownershipType"
              id="propertyDetails.ownershipType"
              options={[
                { value: "Self Owned", label: "Self Owned" },
                { value: "Rented", label: "Rented" },
                {
                  value: "Co-operative Society",
                  label: "Co-operative Society",
                },
                { value: "Power of Attorney", label: "Power of Attorney" },
              ]}
              required
              placeholder="Select ownership type"
              aria-describedby={
                errors?.propertyDetails?.ownershipType &&
                touched?.propertyDetails?.ownershipType
                  ? "propertyDetails.ownershipType-error"
                  : undefined
              }
            />

            <FormDropdown
              label="Property Age"
              name="propertyDetails.propertyAge"
              id="propertyDetails.propertyAge"
              options={[
                { value: "Under Construction", label: "Under Construction" },
                { value: "Less than 1 year", label: "Less than 1 year" },
                { value: "1-5 years", label: "1-5 years" },
                { value: "5-10 years", label: "5-10 years" },
                { value: "More than 10 year", label: "More than 10 year" },
              ]}
              required
              placeholder="Select property age"
              aria-describedby={
                errors?.propertyDetails?.propertyAge &&
                touched?.propertyDetails?.propertyAge
                  ? "propertyDetails.propertyAge-error"
                  : undefined
              }
            />
          </div>
        )}

        {formKey === "flatmatesForm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInputField
              name="propertyDetails.builtUpArea"
              id="propertyDetails.builtUpArea"
              label="Built Up Area"
              dataType="number"
              placeholder="Enter built up area"
              suffix="Sq.ft"
              required
            />

            <FormDropdown
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
                errors?.propertyDetails?.bhkType &&
                touched?.propertyDetails?.bhkType
                  ? "propertyDetails.bhkType-error"
                  : undefined
              }
            />
          </div>
        )}

        {/* FLOOR, TOTAL FLOOR, FLOOR TYPE */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${formKey === "rentForm" || formKey === "resaleForm" ? "xl:grid-cols-3" : ""} gap-6`}
        >
          <FormDropdown
            label="Floor"
            name="propertyDetails.floor"
            id="propertyDetails.floor"
            options={[
              { value: "Ground", label: "Ground" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4+", label: "4+" },
            ]}
            required
            placeholder="Select floor"
            aria-describedby={
              errors?.propertyDetails?.floor && touched?.propertyDetails?.floor
                ? "propertyDetails.floor-error"
                : undefined
            }
          />

          <FormDropdown
            label="Total Floor"
            name="propertyDetails.totalFloor"
            id="totalFloor"
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5+", label: "5+" },
            ]}
            required
            placeholder="Select total floors"
            aria-describedby={
              errors?.propertyDetails?.totalFloor &&
              touched?.propertyDetails?.totalFloor
                ? "totalFloor-error"
                : undefined
            }
          />

          {(formKey === "rentForm" || formKey === "resaleForm") && (
            <FormDropdown
              label="Floor Type"
              name="propertyDetails.floorType"
              id="floorType"
              options={[
                { value: "Mosaic", label: "Mosaic" },
                { value: "Marble", label: "Marble" },
                { value: "Granite", label: "Granite" },
                { value: "Vitrified", label: "Vitrified" },
                { value: "Wooden", label: "Wooden" },
              ]}
              required
              placeholder="Select floor type"
              aria-describedby={
                errors?.propertyDetails?.floorType &&
                touched?.propertyDetails?.floorType
                  ? "floorType-error"
                  : undefined
              }
            />
          )}
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
    </>
  );
};

export default PropertyDetailsPage;
