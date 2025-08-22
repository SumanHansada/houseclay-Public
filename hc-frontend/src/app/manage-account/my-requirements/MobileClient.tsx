"use client";

import { Form, useFormikContext } from "formik";
import { ChevronLeft, SquarePen, X } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import {
  FormCheckbox,
  FormPlacesAutocomplete,
  FormRadioGroup,
} from "@/form-components";
import { MyRequirementsFormValues } from "@/interfaces/ManageAccount";
import { setHideStickyNavBar } from "@/store/appSlice";

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
  setEditMode: (v: boolean) => void;
  onBack: () => void;
  savedValues: MyRequirementsFormValues;
  DEFAULT_VALUES: MyRequirementsFormValues;
}

const MAX_LOCATIONS = 5;

export function MobileClient({
  editMode,
  setEditMode,
  onBack,
  savedValues,
  DEFAULT_VALUES,
}: MobileProps) {
  const { values, setFieldValue, resetForm } =
    useFormikContext<MyRequirementsFormValues>();
  const isTenant = values.userType === "tenant";
  const isFlatmate = isTenant && values.lookingForARoom === "yes";
  const budgetOptions = isTenant ? rentBudgetOptions : resaleBudgetOptions;
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(setHideStickyNavBar(editMode));
    return () => {
      dispatch(setHideStickyNavBar(false));
    };
  }, [dispatch, editMode]);

  return (
    <>
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

      <Form className="flex-1 space-y-6 px-8 py-4 mb-20">
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
                      <X size={14} className="" />
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
              inputClassName="w-full p-2 border rounded-xl"
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

        {/* Actions */}
        {editMode ? (
          <footer className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white py-4 px-5 flex items-center justify-between">
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
            <div className="flex gap-4">
              <button
                type="button"
                className=""
                onClick={() => {
                  resetForm({ values: DEFAULT_VALUES });
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                onClick={() => setFieldValue("locationSearch", "")}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
              >
                Save
              </button>
            </div>
          </footer>
        ) : null}
      </Form>
    </>
  );
}
