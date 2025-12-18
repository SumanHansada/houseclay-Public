"use client";

import { Form, Formik, FormikProvider } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { propertyAddGraphicURL } from "@/common/cdnURLs";
import {
  ListPropertyFormStep,
  ListPropertyRouteStep,
  PropertyCategory,
} from "@/common/enums";
import { extractS3KeyFromUrl } from "@/common/utils";
import Spinner from "@/components/Spinner";
import { ListPropertySuccessDialog } from "@/dialogs";
import { useS3Deleter } from "@/hooks/useS3Deleter";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import {
  transformFormValuesToPropertyForm,
  transformPropertyFormToFormValues,
} from "@/interfaces/FormTransformers";
import { FormValues } from "@/interfaces/FormValues";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { MobileFooter, PageTransition } from "@/layout-components";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useDeletePresignedUrlsMutation,
  useGetMyPropertyByIdQuery,
  usePresignedUrlsMutation,
  usePropertyUpdateMutation,
} from "@/store/apiSlice";
import { resetDelete } from "@/store/deleteFromS3Slice";
import {
  clearFormData,
  setDeleteFileURLMap,
  setFileURLMap,
  setFormData,
  setPropertyCategory,
  setPropertyID,
  setPropertyImages,
} from "@/store/editPropertySlice";
import { RootState } from "@/store/store";
import { resetUpload } from "@/store/uploadToS3Slice";
import { ImageWithLoader } from "@/utility-components";

import EditPropertyDesktopStepper from "../../components/EditPropertyDesktopStepper";
import EditPropertyMobileStepper from "../../components/EditPropertyMobileStepper";

type FinalizationStage = "idle" | "deleting" | "uploading" | "updating";

export default function EditPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const [getDeletePresignedUrls] = useDeletePresignedUrlsMutation();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const deleteFiles = useS3Deleter();
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();

  // Extract propertyCategory and propertyID from URL params
  const pathSegments = pathname.split("/");
  const propertyCategory = pathSegments[2]?.toUpperCase() as PropertyCategory;
  const propertyID = pathSegments[3];

  // Get upload state to monitor completion
  const uploadState = useSelector((state: RootState) => state.uploadToS3);
  const deleteState = useSelector((state: RootState) => state.deleteFromS3);

  // Function to derive current step from URL path
  const getCurrentStepFromPath = (): ListPropertyFormStep => {
    const lastSegment = pathSegments[pathSegments.length - 1];

    switch (lastSegment) {
      case ListPropertyRouteStep.PROPERTY_DETAILS:
        return ListPropertyFormStep.PROPERTY_DETAILS;
      case ListPropertyRouteStep.LOCALITY_DETAILS:
        return ListPropertyFormStep.LOCALITY_DETAILS;
      case ListPropertyRouteStep.RENTAL_DETAILS:
        return ListPropertyFormStep.RENTAL_DETAILS;
      case ListPropertyRouteStep.RESALE_DETAILS:
        return ListPropertyFormStep.RESALE_DETAILS;
      case ListPropertyRouteStep.GALLERY:
        return ListPropertyFormStep.GALLERY;
      case ListPropertyRouteStep.ADDITIONAL_INFO:
        return ListPropertyFormStep.ADDITIONAL_INFO;
      default:
        return ListPropertyFormStep.PROPERTY_DETAILS;
    }
  };

  // Function to get completed steps based on current step
  const getCompletedSteps = (): Set<ListPropertyFormStep> => {
    const currentStep = getCurrentStepFromPath();
    const completedSteps = new Set<ListPropertyFormStep>();

    const allSteps = [
      ListPropertyFormStep.PROPERTY_DETAILS,
      ListPropertyFormStep.LOCALITY_DETAILS,
      propertyCategory === PropertyCategory.RESALE
        ? ListPropertyFormStep.RESALE_DETAILS
        : ListPropertyFormStep.RENTAL_DETAILS,
      ListPropertyFormStep.GALLERY,
      ListPropertyFormStep.ADDITIONAL_INFO,
    ];

    const currentIndex = allSteps.indexOf(currentStep);

    // Mark all steps before current as completed
    for (let i = 0; i < currentIndex; i++) {
      completedSteps.add(allSteps[i]);
    }

    return completedSteps;
  };

  const currentStep = getCurrentStepFromPath();
  const completedSteps = getCompletedSteps();

  const [updateProperty, { isLoading: isUpdatingProperty }] =
    usePropertyUpdateMutation();

  // Fetch existing property data for editing
  const { data: existingPropertyData, isLoading: isLoadingProperty } =
    useGetMyPropertyByIdQuery(propertyID, {
      skip: !propertyID,
      refetchOnMountOrArgChange: true,
    });

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

  // Set propertyID in Redux state when component mounts
  useEffect(() => {
    if (propertyID) {
      dispatch(setPropertyID(propertyID));
    }
  }, [propertyID, dispatch]);

  // Populate form data when existing property data is loaded
  useEffect(() => {
    if (existingPropertyData && !isLoadingProperty) {
      dispatch(clearFormData());
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const propertyData = existingPropertyData as any;
        console.log("Existing Property Data:", propertyData);
        const apiPropertyData = propertyData.property;

        if (apiPropertyData) {
          const mergedPropertyData = {
            ...apiPropertyData,
            secondaryPhoneNumber:
              propertyData.secondaryPhoneNumber ?? undefined,
          };

          // Transform API response to FormValues
          const formValues =
            transformPropertyFormToFormValues(mergedPropertyData);

          // Set property category
          dispatch(setPropertyCategory(mergedPropertyData.propertyCategory));

          // Set form data
          dispatch(setFormData({ data: formValues }));

          // Set property images
          if (formValues.images && formValues.images.length > 0) {
            const decodedImages = formValues.images.map((image) => {
              return {
                ...image,
                url: decodeURIComponent(image.url),
              };
            });
            dispatch(setPropertyImages({ propertyImages: decodedImages }));
          }
        }
      } catch (error) {
        console.error(
          "Error transforming property data to form values:",
          error,
        );
      }
    }
  }, [existingPropertyData, isLoadingProperty, dispatch]);

  const setRoute = (stepSlug: string) => {
    const route = `/edit-property/${propertyCategory.toLowerCase()}/${propertyID}/${stepSlug}`;
    router.push(route);
  };

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

  // Update the handleBack function to remove the previous step from completedSteps
  const handleBack = () => {
    if (currentStep === ListPropertyFormStep.PROPERTY_DETAILS) {
      router.back();
      return;
    }

    const stepMap = {
      [ListPropertyFormStep.LOCALITY_DETAILS]: {
        prevStep: ListPropertyFormStep.PROPERTY_DETAILS,
        route: ListPropertyRouteStep.PROPERTY_DETAILS,
      },
      [ListPropertyFormStep.RENTAL_DETAILS]: {
        prevStep: ListPropertyFormStep.LOCALITY_DETAILS,
        route: ListPropertyRouteStep.LOCALITY_DETAILS,
      },
      [ListPropertyFormStep.RESALE_DETAILS]: {
        prevStep: ListPropertyFormStep.LOCALITY_DETAILS,
        route: ListPropertyRouteStep.LOCALITY_DETAILS,
      },
      [ListPropertyFormStep.GALLERY]: {
        prevStep:
          propertyCategory === PropertyCategory.RESALE
            ? ListPropertyFormStep.RESALE_DETAILS
            : ListPropertyFormStep.RENTAL_DETAILS,
        route:
          propertyCategory === PropertyCategory.RESALE
            ? ListPropertyRouteStep.RESALE_DETAILS
            : ListPropertyRouteStep.RENTAL_DETAILS,
      },
      [ListPropertyFormStep.ADDITIONAL_INFO]: {
        prevStep: ListPropertyFormStep.GALLERY,
        route: ListPropertyRouteStep.GALLERY,
      },
      [ListPropertyFormStep.DONE]: {
        prevStep: ListPropertyFormStep.ADDITIONAL_INFO,
        route: ListPropertyRouteStep.ADDITIONAL_INFO,
      },
    };

    const currentStepConfig = stepMap[currentStep];
    if (currentStepConfig) {
      // No need to manage completedSteps state since it's derived from route
      setRoute(currentStepConfig.route);
    }
  };

  const handleSaveAndNext = async () => {
    if (currentStep === ListPropertyFormStep.PROPERTY_DETAILS) {
      setRoute(ListPropertyRouteStep.LOCALITY_DETAILS);
    } else if (currentStep === ListPropertyFormStep.LOCALITY_DETAILS) {
      if (propertyCategory === PropertyCategory.RESALE) {
        setRoute(ListPropertyRouteStep.RESALE_DETAILS);
      } else {
        setRoute(ListPropertyRouteStep.RENTAL_DETAILS);
      }
    } else if (
      currentStep === ListPropertyFormStep.RENTAL_DETAILS ||
      currentStep === ListPropertyFormStep.RESALE_DETAILS
    ) {
      setRoute(ListPropertyRouteStep.GALLERY);
    } else if (currentStep === ListPropertyFormStep.GALLERY) {
      // Make API call to get presigned-urls for new uploads
      await getPresignedPhotoUrls();
      if (deletedImages.length > 0) {
        await getDeletePresignedPhotoUrls();
      }
      setRoute(ListPropertyRouteStep.ADDITIONAL_INFO);
    } else if (currentStep === ListPropertyFormStep.ADDITIONAL_INFO) {
      const pendingDeletes = buildDeleteQueue();
      const pendingUploads = buildUploadQueue();

      const hasPendingDeletes = pendingDeletes.length > 0;
      const hasPendingUploads = pendingUploads.length > 0;

      if (!hasPendingDeletes && !hasPendingUploads) {
        await handleUpdateProperty();
        return;
      }

      finalizationPlanRef.current = {
        needsDelete: hasPendingDeletes,
        needsUpload: hasPendingUploads,
      };
      finalizationOpsRef.current = {
        deleteStarted: false,
        uploadStarted: false,
        updateStarted: false,
      };

      if (hasPendingDeletes) {
        dispatch(resetDelete());
      }

      if (hasPendingUploads) {
        dispatch(resetUpload());
      }

      setFinalizationStage(hasPendingDeletes ? "deleting" : "uploading");
      return;
    }
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

      await updateProperty(apiPayload);

      openDialog("list-property-success-dialog");

      // Don't open success dialog here anymore - it will be opened automatically after upload completes
    } catch (error) {
      setRoute(ListPropertyRouteStep.ADDITIONAL_INFO);
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

  const goToHomePage = () => {
    // Clear form data when user navigates away
    dispatch(clearFormData());
    router.push("/");
  };

  return (
    <>
      {/* Mobile stepper is now handled inside EditPropertyStepper */}
      <EditPropertyMobileStepper
        currentStep={currentStep}
        propertyCategory={propertyCategory}
        onClose={goToHomePage}
      />
      <div className="flex w-full h-full top-14">
        {/* Background SVG behind left section only */}
        <aside className="left-0 top-14 bottom-0 w-1/3 fixed bg-gray-50 max-md:hidden">
          <ImageWithLoader
            src={propertyAddGraphicURL}
            alt="Property Graphic"
            fill
            className="w-full h-full object-cover max-xl:hidden"
          />
          {/* Left side - Steps navigation */}
          <div className="absolute right-8 top-12 flex flex-col z-50">
            <EditPropertyDesktopStepper
              currentStep={currentStep}
              completedSteps={completedSteps}
              propertyCategory={propertyCategory}
            />
          </div>
        </aside>
        <div className="right-0 ml-[33.33%] w-full max-md:ml-auto pt-4 md:pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-6">
          <PageTransition
            transitionType="slideRight"
            backTransitionType="slideLeft"
          >
            <div className="flex flex-col">
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  console.log("Submit all data:", values);
                  // send to backend
                }}
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
              >
                {(formik) => (
                  <Form>
                    <FormikProvider value={formik}>{children}</FormikProvider>
                  </Form>
                )}
              </Formik>
            </div>
          </PageTransition>
          <div className="fixed bottom-0 left-0 ml-[33.33%] max-md:hidden right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-6 border-t border-t-gray-300 bg-white">
            <button
              type="button"
              className="text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              type="submit"
              className="text-center px-6 py-3 border border-red-500 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 transition duration-200"
              disabled={!isFormValid || isUpdatingProperty}
              onClick={handleSaveAndNext}
            >
              {currentStep === ListPropertyFormStep.ADDITIONAL_INFO ? (
                isUpdatingProperty ? (
                  <Spinner size="sm" />
                ) : (
                  "Update Property"
                )
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </div>
      </div>
      <MobileFooter>
        <div className="md:hidden flex w-full justify-between">
          <button
            type="button"
            className="text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
            onClick={handleBack}
          >
            Back
          </button>

          <button
            type="submit"
            className="text-center px-6 py-3 border border-red-500 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 transition duration-200"
            disabled={!isFormValid || isUpdatingProperty}
            onClick={handleSaveAndNext}
          >
            {currentStep === ListPropertyFormStep.ADDITIONAL_INFO ? (
              isUpdatingProperty ? (
                <Spinner size="sm" />
              ) : (
                "Update Property"
              )
            ) : (
              "Save & Continue"
            )}
          </button>
        </div>
      </MobileFooter>

      {/* Success Dialog */}
      {isDialogOpen("list-property-success-dialog") && (
        <ListPropertySuccessDialog
          id="list-property-success-dialog"
          propertyID={propertyID}
          propertyCategory={propertyCategory}
        />
      )}
    </>
  );
}
