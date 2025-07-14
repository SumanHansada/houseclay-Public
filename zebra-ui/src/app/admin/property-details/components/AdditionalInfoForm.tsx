"use client";

import { useSelector } from "react-redux";

import { PropertyCategoryEnum } from "@/common/enums";
import FormPhoneInput from "@/components/common/FormPhoneInput";
import FormSelectDropdown from "@/form-components/FormSelectDropdown";
import { selectPropertyCategory } from "@/store/propertyDetailsSlice";

interface AdditionalInfoFormProps {
  disabled: boolean;
}

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({
  disabled,
}) => {
  const propertyCategory = useSelector(selectPropertyCategory);
  if (!propertyCategory) {
    return null;
  }
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">
          Any additional info
        </h1>
      </div>
      <div>
        {(propertyCategory === PropertyCategoryEnum.RENT ||
          propertyCategory === PropertyCategoryEnum.FLATMATE) && (
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
                disabled={disabled}
                // aria-describedby={
                //   errors?.additionalInfo?.whoWillShowProperty &&
                //   touched?.additionalInfo?.whoWillShowProperty
                //     ? "whoWillShowProperty-error"
                //     : undefined
                // }
              />
            </div>
            <div className="col-span-1">
              <FormPhoneInput
                label="Secondary Phone Number"
                name="additionalInfo.secondaryPhoneNumber"
                id="additionalInfo.secondaryPhoneNumber"
                defaultCountry="in"
                placeholder="Enter phone number"
                // disabled={disabled}
                className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        )}
        {propertyCategory === PropertyCategoryEnum.RESALE && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <FormSelectDropdown
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
                  disabled={disabled}
                  // aria-describedby={
                  //   errors?.additionalInfo?.khataCertificate &&
                  //   touched?.additionalInfo?.khataCertificate
                  //     ? "additionalInfo.khataCertificate-error"
                  //     : undefined
                  // }
                />
              </div>
              <div className="col-span-1">
                <FormSelectDropdown
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
                  disabled={disabled}
                  // aria-describedby={
                  //   errors?.additionalInfo?.saleDeed &&
                  //   touched?.additionalInfo?.saleDeed
                  //     ? "additionalInfo.saleDeed-error"
                  //     : undefined
                  // }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <FormSelectDropdown
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
                  disabled={disabled}
                  // aria-describedby={
                  //   errors?.additionalInfo?.propertyTax &&
                  //   touched?.additionalInfo?.propertyTax
                  //     ? "additionalInfo.propertyTax-error"
                  //     : undefined
                  // }
                />
              </div>
              <div className="col-span-1">
                <FormPhoneInput
                  label="Secondary Phone Number"
                  name="additionalInfo.secondaryPhoneNumber"
                  id="additionalInfo.secondaryPhoneNumber"
                  defaultCountry="in"
                  placeholder="Enter phone number"
                  //   disabled={disabled}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfoForm;
