"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AnyProperty,
  GetPropertyByIDResponse,
  PropertyCategory,
  PropertyDetailsFormValues,
} from "@/interfaces/Property";
import { dummyGetRentPropertyDetails } from "@/mock/propertyDetailsDummy";
// import { useGetPropertyByIDQuery } from "@/store/apiSlice";
import {
  setPropertyData,
  setPropertyLoading,
} from "@/store/propertyDetailsSlice";
import { RootState } from "@/store/store";
import { transformApiToFormValues } from "@/utils/dataTransformer";

import AdditionalInfoForm from "../../../components/AdditionalInfoForm";
import GalleryForm from "../../../components/GalleryForm";
import LocalityDetailsForm from "../../../components/LocalityDetailsForm";
// Import your DUMB form components
import PropertyDetailsForm from "../../../components/PropertyDetailsForm";
import RentalDetailsForm from "../../../components/RentalDetailsForm";
import ResaleDetailsForm from "../../../components/ResaleDetailsForm";

// import LocalityDetailsForm from "@/components/forms/LocalityDetailsForm"; // etc.

export default function DetailsPage() {
  const { propertyID, type } = useParams() as {
    propertyID: string;
    type: "rent" | "resale" | "flatmate";
  };
  console.log(propertyID);
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
      const category = dummyGetRentPropertyDetails.propertyDetails
        .propertyCategory as PropertyCategory;

      const apiResponse: GetPropertyByIDResponse = {
        ...dummyGetRentPropertyDetails,
        propertyDetails: {
          ...dummyGetRentPropertyDetails.propertyDetails,
          propertyCategory: category,
        } as AnyProperty,
      };
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
