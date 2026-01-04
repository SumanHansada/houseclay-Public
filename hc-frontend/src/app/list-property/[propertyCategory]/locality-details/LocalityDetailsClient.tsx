"use client";

import { useFormikContext } from "formik";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { CITY_LAT_LNG_MAPPING } from "@/common/constants";
import {
  FormPlacesAutocomplete,
  FormSelectDropdown,
  FormTextField,
} from "@/form-components";
import { FormValues } from "@/interfaces/FormValues";
import { setFormValidity, setLocalityDetails } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { GoogleMaps } from "@/utility-components";
import {
  getLocalityDetailsErrors,
  getLocalityDetailsTouched,
} from "@/utils/formHelpers";
import { BENGALURU_BOUNDS, isWithinBounds } from "@/utils/geoBounds";

const localitySchema = Yup.object().shape({
  localityDetails: Yup.object().shape({
    city: Yup.string().required("City is required"),
    locationOrSocietyName: Yup.string().required("Location is required"),
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

const LocalityDetailsClient: React.FC = () => {
  const { values, errors, touched, setFieldError, setErrors, setFieldValue } =
    useFormikContext<FormValues>();
  const formState = useSelector((state: RootState) => state.listProperty.form);
  const isFormValid = formState?.isValid;
  const dispatch = useDispatch();

  // Get locality details errors and touched states
  const localityDetailsErrors = getLocalityDetailsErrors(errors);
  const localityDetailsTouched = getLocalityDetailsTouched(touched);

  const onLocationSelect = (location: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    city?: string;
  }) => {
    if (location.city && values.localityDetails?.city) {
      if (
        !isWithinBounds(location.latitude, location.longitude, BENGALURU_BOUNDS)
      ) {
        toast.error(`Please select a location within Bengaluru`, {
          duration: 5000,
        });
        setFieldValue("localityDetails.city", "");
        setFieldValue("localityDetails.latitude", 0);
        setFieldValue("localityDetails.longitude", 0);
        setFieldValue("localityDetails.locationOrSocietyName", "");
        setFieldValue("localityDetails.landmark", "");
        return;
      }
    }
    setFieldValue("localityDetails.latitude", location.latitude);
    setFieldValue("localityDetails.longitude", location.longitude);
    if (location.name) {
      setFieldValue("localityDetails.locationOrSocietyName", location.name);
    }
    if (location.address) {
      setFieldValue("localityDetails.landmark", location.address);
    }
  };

  const localityDetailsString = JSON.stringify(values.localityDetails);

  // Set default city to Bengaluru when component mounts
  useEffect(() => {
    if (!values.localityDetails?.city) {
      setFieldValue("localityDetails.city", "Bengaluru");
    }
  }, [setFieldValue, values.localityDetails?.city]);

  useEffect(() => {
    const validateAndDispatch = async () => {
      try {
        // Only validate if localityDetails exists
        if (values.localityDetails) {
          await localitySchema.validate(values, { abortEarly: false });
          // Clear any previous errors
          setErrors({});
          // Set form data in the store
          dispatch(
            setLocalityDetails({
              localityDetails: values.localityDetails,
            }),
          );
          // Form is valid
          if (!isFormValid) {
            dispatch(setFormValidity({ isValid: true }));
          }
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
            dispatch(setFormValidity({ isValid: false }));
          }
        }
      }
    };

    validateAndDispatch();
  }, [
    localityDetailsString,
    dispatch,
    setErrors,
    setFieldError,
    isFormValid,
    values,
  ]);

  // Extract city value for dependency array
  const selectedCity = values.localityDetails?.city || "";

  useEffect(() => {
    // Set default latitude and longitude based on selected city *only if not already set*
    if (
      selectedCity &&
      (!values.localityDetails?.latitude || !values.localityDetails?.longitude)
    ) {
      const defaultLatLng = CITY_LAT_LNG_MAPPING[selectedCity] || {
        lat: 0,
        lng: 0,
      };
      setFieldValue("localityDetails.latitude", defaultLatLng.lat);
      setFieldValue("localityDetails.longitude", defaultLatLng.lng);
    }
  }, [
    selectedCity,
    setFieldValue,
    values.localityDetails?.latitude,
    values.localityDetails?.longitude,
  ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800 md:text-3xl">
          Provide location details
        </h1>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-1">
            <FormSelectDropdown
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
                localityDetailsErrors?.city && localityDetailsTouched?.city
                  ? "localityDetails.city-error"
                  : undefined
              }
            />
          </div>
          <div className="col-span-1 xl:col-span-2">
            <FormPlacesAutocomplete
              label="Location / Society Name"
              name="localityDetails.locationOrSocietyName"
              id="localityDetails.locationOrSocietyName"
              placeholder="Location / Society Name"
              required
              onLocationSelect={onLocationSelect}
              containerClassName="w-full relative"
              labelClassName="block text-sm font-medium text-gray-700 mb-1"
              inputClassName="w-full p-3 border rounded-xl"
              dropdownClassName="absolute z-10 mt-1 py-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto"
              dropdownItemClassName="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
              errorClassName="mt-1 text-sm text-red-600"
            />
          </div>
        </div>
        <div className="mb-6">
          <FormTextField
            label="Landmark / Street"
            name="localityDetails.landmark"
            id="localityDetails.landmark"
            placeholder="Landmark / Street"
          />
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl text-gray-800">Pin your location on the Map</h3>
        <p className="flex gap-2 mt-2 text-gray-400">
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
            lat: values.localityDetails?.latitude || 12.9716,
            lng: values.localityDetails?.longitude || 77.5946,
          }}
          zoom={12}
          className="w-full h-full border shadow-lg rounded-xl"
          key={`${values.localityDetails?.latitude || 0}-${values.localityDetails?.longitude || 0}`}
        />
      </div>
    </>
  );
};

export default LocalityDetailsClient;
