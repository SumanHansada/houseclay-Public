"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import {
  useDeletePresignedUrlsMutation,
  usePresignedUrlsMutation,
  usePropertyUpdateMutation,
} from "@/store/apiSlice";
import { useRouter } from "next/navigation";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { useS3Deleter } from "@/hooks/useS3Deleter";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { useDialog } from "@/providers/DialogContextProvider";
import { setDeleteFileURLMap, setFileURLMap } from "@/store/editPropertySlice";
import { resetDelete } from "@/store/deleteFromS3Slice";
import { resetUpload } from "@/store/uploadToS3Slice";

type FinalizationStage = "idle" | "deleting" | "uploading" | "updating";

export default function DetailsPage() {
  const [editMode, setEditMode] = useState(false);
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const [getDeletePresignedUrls] = useDeletePresignedUrlsMutation();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const deleteFiles = useS3Deleter();
  const router = useRouter();
  const [updateProperty, { isLoading: isUpdatingProperty }] =
    usePropertyUpdateMutation();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();

  // Get upload state to monitor completion
  const uploadState = useSelector((state: RootState) => state.uploadToS3);
  const deleteState = useSelector((state: RootState) => state.deleteFromS3);

  const propertyImagesS3Url = useSelector(
    (state: RootState) => state.editProperty.propertyImagesS3Url,
  );
  const propertyImages = useSelector(
    (state: RootState) => state.editProperty.propertyImages,
  );
  const deletedImages = useSelector(
    (state: RootState) => state.editProperty.deletedImages,
  );
  const deletedImagesS3Url = useSelector(
    (state: RootState) => state.editProperty.deletedImagesS3Url,
  );
  const formState = useSelector((state: RootState) => state.editProperty.form);
  const propertyCategory = useSelector(
    (state: RootState) => state.editProperty.propertyCategory,
  );
  const propertyID = useSelector(
    (state: RootState) => state.editProperty.propertyID,
  );
  const userPhoneNo = useSelector(
    (state: RootState) => state.propertyDetails.propertyDetails.owner?.phoneNo,
  );

  const isFormValid = formState?.isValid;

  const [finalizationStage, setFinalizationStage] =
    useState<FinalizationStage>("idle");
  const finalizationPlanRef = useRef({
    needsDelete: false,
    needsUpload: false,
  });
  const finalizationOpsRef = useRef({
    deleteStarted: false,
    uploadStarted: false,
    updateStarted: false,
  });

  const buildUploadQueue = () => {
    const photos = propertyImages || [];

    return photos
      .filter((propertyImage: PropertyImage) =>
        propertyImage.url.startsWith("blob:"),
      )
      .map((propertyImage: PropertyImage) => {
        const fileName = propertyImage.file.name;
        const mappedUrl =
          propertyImagesS3Url?.[fileName] ??
          propertyImagesS3Url?.[encodeURIComponent(fileName)];

        if (!mappedUrl) {
          return null;
        }

        return {
          name: fileName,
          url: propertyImage.url,
          type: propertyImage.file.type,
          S3Url: mappedUrl,
        };
      })
      .filter(
        (
          item,
        ): item is {
          name: string;
          url: string;
          type: string;
          S3Url: string;
        } => Boolean(item),
      );
  };

  const buildDeleteQueue = () => {
    const deletedPhotos = deletedImages || [];

    return deletedPhotos
      .map((propertyImage: PropertyImage) => {
        const fileName = propertyImage.file.name;
        const mappedUrl =
          deletedImagesS3Url?.[fileName] ??
          deletedImagesS3Url?.[encodeURIComponent(fileName)];

        if (!mappedUrl) {
          return null;
        }

        return {
          name: fileName,
          S3Url: mappedUrl,
        };
      })
      .filter(
        (
          item,
        ): item is {
          name: string;
          S3Url: string;
        } => Boolean(item),
      );
  };

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

  const uploadFilesToS3 = async () => {
    const photosToUpload = buildUploadQueue();

    if (photosToUpload.length === 0) {
      return;
    }

    openDialog("upload-photos-dialog");

    await uploadFiles(photosToUpload);

    closeDialog("upload-photos-dialog");
  };

  const getDeletePresignedPhotoUrls = async () => {
    // Request delete pre-signed URLs for deleted images
    const deletedPhotos = deletedImages || [];
    if (deletedPhotos.length === 0) {
      return;
    }

    const fileMap: Record<string, string> = {};
    deletedPhotos.forEach((propertyImage: PropertyImage) => {
      fileMap[encodeURIComponent(propertyImage.file.name)] =
        propertyImage.file.type;
    });

    if (Object.keys(fileMap).length === 0) {
      console.log("No files to delete");
      return;
    }

    console.log("Requesting delete presigned URLs for:", fileMap);

    const presignedUrlsResponse = await getDeletePresignedUrls({
      propertyID,
      fileMap,
    })
      .unwrap()
      .catch((error: Error) => {
        console.error("Error fetching delete presigned URLs:", error);
      });

    if (!presignedUrlsResponse) {
      console.error("No delete presigned URLs received");
      return;
    }

    if (!presignedUrlsResponse) {
      console.error("No delete presigned URLs received");
      return;
    }
    dispatch(
      setDeleteFileURLMap({
        data: presignedUrlsResponse.fileURLMap,
      }),
    );
  };

  const deleteFilesFromS3 = async () => {
    const photosToDelete = buildDeleteQueue();

    if (photosToDelete.length === 0) {
      return;
    }

    openDialog("delete-photos-dialog");

    await deleteFiles(photosToDelete);

    closeDialog("delete-photos-dialog");
  };

  const getPresignedPhotoUrls = async () => {
    // Only request pre-signed URLs for new images (blob URLs)
    const newImages = propertyImages.filter((propertyImage: PropertyImage) =>
      propertyImage.url.startsWith("blob:"),
    );

    if (newImages.length === 0) {
      return;
    }

    const fileMap: Record<string, string> = {};
    newImages.forEach((propertyImage: PropertyImage) => {
      fileMap[encodeURIComponent(propertyImage.file.name)] =
        propertyImage.file.type;
    });
    const presignedUrlsResponse = await getPresignedUrls({
      propertyID,
      fileMap,
    })
      .unwrap()
      .catch((error: Error) => {
        console.error("Error fetching presigned URLs:", error);
      });
    if (!presignedUrlsResponse) {
      console.error("No presigned URLs received");
      return;
    }

    // Decode all URLs in the fileURLMap
    const decodedFileURLMap: Record<string, string> = {};
    Object.entries(presignedUrlsResponse.fileURLMap).forEach(([key, value]) => {
      decodedFileURLMap[key] = decodeURIComponent(value);
    });

    dispatch(
      setFileURLMap({
        data: decodedFileURLMap,
      }),
    );
  };

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

      if (userPhoneNo) {
        await updateProperty({
          payload: apiPayload,
          phoneNo: userPhoneNo,
        }).unwrap();
      }
      router.push("/admin/view-all-properties");

      // Don't open success dialog here anymore - it will be opened automatically after upload completes
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  useEffect(() => {
    if (finalizationStage !== "deleting") {
      return;
    }

    if (!finalizationOpsRef.current.deleteStarted) {
      finalizationOpsRef.current.deleteStarted = true;
      void deleteFilesFromS3();
      return;
    }

    if (deleteState.status === "success" || deleteState.status === "error") {
      finalizationOpsRef.current.deleteStarted = false;
      setFinalizationStage(
        finalizationPlanRef.current.needsUpload ? "uploading" : "updating",
      );
    }
  }, [deleteFilesFromS3, deleteState.status, finalizationStage]);

  useEffect(() => {
    if (finalizationStage !== "uploading") {
      return;
    }

    if (!finalizationOpsRef.current.uploadStarted) {
      finalizationOpsRef.current.uploadStarted = true;
      void uploadFilesToS3();
      return;
    }

    if (uploadState.status === "success" || uploadState.status === "error") {
      finalizationOpsRef.current.uploadStarted = false;
      setFinalizationStage("updating");
    }
  }, [finalizationStage, uploadFilesToS3, uploadState.status]);

  useEffect(() => {
    if (finalizationStage !== "updating") {
      return;
    }

    if (finalizationOpsRef.current.updateStarted) {
      return;
    }

    finalizationOpsRef.current.updateStarted = true;

    const runUpdate = async () => {
      try {
        await handleUpdateProperty();
      } finally {
        setFinalizationStage("idle");
        finalizationPlanRef.current = {
          needsDelete: false,
          needsUpload: false,
        };
        finalizationOpsRef.current = {
          deleteStarted: false,
          uploadStarted: false,
          updateStarted: false,
        };
      }
    };

    void runUpdate();
  }, [finalizationStage, handleUpdateProperty]);

  const handleSaveChanges = async () => {
    // 1) Ensure presigned URLs are in place
    await getPresignedPhotoUrls();
    await getDeletePresignedPhotoUrls();

    // 2) Plan
    const pendingDeletes = buildDeleteQueue();
    const pendingUploads = buildUploadQueue();
    const hasPendingDeletes = pendingDeletes.length > 0;
    const hasPendingUploads = pendingUploads.length > 0;

    if (!hasPendingDeletes && !hasPendingUploads) {
      await handleUpdateProperty();
      return;
    }

    // 3) Reset statuses and kick stage machine
    dispatch(resetDelete());
    dispatch(resetUpload());

    finalizationPlanRef.current = {
      needsDelete: hasPendingDeletes,
      needsUpload: hasPendingUploads,
    };
    finalizationOpsRef.current = {
      deleteStarted: false,
      uploadStarted: false,
      updateStarted: false,
    };

    setFinalizationStage(hasPendingDeletes ? "deleting" : "uploading");
  };

  const isWorking =
    isUpdatingProperty ||
    finalizationStage === "deleting" ||
    finalizationStage === "uploading" ||
    finalizationStage === "updating";

  return (
    <div className="flex flex-col bg-gray-100 h-full overflow-auto">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log("Submit all data:", values);
        }}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={true}
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
                        disabled={!isFormValid || isWorking}
                        onClick={handleSaveChanges}
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
