"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { extractS3KeyFromUrl } from "@/common/utils";
import {
  AdditionalInfoFlatmateForm,
  AdditionalInfoRentForm,
  AdditionalInfoResaleForm,
  createValidationSchema,
  FlatmateDetailsForm,
  GalleryForm,
  LocalityDetailsForm,
  PropertyDetailsFlatmateForm,
  PropertyDetailsRentForm,
  PropertyDetailsResaleForm,
  RentalDetailsForm,
  ResaleDetailsForm,
} from "@/components/forms";
import Spinner from "@/components/Spinner";
import { useS3Deleter } from "@/hooks/useS3Deleter";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { transformFormValuesToPropertyForm } from "@/interfaces/FormTransformers";
import { FormValues } from "@/interfaces/FormValues";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useDeletePresignedUrlsMutation,
  usePresignedUrlsMutation,
  usePropertyUpdateMutation,
} from "@/store/apiSlice";
import { resetDelete } from "@/store/deleteFromS3Slice";
import {
  setDeletedImages,
  setDeleteFileURLMap,
  setFileURLMap,
  setFormData,
  setPropertyImages,
} from "@/store/editPropertySlice";
import { RootState, store } from "@/store/store";
import { resetUpload } from "@/store/uploadToS3Slice";

type FinalizationStage = "idle" | "deleting" | "uploading" | "updating";

interface Props {
  propertyID: string;
}

export const DetailsView = ({ propertyID }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const [getDeletePresignedUrls] = useDeletePresignedUrlsMutation();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const deleteFiles = useS3Deleter();
  const [updateProperty, { isLoading: isUpdatingProperty }] =
    usePropertyUpdateMutation();
  const { openDialog, closeDialog } = useDialog();

  // Selectors
  const uploadState = useSelector((state: RootState) => state.uploadToS3);
  const deleteState = useSelector((state: RootState) => state.deleteFromS3);
  const formState = useSelector((state: RootState) => state.editProperty.form);
  const propertyCategory = useSelector(
    (state: RootState) => state.editProperty.propertyCategory,
  );
  const userPhoneNo = useSelector(
    (state: RootState) => state.propertyDetails.propertyDetails.owner?.phoneNo,
  );

  // Combined Schema
  const validationSchema = useMemo(
    () => createValidationSchema(propertyCategory),
    [propertyCategory],
  );

  // Ensure proper form initialization with all required fields
  const initialValues = useMemo((): FormValues => {
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
      noPhotos:
        data.noPhotos ?? (data.images ? data.images.length === 0 : true),
    };
  }, [formState?.data]);

  // Ref to store submitted values for chaining
  const submittedValuesRef = useRef<FormValues | null>(null);

  // Finalization refs/logic
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

  // Build queues for uploads and deletes based on current state and S3 URL mappings
  const buildUploadQueue = (
    propertyImagesParam: PropertyImage[],
    propertyImagesS3UrlParam: Record<string, string> | undefined,
  ) => {
    const photos = propertyImagesParam || [];
    return photos
      .filter((propertyImage: PropertyImage) =>
        propertyImage.url.startsWith("blob:"),
      )
      .map((propertyImage: PropertyImage) => {
        const fileName = propertyImage.file.name;
        const mappedUrl =
          propertyImagesS3UrlParam?.[fileName] ??
          propertyImagesS3UrlParam?.[encodeURIComponent(fileName)];

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

  const buildDeleteQueue = (
    deletedImagesParam: PropertyImage[],
    deletedImagesS3UrlParam: Record<string, string> | undefined,
  ) => {
    const deletedPhotos = deletedImagesParam || [];
    return deletedPhotos
      .map((propertyImage: PropertyImage) => {
        const fileName = propertyImage.file.name;
        const mappedUrl =
          deletedImagesS3UrlParam?.[fileName] ??
          deletedImagesS3UrlParam?.[encodeURIComponent(fileName)];

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

  // Presigned Helpers
  const getPresignedPhotoUrls = async (imagesParam: PropertyImage[]) => {
    // Only request pre-signed URLs for new images (blob URLs)
    const newImages = imagesParam.filter((propertyImage: PropertyImage) =>
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

  const getDeletePresignedPhotoUrls = async (imagesParam: PropertyImage[]) => {
    // Request delete pre-signed URLs for deleted images
    const deletedPhotos = imagesParam || [];
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

    dispatch(
      setDeleteFileURLMap({
        data: presignedUrlsResponse.fileURLMap,
      }),
    );
  };

  // Upload/Delete functions
  const uploadFilesToS3 = async () => {
    const latest = store.getState().editProperty;
    const queue = buildUploadQueue(
      latest.propertyImages,
      latest.propertyImagesS3Url,
    );
    if (queue.length === 0) return;
    openDialog("upload-photos-dialog");
    await uploadFiles(queue);
    closeDialog("upload-photos-dialog");
  };

  const deleteFilesFromS3 = async () => {
    const latest = store.getState().editProperty;
    const queue = buildDeleteQueue(
      latest.deletedImages,
      latest.deletedImagesS3Url,
    );
    if (queue.length === 0) return;
    openDialog("delete-photos-dialog");
    await deleteFiles(queue);
    closeDialog("delete-photos-dialog");
  };

  // Update Handler
  const handleUpdateProperty = async (formikValues: FormValues) => {
    try {
      if (!formikValues) {
        throw new Error("Form data is not available");
      }
      const propertyForm = transformFormValuesToPropertyForm(
        formikValues,
        propertyID,
        propertyCategory,
      );

      // Use latest from store for images
      const latest = store.getState().editProperty;

      // Extract S3 image keys from propertyForm.images
      // For new images (blob URLs), they should have been uploaded and the S3 URL should be in propertyImagesS3Url
      // For existing images (S3 URLs), extract the key directly from the URL
      const imagesS3Keys = propertyForm.images
        .map((url) => {
          // If it's an existing S3 URL, extract the key
          if (url.startsWith("https://")) return extractS3KeyFromUrl(url) || "";

          // If it's a blob URL, find the S3 URL from propertyImagesS3Url
          const matchingPhoto = latest.propertyImages.find(
            (img) => img.url === url,
          );
          if (matchingPhoto) {
            const s3Url =
              latest.propertyImagesS3Url[
                encodeURIComponent(matchingPhoto.file.name)
              ];
            return s3Url ? extractS3KeyFromUrl(s3Url) || "" : "";
          }
          return "";
        })
        .filter((key) => key !== ""); // Remove empty keys

      // Add cover image information
      const coverImage = latest.propertyImages.filter((image) => image.isCover);

      // Find the cover image S3 key
      let coverImageS3Key = "";
      if (coverImage.length > 0) {
        const coverImageUrl = coverImage[0].url;
        if (coverImageUrl.startsWith("https://")) {
          coverImageS3Key = extractS3KeyFromUrl(coverImageUrl) || "";
        } else if (coverImageUrl.startsWith("blob:")) {
          const s3Url =
            latest.propertyImagesS3Url[
              encodeURIComponent(coverImage[0].file.name)
            ];
          coverImageS3Key = s3Url ? extractS3KeyFromUrl(s3Url) || "" : "";
        }
      }

      if (userPhoneNo) {
        await updateProperty({
          payload: {
            ...propertyForm,
            propertyID,
            coverImage: coverImageS3Key,
            images: imagesS3Keys,
          },
          phoneNo: userPhoneNo,
        }).unwrap();
      }
      setEditMode(false);
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  // Finalization effects
  useEffect(() => {
    if (finalizationStage !== "deleting") return;
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
    if (finalizationStage !== "uploading") return;
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
    if (finalizationStage !== "updating") return;
    if (finalizationOpsRef.current.updateStarted) return;
    finalizationOpsRef.current.updateStarted = true;

    const runUpdate = async () => {
      try {
        if (!submittedValuesRef.current) {
          console.error("No submitted values available");
          return;
        }

        await handleUpdateProperty(submittedValuesRef.current);
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

  // Centralized submit handler
  const handleSaveChanges = async (formikValues: FormValues) => {
    // Detect net deleted images by comparing initial vs final
    const initialImages = initialValues.images || [];
    const finalImages = formikValues.images || [];
    const netDeleted = initialImages.filter(
      (initialImg) =>
        !finalImages.some((finalImg) => finalImg.id === initialImg.id),
    );

    // Update Redux states
    dispatch(setDeletedImages({ deletedImages: netDeleted }));
    dispatch(setPropertyImages({ propertyImages: finalImages }));

    // 1. Sync Formik -> Redux (one-time)
    dispatch(setFormData({ data: formikValues }));
    submittedValuesRef.current = formikValues;

    // 2. Handle presigned URLs
    const latest = store.getState().editProperty;
    await getPresignedPhotoUrls(latest.propertyImages);
    await getDeletePresignedPhotoUrls(latest.deletedImages);

    // Now get latest S3 URLs after presigned dispatches
    const latestUrls = store.getState().editProperty;
    // 3. Plan & execute finalization
    const pendingDeletes = buildDeleteQueue(
      latestUrls.deletedImages,
      latestUrls.deletedImagesS3Url,
    );
    const pendingUploads = buildUploadQueue(
      latestUrls.propertyImages,
      latestUrls.propertyImagesS3Url,
    );

    if (pendingDeletes.length === 0 && pendingUploads.length === 0) {
      await handleUpdateProperty(formikValues);
      return;
    }

    dispatch(resetDelete());
    dispatch(resetUpload());
    finalizationPlanRef.current = {
      needsDelete: pendingDeletes.length > 0,
      needsUpload: pendingUploads.length > 0,
    };
    finalizationOpsRef.current = {
      deleteStarted: false,
      uploadStarted: false,
      updateStarted: false,
    };
    setFinalizationStage(pendingDeletes.length > 0 ? "deleting" : "uploading");
  };

  const isWorking =
    isUpdatingProperty ||
    finalizationStage === "deleting" ||
    finalizationStage === "uploading" ||
    finalizationStage === "updating";

  const isFormDisabled = !editMode || isWorking;

  return (
    <div className="flex flex-col bg-gray-100 h-full overflow-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSaveChanges}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize={!editMode}
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
                        className="border border-red-500 text-red-500 py-1 px-4 text-lg font-medium rounded-xl hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={!formik.isValid || isWorking || !formik.dirty}
                      >
                        {isWorking && <Spinner size="sm" />} Save Changes
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
                      <PropertyDetailsResaleForm disabled={isFormDisabled} />
                    ) : propertyCategory === PropertyCategory.RENT ? (
                      <PropertyDetailsRentForm disabled={isFormDisabled} />
                    ) : (
                      <PropertyDetailsFlatmateForm disabled={isFormDisabled} />
                    )}
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <LocalityDetailsForm disabled={isFormDisabled} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {propertyCategory === PropertyCategory.RESALE ? (
                      <ResaleDetailsForm disabled={isFormDisabled} />
                    ) : propertyCategory === PropertyCategory.RENT ? (
                      <RentalDetailsForm disabled={isFormDisabled} />
                    ) : (
                      <FlatmateDetailsForm disabled={isFormDisabled} />
                    )}
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <GalleryForm disabled={isFormDisabled} />
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    {propertyCategory === PropertyCategory.RESALE ? (
                      <AdditionalInfoResaleForm disabled={isFormDisabled} />
                    ) : propertyCategory === PropertyCategory.RENT ? (
                      <AdditionalInfoRentForm disabled={isFormDisabled} />
                    ) : (
                      <AdditionalInfoFlatmateForm disabled={isFormDisabled} />
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
};
