"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import AdditionalInfoForm from "@/app/admin/property-details/components/AdditionalInfoForm";
import GalleryForm from "@/app/admin/property-details/components/GalleryForm";
import LocalityDetailsForm from "@/app/admin/property-details/components/LocalityDetailsForm";
import { OwnerDetails } from "@/app/admin/property-details/components/OwnerDetails";
import PropertyDetailsForm from "@/app/admin/property-details/components/PropertyDetailsForm";
import RentalDetailsForm from "@/app/admin/property-details/components/RentalDetailsForm";
import ResaleDetailsForm from "@/app/admin/property-details/components/ResaleDetailsForm";
import { FormValues } from "@/interfaces/FormValues";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { apiToForm } from "@/utils/transform/propertyToFormValues";
import { PropertyCategoryEnum } from "@/common/enums";
import { VerificationPanel } from "@/app/admin/property-details/components/VerificationPanel";

export default function VerifyPropertyDetailsPage() {
  const { propertyID } = useParams() as {
    propertyID: string;
  };
  const router = useRouter();

  // --- From DetailsPage: Formik & Edit Mode State ---
  const [editMode, setEditMode] = useState(false);

  const { data: currentProperty } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });
  const currentUser = currentProperty!.owner;
  const formRef = useRef<HTMLFormElement>(null);

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
  console.log("initialValues:", initialValues);
  console.log("propertyCategory: ", propertyCategory);

  // --- Event Handlers ---
  const handleSaveChanges = async (values: FormValues) => {
    console.log("Submitting all changes:", values);
    setEditMode(false);
  };

  const viewUserDetails = (userPhoneNo: string) => {
    router.push(`/admin/user-details/${userPhoneNo}`);
  };

  return (
    <div className="h-full bg-gray-100 flex flex-col px-4 py-8">
      <div className="flex-1 flex min-h-0 gap-5">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSaveChanges}
          enableReinitialize
        >
          {(formik) => (
            // Left Scrollable Column now contains the full form
            <Form
              ref={formRef}
              className="flex flex-col gap-5 w-2/3 overflow-y-auto pr-2 relative"
            >
              <FormikProvider value={formik}>
                {/* --- Sticky Header from DetailsPage --- */}
                <div className="flex justify-between bg-white py-3 px-6 sticky top-0 rounded-xl z-10 border-b shadow-sm items-center">
                  <h1 className="text-2xl font-bold">
                    {editMode ? "Editing Property" : "Viewing Property"}
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

                {/* --- Form Sections from DetailsPage --- */}
                <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-6">
                  <PropertyDetailsForm disabled={!editMode} />
                  <LocalityDetailsForm disabled={!editMode} />
                  {propertyCategory === PropertyCategoryEnum.RESALE ? (
                    <ResaleDetailsForm disabled={!editMode} />
                  ) : (
                    <RentalDetailsForm disabled={!editMode} />
                  )}
                  <AdditionalInfoForm disabled={!editMode} />
                </div>
                {/* Gallery Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <GalleryForm disabled={!editMode} />
                </div>
                {/* Owner Details Section */}
                <div className="p-6 rounded-xl bg-white shadow-sm">
                  <OwnerDetails
                    currentUser={currentUser}
                    viewUserDetails={viewUserDetails}
                  />
                </div>
              </FormikProvider>
            </Form>
          )}
        </Formik>

        {/* Right Fixed Column (Verification Panel) */}
        <VerificationPanel
          propertyID={propertyID}
          formScrollRef={formRef}
          userPhoneNo={currentUser.phoneNo}
        />
      </div>
    </div>
  );
}
