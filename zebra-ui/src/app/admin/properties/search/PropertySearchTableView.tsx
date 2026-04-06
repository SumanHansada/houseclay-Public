"use client";

import { Eye, SearchIcon, SlidersHorizontal, X } from "lucide-react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  MultiSelectDropdown,
  PlacesAutocomplete,
  SelectDropdown,
} from "@/base-components";
import {
  BHK_TYPE_OPTIONS,
  PROPERTY_AVAILABILITY,
  TENANT_TYPE_OPTIONS,
} from "@/common/constants/formOptions";
import { PropertyCategory } from "@/common/enums";
import { getPropertySearchHrefWithLocation } from "@/common/utils";
import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pagination } from "@/components/Pagination";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
import SearchFiltersDialog from "@/dialogs/search-filters-dialog";
import { PropertySearch } from "@/interfaces/PropertySearch";
import {
  SORT_OPTIONS,
  SortToken,
  stateToToken,
  tokenToState,
} from "@/interfaces/PropertySearchSortFilter";
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
  setSortFields,
  setSortOrder,
  setTenantType,
} from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { Popover } from "@/utility-components";
import { formatDateVerbose } from "@/utils/core";
import { BENGALURU_BOUNDS, isWithinBounds } from "@/utils/geoBounds";

// Bellandur exact fallback config
const DEFAULT_LAT = "12.9304";
const DEFAULT_LON = "77.6784";
const DEFAULT_CITY = "bengaluru";
const DEFAULT_LOCATION_NAME = "Bellandur, Bengaluru";

const PROPERTY_FILTERS_DIALOG_ID = "property-filters-dialog";

export function getUrlCategory(
  searchParams: ReadonlyURLSearchParams | URLSearchParams,
): PropertyCategory {
  const raw = (searchParams.get("propertyCategory") || "").toUpperCase();
  const VALID = [
    PropertyCategory.RENT,
    PropertyCategory.FLATMATE,
    PropertyCategory.RESALE,
  ];
  return VALID.includes(raw as PropertyCategory)
    ? (raw as PropertyCategory)
    : PropertyCategory.RENT;
}

const ROWS_PER_PAGE = 12;

interface SerializedPropertySearchRow extends PropertySearch {
  _serial: number;
}

const propertySearchColumns: Column<SerializedPropertySearchRow>[] = [
  { key: "_serial", label: "#", accessor: "_serial", className: "w-16" },
  {
    key: "locationOrSocietyName",
    label: "Location",
    render: (p) => {
      const location = p.locationOrSocietyName || "—";
      return (
        <Popover
          id={`popover-search-location-${p.propertyID}`}
          trigger="hover"
          content={
            <div className="p-3 max-w-xs md:max-w-sm text-sm text-gray-700 font-medium break-words">
              {location}
            </div>
          }
        >
          <div className="max-w-[150px] md:max-w-[200px] xl:max-w-[250px] truncate cursor-help">
            {location}
          </div>
        </Popover>
      );
    },
  },
  { key: "propertyCategory", label: "Category", accessor: "propertyCategory" },
  { key: "bhkType", label: "BHK Type", accessor: "bhkType" },
  {
    key: "createdOn",
    label: "Created On",
    render: (p) => new Date(p.createdOn).toLocaleString("en-IN"),
  },
  {
    key: "availableFrom",
    label: "Available From",
    render: (p) =>
      p.availableFrom != null
        ? formatDateVerbose(p.availableFrom, "en-IN")
        : "—",
  },
  {
    key: "status",
    label: "Status",
    render: (p) => <RenderPropertyStatus status={p.propertyState} />,
  },
];

export function PropertySearchTableView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const searchState = useSelector((state: RootState) => state.propertySearch);
  const { openDialog, closeDialog, isDialogOpen } = useDialog();

  const [page, setPage] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Parse location and fallback
  let lat = searchParams.get("lat");
  let lon = searchParams.get("lon");
  let city = searchParams.get("city");

  if (!lat && !lon) {
    lat = DEFAULT_LAT;
    lon = DEFAULT_LON;
    city = DEFAULT_CITY;
  }

  const location = searchState.location;
  // If we have no confirmed location name and we fallback to Bellandur coordinates, show it visually
  const isDefaultVisualState =
    !searchState.confirmedLocationName &&
    lat === DEFAULT_LAT &&
    lon === DEFAULT_LON;
  const locationSearch =
    location?.name ?? (isDefaultVisualState ? DEFAULT_LOCATION_NAME : "");
  const hasConfirmedLocation =
    !!searchState.confirmedLocationName &&
    searchState.confirmedLocationName !== "";

  const selectedSortToken = stateToToken({
    exclusive: searchState.exclusive,
    sortFields: searchState.sortFields,
    sortOrder: searchState.sortOrder,
  });

  // On first mount: stamp required defaults into the URL if missing
  useEffect(() => {
    const currentPropertyCategory = getUrlCategory(searchParams);
    const hasCategory = !!searchParams.get("propertyCategory");
    const hasLatLon = !!searchParams.get("lat") && !!searchParams.get("lon");

    if (currentPropertyCategory !== searchState.propertyCategory) {
      dispatch(setPropertyCategory(currentPropertyCategory));
      dispatch(resetPropertySearchFilters());
    }

    if (!hasCategory || !hasLatLon) {
      const next = new URLSearchParams(searchParams.toString());
      next.set("propertyCategory", currentPropertyCategory.toLowerCase());
      if (!hasLatLon) {
        next.set("lat", DEFAULT_LAT);
        next.set("lon", DEFAULT_LON);
        next.set("city", DEFAULT_CITY);
      }
      router.replace(`/admin/properties/search?${next.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceQuery = useCallback(
    (mutate: (q: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      // Ensure page resets to 1 (0 internally) upon new filter
      if (next.get("page")) next.delete("page");
      setPage(0);
      router.replace(`/admin/properties/search?${next.toString()}`);
    },
    [router, searchParams],
  );

  // Quick Filters
  const onCategoryChange = (raw: string | number | boolean) => {
    const newCategory = String(raw).toUpperCase() as PropertyCategory;
    dispatch(setPropertyCategory(newCategory));
    dispatch(resetPropertySearchFilters());
    setPage(0);
    router.replace(
      getPropertySearchHrefWithLocation(newCategory, searchParams),
    );
  };

  const onBhkMultiChange = (vals: (string | number | boolean)[]) => {
    const asStr = vals.map(String);
    dispatch(setBhkType(asStr.join(",")));
    replaceQuery((q) => {
      if (asStr.length) q.set("bhkType", asStr.join(","));
      else q.delete("bhkType");
    });
  };

  const onTenantTypeChange = (raw: string | number | boolean) => {
    const val = String(raw);
    dispatch(setTenantType(val));
    replaceQuery((q) => {
      if (val && val !== "") q.set("tenantType", val);
      else q.delete("tenantType");
    });
  };

  const onAvailabilityChange = (raw: string | number | boolean) => {
    const val = String(raw);
    dispatch(setAvailability(val));
    replaceQuery((q) => {
      if (val && val !== "Any") q.set("availability", val);
      else q.delete("availability");
    });
  };

  const onSortChange = (raw: string | number | boolean) => {
    const token = String(raw) as SortToken;
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
    dispatch(setExclusiveFilter(!!mapped.exclusive));
    dispatch(setSortFields(mapped.sortFields ?? ""));
    dispatch(setSortOrder(mapped.sortOrder ?? ""));
    replaceQuery((next) => {
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
    });
  };

  // Location UI operations
  const handleLocationSelect = (selectedLocation: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    city?: string;
  }) => {
    if (
      selectedLocation.city &&
      !isWithinBounds(
        selectedLocation.latitude,
        selectedLocation.longitude,
        BENGALURU_BOUNDS,
      )
    ) {
      toast.error(`Please select a location within Bengaluru`, {
        duration: 5000,
      });
      dispatch(setLocation({ ...location, name: "" }));
      dispatch(setConfirmedLocationName(""));
      return;
    }

    dispatch(setLocation(selectedLocation));
    dispatch(setConfirmedLocationName(selectedLocation.name || ""));

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("lat", selectedLocation.latitude.toString());
    newSearchParams.set("lon", selectedLocation.longitude.toString());
    newSearchParams.delete("page");
    setPage(0);
    router.push(`/admin/properties/search?${newSearchParams.toString()}`);
  };

  const handleLocationChange = (val: string) => {
    if (!val || val.trim() === "") dispatch(setConfirmedLocationName(""));
    if (location) dispatch(setLocation({ ...location, name: val }));
    else dispatch(setLocation({ name: val }));
  };

  const handleClearLocation = () => {
    dispatch(setLocation({ name: "" }));
    dispatch(setConfirmedLocationName(""));
  };

  const handleSearchClick = () => {
    const next = new URLSearchParams(searchParams.toString());
    // Submit dialog or input changes
    if (lat) next.set("lat", lat);
    if (lon) next.set("lon", lon);
    if (city) next.set("city", city);

    // Apply all Redux states to URL
    const effectiveCategory = searchState.propertyCategory;
    next.set("propertyCategory", effectiveCategory.toLowerCase());

    let targetMin: number | null = null;
    let targetMax: number | null = null;

    if (
      effectiveCategory === PropertyCategory.FLATMATE &&
      searchState.priceRangeForFlatmate
    ) {
      [targetMin, targetMax] = searchState.priceRangeForFlatmate;
    } else if (
      effectiveCategory === PropertyCategory.RENT &&
      searchState.priceRangeForRent
    ) {
      [targetMin, targetMax] = searchState.priceRangeForRent;
    }

    if (targetMin !== null && targetMax !== null) {
      next.set("minPrice", String(targetMin));
      next.set("maxPrice", String(targetMax));
    } else {
      next.delete("minPrice");
      next.delete("maxPrice");
    }

    if (searchState.propertyType)
      next.set("propertyType", String(searchState.propertyType));
    else next.delete("propertyType");

    if (searchState.bhkType) next.set("bhkType", String(searchState.bhkType));
    else next.delete("bhkType");

    if (searchState.tenantType)
      next.set("tenantType", String(searchState.tenantType));
    else next.delete("tenantType");

    if (searchState.nonVegAllowed !== null)
      next.set("nonVegAllowed", String(searchState.nonVegAllowed));
    else next.delete("nonVegAllowed");

    if (searchState.roomType)
      next.set("roomType", String(searchState.roomType));
    else next.delete("roomType");

    if (searchState.bathroomType)
      next.set("bathroomType", String(searchState.bathroomType));
    else next.delete("bathroomType");

    if (searchState.balconyType)
      next.set("balconyType", String(searchState.balconyType));
    else next.delete("balconyType");

    if (searchState.availability && searchState.availability !== "Any")
      next.set("availability", String(searchState.availability));
    else next.delete("availability");

    if (searchState.preferredTenants)
      next.set("preferredTenants", String(searchState.preferredTenants));
    else next.delete("preferredTenants");

    if (searchState.furnishing)
      next.set("furnishing", String(searchState.furnishing));
    else next.delete("furnishing");

    if (searchState.parking) next.set("parking", String(searchState.parking));
    else next.delete("parking");

    if (searchState.amenities && searchState.amenities.length > 0)
      next.set("amenities", searchState.amenities.join(","));
    else next.delete("amenities");

    if (searchState.exclusive)
      next.set("exclusive", String(searchState.exclusive));
    else next.delete("exclusive");

    if (searchState.sortFields)
      next.set("sortFields", String(searchState.sortFields));
    else next.delete("sortFields");

    if (searchState.sortOrder)
      next.set("sortOrder", String(searchState.sortOrder));
    else next.delete("sortOrder");

    next.set("page", "0");
    setPage(0);
    router.replace(`/admin/properties/search?${next.toString()}`);
  };

  const handleInputButtonClick = () => {
    if ((isInputFocused && locationSearch) || hasConfirmedLocation)
      handleClearLocation();
    else handleSearchClick();
  };

  const handleClearButtonMouseDown = (e: React.MouseEvent) => {
    if ((isInputFocused && locationSearch) || hasConfirmedLocation)
      e.preventDefault();
  };

  // Construct query params mapped directly to RTK query
  const queryParams = useMemo(() => {
    const query: Record<string, string | number | boolean | string[]> = {
      latitude: Number(lat),
      longitude: Number(lon),
      propertyCategory: getUrlCategory(searchParams),
      page: page,
      size: ROWS_PER_PAGE,
    };

    const minPriceStr = searchParams.get("minPrice");
    const maxPriceStr = searchParams.get("maxPrice");
    if (minPriceStr !== null && maxPriceStr !== null) {
      query.minPrice = Number(minPriceStr);
      query.maxPrice = Number(maxPriceStr);
    }
    const nonVeg = searchParams.get("nonVegAllowed");
    if (nonVeg !== null) query.nonVegAllowed = nonVeg === "true";
    if (searchParams.get("propertyType"))
      query.propertyType = searchParams.get("propertyType") as string;
    if (searchParams.get("bhkType"))
      query.bhkType = searchParams.get("bhkType") as string;
    if (searchParams.get("tenantType"))
      query.tenantType = searchParams.get("tenantType") as string;
    if (searchParams.get("preferredTenants"))
      query.preferredTenants = searchParams.get("preferredTenants") as string;
    if (searchParams.get("roomType"))
      query.roomType = searchParams.get("roomType") as string;
    if (searchParams.get("bathroomType"))
      query.bathroomType = searchParams.get("bathroomType") as string;
    if (searchParams.get("balconyType"))
      query.balconyType = searchParams.get("balconyType") as string;
    if (searchParams.get("availability"))
      query.availability = searchParams.get("availability") as string;
    if (searchParams.get("furnishing"))
      query.furnishing = searchParams.get("furnishing") as string;
    if (searchParams.get("parking"))
      query.parking = searchParams.get("parking") as string;
    if (searchParams.get("amenities"))
      query.amenities = (searchParams.get("amenities") as string).split(",");
    if (searchParams.get("exclusive") === "true") query.exclusive = true;
    if (searchParams.get("sortFields"))
      query.sortFields = searchParams.get("sortFields") as string;
    if (searchParams.get("sortOrder"))
      query.sortOrder = searchParams.get("sortOrder") as string;

    return query;
  }, [searchParams, page, lat, lon]);

  const {
    data: propertiesData,
    isLoading,
    isFetching,
  } = useGetPropertiesByLocationQuery(queryParams, {
    skip:
      isNaN(queryParams.latitude as number) ||
      isNaN(queryParams.longitude as number),
  });

  const totalElements = propertiesData?.totalElements || 0;
  const totalPages = propertiesData?.totalPages || 0;

  const propertyList = (propertiesData?.items || []) as PropertySearch[];

  const columns: Column<SerializedPropertySearchRow>[] = [
    ...propertySearchColumns,
    {
      key: "action",
      label: "Action",
      className: "w-16",
      render: (row) => (
        <IconButtonWithTooltip
          icon={Eye}
          tooltip="View Property Details"
          onClick={() => router.push(`/admin/properties/${row.propertyID}`)}
        />
      ),
    },
  ];

  const rows: SerializedPropertySearchRow[] = propertyList.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: page * ROWS_PER_PAGE + index + 1,
    }),
  );

  const onPageChange = (newPage: number) => {
    setPage(newPage - 1); // internal page 0-idx
  };

  const bhkSelectedValues = useMemo<string[]>(
    () => (searchState.bhkType ? String(searchState.bhkType).split(",") : []),
    [searchState.bhkType],
  );

  return (
    <>
      <div className="h-16 w-full shrink-0 border-b relative z-10 bg-white shadow-sm flex items-center px-8 py-0 gap-6">
        {/* Global Property Search + Filter ConfigBar */}
        <div className="flex-1 flex flex-row items-center gap-2 lg:gap-4">
          <div className="flex-1 min-w-0 flex items-center h-[46px] p-1 px-3 border border-gray-300 rounded-xl bg-gray-50">
            <PlacesAutocomplete
              id="location-search"
              name="location"
              value={locationSearch}
              onChange={handleLocationChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onLocationSelect={handleLocationSelect}
              placeholder="Search Location"
              inputClassName="w-full bg-transparent outline-none border-none text-sm"
              containerClassName="w-full relative mx-1"
            />
            <button
              className="p-1 px-[0.4rem] bg-gray-200 text-gray-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
              onClick={handleInputButtonClick}
              onMouseDown={handleClearButtonMouseDown}
              aria-label="search-or-clear"
            >
              {(isInputFocused && locationSearch) || hasConfirmedLocation ? (
                <X size={16} />
              ) : (
                <SearchIcon size={16} />
              )}
            </button>
          </div>

          {/* Quick Filters */}
          <SelectDropdown
            options={[
              { value: PropertyCategory.RENT, label: "Rent" },
              { value: PropertyCategory.FLATMATE, label: "Rooms" },
            ]}
            name="property-category"
            id="property-category"
            value={searchState.propertyCategory}
            onChange={onCategoryChange}
            dropdownWidth="full"
            containerClassName="relative w-28 shrink-0"
            buttonClassName="flex items-center justify-between w-full h-10 px-3 border border-red-500 text-red-500 rounded-xl text-sm"
          />

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
              containerClassName="relative w-36 shrink-0 hidden 2xl:block"
            />
          ) : (
            <SelectDropdown
              options={[{ value: "", label: "Both" }, ...TENANT_TYPE_OPTIONS]}
              name="tenant-type"
              id="tenant-type"
              value={searchState.tenantType}
              placeholder="Tenant Type"
              onChange={onTenantTypeChange}
              dropdownWidth="full"
              containerClassName="relative w-36 shrink-0 hidden 2xl:block"
              buttonClassName="flex items-center justify-between w-full h-10 px-3 border border-gray-300 rounded-xl text-sm text-left"
            />
          )}

          <SelectDropdown
            options={PROPERTY_AVAILABILITY}
            name="availability"
            id="availability"
            value={searchState.availability}
            placeholder="Availability"
            onChange={onAvailabilityChange}
            dropdownWidth="full"
            containerClassName="relative w-44 shrink-0"
            buttonClassName="flex items-center justify-between w-full h-10 px-3 border border-gray-300 rounded-xl text-sm text-left"
          />

          <SelectDropdown
            options={SORT_OPTIONS}
            name="sort"
            id="sort"
            value={selectedSortToken ?? ""}
            placeholder="Sort"
            onChange={onSortChange}
            dropdownWidth="full"
            containerClassName="relative w-52 shrink-0"
            buttonClassName="flex items-center justify-between w-full h-10 px-3 border border-gray-300 rounded-xl text-sm text-left"
          />

          <Button
            leftIcon={<SlidersHorizontal size={16} />}
            variant="outline"
            size="md"
            className="h-10 px-4 rounded-xl border border-gray-300 ml-auto shrink-0 transition-colors hover:bg-gray-100"
            onClick={() => openDialog(PROPERTY_FILTERS_DIALOG_ID)}
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Table area */}
      <div className="flex-1 flex flex-col bg-gray-100 p-8 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-md rounded-xl relative overflow-hidden p-2 gap-2">
          {/* Table Header */}
          <div className="flex justify-between items-center px-1">
            <h1 className="text-xl font-medium">
              Advanced Search - [{totalElements}]
            </h1>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
              Page {page + 1} of {totalPages || 1}
            </span>
          </div>

          {/* Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(prop) => prop.propertyID}
              noDataMessage="No Properties found for these criteria."
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom pagination */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-4 px-8">
        <Pagination
          currentPage={page + 1}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading || isFetching}
        />
      </div>

      {isDialogOpen(PROPERTY_FILTERS_DIALOG_ID) && (
        <SearchFiltersDialog
          id={PROPERTY_FILTERS_DIALOG_ID}
          onClose={() => closeDialog(PROPERTY_FILTERS_DIALOG_ID)}
          onApply={() => {
            closeDialog(PROPERTY_FILTERS_DIALOG_ID);
            handleSearchClick();
          }}
          onReset={() => {
            handleSearchClick();
          }}
        />
      )}
    </>
  );
}
