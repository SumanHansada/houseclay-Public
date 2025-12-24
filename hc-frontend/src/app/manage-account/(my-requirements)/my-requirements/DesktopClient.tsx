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
import { BENGALURU_BOUNDS, isWithinBounds } from "@/utils/geoBounds";

import {
  bhkTypeOptions,
  lookingForARoomOptions,
  preferredTenantOptions,
  propertyTypeOptions,
  rentBudgetOptions,
  resaleBudgetOptions,
  userTypeOptions,
} from "./options";

interface DesktopProps {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}

const MAX_LOCATIONS = 5;

export function DesktopClient({ editMode, setEditMode }: DesktopProps) {
  const { values, setFieldValue } =
    useFormikContext<MyRequirementsFormValues>();
  const isTenant = values.userType === "tenant";
  const isFlatmate = isTenant && values.lookingForARoom === "yes";
  const budgetOptions = isTenant ? rentBudgetOptions : resaleBudgetOptions;

  const onLocationSelect = (location: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    city?: string;
  }) => {
    if (location.city) {
      if (
        !isWithinBounds(location.latitude, location.longitude, BENGALURU_BOUNDS)
      ) {
        toast.error("Please select a location within Bengaluru", {
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
    <>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-8 border-b-2">
        <h1 className="text-2xl font-medium">My Requirements</h1>
        <button
          type="button"
          className="px-5 py-2 text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={() => setEditMode(true)}
          disabled={editMode}
        >
          Edit
        </button>
      </div>

      <Form className="flex-1 space-y-6">
        {/* Who am I */}
        <div className="flex items-center gap-2">
          <span className="text-xl">I&apos;m a&nbsp;</span>
          <FormRadioGroup
            name="userType"
            containerClassName="m-0"
            columns={2}
            options={userTypeOptions}
            disabled={!editMode}
          />
        </div>

        {/* Locations (Places input + chips) */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Locations
          </label>

          <div
            className={`relative w-full border rounded-xl px-2 py-2 flex flex-wrap items-center gap-2 ${
              !editMode ? "bg-gray-50" : "bg-white"
            }`}
            onKeyDownCapture={(e) => {
              if (e.key !== "Backspace") return;
              const target = e.target as HTMLInputElement;
              if (
                target?.name === "locationSearch" &&
                target.value === "" &&
                values.locations.length > 0 &&
                editMode
              ) {
                const next = [...values.locations];
                next.pop();
                setFieldValue("locations", next);
                e.preventDefault();
              }
            }}
          >
            {/* Chips */}
            {values.locations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm text-white bg-red-500 rounded-md"
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

            {/* Places input lives inside the shell */}
            <div className="flex-1 min-w-[140px]">
              <FormPlacesAutocomplete
                name="locationSearch"
                id="locationSearch"
                placeholder={
                  values.locations.length >= MAX_LOCATIONS
                    ? "Location limit reached"
                    : `Search and add up to ${MAX_LOCATIONS} locations`
                }
                disabled={!editMode || values.locations.length >= MAX_LOCATIONS}
                inputClassName="w-full border-none outline-none bg-transparent p-1"
                containerClassName="w-full"
                dropdownClassName="absolute left-0 right-0 top-full z-50 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto"
                onLocationSelect={onLocationSelect}
              />
            </div>
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
        <div className="flex flex-col w-4/5 gap-2">
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
                withIcons
                disabled={!editMode}
              />
            )}
          </div>
        )}

        {/* Budget */}
        <div className="w-fit">
          <FormRadioGroup
            name="budget"
            label="Your Budget"
            columns={4}
            options={budgetOptions}
            disabled={!editMode}
          />
        </div>
      </Form>
    </>
  );
}
