"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { FormValues } from "@/interfaces/FormValues";
import { RootState } from "@/store/store";
import { apiToForm } from "@/utils/transform/propertyToFormValues";

import AdditionalInfoForm from "../../../components/AdditionalInfoForm";
import GalleryForm from "../../../components/GalleryForm";
import LocalityDetailsForm from "../../../components/LocalityDetailsForm";
import PropertyDetailsForm from "../../../components/PropertyDetailsForm";
import RentalDetailsForm from "../../../components/RentalDetailsForm";
import ResaleDetailsForm from "../../../components/ResaleDetailsForm";
import { PropertyCategoryEnum } from "@/common/enums";

export default function DetailsPage() {
  const [editMode, setEditMode] = useState(false);

  const {
    data: propertyData,
    status,
    propertyCategory,
  } = useSelector((state: RootState) => state.propertyDetails);

  const initialValues = useMemo(
    () => (propertyData ? apiToForm(propertyData) : undefined),
    [propertyData],
  );

  if (status !== "succeeded" || !initialValues) {
    return null;
  }
  console.log("initialValues: ", initialValues);

  const handleSaveChanges = async (values: FormValues) => {
    console.log("Submitting all changes:", values);
    setEditMode(false);
  };

  return (
    <div className="flex flex-col bg-gray-100 h-full overflow-auto">
      <Formik
        initialValues={initialValues}
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
                    <PropertyDetailsForm disabled={!editMode} />
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <LocalityDetailsForm disabled={!editMode} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {propertyCategory === PropertyCategoryEnum.RESALE ? (
                      <ResaleDetailsForm disabled={!editMode} />
                    ) : (
                      <RentalDetailsForm disabled={!editMode} />
                    )}
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <GalleryForm disabled={!editMode} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <AdditionalInfoForm disabled={!editMode} />
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
