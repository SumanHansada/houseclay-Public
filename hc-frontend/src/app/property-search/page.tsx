"use client";

import { ChevronLeft, SearchIcon, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { Button, PlacesAutocomplete, SelectDropdown } from "@/base-components";
import { BadgeType, PropertyCategory } from "@/common/enums";
import { pascalCase } from "@/common/utils";
import Properties from "@/components/Properties";
import { SearchFiltersDialog } from "@/dialogs";
import { PropertySearch } from "@/interfaces/PropertySearch";
import { Footer } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetPropertiesByLocationQuery } from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import {
  setExclusiveFilter,
  setLocation,
  setPropertyBhk,
  setPropertyCategory,
  setPropertyType,
  setSortFields,
  setSortOrder,
  setTenantType,
} from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import {
  SORT_OPTIONS,
  SortToken,
  stateToToken,
  tokenToState,
} from "@/interfaces/PropertySearchSortFilter";

export default function PropertySearchPage() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const propertyCategory = searchParams
    .get("propertyCategory")
    ?.toUpperCase() as PropertyCategory;
  const searchState = useSelector((state: RootState) => state.propertySearch);
  const router = useRouter();

  const location = searchState.location;
  const locationSearch = location?.name || "";

  const { exclusive, sortFields, sortOrder } = useSelector(
    (s: RootState) => s.propertySearch,
  );

  const selectedSortToken = stateToToken({ exclusive, sortFields, sortOrder });

  const handleLocationSelect = (selectedLocation: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    city?: string;
  }) => {
    // Update URL with new location coordinates
    if (selectedLocation.city) {
      const selectedCity = selectedLocation.city.toLowerCase();
      const isCityAllowed = "bengaluru" === selectedCity;
      if (!isCityAllowed) {
        toast.error(`Please select a location within Bengaluru`, {
          duration: 5000,
        });
        dispatch(
          setLocation({
            ...location,
            name: "",
          }),
        );
        return;
      }
    }

    dispatch(setLocation(selectedLocation));

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("lat", selectedLocation.latitude.toString());
    newSearchParams.set("lon", selectedLocation.longitude.toString());

    // Navigate to the same page with updated coordinates
    router.push(`/property-search?${newSearchParams.toString()}`);
  };

  // Handle location input change
  const handleLocationChange = (value: string) => {
    // Update the location name in Redux state
    if (location) {
      dispatch(
        setLocation({
          ...location,
          name: value,
        }),
      );
    } else {
      dispatch(
        setLocation({
          name: value,
        }),
      );
    }
  };

  // Only fetch if lat/lon are present and valid
  const shouldFetch = lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon));

  // Build query object from all URL params
  const buildQueryParams = () => {
    const query: Record<
      string,
      string | number | boolean | string[] | PropertyCategory
    > = {
      latitude: Number(lat),
      longitude: Number(lon),
      propertyCategory: propertyCategory || PropertyCategory.RENT,
    };

    // Add optional filters from URL params
    const propertyType = searchParams.get("propertyType");
    const bhkType = searchParams.get("bhkType");
    const preferredTenant = searchParams.get("preferredTenant");
    const furnishing = searchParams.get("furnishing");
    const parking = searchParams.get("parking");
    const amenities = searchParams.get("amenities");
    const exclusive = searchParams.get("exclusive");
    const sortFields = searchParams.get("sortFields");
    const sortOrder = searchParams.get("sortOrder");

    if (propertyType) query.propertyType = propertyType;
    if (bhkType) query.bhkType = bhkType;
    if (preferredTenant) query.preferredTenant = preferredTenant;
    if (furnishing) query.furnishing = furnishing;
    if (parking) query.parking = parking === "true";
    if (amenities) query.amenities = amenities.split(",");
    if (exclusive) query.exclusive = exclusive === "true" || exclusive === "1";
    if (sortFields) query.sortFields = sortFields;
    if (sortOrder) query.sortOrder = sortOrder;

    return query;
  };

  const { data, isLoading, error } = useGetPropertiesByLocationQuery(
    shouldFetch
      ? buildQueryParams()
      : { latitude: 0, longitude: 0, propertyCategory: PropertyCategory.RENT },
    { skip: !shouldFetch },
  );

  // Memoize property list
  const properties: PropertySearch[] = useMemo(() => {
    if (error) {
      return error as PropertySearch[];
    }
    const properties = data as { items: PropertySearch[] };
    if (!properties || !Array.isArray(properties.items)) return [];
    return properties.items.map((property) => ({
      ...property,
      images: property.image ? [property.image] : [],
    })) as PropertySearch[];
  }, [data, error]);
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideStickyNavBar(false));
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [dispatch, isMobile]);

  const { openDialog, closeDialog, isDialogOpen } = useDialog();

  const onSortChange = (raw: string | number | boolean) => {
    const token = String(raw) as SortToken;
    const mapped = tokenToState[token];

    // 1) Update Redux
    dispatch(setExclusiveFilter(!!mapped.exclusive));
    dispatch(setSortFields(mapped.sortFields ?? ""));
    dispatch(setSortOrder(mapped.sortOrder ?? ""));

    // 2) Update URL (keeps lat/lon/category and triggers refetch)
    const next = new URLSearchParams(searchParams.toString());

    if (mapped.exclusive) {
      next.set("exclusive", "true");
      next.delete("sortFields");
      next.delete("sortOrder");
    } else {
      next.delete("exclusive");
      if (mapped.sortFields) next.set("sortFields", mapped.sortFields);
      else next.delete("sortFields");
      if (mapped.sortOrder) next.set("sortOrder", mapped.sortOrder);
      else next.delete("sortOrder");
    }

    router.replace(`/property-search?${next.toString()}`);
  };

  const handleSearch = () => {
    // Build URL params from searchState (only supported filters)
    const params = new URLSearchParams();

    // Required params (lat, lon, propertyCategory)
    if (lat) params.set("lat", lat);
    if (lon) params.set("lon", lon);
    if (searchState.propertyCategory) {
      params.set(
        "propertyCategory",
        searchState.propertyCategory.toLowerCase(),
      );
    }

    // Optional filters (only add if not empty)
    if (searchState.propertyType && searchState.propertyType !== "") {
      params.set("propertyType", String(searchState.propertyType));
    }
    if (searchState.propertyBhk && searchState.propertyBhk !== "") {
      params.set("bhkType", String(searchState.propertyBhk));
    }
    if (searchState.tenantType && searchState.tenantType !== "") {
      params.set("preferredTenant", String(searchState.tenantType));
    }
    if (searchState.furnishing && searchState.furnishing !== "") {
      params.set("furnishing", searchState.furnishing);
    }
    if (searchState.parking !== undefined && searchState.parking !== "") {
      params.set("parking", String(searchState.parking));
    }
    if (searchState.amenities && searchState.amenities.length > 0) {
      // Join array with comma for API
      params.set("amenities", searchState.amenities.join(","));
    }
    if (searchState.exclusive) {
      params.set("exclusive", String(searchState.exclusive));
    }
    if (searchState.sortFields && searchState.sortFields !== "") {
      params.set("sortFields", String(searchState.sortFields));
    }
    if (searchState.sortOrder && searchState.sortOrder !== "") {
      params.set("sortOrder", String(searchState.sortOrder));
    }

    // Navigate to new URL with all params
    router.push(`/property-search?${params.toString()}`);
  };

  const handleCardClick = (e: React.MouseEvent, property: PropertySearch) => {
    e.stopPropagation();
    router.push(`/property-details/${property.propertyID}`);
  };

  return (
    <>
      <section
        className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-center items-center w-full md:hidden`}
      >
        <button className="rounded-full md:border-none items-center justify-center">
          <ChevronLeft onClick={() => router.back()} size={25} />
        </button>
        <div className="flex items-center h-10 bg-gray-100 w-full px-3 py-2 border-none rounded-full">
          <PlacesAutocomplete
            id="location-search-mobile"
            name="location"
            value={locationSearch}
            onChange={handleLocationChange}
            onLocationSelect={handleLocationSelect}
            placeholder="Search for a property"
            containerClassName="w-full relative"
            inputClassName=""
          />
          <button className="p-2">
            <SearchIcon size={20} />
          </button>
        </div>

        <Button
          leftIcon={<SlidersHorizontal size={16} />}
          variant="outline"
          size="sm"
          className="h-10 text-black text-sm bg-gray-100 rounded-full p-2 border-none"
          onClick={() => openDialog("property-filters-dialog")}
          buttonTextClassName="hidden"
        >
          Filters
        </Button>
      </section>
      <section className="fixed z-50 flex w-full xl:gap-16 border-b bg-white border-gray-200 lg:gap-8 md:gap-0 gap-0  xl:px-24 md:px-12 px-12 max-md:pt-4 max-md:pb-8 h-16 max-md:hidden">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1">
            <PlacesAutocomplete
              id="location-search-desktop"
              name="location"
              value={locationSearch}
              onChange={handleLocationChange}
              onLocationSelect={handleLocationSelect}
              placeholder="Search for a property"
              inputClassName="flex items-center min-h-[46px] w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
              containerClassName="w-full relative"
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
            <SelectDropdown
              options={SORT_OPTIONS}
              name="sort"
              id="sort"
              value={selectedSortToken ?? ""}
              placeholder="Sort"
              onChange={onSortChange}
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-32"
            />
            <Button
              leftIcon={<SlidersHorizontal size={16} />}
              variant="outline"
              size="md"
              className="min-h-[46px] text-black rounded-xl border text-sm"
              onClick={() => openDialog("property-filters-dialog")}
              buttonTextClassName="lg:block md:hidden"
            >
              Filters
            </Button>
            {/* <Button
              leftIcon={<SearchIcon size={16} />}
              variant="primary"
              size="md"
              className="min-h-[46px] rounded-xl text-sm"
              buttonTextClassName="lg:block md:hidden"
              onClick={handleSearch}
            >
              Search
            </Button> */}
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
                No properties found.
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
                    onClick={(e: React.MouseEvent) =>
                      handleCardClick(e, property)
                    }
                    showCarouselDots={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
      {isDialogOpen("property-filters-dialog") && (
        <SearchFiltersDialog
          id="property-filters-dialog"
          onClose={() => {
            closeDialog("property-filters-dialog");
            dispatch(setHideStickyNavBar(false));
          }}
          onReset={() => {}}
          onApply={() => {
            closeDialog("property-filters-dialog");
            dispatch(setHideStickyNavBar(false));
            handleSearch();
          }}
        />
      )}
    </>
  );
}
