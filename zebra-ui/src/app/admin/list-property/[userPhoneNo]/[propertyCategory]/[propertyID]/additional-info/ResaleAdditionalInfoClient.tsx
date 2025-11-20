"use client";

import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  KHATA_CERTIFICATE_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/constants/options/normalOptions";
import { FormPhoneField, FormSelectDropdown } from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import { setAdditionalInfo, setFormValidity } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import {
  getAdditionalInfoErrors,
  getAdditionalInfoTouched,
} from "@/utils/formHelpers";

const additionalInfoSchema = Yup.object().shape({
  additionalInfo: Yup.object().shape({
    whoWillShowProperty: Yup.string(),
    secondaryPhoneNumber: Yup.string(),
    khataCertificate: Yup.string().required("Khata Certificate is required"),
    saleDeed: Yup.boolean().required("Sale Deed is required"),
    propertyTax: Yup.boolean().required("Property Tax is required"),
  }),
});

const ResaleAdditionalInfoClient = () => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );
  const formState = useSelector((state: RootState) => state.listProperty.form);
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  // Helper function to safely access optional fields
  const additionalInfoErrors = getAdditionalInfoErrors(errors);
  const additionalInfoTouched = getAdditionalInfoTouched(touched);

  const additionalInfoString = JSON.stringify(values.additionalInfo);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await additionalInfoSchema.validate(values, {
          abortEarly: false,
          context: { propertyCategory },
        });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        if (values.additionalInfo) {
          dispatch(
            setAdditionalInfo({
              additionalInfo: values.additionalInfo,
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
    additionalInfoString,
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
          Complete Your Listing with Final Details
        </h1>
      </div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Do You have Khata Certificate?"
              name="additionalInfo.khataCertificate"
              id="additionalInfo.khataCertificate"
              options={KHATA_CERTIFICATE_OPTIONS}
              required={true}
              placeholder="Select Khata Certificate"
              aria-describedby={
                additionalInfoErrors?.khataCertificate &&
                additionalInfoTouched?.khataCertificate
                  ? "additionalInfo.khataCertificate-error"
                  : undefined
              }
            />
          </div>
          <div className="col-span-1">
            <FormSelectDropdown
              label="Do You have Sale Deed Certificate?"
              name="additionalInfo.saleDeed"
              id="additionalInfo.saleDeed"
              options={YES_NO_OPTIONS}
              optionsType="boolean"
              required={true}
              placeholder="Select Sale Deed Certificate"
              aria-describedby={
                additionalInfoErrors?.saleDeed &&
                additionalInfoTouched?.saleDeed
                  ? "additionalInfo.saleDeed-error"
                  : undefined
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormSelectDropdown
              label="Have you paid Property Tax?"
              name="additionalInfo.propertyTax"
              id="additionalInfo.propertyTax"
              options={YES_NO_OPTIONS}
              optionsType="boolean"
              required={true}
              placeholder="Select Property Tax Status"
              aria-describedby={
                additionalInfoErrors?.propertyTax &&
                additionalInfoTouched?.propertyTax
                  ? "additionalInfo.propertyTax-error"
                  : undefined
              }
            />
          </div>
          <div className="col-span-1">
            <FormPhoneField
              label="Secondary Phone Number"
              name="additionalInfo.secondaryPhoneNumber"
              id="additionalInfo.secondaryPhoneNumber"
              defaultCountry="in" // Set to India as your default
              placeholder="Enter phone number"
              className="border border-gray-300 rounded-xl px-3 py-1.5 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResaleAdditionalInfoClient;
