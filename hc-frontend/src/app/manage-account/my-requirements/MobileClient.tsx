"use client";

import { Form, useFormikContext } from "formik";
import { ChevronLeft, SquarePen } from "lucide-react";
import type { FormValues } from "./page";
import {
  FormAutocomplete,
  FormCheckbox,
  FormRadioGroup,
} from "@/form-components";
import {
  userTypeOptions,
  locationList,
  propertyTypeOptions,
  bhkTypeOptions,
  lookingForARoomOptions,
  rentBudgetOptions,
  resaleBudgetOptions,
  preferredTenantOptions,
} from "./page";

interface MobileProps {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  onBack: () => void;
  savedValues: FormValues;
  EMPTY_VALUES: FormValues;
}

export function MobileClient({
  editMode,
  setEditMode,
  onBack,
  savedValues,
  EMPTY_VALUES,
}: MobileProps) {
  const { values, setFieldValue, resetForm } = useFormikContext<FormValues>();
  const isTenant = values.userType === "tenant";
  const isFlatmate = isTenant && values.lookingForARoom === "yes";
  const budgetOptions = isTenant ? rentBudgetOptions : resaleBudgetOptions;

  return (
    <section className="md:hidden overflow-y-auto">
      <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white">
        <div className="grid grid-cols-3 items-center h-full px-4">
          <button
            aria-label="Go back"
            className="justify-self-start rounded-full size-10 border flex items-center justify-center"
            onClick={onBack}
          >
            <ChevronLeft size={25} />
          </button>

          <h1 className="col-start-2 text-center font-medium truncate">
            My Requirements
          </h1>

          <button
            type="button"
            onClick={() => setEditMode(true)}
            disabled={editMode}
            className="justify-self-end rounded-full size-10 border flex items-center justify-center"
          >
            <SquarePen size={20} />
          </button>
        </div>
      </header>

      <Form className="flex-1 space-y-6 px-8 py-4 mb-16 mt-[55px]">
        {/* Who am I */}
        <div className="flex flex-col items-start gap-2">
          <label className="text-lg">I&apos;m a&nbsp;</label>
          <div className="border border-gray-300 p-1 rounded-xl w-full">
            <FormRadioGroup
              name="userType"
              columns={2}
              options={userTypeOptions}
              disabled={!editMode}
              containerClassName="m-0"
              radioOptionClassName="flex-1 rounded-xl w-full relative transition-all"
            />
          </div>
        </div>

        {/* Locations */}
        <FormAutocomplete
          name="location"
          label="Locations"
          items={locationList}
          selectedItems={values.locations}
          onSelectionChange={(items) => setFieldValue("location", items)}
          maxItems={5}
          inputClassName="flex flex-wrap items-center bg-gray-50 w-full p-3 border-none rounded-lg"
          placeholder="Search for a property"
          disabled={!editMode}
        />

        {/* Property Type */}
        <FormCheckbox
          name="propertyType"
          label="Property Type"
          columns={4}
          options={propertyTypeOptions}
          withIcons
          disabled={!editMode}
        />

        {/* BHK */}
        <FormRadioGroup
          name="bhkType"
          label="BHK Type"
          columns={5}
          options={bhkTypeOptions}
          disabled={!editMode}
        />

        {/* Looking for a room (Tenant only) */}
        {isTenant && (
          <div className="space-y-6">
            <div>
              <span className="block text-gray-700 text-sm font-medium mb-1">
                Looking for a room
              </span>
              <div className="border border-gray-300 p-1 rounded-xl w-full">
                <FormRadioGroup
                  name="lookingForARoom"
                  columns={2}
                  options={lookingForARoomOptions}
                  disabled={!editMode}
                  containerClassName="m-0"
                  radioOptionClassName="flex-1 rounded-xl w-full relative transition-all"
                />
              </div>
            </div>

            {isFlatmate && (
              <FormRadioGroup
                name="preferredTenants"
                label="Preferred Tenants"
                columns={2}
                options={preferredTenantOptions}
                withIcons
                disabled={!editMode}
              />
            )}
          </div>
        )}

        {/* Budget */}
        <FormRadioGroup
          name="budget"
          label="Your Budget"
          columns={4}
          options={budgetOptions}
          disabled={!editMode}
        />

        {/* Actions */}
        {editMode ? (
          <footer className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white py-4 px-5 flex items-center justify-between">
            <div className="flex gap-2">
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
            <button
              type="submit"
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
            >
              Save
            </button>
          </footer>
        ) : null}
      </Form>
    </section>
  );
}
