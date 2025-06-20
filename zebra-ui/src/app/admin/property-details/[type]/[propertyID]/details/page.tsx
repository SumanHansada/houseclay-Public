"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

// import { useGetPropertyByIDQuery } from "@/store/apiSlice";
import {
  setPropertyData,
  setPropertyLoading,
  setPropertyError,
} from "@/store/propertyDetailsSlice";
import { transformApiToFormValues } from "@/utils/dataTransformer";
import { RootState } from "@/store/store";
import {
  GetPropertyByIDResponse,
  PropertyDetailsFormValues,
} from "@/interfaces/Property";

// Import your DUMB form components
import PropertyDetailsForm from "../../../components/PropertyDetailsForm";
import LocalityDetailsForm from "../../../components/LocalityDetailsForm";
import { dummyGetRentPropertyDetails } from "@/mock/propertyDetailsDummy";
import AdditionalInfoForm from "../../../components/AdditionalInfoForm";
import GalleryForm from "../../../components/GalleryForm";
import RentalDetailsForm from "../../../components/RentalDetailsForm";
import ResaleDetailsForm from "../../../components/ResaleDetailsForm";

// import LocalityDetailsForm from "@/components/forms/LocalityDetailsForm"; // etc.

// Define a combined validation schema
const validationSchema = Yup.object({
  propertyDetails: Yup.object({
    propertyType: Yup.string().required("Property type is required"),
    builtUpArea: Yup.number()
      .required("Built up area is required")
      .positive("Area must be positive"),
    facing: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Facing is required"),
    }),
    bhkType: Yup.string().required("BHK type is required"),
    ownershipType: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Ownership type is required"),
    }),
    propertyAge: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Property age is required"),
    }),
    floor: Yup.number().required("Floor is required"),
    totalFloors: Yup.number().required("Total floors is required"),
    floorType: Yup.string().when("$formKey", {
      is: "flatmatesForm",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required("Floor type is required"),
    }),
  }),
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
  rentalDetails: Yup.object().shape({
    rent: Yup.string()
      .required("Rent is required")
      .test(
        "is-greater-than-zero",
        "Rent must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    deposit: Yup.string()
      .required("Deposit is required")
      .test(
        "is-greater-than-zero",
        "Deposit must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    availableFrom: Yup.string().required("Available from is required"),
    furnishing: Yup.string().required("Furnishing is required"),
    preferredTenants: Yup.array()
      .of(Yup.string())
      .when("$formKey", {
        is: "rentForm",
        then: (schema) =>
          schema
            .required("Preferred tenant is required")
            .min(1, "Select at least one preferred tenant"),
        otherwise: (schema) => schema.optional(),
      }),
    waterSupply: Yup.string().required("Water supply is required"),
    powerBackup: Yup.string().required("Power backup is required"),
    parking: Yup.boolean().required("Parking is required"),
    nonVegAllowed: Yup.boolean().required("Non veg allowed is required"),
  }),
  resaleDetails: Yup.object().shape({
    price: Yup.string()
      .required("Price is required")
      .test(
        "is-greater-than-zero",
        "Price must be greater than zero",
        (value) => parseFloat(value || "0") > 0,
      ),
    availableFrom: Yup.string().required("Available from is required"),
    bathrooms: Yup.number().required("Bathrooms is required"),
    furnishing: Yup.string().required("Furnishing is required"),
    parking: Yup.boolean().required("Parking is required"),
  }),
  images: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().optional(),
    }),
  ),
  additionalInfo: Yup.object().shape({
    whoWillShowProperty: Yup.string(),
    secondaryPhoneNumber: Yup.string(),
    khataCertificate: Yup.string().when("$formKey", {
      is: "resaleForm",
      then: (schema) => schema.required("Khata Certificate is required"),
      otherwise: (schema) => schema.optional(),
    }),
    saleDeed: Yup.boolean().when("$formKey", {
      is: "resaleForm",
      then: (schema) => schema.required("Sale Deed is required"),
      otherwise: (schema) => schema.optional(),
    }),
    propertyTax: Yup.boolean().when("$formKey", {
      is: "resaleForm",
      then: (schema) => schema.required("Property Tax is required"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
});

export default function DetailsPage() {
  const { propertyId, type } = useParams() as {
    propertyId: string;
    type: "rent" | "resale" | "flatmate";
  };
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);

  // 1. Fetch data using RTK Query
  // const {
  //   data: apiResponse,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetPropertyByIDQuery(propertyId);

  useEffect(() => {
    dispatch(setPropertyLoading());

    const timer = setTimeout(() => {
      const apiResponse: GetPropertyByIDResponse =
        dummyGetRentPropertyDetails as any;
      dispatch(setPropertyData(apiResponse));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // 2. Populate Redux store when API call succeeds or fails
  // useEffect(() => {
  //   if (isLoading) {
  //     dispatch(setPropertyLoading());
  //   }
  //   if (isSuccess && apiResponse) {
  //     dispatch(setPropertyData(apiResponse));
  //   }
  //   if (isError) {
  //     dispatch(setPropertyError(JSON.stringify(error)));
  //   }
  // }, [apiResponse, isLoading, isSuccess, isError, error, dispatch]);

  const propertyDataFromStore = useSelector(
    (state: RootState) => state.propertyDetails.data,
  );
  const status = useSelector(
    (state: RootState) => state.propertyDetails.status,
  );

  const initialValues = useMemo(
    () => transformApiToFormValues(propertyDataFromStore),
    [propertyDataFromStore],
  );

  const handleSaveChanges = async (values: PropertyDetailsFormValues) => {
    console.log("Submitting all changes:", values);
    // await updateProperty({ propertyId, data: transformFormToApi(values) }).unwrap();
    setEditMode(false);
  };

  if (status === "loading" || status === "idle" || !initialValues) {
    return (
      <div className="h-full flex items-center justify-center text-lg">
        Loading property details...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="h-full flex items-center justify-center text-lg">
        Error loading property. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-100 h-full overflow-auto">
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSaveChanges}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <div className="my-8 mx-16 flex flex-col gap-5 flex-1 relative">
              <div className="flex justify-between bg-white py-3 px-6 sticky top-0 rounded-xl z-10 border-b border-b-gray-400 shadow-sm items-center">
                <h1 className="text-2xl">
                  {editMode ? "Edit Mode" : "View Mode"}
                </h1>
                {editMode ? (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        formik.resetForm();
                        setEditMode(false);
                      }}
                      className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
                      disabled={!formik.dirty || !formik.isValid}
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white"
                  >
                    Edit
                  </button>
                )}
              </div>

              <FormikProvider value={formik}>
                <div className="flex flex-col gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <PropertyDetailsForm disabled={!editMode} type={type} />
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <LocalityDetailsForm
                      // formik={formik}
                      disabled={!editMode}
                      type={type}
                    />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {type === "resale" ? (
                      <ResaleDetailsForm disabled={!editMode} type={type} />
                    ) : (
                      <RentalDetailsForm disabled={!editMode} type={type} />
                    )}
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <GalleryForm
                      // formik={formik}
                      disabled={!editMode}
                      type={type}
                    />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <AdditionalInfoForm disabled={!editMode} type={type} />
                  </div>
                </div>
              </FormikProvider>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
