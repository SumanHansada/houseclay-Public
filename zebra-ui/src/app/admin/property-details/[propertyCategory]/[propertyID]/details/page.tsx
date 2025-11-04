"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { PropertyResponseFormValues } from "@/interfaces/Property";
import { selectFormData } from "@/store/propertyDetailsSlice";

// import AdditionalInfoForm from "../../../components/AdditionalInfoForm";
import GalleryForm from "../../../components/GalleryForm";
import {
  PropertyDetailsFlatmateForm,
  PropertyDetailsRentForm,
  PropertyDetailsResaleForm,
} from "@/components/forms";
// import LocalityDetailsForm from "../../../components/LocalityDetailsForm";
// import PropertyDetailsForm from "../../../components/PropertyDetailsForm";
// import RentalDetailsForm from "../../../components/RentalDetailsForm";
// import ResaleDetailsForm from "../../../components/ResaleDetailsForm";

export default function DetailsPage() {
  const [editMode, setEditMode] = useState(false);

  const propertyData = useSelector(selectFormData);

  if (!propertyData) return null;
  const { propertyCategory } = propertyData;

  const handleSaveChanges = async (values: PropertyResponseFormValues) => {
    console.log("Submitting all changes:", values);
    setEditMode(false);
  };

  return (
    <div className="flex flex-col bg-gray-100 h-full overflow-auto">
      <Formik
        initialValues={propertyData}
        onSubmit={handleSaveChanges}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <FormikProvider value={formik}>
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

                <div className="flex flex-col gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {propertyCategory === PropertyCategory.RESALE ? (
                      <PropertyDetailsResaleForm disabled={!editMode} />
                    ) : propertyCategory === PropertyCategory.RENT ? (
                      <PropertyDetailsRentForm disabled={!editMode} />
                    ) : (
                      <PropertyDetailsFlatmateForm disabled={!editMode} />
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {/* <LocalityDetailsForm disabled={!editMode} /> */}
                  </div>
                  {/* <div className="bg-white rounded-xl p-6 shadow-sm">
                    {propertyCategory === PropertyCategory.RESALE ? (
                      <ResaleDetailsForm disabled={!editMode} />
                    ) : (
                      <RentalDetailsForm disabled={!editMode} />
                    )}
                  </div> */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <GalleryForm disabled={!editMode} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {/* <AdditionalInfoForm disabled={!editMode} /> */}
                  </div>
                </div>
              </div>
            </FormikProvider>
          </Form>
        )}
      </Formik>
    </div>
  );
}
