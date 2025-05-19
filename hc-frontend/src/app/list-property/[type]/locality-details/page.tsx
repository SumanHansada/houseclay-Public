"use client";

import { useFormikContext } from "formik";
import { MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormDropdown from "@/components/common/FormDropdown";
import FormPlacesAutocomplete from "@/components/common/FormPlacesAutoCompletes";
import GoogleMaps from "@/components/common/GoogleMaps";
import { FormValues } from "@/interfaces/FormValues";
import {
  FormType,
  setFormValidity,
  setLocalityDetails,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

export const dynamicParams = true;

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

const LocalityDetailsPage: React.FC = () => {
  const { values, errors, touched, setFieldError, setErrors, setFieldValue } =
    useFormikContext<FormValues>();
  const params = useParams();
  const formKey = `${params?.type}Form` as FormType;
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  const localityDetailsString = JSON.stringify(values.localityDetails);

  // Set default city to Bengaluru when component mounts
  useEffect(() => {
    if (!values.localityDetails.city) {
      setFieldValue("localityDetails.city", "Bengaluru");
    }
  }, [setFieldValue, values.localityDetails.city]);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        await localitySchema.validate(values, { abortEarly: false });
        // Clear any previous errors
        setErrors({});
        // Set form data in the store
        dispatch(
          setLocalityDetails({
            type: formKey,
            localityDetails: values.localityDetails,
          }),
        );
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
    localityDetailsString,
    dispatch,
    formKey,
    setErrors,
    setFieldError,
    isFormValid,
    values,
  ]);

  useEffect(() => {
    const cityLatLngMapping: Record<string, { lat: number; lng: number }> = {
      Mumbai: { lat: 19.076, lng: 72.8777 },
      Delhi: { lat: 28.6139, lng: 77.209 },
      Bengaluru: { lat: 12.9716, lng: 77.5946 },
      Hyderabad: { lat: 17.385, lng: 78.4867 },
      Chennai: { lat: 13.0827, lng: 80.2707 },
      Kolkata: { lat: 22.5726, lng: 88.3639 },
      Pune: { lat: 18.5204, lng: 73.8567 },
      Ahmedabad: { lat: 23.0225, lng: 72.5714 },
      Jaipur: { lat: 26.9124, lng: 75.7873 },
      Lucknow: { lat: 26.8467, lng: 80.9462 },
    };

    // Set default latitude and longitude based on selected city
    const selectedCity = values.localityDetails.city;
    const defaultLatLng = cityLatLngMapping[selectedCity] || { lat: 0, lng: 0 };
    setFieldValue("localityDetails.latitude", defaultLatLng.lat);
    setFieldValue("localityDetails.longitude", defaultLatLng.lng);
  }, [values.localityDetails.city, setFieldValue]);

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
              disabled={true}
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
            lat: values.localityDetails.latitude || 12.9716,
            lng: values.localityDetails.longitude || 77.5946,
          }}
          zoom={12}
          className="h-full w-full border rounded-xl shadow-lg"
          key={`${values.localityDetails.latitude}-${values.localityDetails.longitude}`}
        />
      </div>
    </>
  );
};

export default LocalityDetailsPage;
