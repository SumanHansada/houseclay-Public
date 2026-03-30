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

  const uploadState = useSelector((state: RootState) => state.uploadToS3);
  const deleteState = useSelector((state: RootState) => state.deleteFromS3);
  const formState = useSelector((state: RootState) => state.editProperty.form);
  const propertyCategory = useSelector(
    (state: RootState) => state.editProperty.propertyCategory,
  );
  const userPhoneNo = useSelector(
    (state: RootState) => state.propertyDetails.propertyDetails.owner?.phoneNo,
  );

  const validationSchema = useMemo(
    () => createValidationSchema(propertyCategory),
    [propertyCategory],
  );

  const initialValues = useMemo((): FormValues => {
    const data = formState?.data || {};
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

  const submittedValuesRef = useRef<FormValues | null>(null);

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

  const buildUploadQueue = (
    propertyImagesParam: PropertyImage[],
    propertyImagesS3UrlParam: Record<string, string> | undefined,
  ) => {
    const photos = propertyImagesParam || [];
    return photos
      .filter((img) => img.url.startsWith("blob:"))
      .map((img) => {
        const fileName = img.file.name;
        const mappedUrl =
          propertyImagesS3UrlParam?.[fileName] ??
          propertyImagesS3UrlParam?.[encodeURIComponent(fileName)];
        if (!mappedUrl) return null;
        return {
          name: fileName,
          url: img.url,
          type: img.file.type,
          S3Url: mappedUrl,
        };
      })
      .filter(
        (
          item,
        ): item is { name: string; url: string; type: string; S3Url: string } =>
          Boolean(item),
      );
  };

  const buildDeleteQueue = (
    deletedImagesParam: PropertyImage[],
    deletedImagesS3UrlParam: Record<string, string> | undefined,
  ) => {
    const deletedPhotos = deletedImagesParam || [];
    return deletedPhotos
      .map((img) => {
        const fileName = img.file.name;
        const mappedUrl =
          deletedImagesS3UrlParam?.[fileName] ??
          deletedImagesS3UrlParam?.[encodeURIComponent(fileName)];
        if (!mappedUrl) return null;
        return { name: fileName, S3Url: mappedUrl };
      })
      .filter((item): item is { name: string; S3Url: string } => Boolean(item));
  };

  const getPresignedPhotoUrls = async (imagesParam: PropertyImage[]) => {
    const newImages = imagesParam.filter((img) => img.url.startsWith("blob:"));
    if (newImages.length === 0) return;
    const fileMap: Record<string, string> = {};
    newImages.forEach((img) => {
      fileMap[encodeURIComponent(img.file.name)] = img.file.type;
    });
    const res = await getPresignedUrls({ propertyID, fileMap })
      .unwrap()
      .catch(console.error);
    if (!res) return;
    const decodedFileURLMap: Record<string, string> = {};
    Object.entries(res.fileURLMap).forEach(([key, value]) => {
      decodedFileURLMap[key] = decodeURIComponent(value);
    });
    dispatch(setFileURLMap({ data: decodedFileURLMap }));
  };

  const getDeletePresignedPhotoUrls = async (imagesParam: PropertyImage[]) => {
    const deletedPhotos = imagesParam || [];
    if (deletedPhotos.length === 0) return;
    const fileMap: Record<string, string> = {};
    deletedPhotos.forEach((img) => {
      fileMap[encodeURIComponent(img.file.name)] = img.file.type;
    });
    const res = await getDeletePresignedUrls({ propertyID, fileMap })
      .unwrap()
      .catch(console.error);
    if (!res) return;
    dispatch(setDeleteFileURLMap({ data: res.fileURLMap }));
  };

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

  const handleUpdateProperty = async (formikValues: FormValues) => {
    try {
      const propertyForm = transformFormValuesToPropertyForm(
        formikValues,
        propertyID,
        propertyCategory,
      );
      const latest = store.getState().editProperty;

      const imagesS3Keys = propertyForm.images
        .map((url) => {
          if (url.startsWith("https://")) return extractS3KeyFromUrl(url) || "";
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
        .filter((key) => key !== "");

      const coverImage = latest.propertyImages.filter((image) => image.isCover);
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
        if (submittedValuesRef.current)
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

  const handleSaveChanges = async (formikValues: FormValues) => {
    const initialImages = initialValues.images || [];
    const finalImages = formikValues.images || [];
    const netDeleted = initialImages.filter(
      (initialImg) =>
        !finalImages.some((finalImg) => finalImg.id === initialImg.id),
    );

    dispatch(setDeletedImages({ deletedImages: netDeleted }));
    dispatch(setPropertyImages({ propertyImages: finalImages }));
    dispatch(setFormData({ data: formikValues }));
    submittedValuesRef.current = formikValues;

    const latest = store.getState().editProperty;
    await getPresignedPhotoUrls(latest.propertyImages);
    await getDeletePresignedPhotoUrls(latest.deletedImages);

    const latestUrls = store.getState().editProperty;
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
