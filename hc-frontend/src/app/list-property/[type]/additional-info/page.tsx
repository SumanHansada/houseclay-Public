"use client";

import { useFormikContext } from "formik";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormDropdown from "@/components/common/FormDropdown";
import FormPhoneInput from "@/components/common/FormPhoneInput";
import {
  FormType,
  setAdditionalInfo,
  setFormValidity,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

import { FormValues } from "../layout";

export const dynamicParams = true;

const AdditionalInfoPage = () => {
  const { values, errors, touched, setFieldError, setErrors } =
    useFormikContext<FormValues>();
  const params = useParams();
  const formKey = `${params?.type}Form` as FormType; // Optional: add type assertion
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  const additionalInfoSchema = Yup.object().shape({
    additionalInfo: Yup.object().shape({
      whoWillShowProperty: Yup.string(),
      secondaryPhoneNumber: Yup.string(),
      khataCertificate: Yup.string().when("$formKey", {
        is: "resaleForm",
        then: (schema) => schema.required("Khata Certificate is required"),
        otherwise: (schema) => schema.optional(),
      }),
      saleDeed: Yup.boolean().when("$formKey", {
        is: "resaleForm",
        then: (schema) => schema.required("Sale Deed is required"),
        otherwise: (schema) => schema.optional(),
      }),
      propertyTax: Yup.boolean().when("$formKey", {
        is: "resaleForm",
        then: (schema) => schema.required("Property Tax is required"),
        otherwise: (schema) => schema.optional(),
      }),
    }),
  });

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await additionalInfoSchema.validate(values, { abortEarly: false, context: { formKey } });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        dispatch(
          setAdditionalInfo({
            type: formKey,
            additionalInfo: values.additionalInfo,
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
    JSON.stringify(values.additionalInfo),
    dispatch,
    formKey,
    setErrors,
    setFieldError,
  ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800">
          Complete Your Listing with Final Details
        </h1>
      </div>
      <div>
        {(formKey === "rentForm" || formKey === "flatmatesForm") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormDropdown
                name="additionalInfo.whoWillShowProperty"
                id="additionalInfo.whoWillShowProperty"
                label="Who will show the property?"
                options={[
                  { value: "Owner", label: "I will show" },
                  {
                    value: "Friend/Neighbour",
                    label: "Friend/Neighbour will show",
                  },
                ]}
                placeholder="Select"
                aria-describedby={
                  errors?.additionalInfo?.whoWillShowProperty &&
                  touched?.additionalInfo?.whoWillShowProperty
                    ? "whoWillShowProperty-error"
                    : undefined
                }
              />
            </div>
            <div className="col-span-1">
              <FormPhoneInput
                label="Secondary Phone Number"
                name="additionalInfo.secondaryPhoneNumber"
                id="additionalInfo.secondaryPhoneNumber"
                defaultCountry="in" // Set to India as your default
                placeholder="Enter phone number"
                className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        )}
        {formKey === "resaleForm" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <FormDropdown
                  label="Do You have Khata Certificate?"
                  name="additionalInfo.khataCertificate"
                  id="additionalInfo.khataCertificate"
                  options={[
                    { value: "A-Khata", label: "Yes, A-Khata" },
                    {
                      value: "B-Khata",
                      label: "Yes, B-Khata",
                    },
                    {
                      value: "No",
                      label: "No",
                    },
                  ]}
                  required={true}
                  placeholder="Select Khata Certificate"
                  aria-describedby={
                    errors?.additionalInfo?.khataCertificate &&
                    touched?.additionalInfo?.khataCertificate
                      ? "additionalInfo.khataCertificate-error"
                      : undefined
                  }
                />
              </div>
              <div className="col-span-1">
                <FormDropdown
                  label="Do You have Sale Deed Certificate?"
                  name="additionalInfo.saleDeed"
                  id="additionalInfo.saleDeed"
                  options={[
                    {
                      value: true,
                      label: "Yes",
                    },
                    {
                      value: false,
                      label: "No",
                    },
                  ]}
                  required={true}
                  placeholder="Select Sale Deed Certificate"
                  aria-describedby={
                    errors?.additionalInfo?.saleDeed &&
                    touched?.additionalInfo?.saleDeed
                      ? "additionalInfo.saleDeed-error"
                      : undefined
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <FormDropdown
                  label="Have you paid Property Tax?"
                  name="additionalInfo.propertyTax"
                  id="additionalInfo.propertyTax"
                  options={[
                    {
                      value: true,
                      label: "Yes",
                    },
                    {
                      value: false,
                      label: "No",
                    },
                  ]}
                  required={true}
                  placeholder="Select Property Tax Status"
                  aria-describedby={
                    errors?.additionalInfo?.propertyTax &&
                    touched?.additionalInfo?.propertyTax
                      ? "additionalInfo.propertyTax-error"
                      : undefined
                  }
                />
              </div>
              <div className="col-span-1">
                <FormPhoneInput
                  label="Secondary Phone Number"
                  name="additionalInfo.secondaryPhoneNumber"
                  id="additionalInfo.secondaryPhoneNumber"
                  defaultCountry="in" // Set to India as your default
                  placeholder="Enter phone number"
                  className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default AdditionalInfoPage;
