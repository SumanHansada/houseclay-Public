"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  FormAutocomplete,
  FormCheckbox,
  FormRadioGroup,
  FormSelectDropdown,
} from "@/form-components";

import Image from "next/image";
import ApartmentIcon from "public/icons/property-types/apartment.webp";
import CommunityVillaIcon from "public/icons/property-types/community-villa.webp";
import IndependentHouseIcon from "public/icons/property-types/independent-house.webp";
import StandaloneBuildingIcon from "public/icons/property-types/standalone-building.webp";

type Option = { label: string; value: string };
type IconOption = Option & { icon: ReactNode };
type UserType = "tenant" | "buyer" | "";

const bhkTypesOptions: Option[] = [
  { label: "1 BHK", value: "1BHK" },
  { label: "2 BHK", value: "2BHK" },
  { label: "3 BHK", value: "3BHK" },
  { label: "4 BHK", value: "4BHK" },
  { label: "5+ BHK", value: "5+BHK" },
];

const rentBudgetOptions: Option[] = [
  { label: "Under ₹30k", value: "under30K" },
  { label: "Under ₹50K", value: "under50K" },
  { label: "Under ₹80k", value: "under80K" },
  { label: "Flexible", value: "flexible" },
];

const resaleBudgetOptions: Option[] = [
  { label: "Under ₹1 Cr", value: "under1CR" },
  { label: "Under ₹2 Cr", value: "under2CR" },
  { label: "Under ₹4 Cr", value: "under4CR" },
  { label: "Flexible", value: "flexible" },
];

const userTypeOptions: Option[] = [
  { label: "Tenant", value: "tenant" },
  { label: "Buyer", value: "buyer" },
];

const propertyTypeOptions: IconOption[] = [
  {
    value: "Apartment",
    label: "Apartment",
    icon: <Image src={ApartmentIcon} alt="Apartment" height={75} width={75} />,
  },
  {
    value: "Independent House/Villa",
    label: "Independent House/Villa",
    icon: (
      <Image
        src={IndependentHouseIcon}
        alt="Independent House/Villa"
        height={75}
        width={75}
      />
    ),
  },
  {
    value: "Community Villa",
    label: "Community Villa",
    icon: (
      <Image
        src={CommunityVillaIcon}
        alt="Community Villa"
        height={75}
        width={75}
      />
    ),
  },
  {
    value: "Standalone Building",
    label: "Standalone Building",
    icon: (
      <Image
        src={StandaloneBuildingIcon}
        alt="Standalone Building"
        height={75}
        width={75}
      />
    ),
  },
];

const lookingForARoomOptions: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const locationList = [
  "JP Nagar",
  "Indiranagar",
  "Koramangala",
  "Whitefield",
  "Sadashivanagar",
  "Jayanagar",
  "HSR Layout",
];

type FormValues = {
  userType: UserType;
  location: string[];
  propertyType: string[];
  bhkType: string;
  lookingForARoom: string;
  budget: string;
};

const EMPTY_VALUES: FormValues = {
  userType: "",
  location: [],
  propertyType: [],
  bhkType: "",
  lookingForARoom: "",
  budget: "",
};

const DEFAULT_VALUES: FormValues = {
  userType: userTypeOptions[0].value as UserType,
  location: [locationList[0]],
  propertyType: [propertyTypeOptions[0].value],
  bhkType: bhkTypesOptions[0].value,
  lookingForARoom: lookingForARoomOptions[0].value,
  budget: rentBudgetOptions[0].value,
};

// keep validation minimal for now so Save works
const validationSchema = Yup.object({});

export default function MyRequirementsPage() {
  const [editMode, setEditMode] = useState(false);
  const [savedValues, setSavedValues] = useState<FormValues>(DEFAULT_VALUES);

  return (
    <>
      {/* Page title */}
      <div className="border-b-2 pb-2 mb-8">
        <h1 className="text-2xl font-medium">My Requirements</h1>
      </div>

      <Formik<FormValues>
        initialValues={savedValues}
        enableReinitialize
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values, helpers) => {
          console.log("Submit all data:", values);
          setSavedValues(values);
          setEditMode(false);
          helpers.setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, resetForm }) => {
          const isTenant = values.userType === "tenant";

          const budgetOptions = useMemo(
            () => (isTenant ? rentBudgetOptions : resaleBudgetOptions),
            [isTenant],
          );

          useEffect(() => {
            if (values.userType === "") return;

            if (!budgetOptions.some((o) => o.value === values.budget)) {
              setFieldValue("budget", budgetOptions[0]?.value ?? "");
            }

            if (!isTenant && values.lookingForARoom) {
              setFieldValue("lookingForARoom", "");
            }
            if (isTenant && !values.lookingForARoom) {
              setFieldValue("lookingForARoom", "yes");
            }
          }, [isTenant]);

          return (
            <Form className="flex-1 space-y-6">
              {/* Who am I */}
              <div className="flex items-center gap-2">
                <span className="text-lg">I&apos;m a&nbsp;</span>
                <FormRadioGroup
                  name="userType"
                  containerClassName="m-0"
                  columns={2}
                  options={userTypeOptions}
                  disabled={!editMode}
                />
              </div>

              {/* Locations */}
              <div>
                <FormAutocomplete
                  name="location"
                  label="Locations"
                  items={locationList}
                  selectedItems={values.location}
                  onSelectionChange={(items) =>
                    setFieldValue("location", items)
                  }
                  maxItems={4}
                  inputClassName="flex items-center h-14 bg-gray-50 w-full p-3 border-none rounded-lg"
                  placeholder="Search for a property"
                  disabled={!editMode}
                />
              </div>

              {/* Property Type */}
              <div>
                <FormCheckbox
                  name="propertyType"
                  label="Property Type"
                  columns={4}
                  options={propertyTypeOptions}
                  withIcons
                  disabled={!editMode}
                />
              </div>

              {/* BHK */}
              <div className="flex flex-col gap-2">
                <FormRadioGroup
                  name="bhkType"
                  label="BHK Type"
                  columns={8}
                  options={bhkTypesOptions}
                  disabled={!editMode}
                />
              </div>

              {/* Looking for a room (Tenant only) */}
              {isTenant && (
                <div>
                  <FormSelectDropdown
                    label="Looking for a room"
                    name="lookingForARoom"
                    id="lookingForARoom"
                    options={lookingForARoomOptions}
                    placeholder="Looking for a room?"
                    disabled={!editMode}
                  />
                </div>
              )}

              {/* Budget (depends on category) */}
              <div>
                <FormRadioGroup
                  name="budget"
                  label="Your Budget"
                  columns={8}
                  options={budgetOptions}
                  disabled={!editMode}
                />
              </div>

              {/* Actions */}
              <div className="mt-4 text-lg">
                {editMode ? (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-5 py-2 border rounded-lg shadow-sm"
                      onClick={() => {
                        // revert to last saved and exit edit mode
                        resetForm({ values: savedValues });
                        setEditMode(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-5 py-2 border rounded-lg shadow-sm"
                      onClick={() => {
                        // clear everything to empty/null, stay in edit mode
                        resetForm({ values: EMPTY_VALUES });
                      }}
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
