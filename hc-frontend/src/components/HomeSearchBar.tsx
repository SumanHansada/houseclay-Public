"use client";

import { useRouter } from "next/navigation";
import SearchSvg from "public/icons/search.svg";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { resetPropertySearch } from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";

import PlacesAutocomplete from "./common/PlacesAutocomplete";
import Dropdown from "./Dropdown";

const Search = SearchSvg as React.FC<React.SVGProps<SVGSVGElement>>;

const cityLatLngMapping: Record<string, { lat: number; lng: number }> = {
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
};

const CITY_OPTIONS = Object.keys(cityLatLngMapping).map((city) => ({
  id: city,
  label: city,
}));

const HomeSearchBar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [location, setLocation] = useState<{
    latitude?: number;
    longitude?: number;
    name?: string;
    address?: string;
    city?: string;
  } | null>(null);
  const propertyCategory = useSelector(
    (state: RootState) => state.propertySearch.propertyCategory,
  );

  const handleSearch = () => {
    if (location && location.latitude && location.longitude) {
      // Reset all filters before making a new search
      dispatch(resetPropertySearch());

      router.push(
        `/property-search?lat=${location.latitude}&lon=${location.longitude}&propertyCategory=${propertyCategory.toLowerCase()}`,
      );
    }
  };

  const handlePrefetch = () => {
    if (location && location.latitude && location.longitude) {
      router.prefetch(
        `/property-search?lat=${location.latitude}&lon=${location.longitude}&propertyCategory=${propertyCategory.toLowerCase()}`,
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
      const selectedCity = value.city.toLowerCase();
      const isCityAllowed =
        CITY_OPTIONS[0].label.toLowerCase() === selectedCity;
      if (!isCityAllowed) {
        toast.error(
          `Please select a location within ${CITY_OPTIONS[0].label}`,
          {
            duration: 5000,
          },
        );
        setLocation(null);
        return;
      }
    }
    setLocation((prev) => {
      return {
        ...prev,
        latitude: value.latitude,
        longitude: value.longitude,
        name: value.name,
        address: value.address,
        city: value.city,
      };
    });
    dispatch(resetPropertySearch());

    router.push(
      `/property-search?lat=${value.latitude}&lon=${value.longitude}&propertyCategory=${propertyCategory.toLowerCase()}`,
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex pl-4 pr-2 rounded-full bg-white shadow-lg justify-between items-center md:h-16 h-14"
    >
      {/* City */}
      <div className="w-1/4 px-3 py-2 border-r border-gray-200 max-md:hidden">
        <div className="text-sm font-medium text-gray-900 mb-1">City</div>
        <div className="text-gray-500 text-sm flex items-center">
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
      <div className="w-3/4 max-md:w-full max-md:flex-1 md:px-3 px-2 md:py-2 py-1 border-gray-200">
        <PlacesAutocomplete
          id="location"
          name="location"
          placeholder="Type Localities..."
          value={location?.name || ""}
          onChange={(value) => {
            setLocation((prev) => {
              return {
                ...prev,
                name: value,
              };
            });
            handlePrefetch();
          }}
          onLocationSelect={handleLocationSelect}
          containerClassName="w-full relative"
          labelClassName="text-sm font-medium text-gray-900 mb-1"
          inputClassName="w-full p-3"
          dropdownClassName="absolute z-10 mt-1 py-1 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-b-xl"
          dropdownItemClassName="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
          errorClassName="mt-1 text-sm text-red-600"
        />
      </div>

      {/* Search Button */}
      <button
        className="text-white flex items-center justify-center rounded-full md:hidden"
        onClick={handleSearch}
      >
        <Search height={40} width={40} />
      </button>
      <button
        className="text-white flex items-center justify-center rounded-full max-md:hidden"
        onClick={handleSearch}
        onMouseEnter={handlePrefetch}
        onFocus={handlePrefetch}
      >
        <Search height={50} width={50} />
      </button>
    </div>
  );
};

export default HomeSearchBar;
