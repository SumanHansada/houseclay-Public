"use client";

import "../../app/google-places-autocomplete.css";

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
}

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
  // Styling props with defaults
  containerClassName = "w-full relative",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  inputClassName = "w-full p-3 border rounded-xl",
  dropdownClassName = "absolute z-10 mt-1 py-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto",
  dropdownItemClassName = "py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center",
  errorClassName = "mt-1 text-sm text-red-600",
}: PlacesAutocompleteProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const checkGoogleMapsLoaded = async () => {
      if (window.google?.maps?.places) {
        setIsLoaded(true);
      } else {
        timeoutRef.current = setTimeout(checkGoogleMapsLoaded, 250);
      }
    };

    checkGoogleMapsLoaded();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle manual input changes
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.length > 2 && isLoaded) {
      try {
        const places = (await google.maps.importLibrary("places")) as unknown;
        // Type guard or cast to the expected type
        const placeLib = places as {
          Place: {
            searchByText: (args: {
              textQuery: string;
              fields: string[];
              region: string;
              locationBias: {
                center: { lat: number; lng: number };
                radius: number;
              };
            }) => Promise<{
              places?: {
                id: string;
                displayName?: string;
                formattedAddress?: string;
                location: {
                  lat: () => number;
                  lng: () => number;
                };
              }[];
            }>;
          };
        };
        const result = await placeLib.Place.searchByText({
          textQuery: newValue,
          fields: ["id", "displayName", "formattedAddress", "location"],
          region: "IN",
          locationBias: {
            center: { lat: 12.9716, lng: 77.5946 },
            radius: 50000, // radius in meters
          },
        });

        if (result.places && result.places.length > 0) {
          const formattedPredictions = result.places.map((place) => ({
            id: place.id,
            mainText: place.displayName || "",
            secondaryText: place.formattedAddress || "",
            placeId: place.id,
            latitude: place.location.lat(),
            longitude: place.location.lng(),
          }));
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
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  // Handle selection from dropdown
  const selectPrediction = async (prediction: PlacePrediction) => {
    if (isLoaded) {
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
          ],
        });

        if (result.place) {
          const placeData = result.place;
          onChange(placeData.displayName || "");
          let city = "";
          if (placeData.addressComponents) {
            for (const component of placeData.addressComponents) {
              const componentType = component.types[0];
              if (
                componentType === "locality" ||
                componentType === "administrative_area_level_1"
              ) {
                city = component.longText;
                break;
              }
            }
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
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        className={`${inputClassName} ${error ? "border-red-500" : "border-gray-300"}`}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={
          focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined
        }
      />

      {showDropdown && predictions.length > 0 && (
        <div
          className={dropdownClassName}
          role="listbox"
          id={`${id}-listbox`}
          aria-label="Location suggestions"
        >
          {predictions.map((prediction, index) => (
            <div
              key={prediction.placeId}
              id={`${id}-option-${index}`}
              className={`${dropdownItemClassName} ${index === focusedIndex ? "bg-gray-100" : ""}`}
              onClick={() => selectPrediction(prediction)}
              role="option"
              aria-selected={index === focusedIndex}
              tabIndex={-1}
            >
              <span className="text-gray-500 mr-2">
                <MapPin size={20} />
              </span>
              <div>
                <div className="text-sm font-medium">{prediction.mainText}</div>
                <div className="text-xs text-gray-500">
                  {prediction.secondaryText}
                </div>
              </div>
            </div>
          ))}
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
