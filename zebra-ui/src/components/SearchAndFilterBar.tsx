"use client";

import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Autocomplete, Button, SelectDropdown } from "@/base-components";
import { PropertyCategory } from "@/common/enums";
import SearchFilterDialog from "@/dialogs/search-filters-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  setPropertyBhk,
  setPropertyCategory,
  setPropertyType,
  setTenantType,
} from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";

export const SearchAndFilterBar: React.FC = () => {
  // const searchParams = useSearchParams();
  // const lat = searchParams.get("lat");
  // const lon = searchParams.get("lon");
  // const propertyCategory = searchParams
  //   .get("propertyCategory")
  //   ?.toUpperCase() as PropertyCategory;
  const searchState = useSelector((state: RootState) => state.propertySearch);

  // Only fetch if lat/lon are present and valid
  // const shouldFetch = lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon));

  // Build query object from all URL params
  // const buildQueryParams = () => {
  //   const query: Record<
  //     string,
  //     string | number | boolean | string[] | PropertyCategory
  //   > = {
  //     latitude: Number(lat),
  //     longitude: Number(lon),
  //     propertyCategory: propertyCategory || PropertyCategory.RENT,
  //   };

  //   // Add optional filters from URL params
  //   const propertyType = searchParams.get("propertyType");
  //   const bhkType = searchParams.get("bhkType");
  //   const preferredTenant = searchParams.get("preferredTenant");
  //   const furnishing = searchParams.get("furnishing");
  //   const parking = searchParams.get("parking");
  //   const amenities = searchParams.get("amenities");

  //   if (propertyType) query.propertyType = propertyType;
  //   if (bhkType) query.bhkType = bhkType;
  //   if (preferredTenant) query.preferredTenant = preferredTenant;
  //   if (furnishing) query.furnishing = furnishing;
  //   if (parking) query.parking = parking === "true";
  //   if (amenities) query.amenities = amenities.split(",");

  //   return query;
  // };

  // const { data, isLoading, error } = useGetPropertiesByLocationQuery(
  //   shouldFetch
  //     ? buildQueryParams()
  //     : {
  //         latitude: 0,
  //         longitude: 0,
  //         propertyCategory: PropertyCategory.RENT,
  //       },
  //   { skip: !shouldFetch },
  // );

  // Memoize property list
  // const properties: PropertySearch[] = useMemo(() => {
  //   if (error) {
  //     return error as PropertySearch[];
  //   }
  //   if (!data || !Array.isArray(data)) return [];
  //   return data.map((property) => ({
  //     ...property,
  //     images: property.image ? [property.image] : [],
  //   })) as PropertySearch[];
  // }, [data, error]);

  const dispatch = useDispatch();

  const { openDialog, closeDialog, isDialogOpen } = useDialog();

  const handleSearch = () => {
    console.log("SearchAndFilterBar.tsx - handleSearch(): Searching...");
  };
  // const handleSearch = () => {
  //   // Build URL params from searchState (only supported filters)
  //   const params = new URLSearchParams();

  //   // Required params (lat, lon, propertyCategory)
  //   // if (lat) params.set("lat", lat);
  //   // if (lon) params.set("lon", lon);
  //   if (searchState.propertyCategory) {
  //     params.set(
  //       "propertyCategory",
  //       searchState.propertyCategory.toLowerCase(),
  //     );
  //   }

  //   // Optional filters (only add if not empty)
  //   if (searchState.propertyType && searchState.propertyType !== "") {
  //     params.set("propertyType", String(searchState.propertyType));
  //   }
  //   if (searchState.propertyBhk && searchState.propertyBhk !== "") {
  //     params.set("bhkType", String(searchState.propertyBhk));
  //   }
  //   if (searchState.tenantType && searchState.tenantType !== "") {
  //     params.set("preferredTenant", String(searchState.tenantType));
  //   }
  //   if (searchState.furnishing && searchState.furnishing !== "") {
  //     params.set("furnishing", searchState.furnishing);
  //   }
  //   if (searchState.parking !== undefined && searchState.parking !== "") {
  //     params.set("parking", String(searchState.parking));
  //   }
  //   if (searchState.amenities && searchState.amenities.length > 0) {
  //     // Join array with comma for API
  //     params.set("amenities", searchState.amenities.join(","));
  //   }

  //   // Navigate to new URL with all params
  //   // router.push(`/property-search?${params.toString()}`);
  // };

  return (
    <>
      {/* Mobile bar */}
      {/* <section
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
      </section> */}

      {/* Desktop bar */}
      <section className="flex w-full">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1">
            <Autocomplete
              name="location"
              selectedItems={["Bengaluru"]}
              items={[
                "The Godfather",
                "12 Angry Men",
                "The Shawshank Redemption",
                "Schindler's List",
                "Pulp Fiction",
                "Bengaluru",
              ]}
              disabled={true}
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
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      {isDialogOpen("property-filters") && (
        <SearchFilterDialog
          id="property-filters"
          onClose={() => {
            closeDialog("property-filters");
          }}
          onReset={() => {}}
          onApply={() => {
            closeDialog("property-filters");
            handleSearch();
          }}
        />
      )}
    </>
  );
};
