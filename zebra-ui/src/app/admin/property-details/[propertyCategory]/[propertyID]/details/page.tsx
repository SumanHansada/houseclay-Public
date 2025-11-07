"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";

import {
  PropertyDetailsFlatmateForm,
  PropertyDetailsRentForm,
  PropertyDetailsResaleForm,
} from "@/components/forms";
import LocalityDetailsForm from "@/components/forms/LocalityDetailsForm";
import { FormValues } from "@/interfaces/FormValues";
import { RootState } from "@/store/store";
import FlatmateDetailsForm from "@/components/forms/FlatmateDetailsForm";
import ResaleDetailsForm from "@/components/forms/ResaleDetailsForm";
import RentalDetailsForm from "@/components/forms/RentalDetailsForm";
import GalleryForm from "@/components/forms/GalleryForm";
import AdditionalInfoRentForm from "@/components/forms/AdditionalInfoRentForm";
import AdditionalInfoResaleForm from "@/components/forms/AdditionalInfoResaleForm";
import AdditionalInfoFlatmateForm from "@/components/forms/AdditionalInfoFlatmateForm";
import { transformFormValuesToPropertyForm } from "@/interfaces/FormTransformers";
import { extractS3KeyFromUrl } from "@/common/utils";
import { usePropertyUpdateMutation } from "@/store/apiSlice";
import { useRouter } from "next/navigation";

export default function DetailsPage() {
  const [editMode, setEditMode] = useState(false);
  const [updateProperty, { isLoading: isUpdatingProperty }] =
    usePropertyUpdateMutation();
    
  const router = useRouter()

  const formState = useSelector((state: RootState) => state.editProperty.form);
  const propertyCategory = useSelector(
    (state: RootState) => state.editProperty.propertyCategory,
  );
  const propertyID = useSelector(
    (state: RootState) => state.editProperty.propertyID,
  );

  const isFormValid = formState?.isValid;

  // Ensure proper form initialization with all required fields
  const getInitialValues = (): FormValues => {
    const data = formState?.data || {};

    // Ensure all required fields are present
    return {
      localityDetails: data.localityDetails,
      images: data.images || [],
      propertyDetails: data.propertyDetails,
      rentalDetails: data.rentalDetails,
      resaleDetails: data.resaleDetails,
      flatmateDetails: data.flatmateDetails,
      additionalInfo: data.additionalInfo,
    };
  };

  const initialValues = getInitialValues();

  // const handleUpdateProperty = async (values: FormValues) => {
  //   console.log("Submitting all changes:", values);
  //   setEditMode(false);
  // };

  const handleUpdateProperty = async () => {
    try {
      // Transform FormValues to PropertyForm using the type-safe transformer
      const formValues = formState.data as FormValues;

      if (!formValues) {
        throw new Error("Form data is not available");
      }

      // Transform to the appropriate PropertyForm type
      const propertyForm = transformFormValuesToPropertyForm(
        formValues,
        propertyID,
        propertyCategory,
      );

      // Extract S3 image keys from propertyForm.images
      // For new images (blob URLs), they should have been uploaded and the S3 URL should be in propertyImagesS3Url
      // For existing images (S3 URLs), extract the key directly from the URL
      const imagesS3Keys = propertyForm.images
        .map((url) => {
          // If it's an existing S3 URL, extract the key
          if (url.startsWith("https://")) {
            return extractS3KeyFromUrl(url) || "";
          }
          // If it's a blob URL, find the S3 URL from propertyImagesS3Url
          const matchingPhoto = propertyImages.find((img) => img.url === url);
          if (matchingPhoto) {
            const s3Url =
              propertyImagesS3Url[encodeURIComponent(matchingPhoto.file.name)];
            return s3Url ? extractS3KeyFromUrl(s3Url) || "" : "";
          }
          return "";
        })
        .filter((key) => key !== ""); // Remove empty keys

      // Add cover image information if needed
      const coverImage = propertyImages.filter((image) => image.isCover);

      // Find the cover image S3 key
      let coverImageS3Key = "";
      if (coverImage.length > 0) {
        const coverImageUrl = coverImage[0].url;
        if (coverImageUrl.startsWith("https://")) {
          coverImageS3Key = extractS3KeyFromUrl(coverImageUrl) || "";
        } else if (coverImageUrl.startsWith("blob:")) {
          const s3Url =
            propertyImagesS3Url[encodeURIComponent(coverImage[0].file.name)];
          coverImageS3Key = s3Url ? extractS3KeyFromUrl(s3Url) || "" : "";
        }
      }

      // Create the final API payload
      const apiPayload = {
        ...propertyForm,
        propertyID: propertyID, // Use propertyID from URL for update
        coverImage: coverImageS3Key,
        images: imagesS3Keys,
      };

      await updateProperty({ payload: apiPayload, phoneNo:  });

      // In case of no images, open list-property-success-dialog
      router.push("/admin/view-all-properties")

      // Don't open success dialog here anymore - it will be opened automatically after upload completes
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 h-full overflow-auto">
      <Formik
        initialValues={initialValues}
        onSubmit={handleUpdateProperty}
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
                    <LocalityDetailsForm disabled={!editMode} />
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {propertyCategory === PropertyCategory.RESALE ? (
                      <ResaleDetailsForm disabled={!editMode} />
                    ) : propertyCategory === PropertyCategory.RENT ? (
                      <RentalDetailsForm disabled={!editMode} />
                    ) : (
                      <FlatmateDetailsForm disabled={!editMode} />
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <GalleryForm disabled={!editMode} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {propertyCategory === PropertyCategory.RESALE ? (
                      <AdditionalInfoResaleForm disabled={!editMode} />
                    ) : propertyCategory === PropertyCategory.RENT ? (
                      <AdditionalInfoRentForm disabled={!editMode} />
                    ) : (
                      <AdditionalInfoFlatmateForm disabled={!editMode} />
                    )}
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
