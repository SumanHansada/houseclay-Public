"use client";

import "../../app/google-places-autocomplete.css"; // Import the CSS

import { useField, useFormikContext } from "formik";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { FormValues } from "@/interfaces/FormValues";

interface FormPlacesAutocompleteProps {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  pairWithGoogleMaps?: boolean;
  googleMapsFieldName?: string;
}

interface PlacePrediction {
  id: string;
  mainText: string;
  secondaryText: string;
  placeId: string;
}

const FormPlacesAutocomplete = ({
  label,
  name,
  id,
  placeholder = "Search places",
  required = false,
  pairWithGoogleMaps = false,
  googleMapsFieldName = "",
}: FormPlacesAutocompleteProps) => {
  const [field, meta, helpers] = useField(name);
  const { setFieldValue } = useFormikContext<FormValues>();
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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

  // Add effect to handle place changes
  useEffect(() => {
    if (field.value && pairWithGoogleMaps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: field.value }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          setFieldValue(`${googleMapsFieldName}.latitude`, location.lat());
          setFieldValue(`${googleMapsFieldName}.longitude`, location.lng());
        }
      });
    }
  }, [field.value, pairWithGoogleMaps, googleMapsFieldName, setFieldValue]);

  // Handle manual input changes
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    await helpers.setValue(value);
    await helpers.setTouched(true);

    if (value.length > 2 && isLoaded) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const places = (await google.maps.importLibrary("places")) as any;
        const result = await places.Place.searchByText({
          textQuery: value,
          fields: ["id", "displayName", "formattedAddress", "location"],
          region: "IN",
          locationBias: {
            center: { lat: 12.9716, lng: 77.5946 },
            radius: 50000, // radius in meters
          },
        });

        if (result.places && result.places.length > 0) {
          // Transform the places into a format we can display
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedPredictions = result.places.map((place: any) => ({
            id: place.id,
            mainText: place.displayName || "",
            secondaryText: place.formattedAddress || "",
            placeId: place.id,
            latitude: place.location.lat(),
            longitude: place.location.lng(),
          }));
          console.log("formattedPredictions", formattedPredictions);
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
          fields: ["id", "formattedAddress", "location", "displayName"],
        });

        if (result.place) {
          const placeData = result.place;
          const formattedPlaceData = {
            id: placeData.id,
            mainText: placeData.displayName || "",
            secondaryText: placeData.formattedAddress || "",
            placeId: placeData.id,
            latitude: placeData.location.lat(),
            longitude: placeData.location.lng(),
          };
          console.log("formattedPlaceData", formattedPlaceData);
          helpers.setValue(
            `${placeData.displayName}, ${placeData.formattedAddress}` || "",
          );
          helpers.setTouched(true);

          if (pairWithGoogleMaps && placeData.location) {
            const lat = Number(placeData.location.lat());
            const lng = Number(placeData.location.lng());

            if (!isNaN(lat) && !isNaN(lng)) {
              setFieldValue(`${googleMapsFieldName}.latitude`, lat);
              setFieldValue(`${googleMapsFieldName}.longitude`, lng);
            }
          }
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    }
  };

  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full relative">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={name}
        value={field.value}
        onChange={handleInputChange}
        onBlur={() => {
          helpers.setTouched(true);
          setTimeout(() => {
            setShowDropdown(false);
          }, 200);
        }}
        placeholder={placeholder}
        className={`w-full p-3 border ${
          hasError ? "border-red-500" : "border-gray-300"
        } rounded-xl`}
        type="text"
        autoComplete="off"
        role="presentation"
      />

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-10 mt-1 py-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.placeId}
              className="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => selectPrediction(prediction)}
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

      {hasError && (
        <div className="mt-1 text-sm text-red-600" id={`${id || name}-error`}>
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default FormPlacesAutocomplete;
