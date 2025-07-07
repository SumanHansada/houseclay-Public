"use client";

import { ChevronLeft, SearchIcon, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BadgeType, PropertyCategory } from "@/common/enums";
import { pascalCase } from "@/common/utils";
import Autocomplete from "@/components/common/Autocomplete";
import Button from "@/components/common/Button";
import SelectDropdown from "@/components/common/SelectDropdown";
import Footer from "@/components/Footer";
import Properties from "@/components/Properties";
import SearchFilterDialog from "@/dialogs/search-filters";
import { PropertySearch } from "@/interfaces/PropertySearch";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetPropertiesByLocationQuery } from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import {
  setPropertyBhk,
  setPropertyCategory,
  setPropertyType,
  setTenantType,
} from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";

export default function PropertySearchPage() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const propertyCategory = searchParams
    .get("propertyCategory")
    ?.toUpperCase() as PropertyCategory;
  const searchState = useSelector((state: RootState) => state.propertySearch);
  const router = useRouter();

  // Only fetch if lat/lon are present and valid
  const shouldFetch = lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon));
  const { data, isLoading, error } = useGetPropertiesByLocationQuery(
    shouldFetch
      ? {
          latitude: Number(lat),
          longitude: Number(lon),
          propertyCategory: propertyCategory || PropertyCategory.RENT,
        }
      : { latitude: 0, longitude: 0, propertyCategory: PropertyCategory.RENT },
    { skip: !shouldFetch },
  );

  // Memoize property list
  const properties: PropertySearch[] = useMemo(() => {
    if (error) {
      return error as PropertySearch[];
    }
    if (!data || !Array.isArray(data)) return [];
    return data.map((property) => ({
      ...property,
      images: property.image ? [property.image] : [],
    })) as PropertySearch[];
  }, [data, error]);
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [dispatch, isMobile]);

  const { openDialog, closeDialog, isDialogOpen } = useDialog();

  return (
    <>
      <section
        className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-center items-center w-full md:hidden`}
      >
        <button className="rounded-full md:border-none items-center justify-center">
          <ChevronLeft onClick={() => router.back()} size={25} />
        </button>
        <Autocomplete
          items={[
            "The Godfather",
            "12 Angry Men",
            "The Shawshank Redemption",
            "Schindler's List",
            "Pulp Fiction",
          ]}
          inputClassName="flex items-center h-10 bg-gray-100 w-full p-2 border-none rounded-full"
          placeholder="Search for a property"
        />
        <Button
          leftIcon={<SlidersHorizontal size={16} />}
          variant="outline"
          size="sm"
          className="h-10 text-black text-sm bg-gray-100 rounded-full p-2 border-none"
          onClick={() => openDialog("property-filters")}
          buttonTextClassName="hidden"
        >
          Filters
        </Button>
      </section>
      <section className="fixed z-50 flex w-full xl:gap-16 border-b border-t bg-white border-gray-200 lg:gap-8 md:gap-0 gap-0  xl:px-24 md:px-12 px-12 max-md:pt-4 max-md:pb-8 h-16 max-md:hidden">
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
                  value: PropertyCategory.FLATMATE,
                  label: "Flatmate",
                },
                {
                  value: PropertyCategory.RENT,
                  label: "Rent",
                },
                {
                  value: PropertyCategory.RESALE,
                  label: "Buy",
                },
              ]}
              name="property-category"
              id="property-category"
              value={searchState.propertyCategory}
              onChange={(value: string | number | boolean) =>
                dispatch(setPropertyCategory(value as PropertyCategory))
              }
              size="sm"
              dropdownWidth="auto"
              containerClassName="relative w-20"
              buttonClassName="flex justify-between items-center w-full p-3 border rounded-xl text-left border-red-500 text-red-500 hover:border-red-500 hover:text-red-500"
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
              value={searchState.propertyType}
              placeholder="Property type"
              onChange={(value: string | number | boolean) =>
                dispatch(setPropertyType(value))
              }
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-36 md:w-36 xl:w-40 md:hidden lg:block"
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
              value={searchState.propertyBhk}
              placeholder="Beds"
              onChange={(value: string | number | boolean) =>
                dispatch(setPropertyBhk(value))
              }
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-28 md:w-24 lg:w-28"
            />
            <SelectDropdown
              options={[
                { value: "Couple", label: "Couple" },
                { value: "Family", label: "Family" },
                { value: "Bachelor", label: "Bachelor" },
                { value: "Company", label: "Company" },
              ]}
              name="tenant-type"
              id="tenant-type"
              value={searchState.tenantType}
              placeholder="Tenant type"
              onChange={(value: string | number | boolean) =>
                dispatch(setTenantType(value))
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
              buttonTextClassName="lg:block md:hidden"
            >
              Filters
            </Button>
            <Button
              leftIcon={<SearchIcon size={16} />}
              variant="primary"
              size="md"
              className="min-h-[46px] rounded-xl text-sm"
              buttonTextClassName="lg:block md:hidden"
            >
              Search
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full md:pt-[64px] bg-gray-50 relative max-md:pb-12">
        <div className="min-h-screen bg-gray-50 pb-10 xl:px-24 md:px-12 px-6">
          {/* Header Bar */}
          <div className="">
            <div className="flex flex-col gap-4 py-6">
              {/* Filter/Search Bar */}

              <div>
                <p className="text-gray-500 text-sm">
                  {properties.length} Rooms for{" "}
                  {pascalCase(propertyCategory || "")}
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
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
                {properties.map((property, idx) => (
                  <Properties
                    key={`${property.propertyID}-${idx}`}
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
      <Footer />
      {isDialogOpen("property-filters") && (
        <SearchFilterDialog
          id="property-filters"
          onClose={() => {
            closeDialog("property-filters");
            dispatch(setHideStickyNavBar(false));
          }}
          onReset={() => {}}
          onApply={() => {
            closeDialog("property-filters");
            dispatch(setHideStickyNavBar(false));
          }}
        />
      )}
    </>
  );
}
