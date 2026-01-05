"use client";

import {
  ArrowDownWideNarrow,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  MultiSelectDropdown,
  PlacesAutocomplete,
  SelectDropdown,
} from "@/base-components";
import { noResultsFoundIconURL } from "@/common/cdnURLs";
import { CITY_LAT_LNG_MAPPING, EXPLORE_LOCATION } from "@/common/constants";
import {
  BHK_TYPE_OPTIONS,
  PROPERTY_AVAILABILITY,
  PROPERTY_TYPE_SHORT_OPTIONS,
  TENANT_TYPE_OPTIONS,
} from "@/common/dataConstants/options";
import { BadgeType, PropertyCategory } from "@/common/enums";
import FullScreenLoader from "@/components/FullScreenLoader";
import Properties from "@/components/Properties";
import { SearchFiltersDialog, SortFiltersDialog } from "@/dialogs";
import { PropertySearch } from "@/interfaces/PropertySearch";
import {
  SORT_OPTIONS,
  SortToken,
  stateToToken,
  tokenToState,
} from "@/interfaces/PropertySearchSortFilter";
import { Footer, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetPropertiesByLocationQuery } from "@/store/apiSlice";
import {
  resetPropertySearchFilters,
  setAvailability,
  setBhkType,
  setConfirmedLocationName,
  setExclusiveFilter,
  setLocation,
  setPropertyCategory,
  setPropertyType,
  setSortFields,
  setSortOrder,
  setTenantType,
} from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { ImageWithLoader } from "@/utility-components";
import { BENGALURU_BOUNDS, isWithinBounds } from "@/utils/geoBounds";

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

interface PropertySearchClientProps {
  initialData?: {
    items: PropertySearch[];
    hasNext: boolean;
    page: number;
    totalElements: number;
  };
}

// Memoized component for properties list to prevent re-renders when typing
interface PropertiesListProps {
  properties: PropertySearch[];
  isLoading: boolean;
  isFetching: boolean;
  effectiveData?: {
    hasNext: boolean;
  };
  onLoadMore: () => void;
  page: number;
  initialData?: PropertySearchClientProps["initialData"];
}

const PropertiesList = memo(function PropertiesList({
  properties,
  isLoading,
  isFetching,
  effectiveData,
  onLoadMore,
  page,
  initialData,
}: PropertiesListProps) {
  if (isLoading && page === 0 && !initialData) {
    return <FullScreenLoader />;
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-11/12 gap-3 mx-auto md:w-2/3 lg:w-1/2">
        <div className="relative w-11/12 md:w-3/4 lg:w-2/3 aspect-[295/230]">
          <ImageWithLoader
            src={noResultsFoundIconURL}
            alt="No Results Found"
            fill
          />
        </div>
        <div className="text-center md:px-4">
          <h1 className="text-xl font-semibold md:text-2xl">
            No Results Found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {properties.map((property, idx) => (
          <Link
            key={`${property.propertyID}-${idx}`}
            href={`/property-details/${property.propertyID}`}
            prefetch={false}
            className="block"
          >
            <Properties
              property={property}
              badgeType={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (property as any).badgeType as BadgeType | undefined
              }
              showCarouselDots={false}
            />
          </Link>
        ))}
      </div>

      {effectiveData?.hasNext && (
        <div className="flex justify-center w-full mt-10 mb-6">
          <Button
            variant="primary"
            onClick={onLoadMore}
            isLoading={isFetching}
            className="px-6 py-3 min-w-40 rounded-xl"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
});

export function PropertySearchClient({
  initialData,
}: PropertySearchClientProps) {
  const searchParams = useSearchParams();
  let lat = searchParams.get("lat");
  let lon = searchParams.get("lon");
  const city = searchParams.get("city");
  if (!lat && !lon) {
    const cityCoords =
      EXPLORE_LOCATION ||
      CITY_LAT_LNG_MAPPING[city as keyof typeof CITY_LAT_LNG_MAPPING];
    lat = cityCoords.lat.toString();
    lon = cityCoords.lng.toString();
  }
  const urlPropertyCategory = searchParams
    .get("propertyCategory")
    ?.toUpperCase() as PropertyCategory;

  const searchState = useSelector((state: RootState) => state.propertySearch);
  const router = useRouter();
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const urlCategory = getUrlCategory(searchParams);
  const [page, setPage] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { openDialog, closeDialog, isDialogOpen } = useDialog();

  const location = searchState.location;
  const locationSearch = location?.name || "";

  const { exclusive, sortFields, sortOrder } = useSelector(
    (s: RootState) => s.propertySearch,
  );

  const selectedSortToken = stateToToken({ exclusive, sortFields, sortOrder });

  // Hydrate category from URL on first load / URL change
  useEffect(() => {
    if (urlCategory !== searchState.propertyCategory) {
      dispatch(setPropertyCategory(urlCategory));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, urlCategory]);

  // Whenever the URL search params change, we want to start fresh.
  useEffect(() => {
    setPage(0);
  }, [searchParams]);

  // Parse BHK selections from comma-separated Redux string
  const bhkSelectedValues = useMemo<string[]>(
    () => (searchState.bhkType ? String(searchState.bhkType).split(",") : []),
    [searchState.bhkType],
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
    dispatch(resetPropertySearchFilters());

    // when switching category, drop irrelevant filter from URL/state
    replaceQuery((q) => {
      q.set("propertyCategory", cat.toLowerCase());
      if (cat === PropertyCategory.RENT) {
        q.delete("tenantType");
        dispatch(setTenantType(""));
      } else if (cat === PropertyCategory.FLATMATE) {
        q.delete("bhkType");
        dispatch(setBhkType(""));
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
    dispatch(setBhkType(asStr.join(",")));
    replaceQuery((q) => {
      if (asStr.length) {
        q.set("bhkType", asStr.join(","));
      } else {
        q.delete("bhkType");
      }
    });
  };

  const onTenantTypeChange = (raw: string | number | boolean) => {
    const val = String(raw);
    dispatch(setTenantType(val));
    replaceQuery((q) => {
      if (val && val !== "") {
        q.set("tenantType", val);
      } else {
        q.delete("tenantType");
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
      if (
        !isWithinBounds(
          selectedLocation.latitude,
          selectedLocation.longitude,
          BENGALURU_BOUNDS,
        )
      ) {
        toast.error(`Please select a location within Bengaluru`, {
          duration: 5000,
        });
        dispatch(
          setLocation({
            ...location,
            name: "",
          }),
        );
        dispatch(setConfirmedLocationName(""));
        return;
      }
    }

    dispatch(setLocation(selectedLocation));
    dispatch(setConfirmedLocationName(selectedLocation.name || ""));

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("lat", selectedLocation.latitude.toString());
    newSearchParams.set("lon", selectedLocation.longitude.toString());

    // Navigate to the same page with updated coordinates
    router.push(`/property-search?${newSearchParams.toString()}`);
  };

  // Handle location input change
  const handleLocationChange = (value: string) => {
    if (!value || value.trim() === "") {
      dispatch(setConfirmedLocationName(""));
    }

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

  // Handle clear location
  const handleClear = () => {
    handleLocationChange("");
    dispatch(setLocation(null));
    dispatch(setConfirmedLocationName(""));
  };

  // Handle button click - either clear or search
  const handleButtonClick = () => {
    if (isInputFocused && location?.name) {
      handleClear();
    } else {
      handleSearch();
    }
  };

  // Prevent blur when clicking clear button
  const handleClearButtonMouseDown = (e: React.MouseEvent) => {
    if (isInputFocused && location?.name) {
      e.preventDefault();
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
      propertyCategory: urlPropertyCategory || PropertyCategory.RENT,
      page: page,
    };

    // Add optional filters from URL params
    const minPriceStr = searchParams.get("minPrice");
    const maxPriceStr = searchParams.get("maxPrice");
    const propertyType = searchParams.get("propertyType");
    const bhkType = searchParams.get("bhkType");
    const tenantType = searchParams.get("tenantType");
    const preferredTenants = searchParams.get("preferredTenants");
    const nonVegAllowedStr = searchParams.get("nonVegAllowed");
    const roomType = searchParams.get("roomType");
    const bathroomType = searchParams.get("bathroomType");
    const balconyType = searchParams.get("balconyType");
    const availability = searchParams.get("availability");
    const furnishing = searchParams.get("furnishing");
    const parking = searchParams.get("parking");
    const amenities = searchParams.get("amenities");
    const exclusive = searchParams.get("exclusive");
    const sortFields = searchParams.get("sortFields");
    const sortOrder = searchParams.get("sortOrder");

    // Tamper protection: Validate minPrice and maxPrice from URL
    if (minPriceStr !== null && maxPriceStr !== null) {
      const minNum = Number(minPriceStr);
      const maxNum = Number(maxPriceStr);
      if (!isNaN(minNum) && !isNaN(maxNum)) {
        // Bounds
        const clampedMin = Math.max(0, minNum);
        const clampedMax = Math.min(1000000, maxNum);

        if (clampedMin <= clampedMax) {
          query.minPrice = clampedMin;
          query.maxPrice = clampedMax;
        }
      }
    }

    if (nonVegAllowedStr !== null) {
      if (nonVegAllowedStr === "true" || nonVegAllowedStr === "1") {
        query.nonVegAllowed = true;
      } else if (nonVegAllowedStr === "false" || nonVegAllowedStr === "0") {
        query.nonVegAllowed = false;
      }
    }
    if (propertyType) query.propertyType = propertyType;
    if (bhkType) query.bhkType = bhkType;
    if (tenantType) query.tenantType = tenantType;
    if (preferredTenants) query.preferredTenants = preferredTenants;
    if (roomType) query.roomType = roomType;
    if (bathroomType) query.bathroomType = bathroomType;
    if (balconyType) query.balconyType = balconyType;
    if (availability && availability !== "Any")
      query.availability = availability;
    if (furnishing) query.furnishing = furnishing;
    if (parking) query.parking = parking;
    if (amenities) query.amenities = amenities.split(",");
    if (exclusive) query.exclusive = exclusive === "true" || exclusive === "1";
    if (sortFields) query.sortFields = sortFields;
    if (sortOrder) query.sortOrder = sortOrder;

    return query;
  };

  // Use RTK Query for subsequent fetches (pagination, filter changes)
  // But use initialData for first render if available
  const { data, isLoading, isFetching, error } =
    useGetPropertiesByLocationQuery(
      shouldFetch
        ? buildQueryParams()
        : {
            latitude: 0,
            longitude: 0,
            propertyCategory: PropertyCategory.RENT,
          },
      {
        skip: !shouldFetch,
      },
    );

  // Use initial data if available and we're on page 0, otherwise use RTK Query data
  const effectiveData = useMemo(() => {
    if (page === 0 && initialData) {
      return initialData;
    }
    return data;
  }, [page, initialData, data]);

  // Helper to load next page
  const handleLoadMore = () => {
    if (!effectiveData?.hasNext) return;
    setPage((prev) => prev + 1);
  };

  // Memoize property list
  const properties: PropertySearch[] = useMemo(() => {
    if (error) {
      return error as PropertySearch[];
    }
    const properties = effectiveData as { items: PropertySearch[] };
    if (!properties || !Array.isArray(properties.items)) return [];
    return properties.items.map((property) => ({
      ...property,
      images: property.images.length ? property.images : [],
    })) as PropertySearch[];
  }, [effectiveData, error]);

  const handleSearch = (dialogSelectedCategory?: PropertyCategory) => {
    // Build URL params from searchState (only supported filters)
    const params = new URLSearchParams();

    // Required params (lat, lon, propertyCategory)
    if (lat) params.set("lat", lat);
    if (lon) params.set("lon", lon);

    const effectiveCategory =
      dialogSelectedCategory ?? searchState.propertyCategory;
    if (effectiveCategory) {
      params.set("propertyCategory", effectiveCategory.toLowerCase());
    }

    // Optional filters (only add if not empty)
    let targetMin: number | null = null;
    let targetMax: number | null = null;

    if (searchState.propertyCategory === PropertyCategory.FLATMATE) {
      if (searchState.priceRangeForFlatmate) {
        [targetMin, targetMax] = searchState.priceRangeForFlatmate;
      }
    } else {
      if (searchState.priceRangeForRent) {
        [targetMin, targetMax] = searchState.priceRangeForRent;
      }
    }

    // Only append to URL if we found valid numbers
    if (targetMin !== null && targetMax !== null) {
      params.set("minPrice", String(targetMin));
      params.set("maxPrice", String(targetMax));
    }
    if (searchState.propertyType && searchState.propertyType !== "") {
      params.set("propertyType", String(searchState.propertyType));
    }
    if (searchState.bhkType && searchState.bhkType !== "") {
      params.set("bhkType", String(searchState.bhkType));
    }
    if (searchState.tenantType && searchState.tenantType !== "") {
      params.set("tenantType", String(searchState.tenantType));
    }
    if (searchState.nonVegAllowed !== null) {
      params.set("nonVegAllowed", String(searchState.nonVegAllowed));
    }
    if (searchState.roomType && searchState.roomType !== "") {
      params.set("roomType", String(searchState.roomType));
    }
    if (searchState.bathroomType && searchState.bathroomType !== "") {
      params.set("bathroomType", String(searchState.bathroomType));
    }
    if (searchState.balconyType && searchState.balconyType !== "") {
      params.set("balconyType", String(searchState.balconyType));
    }
    if (searchState.availability && searchState.availability !== "Any") {
      params.set("availability", String(searchState.availability));
    }
    if (searchState.preferredTenants && searchState.preferredTenants !== "") {
      params.set("preferredTenants", String(searchState.preferredTenants));
    }
    if (searchState.furnishing && searchState.furnishing !== "") {
      params.set("furnishing", String(searchState.furnishing));
    }
    if (searchState.parking && searchState.parking !== "") {
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
    // Use replace to avoid polluting history when updating filters
    router.replace(`/property-search?${params.toString()}`);
  };

  const getTieredCountElement = () => {
    const total = effectiveData?.totalElements || 0;
    if (total < 20) {
      return null;
    }

    let baseLabel: string;
    switch (searchState.propertyCategory) {
      case PropertyCategory.RESALE:
        baseLabel = "listings for sale";
        break;
      default:
      case PropertyCategory.RENT:
      case PropertyCategory.FLATMATE:
        baseLabel = "listings for rent";
    }
    const tier =
      total >= 200
        ? "200+"
        : total >= 100
          ? "100+"
          : total >= 50
            ? "50+"
            : "20+";
    const displayText = `${tier} ${baseLabel}`;

    return (
      <p className="text-sm text-gray-500 text-left md:text-right flex items-center gap-1">
        <span>{displayText}</span>
        <ChevronRight className="h-3 w-3 text-gray-400 hidden md:block" />
      </p>
    );
  };

  return (
    <>
      {/* Mobile - Search and Filter Bar (Overlaps Header)*/}
      <MobileHeader childrenClassName="gap-2">
        <button className="items-center justify-center rounded-full md:border-none">
          <ChevronLeft onClick={() => router.back()} size={25} />
        </button>
        <div className="flex items-center w-full h-10 py-1 pl-3 pr-1 bg-gray-100 border-none rounded-full">
          <PlacesAutocomplete
            id="location-search-mobile"
            name="location"
            value={locationSearch}
            onChange={handleLocationChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onLocationSelect={handleLocationSelect}
            placeholder="Search for a property"
            containerClassName="w-full relative"
            inputClassName="h-10 bg-gray-100 w-full border-none outline-none"
          />
          <button
            className="p-2 rounded-full"
            onClick={handleButtonClick}
            onMouseDown={handleClearButtonMouseDown}
            aria-label={
              isInputFocused && location?.name
                ? "clear-location-mobile"
                : "search-properties-mobile"
            }
          >
            {isInputFocused && location?.name ? (
              <X size={20} />
            ) : (
              <SearchIcon size={20} />
            )}
          </button>
        </div>

        <Button
          leftIcon={<SlidersHorizontal size={16} />}
          variant="outline"
          size="sm"
          className="h-10 text-sm text-black bg-gray-100 border-none rounded-full"
          onClick={() => openDialog(PROPERTY_FILTERS_DIALOG_ID)}
          buttonTextClassName="hidden"
        >
          Filters
        </Button>

        <Button
          leftIcon={<ArrowDownWideNarrow size={16} />}
          variant="outline"
          size="sm"
          className="h-10 text-sm text-black bg-gray-100 border-none rounded-full"
          onClick={() => openDialog(SORT_FILTERS_DIALOG_ID)}
          buttonTextClassName="hidden"
        >
          Sort
        </Button>
      </MobileHeader>

      {/* Desktop - Search and Filter Bar (Below Header) */}
      <section className="fixed top-14 z-50 flex w-full h-16 gap-0 px-12 bg-white border-b border-gray-200 xl:gap-16 lg:gap-8 md:gap-0 xl:px-24 md:px-12 max-md:pt-4 max-md:pb-8 max-md:hidden">
        <div className="flex items-center justify-between w-full gap-4 border-gray-200">
          <div className="flex-1 flex items-center min-h-[46px] w-full p-1 border border-gray-300 rounded-xl bg-white">
            <PlacesAutocomplete
              id="location-search-desktop"
              name="location"
              value={locationSearch}
              onChange={handleLocationChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onLocationSelect={handleLocationSelect}
              placeholder="Search for a property"
              inputClassName="w-full outline-none px-3"
              containerClassName="w-full relative"
            />
            <button
              className="p-2 bg-gray-100 rounded-full"
              onClick={handleButtonClick}
              onMouseDown={handleClearButtonMouseDown}
              aria-label={
                isInputFocused && location?.name
                  ? "clear-location"
                  : "search-properties"
              }
            >
              {isInputFocused && location?.name ? (
                <X size={20} />
              ) : (
                <SearchIcon size={20} />
              )}
            </button>
          </div>
          <div className="flex flex-row items-center gap-2">
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
              dropdownWidth="full"
              containerClassName="relative w-24"
              buttonClassName="flex justify-between items-center w-full p-3 border rounded-xl text-left border-red-500 text-red-500 hover:border-red-500 hover:text-red-500"
              displayTextClassName="text-red-500"
            />

            {/* Property Type (common) */}
            <SelectDropdown
              options={PROPERTY_TYPE_SHORT_OPTIONS}
              name="property-type"
              id="property-type"
              value={searchState.propertyType}
              placeholder="Property type"
              onChange={onTypeChange}
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-36 max-2xl:hidden"
            />

            {/* Rent: BHK | Flatmate: Tenant Type */}
            {searchState.propertyCategory === PropertyCategory.RENT ? (
              <MultiSelectDropdown
                options={BHK_TYPE_OPTIONS}
                name="property-bhk"
                id="property-bhk"
                value={bhkSelectedValues}
                placeholder="Beds"
                onChange={onBhkMultiChange}
                size="sm"
                dropdownWidth="full"
                displayMode="first+count"
                showSelectAll
                containerClassName="relative w-32 max-xl:hidden"
              />
            ) : (
              <SelectDropdown
                options={[{ value: "", label: "Both" }, ...TENANT_TYPE_OPTIONS]}
                name="tenant-type"
                id="tenant-type"
                value={searchState.tenantType}
                placeholder="Tenant Type"
                onChange={onTenantTypeChange}
                size="sm"
                dropdownWidth="full"
                containerClassName="relative w-32 max-xl:hidden"
              />
            )}

            {/* Availability (common) */}
            <SelectDropdown
              options={PROPERTY_AVAILABILITY}
              name="availability"
              id="availability"
              value={searchState.availability}
              placeholder="Availability"
              onChange={onAvailabilityChange}
              size="sm"
              dropdownWidth="full"
              containerClassName="relative w-40 max-lg:hidden"
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
              containerClassName="relative w-48"
            />
            <Button
              leftIcon={<SlidersHorizontal size={16} />}
              variant="outline"
              size="md"
              className="min-h-[46px] text-black rounded-xl border text-sm"
              onClick={() => openDialog(PROPERTY_FILTERS_DIALOG_ID)}
              buttonTextClassName="max-lg:hidden"
            >
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full md:pt-[64px] md:bg-gray-50 relative">
        <div className="min-h-[580px] px-6 pb-10 md:bg-gray-50 xl:px-24 md:px-12">
          {/* Info Bar */}
          {(() => {
            const totalElements = effectiveData?.totalElements || 0;
            const hasCount = totalElements >= 20;
            const hasLocation =
              !!searchState.confirmedLocationName &&
              searchState.confirmedLocationName !== "";
            const hasContent = hasCount || hasLocation;

            if (!hasContent) {
              return <div className="h-10 invisible" />;
            }

            const countElement = getTieredCountElement();

            return (
              <div className="flex flex-col gap-4 py-6 max-md:max-h-24 max-h-20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                  {/* Left Side: Count or empty (no spacer—let flex handle) */}
                  {countElement}

                  {/* Right Side: Location (no placeholder if empty) */}
                  {hasLocation ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm text-gray-700 inline text-nowrap">
                        Showing in:
                      </span>
                      <span className="px-2 py-0.5 md:py-1 rounded-full bg-gray-200 text-xs md:text-sm truncate max-w-64 md:max-w-xs">
                        {searchState.confirmedLocationName}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })()}

          {/* Property List */}
          <div className="mx-auto">
            <PropertiesList
              properties={properties}
              isLoading={isLoading}
              isFetching={isFetching}
              effectiveData={effectiveData}
              onLoadMore={handleLoadMore}
              page={page}
              initialData={initialData}
            />
          </div>
        </div>
      </section>
      <Footer />

      {isDialogOpen(PROPERTY_FILTERS_DIALOG_ID) && (
        <SearchFiltersDialog
          id={PROPERTY_FILTERS_DIALOG_ID}
          onClose={() => {
            closeDialog(PROPERTY_FILTERS_DIALOG_ID);
          }}
          onReset={() => {}}
          onApply={(dialogSelectedCategory?: PropertyCategory) => {
            closeDialog(PROPERTY_FILTERS_DIALOG_ID);
            handleSearch(dialogSelectedCategory);
          }}
        />
      )}

      {isDialogOpen(SORT_FILTERS_DIALOG_ID) && isMobile && (
        <SortFiltersDialog
          id={SORT_FILTERS_DIALOG_ID}
          options={SORT_OPTIONS as { value: SortToken; label: string }[]}
          selectedToken={selectedSortToken}
          onSelect={(token) => onSortChange(token)}
          onClose={() => {
            closeDialog(SORT_FILTERS_DIALOG_ID);
          }}
        />
      )}
    </>
  );
}
