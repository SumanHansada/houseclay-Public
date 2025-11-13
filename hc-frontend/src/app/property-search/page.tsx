"use client";

import {
  ArrowDownWideNarrow,
  ChevronLeft,
  SearchIcon,
  SlidersHorizontal,
} from "lucide-react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  MultiSelectDropdown,
  PlacesAutocomplete,
  SelectDropdown,
} from "@/base-components";
import { BadgeType, PropertyCategory } from "@/common/enums";
import Properties from "@/components/Properties";
import { SearchFiltersDialog, SortFiltersDialog } from "@/dialogs";
import { PropertySearch } from "@/interfaces/PropertySearch";
import {
  SORT_OPTIONS,
  SortToken,
  stateToToken,
  tokenToState,
} from "@/interfaces/PropertySearchSortFilter";
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
  setAvailability,
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
import { ImageWithLoader } from "@/utility-components";

// normalize & validate category from URL
function getUrlCategory(sp: ReadonlyURLSearchParams): PropertyCategory {
  const raw = (sp.get("propertyCategory") || "").toUpperCase();
  const values = Object.values(PropertyCategory) as string[];
  return values.includes(raw)
    ? (raw as PropertyCategory)
    : PropertyCategory.RENT;
}

const PROPERTY_FILTERS_DIALOG_ID = "property-filters-dialog";
const SORT_FILTERS_DIALOG_ID = "sort-filters-dialog";

export default function PropertySearchPage() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const propertyCategory = searchParams
    .get("propertyCategory")
    ?.toUpperCase() as PropertyCategory;

  const urlCategory = getUrlCategory(searchParams);
  const searchState = useSelector((state: RootState) => state.propertySearch);
  const router = useRouter();
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const location = searchState.location;
  const locationSearch = location?.name || "";

  const { exclusive, sortFields, sortOrder } = useSelector(
    (s: RootState) => s.propertySearch,
  );

  const selectedSortToken = stateToToken({ exclusive, sortFields, sortOrder });

  // Hydrate category from URL on first load / URL change
  // useEffect(() => {
  //   if (urlCategory !== searchState.propertyCategory) {
  //     dispatch(setPropertyCategory(urlCategory));
  //   }
  // }, [dispatch, urlCategory, searchState.propertyCategory]);

  // Parse BHK selections from comma-separated Redux string
  const bhkSelectedValues = useMemo<string[]>(
    () =>
      searchState.propertyBhk ? String(searchState.propertyBhk).split(",") : [],
    [searchState.propertyBhk],
  );

  // small helper: mutate & replace URL
  const replaceQuery = (mutate: (q: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams.toString());
    mutate(next);
    router.replace(`/property-search?${next.toString()}`);
  };

  // QUICK FILTER handlers (all auto-search via URL updates)
  const onCategoryChange = (raw: string | number | boolean) => {
    const cat = String(raw).toUpperCase() as PropertyCategory;
    dispatch(setPropertyCategory(cat));

    // when switching category, drop irrelevant filter from URL/state
    replaceQuery((q) => {
      q.set("propertyCategory", cat.toLowerCase());
      if (cat === PropertyCategory.RENT) {
        q.delete("preferredTenant");
        dispatch(setTenantType(""));
      } else if (cat === PropertyCategory.FLATMATE) {
        q.delete("bhkType");
        dispatch(setPropertyBhk(""));
      }
    });
  };

  const onTypeChange = (raw: string | number | boolean) => {
    const val = String(raw);
    dispatch(setPropertyType(val));
    replaceQuery((q) => {
      if (val) {
        q.set("propertyType", val);
      } else {
        q.delete("propertyType");
      }
    });
  };

  // New multi-select handler (keeps Redux as comma-separated string; updates URL)
  const onBhkMultiChange = (vals: (string | number | boolean)[]) => {
    const asStr = vals.map(String);
    dispatch(setPropertyBhk(asStr.join(",")));
    replaceQuery((q) => {
      if (asStr.length) {
        q.set("bhkType", asStr.join(","));
      } else {
        q.delete("bhkType");
      }
    });
  };

  const onPreferredTenantChange = (raw: string | number | boolean) => {
    const val = String(raw);
    dispatch(setTenantType(val));
    replaceQuery((q) => {
      if (val) {
        q.set("preferredTenant", val);
      } else {
        q.delete("preferredTenant");
      }
    });
  };

  const onAvailabilityChange = (raw: string | number | boolean) => {
    const val = String(raw);
    dispatch(setAvailability(val));
    replaceQuery((q) => {
      // treat "Any" as no constraint => drop param
      if (val && val !== "Any") {
        q.set("availability", val);
      } else {
        q.delete("availability");
      }
    });
  };

  const onSortChange = (raw: string | number | boolean) => {
    const token = String(raw) as SortToken;

    // Explicit clear path for "None"
    if (token === "NONE") {
      dispatch(setExclusiveFilter(false));
      dispatch(setSortFields(""));
      dispatch(setSortOrder(""));
      replaceQuery((next) => {
        next.delete("exclusive");
        next.delete("sortFields");
        next.delete("sortOrder");
      });
      return;
    }

    const mapped = tokenToState[token];

    // Update Redux
    dispatch(setExclusiveFilter(!!mapped.exclusive));
    dispatch(setSortFields(mapped.sortFields ?? ""));
    dispatch(setSortOrder(mapped.sortOrder ?? ""));

    // Update URL (keeps lat/lon/category and triggers refetch)
    replaceQuery((next) => {
      if (mapped.exclusive) {
        next.set("exclusive", "true");
        next.delete("sortFields");
        next.delete("sortOrder");
      } else {
        next.delete("exclusive");

        if (mapped.sortFields) {
          next.set("sortFields", mapped.sortFields);
        } else {
          next.delete("sortFields");
        }
        if (mapped.sortOrder) {
          next.set("sortOrder", mapped.sortOrder);
        } else {
          next.delete("sortOrder");
        }
      }
    });
  };

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
    const availability = searchParams.get("availability");
    const furnishing = searchParams.get("furnishing");
    const parking = searchParams.get("parking");
    const amenities = searchParams.get("amenities");
    const exclusive = searchParams.get("exclusive");
    const sortFields = searchParams.get("sortFields");
    const sortOrder = searchParams.get("sortOrder");

    if (propertyType) query.propertyType = propertyType;
    if (bhkType) query.bhkType = bhkType;
    if (preferredTenant) query.preferredTenant = preferredTenant;
    if (availability && availability !== "Any")
      query.availability = availability;
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
    {
      skip: !shouldFetch,
      refetchOnMountOrArgChange: true,
    },
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
      images: property.images.length ? property.images : [],
    })) as PropertySearch[];
  }, [data, error]);

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
    if (searchState.availability && searchState.availability !== "Any") {
      params.set("availability", searchState.availability);
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
      {/* Mobile */}
      <section
        className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex gap-2 justify-center items-center w-full md:hidden`}
      >
        <button className="rounded-full md:border-none items-center justify-center">
          <ChevronLeft onClick={() => router.back()} size={25} />
        </button>
        <div className="flex items-center h-10 bg-gray-100 w-full pl-3 pr-1 py-1 border-none rounded-full">
          <PlacesAutocomplete
            id="location-search-mobile"
            name="location"
            value={locationSearch}
            onChange={handleLocationChange}
            onLocationSelect={handleLocationSelect}
            placeholder="Search for a property"
            containerClassName="w-full relative"
            inputClassName="h-10 bg-gray-100 w-full border-none outline-none"
          />
          <button className="p-2 rounded-full" onClick={handleSearch}>
            <SearchIcon size={20} />
          </button>
        </div>

        <Button
          leftIcon={<SlidersHorizontal size={16} />}
          variant="outline"
          size="sm"
          className="h-10 text-black text-sm bg-gray-100 rounded-full p-2 border-none"
          onClick={() => openDialog(PROPERTY_FILTERS_DIALOG_ID)}
          buttonTextClassName="hidden"
        >
          Filters
        </Button>

        <Button
          leftIcon={<ArrowDownWideNarrow size={20} />}
          variant="outline"
          size="sm"
          className="h-10 text-black text-sm bg-gray-100 rounded-full p-1 border-none"
          onClick={() => openDialog(SORT_FILTERS_DIALOG_ID)}
          buttonTextClassName="hidden"
        >
          Sort
        </Button>
      </section>

      {/* Desktop */}
      <section className="fixed z-50 flex w-full xl:gap-16 border-b bg-white border-gray-200 lg:gap-8 md:gap-0 gap-0  xl:px-24 md:px-12 px-12 max-md:pt-4 max-md:pb-8 h-16 max-md:hidden">
        <div className="flex justify-between items-center border-gray-200 w-full gap-4">
          <div className="flex-1 flex items-center min-h-[46px] w-full p-1 border border-gray-300 rounded-xl bg-white">
            <PlacesAutocomplete
              id="location-search-desktop"
              name="location"
              value={locationSearch}
              onChange={handleLocationChange}
              onLocationSelect={handleLocationSelect}
              placeholder="Search for a property"
              inputClassName="w-full outline-none px-3"
              containerClassName="w-full relative"
            />
            <button
              className="p-2 rounded-full bg-gray-100"
              onClick={handleSearch}
            >
              <SearchIcon size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-row">
            {/* Category */}
            <SelectDropdown
              options={[
                {
                  value: PropertyCategory.RENT,
                  label: "Rent",
                },
                {
                  value: PropertyCategory.FLATMATE,
                  label: "Rooms",
                },
                // {
                //   value: PropertyCategory.RESALE,
                //   label: "Buy",
                // },
              ]}
              name="property-category"
              id="property-category"
              value={searchState.propertyCategory}
              onChange={onCategoryChange}
              size="sm"
              dropdownWidth="auto"
              containerClassName="relative w-20"
              buttonClassName="flex justify-between items-center w-full p-3 border rounded-xl text-left border-red-500 text-red-500 hover:border-red-500 hover:text-red-500"
              displayTextClassName="text-red-500"
            />

            {/* Property Type (common) */}
            <SelectDropdown
              options={[
                { value: "Apartment", label: "Apartment" },
                { value: "Independent House/Villa", label: "House" },
                { value: "Community Villa", label: "Villa" },
                { value: "Standalone Building", label: "Building" },
              ]}
              name="property-type"
              id="property-type"
              value={searchState.propertyType}
              placeholder="Property type"
              onChange={onTypeChange}
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-36 max-xl:hidden"
            />

            {/* Rent: BHK | Flatmate: Preferred Tenant */}
            {searchState.propertyCategory === PropertyCategory.RENT ? (
              <MultiSelectDropdown
                options={[
                  { value: "1BHK", label: "1 BHK" },
                  { value: "2BHK", label: "2 BHK" },
                  { value: "3BHK", label: "3 BHK" },
                  { value: "4BHK", label: "4 BHK" },
                  { value: "5+BHK", label: "5+ BHK" },
                ]}
                name="property-bhk"
                id="property-bhk"
                value={bhkSelectedValues}
                placeholder="Beds"
                onChange={onBhkMultiChange}
                size="sm"
                dropdownWidth="full"
                displayMode="first+count"
                showSelectAll
                containerClassName="relative w-28 max-xl:hidden"
              />
            ) : (
              <SelectDropdown
                options={[
                  { value: "Female", label: "Female" },
                  { value: "Male", label: "Male" },
                ]}
                name="preferred-tenant"
                id="preferred-tenant"
                value={searchState.tenantType}
                placeholder="Preferred tenant"
                onChange={onPreferredTenantChange}
                size="sm"
                dropdownWidth="full"
                containerClassName="relative w-40 max-xl:hidden"
              />
            )}

            {/* Availability (common) */}
            <SelectDropdown
              options={[
                { label: "Any", value: "Any" },
                { label: "Immediate", value: "Immediate" },
                { label: "Within 15 Days", value: "Within 15 Days" },
                { label: "Within 30 Days", value: "Within 30 Days" },
                { label: "After 45 Days", value: "After 45 Days" },
              ]}
              name="availability"
              id="availability"
              value={searchState.availability}
              placeholder="Availability"
              onChange={onAvailabilityChange}
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-36 max-xl:hidden"
            />

            {/* Sort */}
            <SelectDropdown
              options={SORT_OPTIONS}
              name="sort"
              id="sort"
              value={selectedSortToken ?? ""}
              placeholder="Sort"
              onChange={onSortChange}
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-52"
            />
            <Button
              leftIcon={<SlidersHorizontal size={16} />}
              variant="outline"
              size="md"
              className="min-h-[46px] text-black rounded-xl border text-sm"
              onClick={() => openDialog(PROPERTY_FILTERS_DIALOG_ID)}
              buttonTextClassName="hidden lg:block"
            >
              Filters
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
                  {properties.length}{" "}
                  {searchState.propertyCategory === PropertyCategory.FLATMATE
                    ? "Single Occupancy Rooms for Rent"
                    : searchState.propertyCategory === PropertyCategory.RENT
                      ? "Properties for Rent"
                      : "Properties for Sale"}
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
              <div className="flex flex-col items-center justify-center w-11/12 md:w-2/3 lg:w-1/2 mx-auto gap-3">
                <div className="relative w-11/12 md:w-3/4 lg:w-2/3 aspect-[295/230]">
                  <ImageWithLoader
                    src="/optimizedIcons/large/no-results-found.svg"
                    alt="no results found"
                    fill
                  />
                </div>
                <div className="text-center md:px-4">
                  <h1 className="text-xl md:text-2xl font-semibold">
                    No Results Found
                  </h1>
                  {/* Commented my-requirements code for now */}
                  {/* <p className="md:text-lg text-balance text-gray-600">
                    Don&apos;t worry, we can still get you the dream house fill
                    up the requirements below and we will get back to you.
                  </p> */}
                </div>
                {/* <Link
                  href="/manage-account/my-requirements"
                  className="px-6 py-2 rounded-md border border-red-500 md:text-lg hover:bg-red-50"
                >
                  Fill Requirements
                </Link> */}
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
      {isDialogOpen(PROPERTY_FILTERS_DIALOG_ID) && (
        <SearchFiltersDialog
          id={PROPERTY_FILTERS_DIALOG_ID}
          onClose={() => {
            closeDialog(PROPERTY_FILTERS_DIALOG_ID);
            dispatch(setHideStickyNavBar(false));
          }}
          onReset={() => {}}
          onApply={() => {
            closeDialog(PROPERTY_FILTERS_DIALOG_ID);
            dispatch(setHideStickyNavBar(false));
            handleSearch();
          }}
        />
      )}

      {isDialogOpen(SORT_FILTERS_DIALOG_ID) && isMobile && (
        <SortFiltersDialog
          id={SORT_FILTERS_DIALOG_ID}
          options={SORT_OPTIONS as { value: SortToken; label: string }[]}
          selectedToken={selectedSortToken ?? ""}
          onSelect={(token) => onSortChange(token)}
          onClose={() => {
            closeDialog(SORT_FILTERS_DIALOG_ID);
            dispatch(setHideStickyNavBar(false));
          }}
        />
      )}
    </>
  );
}
