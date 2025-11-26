"use client";

import { BENGALURU_BOUNDS, LatLngBounds } from "@/utils/geoBounds";
import "../app/google-places-autocomplete.css";

import { APIProvider } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PlacesAutocompleteProps {
  label?: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    city?: string;
  }) => void;
  // Styling props
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  dropdownItemClassName?: string;
  errorClassName?: string;
}

interface PlacePrediction {
  id: string;
  mainText: string;
  secondaryText: string;
  placeId: string;
  latitude?: number;
  longitude?: number;
  types?: string[];
  primaryType?: string;
  isPriority?: boolean;
  isArea?: boolean;
}

// Property-related types that should be prioritized
const PRIORITY_TYPES = [
  "apartment_building",
  "apartment_complex",
  "condominium_complex",
  "housing_complex",
  "premise",
  "subpremise",
];

const AREA_TYPES = [
  "locality",
  "sublocality",
  "sublocality_level_1",
  "sublocality_level_2",
];

// Label Logic should prefer Primary Type
const getTypeLabel = (
  types?: string[],
  primaryType?: string,
): string | null => {
  // If primary type exists, use it (formatted)
  if (primaryType) {
    // Custom overrides for specific technical names if needed
    if (
      primaryType === "premise" ||
      primaryType === "subpremise" ||
      primaryType === "apartment_building" ||
      primaryType === "apartment_complex" ||
      primaryType === "condominium_complex" ||
      primaryType === "housing_complex"
    )
      return "Society";
  }

  // Fallback logic if primaryType is missing
  if (!types || types.length === 0) return null;
  const typeSet = new Set(types);

  if (
    typeSet.has("premise") ||
    typeSet.has("subpremise") ||
    typeSet.has("apartment_building") ||
    typeSet.has("apartment_complex") ||
    typeSet.has("condominium_complex") ||
    typeSet.has("housing_complex")
  )
    return "Society";
  if (
    typeSet.has("locality") ||
    typeSet.has("sublocality") ||
    typeSet.has("sublocality_level_1") ||
    typeSet.has("sublocality_level_2")
  )
    return "Area";
  // if (typeSet.has("shopping_mall")) return "Shopping Mall";
  // if (typeSet.has("store")) return "Store";
  // if (typeSet.has("restaurant")) return "Restaurant";
  // if (typeSet.has("cafe")) return "Cafe";
  // if (typeSet.has("school")) return "School";
  // if (typeSet.has("university")) return "University";
  // if (typeSet.has("hospital")) return "Hospital";
  // if (typeSet.has("park")) return "Park";
  // if (typeSet.has("establishment")) return "Establishment";

  return null;
};

const PlacesAutocompleteBase = ({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Search places",
  required = false,
  onLocationSelect,
  disabled = false,
  // Styling props with defaults
  containerClassName = "w-full relative",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  inputClassName = "w-full p-3 border rounded-xl",
  dropdownClassName = "absolute z-10 mt-2 py-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto",
  dropdownItemClassName = "py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center",
  errorClassName = "mt-1 text-sm text-red-600",
}: PlacesAutocompleteProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const loadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const activeOptionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkGoogleMapsLoaded = async () => {
      if (window.google?.maps?.places) {
        setIsLoaded(true);
      } else {
        loadTimeoutRef.current = setTimeout(checkGoogleMapsLoaded, 250);
      }
    };

    checkGoogleMapsLoaded();

    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // Handle manual input changes
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = e.target.value;
    onChange(newValue);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (newValue.length > 2 && isLoaded) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const places = (await google.maps.importLibrary("places")) as unknown;
          // Type guard or cast to the expected type
          const placeLib = places as {
            Place: {
              searchByText: (args: {
                textQuery: string;
                fields: string[];
                region: string;
                locationRestriction: LatLngBounds;
                maxResultCount?: number;
              }) => Promise<{
                places?: {
                  id: string;
                  displayName?: string;
                  formattedAddress?: string;
                  location: {
                    lat: () => number;
                    lng: () => number;
                  };
                  types?: string[];
                  primaryType?: string;
                }[];
              }>;
            };
          };
          const result = await placeLib.Place.searchByText({
            textQuery: newValue,
            fields: [
              "id",
              "displayName",
              "formattedAddress",
              "location",
              "types",
              "primaryType",
            ],
            region: "IN",
            locationRestriction: {
              south: BENGALURU_BOUNDS.south,
              west: BENGALURU_BOUNDS.west,
              north: BENGALURU_BOUNDS.north,
              east: BENGALURU_BOUNDS.east,
            },
            maxResultCount: 8,
          });

          if (result.places && result.places.length > 0) {
            const formattedPredictions = result.places.map((place) => {
              const types = place.types || [];
              const isPriority = types.some((type) =>
                PRIORITY_TYPES.includes(type),
              );
              const isArea = types.some((type) => AREA_TYPES.includes(type));

              return {
                id: place.id,
                mainText: place.displayName || "",
                secondaryText: place.formattedAddress || "",
                placeId: place.id,
                latitude: place.location.lat(),
                longitude: place.location.lng(),
                types: types,
                primaryType: place.primaryType,
                isPriority: isPriority,
                isArea: isArea,
              };
            });

            // Sort predictions: priority items (Society) first, then areas, then rest
            formattedPredictions.sort((a, b) => {
              // Society first
              if (a.isPriority && !b.isPriority) return -1;
              if (!a.isPriority && b.isPriority) return 1;

              // Then areas (among non-societies)
              if (!a.isPriority && !b.isPriority) {
                if (a.isArea && !b.isArea) return -1;
                if (!a.isArea && b.isArea) return 1;
              }

              return 0;
            });

            setPredictions(formattedPredictions);
            setShowDropdown(true);
          } else {
            setPredictions([]);
            setShowDropdown(false);
          }
        } catch (error) {
          console.error("Error getting place suggestions:", error);
          setPredictions([]);
          setShowDropdown(false);
        }
      }, 200); // Debounce delay - 200ms
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  // Handle selection from dropdown
  const selectPrediction = async (prediction: PlacePrediction) => {
    if (disabled || !isLoaded) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const places = (await google.maps.importLibrary("places")) as any;
      const place = new places.Place({ id: prediction.placeId });

      const result = await place.fetchFields({
        fields: [
          "id",
          "formattedAddress",
          "location",
          "displayName",
          "addressComponents",
          "types",
          "primaryType",
        ],
      });

      if (result.place) {
        const placeData = result.place;
        onChange(placeData.displayName || "");

        let city = "";
        let sublocality = "";
        let pincode = "";
        if (placeData.addressComponents) {
          const components = placeData.addressComponents as {
            longText: string;
            types: string[];
          }[];
          console.log(`Component: ${components}`);

          // 1. Extract City (Locality)
          const cityComponent = components.find((c) =>
            c.types.includes("locality"),
          );
          if (cityComponent) city = cityComponent.longText;

          // 2. Extract Sublocality - STRICT PRIORITY
          // Find Level 1
          const subLoc1 = components.find((c) =>
            c.types.includes("sublocality_level_1"),
          );
          // Find Level 2
          const subLoc2 = components.find((c) =>
            c.types.includes("sublocality_level_2"),
          );
          // Find Generic
          const subLocGeneric = components.find((c) =>
            c.types.includes("sublocality"),
          );

          // Apply Priority: 1 > 2 > Generic
          if (subLoc1) {
            sublocality = subLoc1.longText;
          } else if (subLoc2) {
            sublocality = subLoc2.longText;
          } else if (subLocGeneric) {
            sublocality = subLocGeneric.longText;
          }

          // 3. Extract Pincode
          const pincodeComponent = components.find((c) =>
            c.types.includes("postal_code"),
          );
          if (pincodeComponent) pincode = pincodeComponent.longText;

          console.log("Extracted data:", {
            city,
            sublocality,
            pincode,
            types: placeData.types,
            primaryType: placeData.primaryType,
          });
        }

        if (placeData.location && onLocationSelect) {
          const lat = Number(placeData.location.lat());
          const lng = Number(placeData.location.lng());

          if (!isNaN(lat) && !isNaN(lng)) {
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              name: placeData.displayName,
              address: placeData.formattedAddress,
              city: city,
            });
          }
        }
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < predictions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < predictions.length) {
          selectPrediction(predictions[focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Reset focused index when predictions change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [predictions]);

  // Scroll active option into view
  useEffect(() => {
    if (!showDropdown) return;
    if (focusedIndex < 0) return;

    if (activeOptionRef.current) {
      activeOptionRef.current.scrollIntoView({
        block: "nearest",
      });
    }
  }, [focusedIndex, showDropdown]);

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          onBlur?.();
          setTimeout(() => {
            setShowDropdown(false);
            setFocusedIndex(-1);
          }, 200);
        }}
        placeholder={placeholder}
        className={`${inputClassName} ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "cursor-not-allowed bg-gray-50" : ""}`}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={
          focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined
        }
        disabled={disabled}
      />

      {showDropdown && predictions.length > 0 && (
        <div
          className={dropdownClassName}
          role="listbox"
          id={`${id}-listbox`}
          aria-label="Location suggestions"
        >
          {predictions.map((prediction, index) => {
            const typeLabel = getTypeLabel(
              prediction.types,
              prediction.primaryType,
            );

            return (
              <div
                key={prediction.placeId}
                id={`${id}-option-${index}`}
                ref={index === focusedIndex ? activeOptionRef : null}
                className={`${dropdownItemClassName} ${index === focusedIndex ? "bg-gray-100" : ""}`}
                onClick={() => selectPrediction(prediction)}
                role="option"
                aria-selected={index === focusedIndex}
                tabIndex={-1}
              >
                <div className="flex flex-col w-full gap-0.5">
                  <div className="flex items-center w-full gap-1">
                    <span className="mt-0.5 text-gray-500 flex-shrink-0">
                      <MapPin size={16} />
                    </span>
                    <div className="flex items-center w-11/12 gap-2">
                      <div className="text-sm font-medium truncate">
                        {prediction.mainText}
                      </div>
                      {typeLabel && (
                        <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full whitespace-nowrap flex-shrink-0">
                          {typeLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 truncate">
                    {prediction.secondaryText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div className={errorClassName} id={`${id || name}-error`} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

const PlacesAutocomplete = (props: PlacesAutocompleteProps) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <PlacesAutocompleteBase {...props} />
    </APIProvider>
  );
};

export default PlacesAutocomplete;
