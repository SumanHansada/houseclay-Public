"use client";

import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { WHO_WILL_SHOW_PROPERTY_OPTIONS } from "@/common/constants/formOptions";
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
  }),
});

const FlatmateAdditionalInfoClient = () => {
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
              name="additionalInfo.whoWillShowProperty"
              id="additionalInfo.whoWillShowProperty"
              label="Who will show the property?"
              options={WHO_WILL_SHOW_PROPERTY_OPTIONS}
              placeholder="Select"
              aria-describedby={
                additionalInfoErrors?.whoWillShowProperty &&
                additionalInfoTouched?.whoWillShowProperty
                  ? "whoWillShowProperty-error"
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

export default FlatmateAdditionalInfoClient;
