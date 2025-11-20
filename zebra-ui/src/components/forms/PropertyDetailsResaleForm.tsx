"use client";

import { useFormikContext } from "formik";

import {
  BHK_TYPE_OPTIONS,
  FACING_OPTIONS,
  FLOOR_NUMERIC_OPTIONS,
  FLOOR_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
  PROPERTY_AGE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  TOTAL_FLOORS_NUMERIC_OPTIONS,
} from "@/common/constants/options/normalOptions";
import {
  FormSelectDropdown,
  FormTextArea,
  FormTextField,
} from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import {
  getPropertyDetailsErrors,
  getPropertyDetailsTouched,
} from "@/utils/formHelpers";

interface PropertyDetailsResaleFormProps {
  disabled: boolean;
}

const PropertyDetailsResaleForm: React.FC<PropertyDetailsResaleFormProps> = ({
  disabled,
}) => {
  const { errors, touched } = useFormikContext<FormValues>();

  // Helper function to safely access property details errors and touched
  const propertyDetailsErrors = getPropertyDetailsErrors(errors);
  const propertyDetailsTouched = getPropertyDetailsTouched(touched);

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
        options={PROPERTY_TYPE_OPTIONS}
        required
        placeholder="Select property type"
        aria-describedby={
          propertyDetailsErrors?.propertyType &&
          propertyDetailsTouched?.propertyType
            ? "propertyDetails.propertyType-error"
            : undefined
        }
        disabled={disabled}
      />

      {/* BUILT UP AREA + FACING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormTextField
          name="propertyDetails.builtUpArea"
          id="propertyDetails.builtUpArea"
          label="Built Up Area"
          dataType="number"
          placeholder="Enter built up area"
          suffix="Sq.ft"
          required
          disabled={disabled}
        />

        <FormSelectDropdown
          label="Facing"
          name="propertyDetails.facing"
          id="propertyDetails.facing"
          options={FACING_OPTIONS}
          required
          placeholder="Select facing direction"
          aria-describedby={
            propertyDetailsErrors?.facing && propertyDetailsTouched?.facing
              ? "propertyDetails.facing-error"
              : undefined
          }
          disabled={disabled}
        />
      </div>

      {/* BHK TYPE, OWNERSHIP, AGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <FormSelectDropdown
          label="BHK Type"
          name="propertyDetails.bhkType"
          id="propertyDetails.bhkType"
          options={BHK_TYPE_OPTIONS}
          required
          placeholder="Select BHK Type"
          aria-describedby={
            propertyDetailsErrors?.bhkType && propertyDetailsTouched?.bhkType
              ? "propertyDetails.bhkType-error"
              : undefined
          }
          disabled={disabled}
        />

        <FormSelectDropdown
          label="Ownership Type"
          name="propertyDetails.ownershipType"
          id="propertyDetails.ownershipType"
          options={OWNERSHIP_TYPE_OPTIONS}
          required
          placeholder="Select ownership type"
          aria-describedby={
            propertyDetailsErrors?.ownershipType &&
            propertyDetailsTouched?.ownershipType
              ? "propertyDetails.ownershipType-error"
              : undefined
          }
          disabled={disabled}
        />

        <FormSelectDropdown
          label="Property Age"
          name="propertyDetails.propertyAge"
          id="propertyDetails.propertyAge"
          options={PROPERTY_AGE_OPTIONS}
          required
          placeholder="Select property age"
          aria-describedby={
            propertyDetailsErrors?.propertyAge &&
            propertyDetailsTouched?.propertyAge
              ? "propertyDetails.propertyAge-error"
              : undefined
          }
          disabled={disabled}
        />
      </div>

      {/* FLOOR, TOTAL FLOOR, FLOOR TYPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <FormSelectDropdown
          label="Total Floor"
          name="propertyDetails.totalFloors"
          id="totalFloors"
          options={TOTAL_FLOORS_NUMERIC_OPTIONS}
          optionsType="number"
          required
          placeholder="Select total floors"
          aria-describedby={
            propertyDetailsErrors?.totalFloors &&
            propertyDetailsTouched?.totalFloors
              ? "totalFloors-error"
              : undefined
          }
          disabled={disabled}
        />

        <FormSelectDropdown
          label="Floor"
          name="propertyDetails.floor"
          id="propertyDetails.floor"
          options={FLOOR_NUMERIC_OPTIONS}
          optionsType="number"
          required
          placeholder="Select floor"
          aria-describedby={
            propertyDetailsErrors?.floor && propertyDetailsTouched?.floor
              ? "propertyDetails.floor-error"
              : undefined
          }
          disabled={disabled}
        />

        <FormSelectDropdown
          label="Floor Type"
          name="propertyDetails.floorType"
          id="floorType"
          options={FLOOR_TYPE_OPTIONS}
          required
          placeholder="Select floor type"
          aria-describedby={
            propertyDetailsErrors?.floorType &&
            propertyDetailsTouched?.floorType
              ? "floorType-error"
              : undefined
          }
          disabled={disabled}
        />
      </div>

      <div className="mb-6">
        <FormTextArea
          name="propertyDetails.description"
          id="propertyDetails.description"
          label="Description"
          placeholder="Enter property description"
          rows={5}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsResaleForm;
