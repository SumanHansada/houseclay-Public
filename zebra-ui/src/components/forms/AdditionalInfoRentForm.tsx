"use client";

import { useFormikContext } from "formik";

import { FormPhoneField, FormSelectDropdown } from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import {
  getAdditionalInfoErrors,
  getAdditionalInfoTouched,
} from "@/utils/formHelpers";

interface AdditionalInfoRentFormProps {
  disabled: boolean;
}

const AdditionalInfoRentForm: React.FC<AdditionalInfoRentFormProps> = ({
  disabled,
}) => {
  const { errors, touched } = useFormikContext<FormValues>();

  // Helper function to safely access optional fields
  const additionalInfoErrors = getAdditionalInfoErrors(errors);
  const additionalInfoTouched = getAdditionalInfoTouched(touched);

  // console.log("<-- AdditionalInfoDetails (Form 5) - Rent -->");

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
                additionalInfoErrors?.whoWillShowProperty &&
                additionalInfoTouched?.whoWillShowProperty
                  ? "whoWillShowProperty-error"
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

export default AdditionalInfoRentForm;
