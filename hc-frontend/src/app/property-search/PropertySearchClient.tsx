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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  PROPERTY_FILTERS_DIALOG_ID,
  SORT_FILTERS_DIALOG_ID,
} from "@/common/dataConstants/dialogIDs";
import {
  BHK_TYPE_OPTIONS,
  PROPERTY_AVAILABILITY,
  PROPERTY_TYPE_SHORT_OPTIONS,
  TENANT_TYPE_OPTIONS,
} from "@/common/dataConstants/formOptions";
import { BadgeType, PropertyCategory } from "@/common/enums";
import { getPropertySearchHrefWithLocation } from "@/common/utils";
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
import GoogleMapsPropertyMarkers from "@/utility-components/GoogleMapsPropertyMarkers";
import { BENGALURU_BOUNDS, isWithinBounds } from "@/utils/geoBounds";

// Normalize & Validate category from URL
export function getUrlCategory(
  searchParams: ReadonlyURLSearchParams,
): PropertyCategory {
  const raw = (searchParams.get("propertyCategory") || "").toUpperCase();
  return Object.values(PropertyCategory).includes(raw as PropertyCategory)
    ? (raw as PropertyCategory)
    : PropertyCategory.RENT;
}

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

const TieredCount = memo(function TieredCount({
  totalElements,
  propertyCategory,
}: {
  totalElements: number;
  propertyCategory: PropertyCategory;
}) {
  if (totalElements < 20) return null;

  let baseLabel: string;
  switch (propertyCategory) {
    case PropertyCategory.RESALE:
      baseLabel = "listings for sale";
      break;
    default:
    case PropertyCategory.RENT:
    case PropertyCategory.FLATMATE:
      baseLabel = "listings for rent";
  }
  const tier =
    totalElements >= 200
      ? "200+"
      : totalElements >= 100
        ? "100+"
        : totalElements >= 50
          ? "50+"
          : "20+";

  return (
    <p className="text-sm text-gray-500 text-left md:text-right flex items-center gap-1">
      <span>{`${tier} ${baseLabel}`}</span>
      <ChevronRight className="h-3 w-3 text-gray-400 hidden md:block" />
    </p>
  );
});

const SearchResultsHeader = memo(function SearchResultsHeader({
  totalElements,
  propertyCategory,
  hasConfirmedLocation,
  confirmedLocationName,
  variant,
}: {
  totalElements: number;
  propertyCategory: PropertyCategory;
  hasConfirmedLocation: boolean;
  confirmedLocationName: string;
  variant: "mobile" | "desktop";
}) {
  const hasCount = totalElements >= 20;
  const hasContent = hasCount || hasConfirmedLocation;

  if (!hasContent) {
    return <div className="h-10 invisible" />;
  }

  const isMobileVariant = variant === "mobile";

  return (
    <div
      className={`flex flex-col gap-4 py-6 ${isMobileVariant ? "max-h-24" : "max-h-20"}`}
    >
      <div
        className={
          isMobileVariant
            ? "flex flex-col gap-2"
            : "flex flex-row items-center justify-between gap-4"
        }
      >
        <TieredCount
          totalElements={totalElements}
          propertyCategory={propertyCategory}
        />

        {hasConfirmedLocation ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-700 inline text-nowrap">
              Showing in:
            </span>
            <span
              className={`px-2 rounded-full bg-gray-200 truncate ${
                isMobileVariant
                  ? "py-0.5 text-xs max-w-64"
                  : "py-1 text-sm max-w-xs"
              }`}
            >
              {confirmedLocationName}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
});

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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {properties.map((property, idx) => (
          <Link
            key={`${property.propertyID}-${idx}`}
            href={`/property-details/${property.propertyID}`}
            prefetch={false}
            className="block rounded-xl"
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
    if (cityCoords) {
      lat = cityCoords.lat.toString();
      lon = cityCoords.lng.toString();
    }
  }

  const searchState = useSelector((state: RootState) => state.propertySearch);
  const router = useRouter();
  const { isMobile, isTablet } = useDeviceContext();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedMapProperty, setSelectedMapProperty] =
    useState<PropertySearch | null>(null);
  const displayedMapProperty = useRef<PropertySearch | null>(null);
  useEffect(() => {
    if (selectedMapProperty) {
      displayedMapProperty.current = selectedMapProperty;
    }
  }, [selectedMapProperty]);

  const clearSelectedMapProperty = useCallback(() => {
    setSelectedMapProperty(null);
  }, []);

  const listingsRef = useRef<HTMLDivElement>(null);
  const listingsOffsetY = useRef(0);
  const dragStartY = useRef<number | null>(null);
  const dragStartOffset = useRef(0);
  const hasMountAnimated = useRef(false);

  const getMaxOffset = useCallback(() => {
    return window.innerHeight * 0.4;
  }, []);

  const setListingsTransform = useCallback((y: number, animate: boolean) => {
    if (!listingsRef.current) return;
    listingsRef.current.style.transition = animate
      ? "transform 300ms ease-in-out"
      : "none";
    listingsRef.current.style.transform = `translateY(${y}px)`;
    listingsOffsetY.current = y;
  }, []);

  const handleMobileMarkerSelect = useCallback(
    (property: PropertySearch | null) => {
      if (property) {
        displayedMapProperty.current = property;
      }
      setSelectedMapProperty(property);
      if (property) {
        setListingsTransform(getMaxOffset(), true);
      }
    },
    [setListingsTransform, getMaxOffset],
  );

  useEffect(() => {
    const shouldAnimateSheet = isMobile || isTablet;

    if (!shouldAnimateSheet) {
      hasMountAnimated.current = false;
      return;
    }

    const trySheetOpenMountAnimation = () => {
      if (!listingsRef.current) return;
      if (hasMountAnimated.current) return;
      hasMountAnimated.current = true;
      requestAnimationFrame(() => setListingsTransform(0, true));
    };

    trySheetOpenMountAnimation();
    requestAnimationFrame(() => trySheetOpenMountAnimation());
  }, [isMobile, isTablet, setListingsTransform]);

  const listingsPanelTouchCleanup = useRef<(() => void) | null>(null);
  const setListingsPanelRef = useCallback(
    (el: HTMLDivElement | null) => {
      listingsRef.current = el;
      listingsPanelTouchCleanup.current?.();
      listingsPanelTouchCleanup.current = null;

      if (!el) return;

      const dragRegion = el.querySelector("[data-sheet-drag-region]");
      if (!dragRegion) return;

      const onTouchStart = (e: Event) => {
        const te = e as TouchEvent;
        dragStartY.current = te.touches[0].clientY;
        dragStartOffset.current = listingsOffsetY.current;
      };

      const onTouchMove = (e: Event) => {
        if (dragStartY.current === null) return;
        const te = e as TouchEvent;
        const dy = te.touches[0].clientY - dragStartY.current;
        const maxOffset = getMaxOffset();

        te.preventDefault();
        const newOffset = Math.max(
          0,
          Math.min(maxOffset, dragStartOffset.current + dy),
        );
        setListingsTransform(newOffset, false);
      };

      const onTouchEnd = () => {
        if (dragStartY.current === null) return;
        dragStartY.current = null;
        const maxOffset = getMaxOffset();
        const snapTarget =
          listingsOffsetY.current > maxOffset * 0.5 ? maxOffset : 0;
        setListingsTransform(snapTarget, true);
      };

      dragRegion.addEventListener("touchstart", onTouchStart, {
        passive: true,
      });
      dragRegion.addEventListener("touchmove", onTouchMove, { passive: false });
      dragRegion.addEventListener("touchend", onTouchEnd);

      listingsPanelTouchCleanup.current = () => {
        dragRegion.removeEventListener("touchstart", onTouchStart);
        dragRegion.removeEventListener("touchmove", onTouchMove);
        dragRegion.removeEventListener("touchend", onTouchEnd);
      };
    },
    [getMaxOffset, setListingsTransform],
  );
  const { openDialog, closeDialog, isDialogOpen } = useDialog();

  const location = searchState.location;
  const locationSearch = location?.name || "";
  const hasConfirmedLocation =
    !!searchState.confirmedLocationName &&
    searchState.confirmedLocationName !== "";

  const selectedSortToken = stateToToken({
    exclusive: searchState.exclusive,
    sortFields: searchState.sortFields,
    sortOrder: searchState.sortOrder,
  });

  // Reset entire slice on initial mount if URL is clean (from header navigation)
  useEffect(() => {
    const paramKeys = Array.from(searchParams.keys());
    const allowedKeys = ["city", "lat", "lon", "propertyCategory"];
    const isCleanUrl =
      paramKeys.every((key) => allowedKeys.includes(key)) &&
      paramKeys.length <= allowedKeys.length;

    if (isCleanUrl) {
      dispatch(resetPropertySearchFilters());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hydrate category from URL on first load / URL change
  useEffect(() => {
    const currentPropertyCategory = getUrlCategory(searchParams);
    if (currentPropertyCategory !== searchState.propertyCategory) {
      dispatch(setPropertyCategory(currentPropertyCategory));
      dispatch(resetPropertySearchFilters());

      // Build clean URL: keep location (lat/lon or city), set category, remove ALL other
      router.replace(
        getPropertySearchHrefWithLocation(
          currentPropertyCategory,
          searchParams,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, dispatch, router]);

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
    const newCategory = String(raw).toUpperCase() as PropertyCategory;
    dispatch(setPropertyCategory(newCategory));
    dispatch(resetPropertySearchFilters());

    // build fresh URL with only location + new category
    router.replace(
      getPropertySearchHrefWithLocation(newCategory, searchParams),
    );
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
    if ((isInputFocused && location?.name) || hasConfirmedLocation) {
      handleClear();
    } else {
      handleSearch();
    }
  };

  // Prevent blur when clicking clear button
  const handleClearButtonMouseDown = (e: React.MouseEvent) => {
    if ((isInputFocused && location?.name) || hasConfirmedLocation) {
      e.preventDefault();
    }
  };

  const numLat = lat ? Number(lat) : NaN;
  const numLon = lon ? Number(lon) : NaN;
  const shouldFetch = !isNaN(numLat) && !isNaN(numLon);

  const queryParams = useMemo(() => {
    if (!shouldFetch) {
      return {
        latitude: 0,
        longitude: 0,
        propertyCategory: PropertyCategory.RENT,
      };
    }

    const currentPropertyCategory = getUrlCategory(searchParams);
    const query: Record<
      string,
      string | number | boolean | string[] | PropertyCategory
    > = {
      latitude: numLat,
      longitude: numLon,
      propertyCategory: currentPropertyCategory,
      page: page,
    };

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

    if (minPriceStr !== null && maxPriceStr !== null) {
      const minNum = Number(minPriceStr);
      const maxNum = Number(maxPriceStr);
      if (!isNaN(minNum) && !isNaN(maxNum)) {
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
  }, [searchParams, page, numLat, numLon, shouldFetch]);

  const { data, isLoading, isFetching, error } =
    useGetPropertiesByLocationQuery(queryParams, {
      skip: !shouldFetch,
    });

  // Use initial data if available and we're on page 0, otherwise use RTK Query data.
  // When page > 0 but RTK Query hasn't finished its background page-0 fetch yet,
  // fall back to initialData to avoid losing SSR items.
  const effectiveData = useMemo(() => {
    if (page === 0 && initialData) {
      return initialData;
    }
    return data ?? initialData;
  }, [page, initialData, data]);

  const handleLoadMore = useCallback(() => {
    if (!effectiveData?.hasNext || isFetching) return;
    setPage((prev) => prev + 1);
  }, [effectiveData?.hasNext, isFetching]);

  // Memoize property list
  const properties: PropertySearch[] = useMemo(() => {
    if (error) return [];
    const result = effectiveData as { items: PropertySearch[] };
    if (!result || !Array.isArray(result.items)) return [];
    return result.items.map((property) => ({
      ...property,
      images: property.images.length ? property.images : [],
    })) as PropertySearch[];
  }, [effectiveData, error]);

  const handleSearch = useCallback(
    (dialogSelectedCategory?: PropertyCategory) => {
      const params = new URLSearchParams();

      if (lat) params.set("lat", lat);
      if (lon) params.set("lon", lon);

      const effectiveCategory =
        dialogSelectedCategory ?? searchState.propertyCategory;
      if (effectiveCategory) {
        params.set("propertyCategory", effectiveCategory.toLowerCase());
      }

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

      router.replace(`/property-search?${params.toString()}`);
    },
    [lat, lon, searchState, router],
  );

  const totalElements = effectiveData?.totalElements || 0;

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
            {(isInputFocused && location?.name) || hasConfirmedLocation ? (
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
      <section className="fixed top-14 z-50 flex w-full h-16 gap-0 px-8 bg-white border-b border-gray-200 xl:gap-16 lg:gap-8 md:gap-0 xl:px-24 lg:px-12 max-md:pt-4 max-md:pb-8 max-md:hidden">
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
              {(isInputFocused && location?.name) || hasConfirmedLocation ? (
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
        {/* Mobile: Map + bottom sheet + marker card */}
        <section className="xl:hidden">
          {/* Mobile: Map */}
          <div className="sticky top-14 z-0 h-[calc(100vh-3.5rem)] md:top-[120px] md:h-[calc(100vh-120px)]">
            <GoogleMapsPropertyMarkers
              properties={properties}
              mapId="d2efb78aa393f5315b3aed0e"
              defaultCenter={
                shouldFetch ? { lat: numLat, lng: numLon } : undefined
              }
              className="h-full w-full max-xl:rounded-none xl:rounded-lg"
              onMarkerSelect={handleMobileMarkerSelect}
            />
          </div>

          {/* Mobile: Marker card */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-50 pb-safe-bottom bg-white transition-transform duration-300 ease-in-out ${selectedMapProperty ? "translate-y-0" : "translate-y-full"}`}
          >
            {displayedMapProperty.current && (
              <Link
                key={displayedMapProperty.current.propertyID}
                href={`/property-details/${displayedMapProperty.current.propertyID}`}
                prefetch={false}
                className="block rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Properties
                  property={displayedMapProperty.current}
                  showCarouselDots={false}
                  onClose={clearSelectedMapProperty}
                  className="rounded-t-xl rounded-b-none drop-shadow-none"
                />
              </Link>
            )}
          </div>

          {/* Mobile: Listings — page scrolls (no inner overflow); sheet drag only on handle + header */}
          <div
            ref={setListingsPanelRef}
            className="relative z-10 -mt-[50vh] min-h-[50vh] translate-y-[50vh] rounded-t-3xl bg-white px-4 md:px-8 pb-16 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
          >
            <div
              data-sheet-drag-region
              className="cursor-grab active:cursor-grabbing"
            >
              <div className="flex justify-center pt-3 pb-3">
                <div className="h-1 w-10 rounded-full bg-gray-300" />
              </div>

              <SearchResultsHeader
                totalElements={totalElements}
                propertyCategory={searchState.propertyCategory}
                hasConfirmedLocation={hasConfirmedLocation}
                confirmedLocationName={searchState.confirmedLocationName}
                variant="mobile"
              />
            </div>

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

        {/* Desktop: Listings + Map side by side */}
        <section className="hidden xl:flex">
          {/* Desktop: Listings */}
          <div className="min-h-[580px] px-6 pb-10 bg-gray-50 pl-8 lg:pl-12 pr-6 xl:pl-24 xl:pr-8 flex-1 min-w-0">
            <SearchResultsHeader
              totalElements={totalElements}
              propertyCategory={searchState.propertyCategory}
              hasConfirmedLocation={hasConfirmedLocation}
              confirmedLocationName={searchState.confirmedLocationName}
              variant="desktop"
            />

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

          {/* Desktop: Sticky map on right */}
          <div className="w-[50%] lg:w-[50%]">
            <div className="sticky top-[120px] h-[calc(100vh-120px)] pt-6 pb-6 pr-8 lg:pr-12 xl:pr-24">
              <GoogleMapsPropertyMarkers
                properties={properties}
                mapId="d2efb78aa393f5315b3aed0e"
                defaultCenter={
                  shouldFetch ? { lat: numLat, lng: numLon } : undefined
                }
                className="h-full w-full rounded-xl"
              />
            </div>
          </div>
        </section>
      </section>
      <Footer />

      {isDialogOpen(PROPERTY_FILTERS_DIALOG_ID) && (
        <SearchFiltersDialog
          id={PROPERTY_FILTERS_DIALOG_ID}
          onClose={() => {
            closeDialog(PROPERTY_FILTERS_DIALOG_ID);
          }}
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
