"use client";

import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useReducer } from "react";

import { BadgeType } from "@/common/enums";
import Autocomplete from "@/components/common/Autocomplete";
import Button from "@/components/common/Button";
import SelectDropdown from "@/components/common/SelectDropdown";
import Properties from "@/components/Properties";
import { Property } from "@/interfaces/Property";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetPropertiesByLocationQuery } from "@/store/apiSlice";

import FilterDialog from "./components/filters";

export default function PropertySearchPage() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  // Only fetch if lat/lon are present and valid
  const shouldFetch = lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon));
  const { data, isLoading, error } = useGetPropertiesByLocationQuery(
    shouldFetch
      ? { latitude: Number(lat), longitude: Number(lon) }
      : { latitude: 0, longitude: 0 },
    { skip: !shouldFetch },
  );

  // Memoize property list
  const properties: Property[] = useMemo(() => {
    if (error) {
      return error as Property[];
    }
    if (!data || !Array.isArray(data)) return [];
    return data as Property[];
  }, [data, error]);

  type PropertySearchState = {
    propertyType: string | number | boolean;
    propertyCategory: string | number | boolean;
    propertyBhk: string | number | boolean;
    tenantType: string | number | boolean;
  };

  type PropertySearchAction = {
    type:
      | "SET_PROPERTY_TYPE"
      | "SET_PROPERTY_CATEGORY"
      | "SET_PROPERTY_BHK"
      | "SET_TENANT_TYPE";
    payload: string | number | boolean;
  };

  const initialState: PropertySearchState = {
    propertyType: "",
    propertyCategory: "buy",
    propertyBhk: "",
    tenantType: "",
  };

  const propertyReducer = (
    state: PropertySearchState,
    action: PropertySearchAction,
  ): PropertySearchState => {
    switch (action.type) {
      case "SET_PROPERTY_TYPE":
        return { ...state, propertyType: action.payload };
      case "SET_PROPERTY_CATEGORY":
        return { ...state, propertyCategory: action.payload };
      case "SET_PROPERTY_BHK":
        return { ...state, propertyBhk: action.payload };
      case "SET_TENANT_TYPE":
        return { ...state, tenantType: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(propertyReducer, initialState);
  const { openDialog, closeDialog, isDialogOpen } = useDialog();

  return (
    <>
      <section className="fixed z-50 flex w-full xl:gap-16 border-b border-t bg-white border-gray-200 lg:gap-8 md:gap-0 gap-0  xl:px-24 md:px-12 px-12 max-md:pt-4 max-md:pb-8 h-16">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1">
            <Autocomplete
              items={[
                "The Godfather",
                "12 Angry Men",
                "The Shawshank Redemption",
                "Schindler's List",
                "Pulp Fiction",
              ]}
              inputClassName="flex items-center min-h-[46px] w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
              placeholder="Search for a property"
            />
          </div>
          <div className="flex items-center gap-2 flex-row">
            <SelectDropdown
              options={[
                {
                  value: "rent",
                  label: "Rent",
                },
                {
                  value: "buy",
                  label: "Buy",
                },
                {
                  value: "flatmates",
                  label: "Flatmates",
                },
              ]}
              name="property-category"
              id="property-category"
              value={state.propertyCategory}
              onChange={(value: string | number | boolean) =>
                dispatch({ type: "SET_PROPERTY_CATEGORY", payload: value })
              }
              size="sm"
              dropdownWidth="fit"
              containerClassName="relative w-20"
              buttonClassName="flex justify-between items-center w-full p-3 border rounded-xl text-left border-red-500 text-red-500 hover:border-red-500 hover:text-red-500"
              selectedOptionClassName="bg-red-50 text-red-700 font-medium"
              displayTextClassName="text-red-500"
            />
            <SelectDropdown
              options={[
                { value: "Apartment", label: "Apartment" },
                { value: "Villa", label: "Villa" },
                { value: "House", label: "House" },
                { value: "Plot", label: "Plot" },
                { value: "Commercial", label: "Commercial" },
              ]}
              name="property-type"
              id="property-type"
              value={state.propertyType}
              placeholder="Property type"
              onChange={(value: string | number | boolean) =>
                dispatch({ type: "SET_PROPERTY_TYPE", payload: value })
              }
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-40"
            />
            <SelectDropdown
              options={[
                { value: "1BHK", label: "1 BHK" },
                { value: "2BHK", label: "2 BHK" },
                { value: "3BHK", label: "3 BHK" },
                { value: "4BHK", label: "4 BHK" },
                { value: "5+BHK", label: "5+ BHK" },
              ]}
              name="property-bhk"
              id="property-bhk"
              value={state.propertyBhk}
              placeholder="Beds"
              onChange={(value: string | number | boolean) =>
                dispatch({ type: "SET_PROPERTY_BHK", payload: value })
              }
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-32"
            />
            <SelectDropdown
              options={[
                { value: "couple", label: "Couple" },
                { value: "family", label: "Family" },
                { value: "bachelor", label: "Bachelor" },
                { value: "company", label: "Company" },
              ]}
              name="tenant-type"
              id="tenant-type"
              value={state.tenantType}
              placeholder="Tenant type"
              onChange={(value: string | number | boolean) =>
                dispatch({ type: "SET_TENANT_TYPE", payload: value })
              }
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-32"
            />
            <Button
              leftIcon={<SlidersHorizontal size={16} />}
              variant="outline"
              size="md"
              className="min-h-[46px] text-black rounded-xl border text-sm"
              onClick={() => openDialog("property-filters")}
            >
              Filters
            </Button>
            <Button
              leftIcon={<SearchIcon size={16} />}
              variant="primary"
              size="md"
              className="min-h-[46px] rounded-xl text-sm"
            >
              Search
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full pt-[64px] bg-gray-50 relative">
        <div className="min-h-screen bg-gray-50 pb-10 xl:px-24 md:px-12 px-12">
          {/* Header Bar */}
          <div className="">
            <div className="flex flex-col gap-4 py-6">
              {/* Filter/Search Bar */}

              <div>
                <p className="text-gray-500 text-sm">
                  {properties.length} properties
                </p>
              </div>
            </div>
          </div>

          {/* Property List */}
          <div className="mx-auto">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* {Array.from({ length: 6 }).map((_, i) => (
                  <P key={i} />
                ))} */}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                No properties found for this location.
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 max-md:hidden">
                {properties.map((property, idx) => (
                  <Properties
                    key={`${property.id}-${idx}`}
                    property={property}
                    badgeType={
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (property as any).badgeType as BadgeType | undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {isDialogOpen("property-filters") && (
        <FilterDialog
          id="property-filters"
          onClose={() => closeDialog("property-filters")}
          onReset={() => {}}
          onApply={() => closeDialog("property-filters")}
        />
      )}
    </>
  );
}
