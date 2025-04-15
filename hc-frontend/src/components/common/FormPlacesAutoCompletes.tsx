import "../../app/google-places-autocomplete.css"; // Import the CSS

import { useField, useFormikContext } from "formik";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FormPlacesAutocompleteProps {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  required?: boolean;
}

const FormPlacesAutocomplete = ({
  label,
  name,
  id,
  placeholder = "Search places",
  required = false,
}: FormPlacesAutocompleteProps) => {
  const [field, meta, helpers] = useField(name);
  const { setFieldValue, setTouched } = useFormikContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if Google Maps is available globally
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
      } else {
        // If not loaded yet, check again in a moment
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  // Set up autocomplete when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: [
            "formatted_address",
            "geometry",
            "name",
            "address_components",
          ],
          types: ["geocode", "establishment"],
          componentRestrictions: { country: "in" },
        },
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address && place.geometry) {
          const latitude = place.geometry.location?.lat();
          const longitude = place.geometry.location?.lng();

          helpers.setValue(place.formatted_address);
          helpers.setTouched(true);
          setFieldValue("latitude", latitude);
          setFieldValue("longitude", longitude);
          setShowDropdown(false);
        }
      });
    }
  }, [isLoaded]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    helpers.setValue(value);

    if (value.length > 2 && isLoaded) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "in" },
          types: ["geocode", "establishment"],
        },
        (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setPredictions(results);
            setShowDropdown(true);
          } else {
            setPredictions([]);
            setShowDropdown(false);
          }
        },
      );
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  // Handle selection from dropdown
  const selectPrediction = (
    prediction: google.maps.places.AutocompletePrediction,
  ) => {
    if (isLoaded) {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement("div"),
      );
      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["formatted_address", "geometry", "name"],
        },
        (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            helpers.setValue(place.formatted_address);
            helpers.setTouched(true);
            setFieldValue("latitude", place.geometry?.location?.lat());
            setFieldValue("longitude", place.geometry?.location?.lng());
            setShowDropdown(false);
          }
        },
      );
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
          setTimeout(() => {
            setShowDropdown(false);
            setTouched({ [name]: true });
          }, 200);
        }}
        placeholder={placeholder}
        className={`w-full p-3 border ${
          hasError ? "border-red-500" : "border-gray-300"
        } rounded-xl focus:ring-red-500 focus:border-red-500`}
        type="text"
        // These attributes help prevent browser's native autocomplete
        autoComplete="off"
        role="presentation"
      />

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-10 mt-1 py-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => selectPrediction(prediction)}
            >
              <span className="text-gray-500 mr-2">
                <MapPin size={20} />
              </span>
              <div>
                <div className="text-sm font-medium">
                  {prediction.structured_formatting.main_text}
                </div>
                <div className="text-xs text-gray-500">
                  {prediction.structured_formatting.secondary_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasError && (
        <div className="mt-1 text-sm text-red-500">{meta.error}</div>
      )}
    </div>
  );
};

export default FormPlacesAutocomplete;
