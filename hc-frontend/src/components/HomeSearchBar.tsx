"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { CITY_OPTIONS } from "@/common/utils";
import {
  resetPropertySearchSlice,
  setConfirmedLocationName,
  setLocation,
} from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { PlacesAutocompleteWithAnimation } from "@/utility-components";
import { BENGALURU_BOUNDS, isWithinBounds } from "@/utils/geoBounds";

import Dropdown from "./Dropdown";

interface HomeSearchBarProps {
  id: string;
}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const location = useSelector(
    (state: RootState) => state.propertySearch.location,
  );
  const propertyCategory = useSelector(
    (state: RootState) => state.propertySearch.propertyCategory,
  );

  // Default city (e.g., first option 'Bengaluru')
  const defaultCity = CITY_OPTIONS[0].id;

  useEffect(() => {
    // Reset location state on homepage mount for a fresh search experience
    // (clears any carryover from previous navigation's)
    dispatch(setLocation(null));
    dispatch(setConfirmedLocationName(""));
  }, [dispatch]);

  const handleSearch = () => {
    if (location && location.latitude && location.longitude) {
      // Reset all filters before making a new search
      dispatch(resetPropertySearchSlice());
      dispatch(setLocation(location));
      dispatch(setConfirmedLocationName(location.name || ""));

      router.push(
        `/property-search?city=${defaultCity}&lat=${location.latitude}&lon=${location.longitude}&propertyCategory=${propertyCategory.toLowerCase()}`,
      );
    }
  };

  const handlePrefetch = () => {
    if (location && location.latitude && location.longitude) {
      router.prefetch(
        `/property-search?city=${defaultCity}&lat=${location.latitude}&lon=${location.longitude}&propertyCategory=${propertyCategory.toLowerCase()}`,
      );
    }
  };

  const handleLocationSelect = (value: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    city?: string;
  }) => {
    if (value.city) {
      if (!isWithinBounds(value.latitude, value.longitude, BENGALURU_BOUNDS)) {
        toast.error("Please select a location within Bengaluru", {
          duration: 5000,
        });
        dispatch(
          setLocation({
            ...location,
            ...value,
            name: "",
          }),
        );
        dispatch(setConfirmedLocationName(""));
        return;
      }
    }

    dispatch(resetPropertySearchSlice());
    dispatch(setLocation(value));
    dispatch(setConfirmedLocationName(value.name || ""));

    router.push(
      `/property-search?city=${defaultCity}&lat=${value.latitude}&lon=${value.longitude}&propertyCategory=${propertyCategory.toLowerCase()}`,
    );
  };

  const handleLocationChange = (value: string) => {
    // If user clears input manually, ensure confirmed is cleared
    if (!value || value.trim() === "") {
      dispatch(setConfirmedLocationName(""));
    }

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
    handlePrefetch();
  };

  const handleClear = () => {
    // Clear the input value by calling onChange with empty string
    handleLocationChange("");
    // Also ensure location is fully cleared
    dispatch(setLocation(null));
    dispatch(setConfirmedLocationName(""));
  };

  const handleButtonClick = () => {
    if (isInputFocused && location?.name) {
      handleClear();
    } else {
      handleSearch();
    }
  };

  const handleClearButtonMouseDown = (e: React.MouseEvent) => {
    // Prevent blur from happening before we clear
    if (isInputFocused && location?.name) {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-between pl-4 pr-2 bg-white border border-gray-200 rounded-full shadow-lg inset-shadow-xs md:h-16 h-14"
    >
      {/* City */}
      <div className="w-1/4 px-3 py-2 border-r border-gray-200 max-md:hidden">
        <div className="mb-1 text-sm font-medium text-gray-900">City</div>
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-full">
            <Dropdown
              options={CITY_OPTIONS}
              defaultSelected={CITY_OPTIONS[0]}
              onChange={(option) => console.log(option)}
              disabled={true}
              dropdownClass="gap-1 w-full justify-start"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="w-3/4 px-2 py-2 border-gray-200 max-md:w-full max-md:flex-1 md:px-3 md:py-2">
        <PlacesAutocompleteWithAnimation
          id={id}
          name="location"
          animatedPlaceholders={[
            "Bellandur",
            "Kadubeesanahalli",
            "Sarjapura",
            "HSR Layout",
            "Koramangala",
            "Indiranagar",
          ]}
          value={location?.name || ""}
          onChange={handleLocationChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onLocationSelect={handleLocationSelect}
          containerClassName="w-full relative"
          labelClassName="text-lg font-medium text-gray-900 mb-1"
          inputClassName="w-full p-1 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          dropdownClassName="absolute z-10 mt-1 py-1 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-b-xl"
          dropdownItemClassName="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
          errorClassName="mt-1 text-sm text-red-600"
        />
      </div>

      {/* Search/Clear Button */}
      <button
        aria-label={
          isInputFocused && location?.name
            ? "clear-location-mobile"
            : "search-properties-mobile"
        }
        className="flex items-center justify-center p-3 bg-red-500 rounded-full shadow-xl md:hidden"
        onClick={handleButtonClick}
        onMouseDown={handleClearButtonMouseDown}
      >
        {isInputFocused && location?.name ? (
          <X size={20} className="text-white" />
        ) : (
          <Search size={20} className="text-white fill-red-500" />
        )}
      </button>
      <button
        aria-label={
          isInputFocused && location?.name
            ? "clear-location"
            : "search-properties"
        }
        className="flex items-center justify-center p-3 bg-red-500 rounded-full shadow-xl max-md:hidden"
        onClick={handleButtonClick}
        onMouseDown={handleClearButtonMouseDown}
        onMouseEnter={
          !isInputFocused || !location?.name ? handlePrefetch : undefined
        }
        onFocus={
          !isInputFocused || !location?.name ? handlePrefetch : undefined
        }
      >
        {isInputFocused && location?.name ? (
          <X size={30} className="text-white" />
        ) : (
          <Search size={30} className="text-white fill-red-500" />
        )}
      </button>
    </div>
  );
};

export default HomeSearchBar;
