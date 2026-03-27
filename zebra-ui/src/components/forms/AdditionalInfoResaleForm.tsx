"use client";

import { useFormikContext } from "formik";

import {
  KHATA_CERTIFICATE_OPTIONS,
  YES_NO_OPTIONS,
} from "@/common/constants/formOptions";
import { FormPhoneField, FormSelectDropdown } from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import {
  getAdditionalInfoErrors,
  getAdditionalInfoTouched,
} from "@/utils/formHelpers";

interface AdditionalInfoResaleFormProps {
  disabled: boolean;
}

const AdditionalInfoResaleForm: React.FC<AdditionalInfoResaleFormProps> = ({
  disabled,
}) => {
  const { errors, touched } = useFormikContext<FormValues>();

  // Helper function to safely access optional fields
  const additionalInfoErrors = getAdditionalInfoErrors(errors);
  const additionalInfoTouched = getAdditionalInfoTouched(touched);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">
          Any additional info
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoResaleForm;
