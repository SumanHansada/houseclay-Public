"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  FormAutocomplete,
  FormCheckbox,
  FormRadioGroup,
} from "@/form-components";

import Image from "next/image";
import ApartmentIcon from "public/icons/property-types/apartment.webp";
import CommunityVillaIcon from "public/icons/property-types/community-villa.webp";
import IndependentHouseIcon from "public/icons/property-types/independent-house.webp";
import StandaloneBuildingIcon from "public/icons/property-types/standalone-building.webp";
import FemaleIconSvg from "public/icons/preferred-tenants/female.svg";
import MaleIconSvg from "public/icons/preferred-tenants/male.svg";

const MaleIcon = MaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const FemaleIcon = FemaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

type Option = { label: string; value: string };
type IconOption = Option & { icon: ReactNode };
type UserType = "tenant" | "buyer" | "";

const userTypeOptions: Option[] = [
  { label: "Tenant", value: "tenant" },
  { label: "Buyer", value: "buyer" },
];

const propertyTypeOptions: IconOption[] = [
  {
    label: "Apartment",
    value: "Apartment",
    icon: <Image src={ApartmentIcon} alt="Apartment" height={75} width={75} />,
  },
  {
    label: "Independent House/Villa",
    value: "Independent House/Villa",
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
    label: "Community Villa",
    value: "Community Villa",
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
    label: "Standalone Building",
    value: "Standalone Building",
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

const bhkTypeOptions: Option[] = [
  { label: "1 BHK", value: "1BHK" },
  { label: "2 BHK", value: "2BHK" },
  { label: "3 BHK", value: "3BHK" },
  { label: "4 BHK", value: "4BHK" },
  { label: "5+ BHK", value: "5+BHK" },
];

const lookingForARoomOptions: Option[] = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const preferredTenantOptions: IconOption[] = [
  {
    label: "Female",
    value: "female",
    icon: <FemaleIcon />,
  },
  {
    label: "Male",
    value: "male",
    icon: <MaleIcon />,
  },
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
  preferredTenants: string;
  budget: string;
};

const EMPTY_VALUES: FormValues = {
  userType: "",
  location: [],
  propertyType: [],
  bhkType: "",
  lookingForARoom: "",
  preferredTenants: "",
  budget: "",
};

const DEFAULT_VALUES: FormValues = {
  userType: "tenant",
  location: ["JP Nagar"],
  propertyType: ["Apartment"],
  bhkType: "1BHK",
  lookingForARoom: "yes",
  preferredTenants: "female",
  budget: "under50K",
};

// keep validation minimal for now so Save works
const validationSchema = Yup.object({});

export default function MyRequirementsPage() {
  const [editMode, setEditMode] = useState(false);
  const [savedValues, setSavedValues] = useState<FormValues>(DEFAULT_VALUES);

  return (
    <>
      {/* Page title */}
      <div className="border-b-2 pb-2 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-medium">My Requirements</h1>
        <button
          type="button"
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={() => setEditMode(true)}
          disabled={editMode}
        >
          Edit
        </button>
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
          const isFlatmate = isTenant && values.lookingForARoom === "yes";

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

            if (isFlatmate) {
              setFieldValue("preferredTenants", "female");
            }
          }, [isTenant, isFlatmate]);

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
              <div className="flex flex-col gap-2 w-4/5">
                <FormRadioGroup
                  name="bhkType"
                  label="BHK Type"
                  columns={5}
                  options={bhkTypeOptions}
                  disabled={!editMode}
                />
              </div>

              {/* Looking for a room (Tenant only) */}
              {isTenant && (
                <div className="w-2/5">
                  <FormRadioGroup
                    name="lookingForARoom"
                    label="Looking for a room"
                    columns={2}
                    options={lookingForARoomOptions}
                    disabled={!editMode}
                  />
                  {isFlatmate && (
                    <FormRadioGroup
                      name="preferredTenants"
                      label="Preferred Tenants"
                      columns={2}
                      options={preferredTenantOptions}
                      withIcons={true}
                      disabled={!editMode}
                    />
                  )}
                </div>
              )}

              {/* Budget (depends on category) */}
              <div className="w-fit">
                <FormRadioGroup
                  name="budget"
                  label="Your Budget"
                  columns={4}
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
                      className="px-5 py-2 border rounded-lg shadow-sm hover:bg-gray-50"
                      onClick={() => {
                        resetForm({ values: savedValues });
                        setEditMode(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-5 py-2 border rounded-lg shadow-sm hover:bg-gray-50"
                      onClick={() => {
                        resetForm({ values: EMPTY_VALUES });
                      }}
                    >
                      Reset
                    </button>
                  </div>
                ) : null}
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
