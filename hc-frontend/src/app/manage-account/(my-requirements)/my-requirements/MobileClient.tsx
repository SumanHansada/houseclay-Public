"use client";

import { Form, useFormikContext } from "formik";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import {
  FormCheckbox,
  FormPlacesAutocomplete,
  FormRadioGroup,
} from "@/form-components";
import { MyRequirementsFormValues } from "@/interfaces/ManageAccount";

import {
  bhkTypeOptions,
  lookingForARoomOptions,
  preferredTenantOptions,
  propertyTypeOptions,
  rentBudgetOptions,
  resaleBudgetOptions,
  userTypeOptions,
} from "./options";

interface MobileProps {
  editMode: boolean;
}

const MAX_LOCATIONS = 5;

export function MobileClient({ editMode }: MobileProps) {
  const { values, setFieldValue } =
    useFormikContext<MyRequirementsFormValues>();
  const isTenant = values.userType === "tenant";
  const isFlatmate = isTenant && values.lookingForARoom === "yes";
  const budgetOptions = isTenant ? rentBudgetOptions : resaleBudgetOptions;
  const cityAllowed = "Bengaluru";
  const onLocationSelect = (location: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    city?: string;
  }) => {
    if (location.city && cityAllowed) {
      const selectedCity = location.city;
      const isCityAllowed = cityAllowed === selectedCity;

      if (!isCityAllowed) {
        toast.error(`Please select a location within ${cityAllowed}`, {
          duration: 5000,
        });
        setFieldValue("locationSearch", "");
        return;
      }
    }
    const label = (location.name ?? values.locationSearch ?? "").trim();
    if (!label) return;
    if (values.locations.includes(label)) return;
    if (values.locations.length >= MAX_LOCATIONS) return;

    setFieldValue("locations", [...values.locations, label]);
    setFieldValue("locationSearch", "");
  };

  return (
    <div className="md:hidden">
      <Form className="flex-1 space-y-6 px-6 pt-4 pb-16">
        {/* Who am I */}
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-lg">I&apos;m a&nbsp;</label>
          <FormRadioGroup
            name="userType"
            columns={2}
            options={userTypeOptions}
            disabled={!editMode}
            containerClassName="m-0 w-full"
            radioGroupClassName="border border-gray-300 p-2 rounded-xl"
            radioOptionClassName="flex-1 rounded-xl w-full relative transition-all"
          />
        </div>

        {/* Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locations
          </label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {values.locations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-sm rounded-md"
                >
                  {loc}
                  {editMode && (
                    <button
                      type="button"
                      aria-label={`Remove ${loc}`}
                      className="rounded hover:bg-white/10"
                      onClick={() =>
                        setFieldValue(
                          "locations",
                          values.locations.filter((l) => l !== loc),
                        )
                      }
                    >
                      <X size={14} />
                    </button>
                  )}
                </span>
              ))}
            </div>

            <FormPlacesAutocomplete
              name="locationSearch"
              id="locationSearch"
              placeholder={
                values.locations.length >= MAX_LOCATIONS
                  ? "Location limit reached"
                  : `Search and add up to ${MAX_LOCATIONS} locations`
              }
              disabled={!editMode || values.locations.length >= MAX_LOCATIONS}
              containerClassName="w-full relative"
              inputClassName="w-full p-1 border rounded-xl"
              dropdownClassName="absolute left-0 right-0 top-full z-50 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto"
              dropdownItemClassName="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
              onLocationSelect={onLocationSelect}
            />
          </div>
        </div>

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
              <FormRadioGroup
                name="lookingForARoom"
                columns={2}
                options={lookingForARoomOptions}
                disabled={!editMode}
                containerClassName="m-0 w-full"
                radioGroupClassName="border border-gray-300 p-2 rounded-xl"
                radioOptionClassName="flex-1 rounded-xl w-full relative transition-all"
              />
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
      </Form>
    </div>
  );
}
