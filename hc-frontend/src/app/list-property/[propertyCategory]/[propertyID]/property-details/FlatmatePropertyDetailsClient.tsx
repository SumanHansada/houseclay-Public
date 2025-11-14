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
import { setFormValidity, setPropertyDetails } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import {
  getPropertyDetailsErrors,
  getPropertyDetailsTouched,
} from "@/utils/formHelpers";

const propertySchema = Yup.object({
  propertyDetails: Yup.object({
    propertyType: Yup.string().required("Property type is required"),
    builtUpArea: Yup.number()
      .required("Built up area is required")
      .positive("Area must be positive"),
    facing: Yup.string().required("Facing is required"),
    bhkType: Yup.string().required("BHK type is required"),
    floor: Yup.number()
      .required("Floor is required")
      .test(
        "floor-less-than-total",
        "Floor cannot exceed total floors",
        function (value) {
          const { totalFloors } = this.parent;
          if (!value || !totalFloors) return true;
          return value <= totalFloors;
        },
      ),
    totalFloors: Yup.number().required("Total floors is required"),
    bathrooms: Yup.number().required("Bathroom is required"),
  }),
});

const FlatmatePropertyDetailsClient: React.FC = () => {
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
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">
          Tell Us About Your Property
        </h1>
        <p className="text-gray-500 mt-2">
          Share key property details to create an accurate, appealing listing.
        </p>
      </div>

      <div className="space-y-6">
        {/* PROPERTY TYPE */}
        <FormSelectDropdown
          label="Property Type"
          name="propertyDetails.propertyType"
          id="propertyDetails.propertyType"
          options={[
            { value: "Apartment", label: "Apartment" },
            { value: "Independent House/Villa", label: "House" },
            { value: "Community Villa", label: "Villa" },
            { value: "Standalone Building", label: "Building" },
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

        {/* BUILT UP AREA + FACING + BHK TYPE */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
              { value: "dont-know", label: "Don't Know" },
            ]}
            required
            placeholder="Select facing direction"
            aria-describedby={
              propertyDetailsErrors?.facing && propertyDetailsTouched?.facing
                ? "propertyDetails.facing-error"
                : undefined
            }
          />

          <FormSelectDropdown
            label="BHK Type"
            name="propertyDetails.bhkType"
            id="propertyDetails.bhkType"
            options={[
              { value: "studio", label: "Studio" },
              { value: "1BHK", label: "1 BHK" },
              { value: "2BHK", label: "2 BHK" },
              { value: "3BHK", label: "3 BHK" },
              { value: "4BHK", label: "4 BHK" },
              { value: "5+BHK", label: "5+ BHK" },
            ]}
            required
            placeholder="Select BHK type"
            aria-describedby={
              propertyDetailsErrors?.bhkType && propertyDetailsTouched?.bhkType
                ? "propertyDetails.bhkType-error"
                : undefined
            }
          />
        </div>

        {/* BATHROOMS, FLOOR, TOTAL FLOOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <FormSelectDropdown
            label="Bathrooms"
            name="propertyDetails.bathrooms"
            id="propertyDetails.bathrooms"
            options={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
            ]}
            optionsType="number"
            required
            placeholder="Select bathrooms"
            aria-describedby={
              propertyDetailsErrors?.bathrooms &&
              propertyDetailsTouched?.bathrooms
                ? "propertyDetails.bathrooms-error"
                : undefined
            }
          />

          <FormSelectDropdown
            label="Total Floor"
            name="propertyDetails.totalFloors"
            id="totalFloors"
            options={Array.from({ length: 50 }, (_, i) => i + 1).map(
              (value) => ({
                value: value,
                label: value.toString(),
              }),
            )}
            optionsType="number"
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
            optionsType="number"
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
    </>
  );
};

export default FlatmatePropertyDetailsClient;
