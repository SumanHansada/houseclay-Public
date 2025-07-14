"use client";

import { useSelector } from "react-redux";

import { PropertyCategoryEnum } from "@/common/enums";
import FormInputField from "@/components/common/FormInputField";
import FormTextArea from "@/components/common/FormTextArea";
import FormSelectDropdown from "@/form-components/FormSelectDropdown";
import { selectPropertyCategory } from "@/store/propertyDetailsSlice";

interface PropertyDetailsFormProps {
  disabled: boolean;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({
  disabled,
}) => {
  const propertyCategory = useSelector(selectPropertyCategory);
  if (!propertyCategory) {
    return null;
  }
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800">Property Details</h1>
        <p className="text-gray-500 mt-2">
          Review and edit key property details for an accurate, appealing
          listing.
        </p>
      </div>

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
        disabled={disabled}
        // aria-describedby={
        //   errors?.propertyDetails?.propertyType &&
        //   touched?.propertyDetails?.propertyType
        //     ? "propertyDetails.propertyType-error"
        //     : undefined
        // }
      />

      {/* BUILT UP AREA + FACING */}
      {(propertyCategory === PropertyCategoryEnum.RENT ||
        propertyCategory === PropertyCategoryEnum.RESALE) && (
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
            ]}
            required
            placeholder="Select facing direction"
            disabled={disabled}
            // aria-describedby={
            //   errors?.propertyDetails?.facing &&
            //   touched?.propertyDetails?.facing
            //     ? "propertyDetails.facing-error"
            //     : undefined
            // }
          />
        </div>
      )}

      {/* BHK TYPE, OWNERSHIP, AGE */}
      {(propertyCategory === PropertyCategoryEnum.RENT ||
        propertyCategory === PropertyCategoryEnum.RESALE) && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            disabled={disabled}
            // aria-describedby={
            //   errors?.propertyDetails?.bhkType &&
            //   touched?.propertyDetails?.bhkType
            //     ? "propertyDetails.bhkType-error"
            //     : undefined
            // }
          />

          <FormSelectDropdown
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
            disabled={disabled}
            // aria-describedby={
            //   errors?.propertyDetails?.ownershipType &&
            //   touched?.propertyDetails?.ownershipType
            //     ? "propertyDetails.ownershipType-error"
            //     : undefined
            // }
          />

          <FormSelectDropdown
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
            disabled={disabled}
            // aria-describedby={
            //   errors?.propertyDetails?.propertyAge &&
            //   touched?.propertyDetails?.propertyAge
            //     ? "propertyDetails.propertyAge-error"
            //     : undefined
            // }
          />
        </div>
      )}

      {propertyCategory === PropertyCategoryEnum.FLATMATE && (
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
            disabled={disabled}
            // aria-describedby={
            //   errors?.propertyDetails?.bhkType &&
            //   touched?.propertyDetails?.bhkType
            //     ? "propertyDetails.bhkType-error"
            //     : undefined
            // }
          />
        </div>
      )}

      {/* FLOOR, TOTAL FLOOR, FLOOR TYPE */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${propertyCategory === PropertyCategoryEnum.RENT || propertyCategory === PropertyCategoryEnum.RESALE ? "xl:grid-cols-3" : ""} gap-6`}
      >
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
          disabled={disabled}
          // aria-describedby={
          //   errors?.propertyDetails?.totalFloors &&
          //   touched?.propertyDetails?.totalFloors
          //     ? "totalFloors-error"
          //     : undefined
          // }
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
          disabled={disabled}
          // aria-describedby={
          //   errors?.propertyDetails?.floor && touched?.propertyDetails?.floor
          //     ? "propertyDetails.floor-error"
          //     : undefined
          // }
        />

        {(propertyCategory === PropertyCategoryEnum.RENT ||
          propertyCategory === PropertyCategoryEnum.RESALE) && (
          <FormSelectDropdown
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
            disabled={disabled}
            // aria-describedby={
            //   errors?.propertyDetails?.floorType &&
            //   touched?.propertyDetails?.floorType
            //     ? "floorType-error"
            //     : undefined
            // }
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
  );
};

export default PropertyDetailsForm;
