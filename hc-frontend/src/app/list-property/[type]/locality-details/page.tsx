// app/list-property/[type]/locality-details/page.tsx

"use client";

import { useFormikContext } from "formik";
import { MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormDropdown from "@/components/common/FormDropdown";
import FormPlacesAutocomplete from "@/components/common/FormPlacesAutoCompletes";
import GoogleMaps from "@/components/common/GoogleMaps";
import {
  FormType,
  setFormData,
  setFormValidity,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

import { FormValues } from "../layout";
import LocationFormSkeleton from "./LocationFormSkeleton";

const LocalityDetailsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { values, errors, touched, setFieldError, setErrors, setFieldValue } =
    useFormikContext<FormValues>();
  const params = useParams();
  const formKey = `${params?.type}Form` as FormType; // Optional: add type assertion
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();
  console.log("Locality DetailsPage values", values);
  console.log("Locality DetailsPage errors", errors);
  console.log("Locality DetailsPage touched", touched);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const localitySchema = Yup.object().shape({
    localityDetails: Yup.object().shape({
      city: Yup.string().required("City is required"),
      location: Yup.string().required("Location is required"),
      latitude: Yup.number()
        .required("Latitude is required")
        .min(-90, "Latitude must be greater than or equal to -90")
        .max(90, "Latitude must be less than or equal to 90"),
      longitude: Yup.number()
        .required("Longitude is required")
        .min(-180, "Longitude must be greater than or equal to -180")
        .max(180, "Longitude must be less than or equal to 180"),
    }),
  });

  const cityLatLngMapping: Record<string, { lat: number; lng: number }> = {
    Bengaluru: { lat: 12.9716, lng: 77.5946 },
    Delhi: { lat: 28.6139, lng: 77.209 },
    Mumbai: { lat: 19.076, lng: 72.8777 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Hyderabad: { lat: 17.385, lng: 78.4867 },
    Pune: { lat: 18.5204, lng: 73.8567 },
  };

  useEffect(() => {
    // Set default latitude and longitude based on selected city
    const selectedCity = values.localityDetails.city;
    const defaultLatLng = cityLatLngMapping[selectedCity] || { lat: 0, lng: 0 };
    setFieldValue("localityDetails.latitude", defaultLatLng.lat);
    setFieldValue("localityDetails.longitude", defaultLatLng.lng);
  }, [values.localityDetails.city, setFieldValue]);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await localitySchema.validate(values, { abortEarly: false });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        dispatch(setFormData({ type: formKey, data: { ...values } }));
        // Form is valid
        if (!isFormValid) {
          dispatch(setFormValidity({ type: formKey, isValid: true }));
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          // Clear any previous errors
          setErrors({});
          // Set individual field errors
          err.inner.forEach((validationError) => {
            if (validationError.path && validationError.message) {
              setFieldError(validationError.path, validationError.message);
            }
          });
          // Form is invalid
          if (isFormValid) {
            dispatch(setFormValidity({ type: formKey, isValid: false }));
          }
        }
      }
    };

    validateAndDispatch();
  }, [
    JSON.stringify(values.localityDetails),
    dispatch,
    formKey,
    setErrors,
    setFieldError,
  ]);

  if (isLoading) {
    return <LocationFormSkeleton />;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800">Provide location details</h1>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1">
            <FormDropdown
              label="City"
              name="localityDetails.city"
              id="localityDetails.city"
              options={[
                { value: "Bengaluru", label: "Bengaluru" },
                { value: "Delhi", label: "Delhi" },
                { value: "Mumbai", label: "Mumbai" },
                { value: "Chennai", label: "Chennai" },
                { value: "Kolkata", label: "Kolkata" },
                { value: "Hyderabad", label: "Hyderabad" },
                { value: "Pune", label: "Pune" },
              ]}
              required={true}
              placeholder="Select city"
              aria-describedby={
                errors?.localityDetails?.city && touched?.localityDetails?.city
                  ? "localityDetails.city-error"
                  : undefined
              }
            />
          </div>
          <div className="col-span-1 xl:col-span-2">
            <FormPlacesAutocomplete
              label="Location / Society Name"
              name="localityDetails.location"
              id="localityDetails.location"
              placeholder="Location / Society Name"
              required
              pairWithGoogleMaps
              googleMapsFieldName="localityDetails"
            />
          </div>
        </div>
        <div className="mb-6">
          <FormPlacesAutocomplete
            label="Landmark / Street"
            name="localityDetails.landmark"
            id="localityDetails.landmark"
            placeholder="Landmark / Street"
          />
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl text-gray-800">Pin your location on the Map</h3>
        <p className="text-gray-400 mt-2 flex gap-2">
          <MapPin />{" "}
          <span>
            Set property location by using search box and move the map
          </span>
        </p>
      </div>
      <div className="mt-4 h-96">
        <GoogleMaps
          mapId="houseclay-googlemaps"
          center={{
            lat: values.localityDetails.latitude,
            lng: values.localityDetails.longitude,
          }}
          zoom={12}
          className="h-full w-full rounded-lg shadow-lg"
        />
      </div>
    </>
  );
};

export default LocalityDetailsPage;
