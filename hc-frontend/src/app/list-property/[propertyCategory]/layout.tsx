"use client";

import { Form, Formik, FormikProvider } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { propertyAddGraphicURL } from "@/common/cdnURLs";
import {
  LIST_PROPERTY_SUCCESS_DIALOG_ID,
  UPLOAD_PHOTOS_DIALOG_ID,
} from "@/common/dialogConstants";
import {
  ListPropertyFormStep,
  ListPropertyRouteStep,
  PropertyCategory,
} from "@/common/enums";
import { extractS3KeyFromUrl } from "@/common/utils";
import Spinner from "@/components/Spinner";
import { ListPropertySuccessDialog, UploadPhotosDialog } from "@/dialogs";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { transformFormValuesToPropertyForm } from "@/interfaces/FormTransformers";
import { FormValues } from "@/interfaces/FormValues";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { MobileFooter, PageTransition } from "@/layout-components";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  usePresignedUrlsMutation,
  usePropertyAddMutation,
} from "@/store/apiSlice";
import { clearFormData, setFileURLMap } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { resetUpload } from "@/store/uploadToS3Slice";
import { ImageWithLoader } from "@/utility-components";

import ListPropertyDesktopStepper from "../components/ListPropertyDesktopStepper";
import ListPropertyMobileStepper from "../components/ListPropertyMobileStepper";

type FinalizationStage = "idle" | "uploading" | "posting";

export default function ListPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();

  // Extract propertyCategory from URL params
  const pathSegments = pathname.split("/");
  const propertyCategory = pathSegments[2]?.toUpperCase() as PropertyCategory;

  // Get propertyID from Redux state
  const propertyID = useSelector(
    (state: RootState) => state.listProperty.propertyID,
  );

  // Get upload state to monitor completion
  const uploadState = useSelector((state: RootState) => state.uploadToS3);

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

  const [addProperty, { isLoading: isAddingProperty }] =
    usePropertyAddMutation();

  const propertyImagesS3Url = useSelector(
    (state: RootState) => state.listProperty.propertyImagesS3Url,
  );
  const propertyImages = useSelector(
    (state: RootState) => state.listProperty.propertyImages,
  );
  const formState = useSelector((state: RootState) => state.listProperty.form);

  const isFormValid = formState?.isValid;

  const [finalizationStage, setFinalizationStage] =
    useState<FinalizationStage>("idle");
  const finalizationOpsRef = useRef({
    uploadStarted: false,
    postStarted: false,
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

  // Ensure proper form initialization with all required fields
  const getInitialValues = (): FormValues => {
    const data = formState?.data || {};

    // Ensure all required fields are present
    return {
      localityDetails: data.localityDetails,
      images: data.images || [],
      noPhotos: data.noPhotos || false,
      propertyDetails: data.propertyDetails,
      rentalDetails: data.rentalDetails,
      resaleDetails: data.resaleDetails,
      flatmateDetails: data.flatmateDetails,
      additionalInfo: data.additionalInfo,
    };
  };

  const initialValues = getInitialValues();

  const setRoute = (stepSlug: string) => {
    const route = `/list-property/${propertyCategory.toLowerCase()}/${stepSlug}`;
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

  const getPresignedPhotoUrls = async () => {
    // Step 1: Request pre-signed URLs
    const fileMap: Record<string, string> = {};
    propertyImages.forEach((propertyImage: PropertyImage) => {
      fileMap[encodeURIComponent(propertyImage.file.name)] =
        propertyImage.file.type;
    });
    console.log(fileMap);
    const presignedUrlsResponse = await getPresignedUrls({
      fileMap,
      propertyID,
    })
      .unwrap()
      .catch((error: Error) => {
        console.error("Error fetching presigned URLs:", error);
      });
    if (!presignedUrlsResponse) {
      console.error("No presigned URLs received");
      return;
    }
    dispatch(
      setFileURLMap({
        data: presignedUrlsResponse.fileURLMap,
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
      // Make API call to get presigned-urls
      await getPresignedPhotoUrls();
      setRoute(ListPropertyRouteStep.ADDITIONAL_INFO);
    } else if (currentStep === ListPropertyFormStep.ADDITIONAL_INFO) {
      const pendingUploads = buildUploadQueue();

      if (pendingUploads.length === 0) {
        await handlePostProperty();
        return;
      }

      finalizationOpsRef.current = {
        uploadStarted: false,
        postStarted: false,
      };

      dispatch(resetUpload());

      setFinalizationStage("uploading");
      return;
    }
  };

  const handlePostProperty = async () => {
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

      // Extract S3 image keys
      const imagesS3Keys =
        Object.values(propertyImagesS3Url).length > 0
          ? Object.values(propertyImagesS3Url).map(
              (url) => extractS3KeyFromUrl(url) || "",
            )
          : [];

      // Add cover image information if needed
      const coverImage = propertyImages.filter((image) => image.isCover);
      const coverImageName =
        coverImage.length > 0 ? coverImage[0].file.name : "";
      const coverImageS3Key = imagesS3Keys.find((key) =>
        key.endsWith(coverImageName),
      );

      // Create the final API payload
      const apiPayload = {
        ...propertyForm,
        coverImage: coverImageS3Key,
        images: imagesS3Keys,
      };

      await addProperty(apiPayload);

      openDialog("list-property-success-dialog");

      // Don't open success dialog here anymore - it will be opened automatically after upload completes
    } catch (error) {
      setRoute(ListPropertyRouteStep.ADDITIONAL_INFO);
      console.error("Error posting property:", error);
    }
  };

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
      setFinalizationStage("posting");
    }
  }, [finalizationStage, uploadFilesToS3, uploadState.status]);

  useEffect(() => {
    if (finalizationStage !== "posting") {
      return;
    }

    if (finalizationOpsRef.current.postStarted) {
      return;
    }

    finalizationOpsRef.current.postStarted = true;

    const runPost = async () => {
      try {
        await handlePostProperty();
      } finally {
        setFinalizationStage("idle");
        finalizationOpsRef.current = {
          uploadStarted: false,
          postStarted: false,
        };
      }
    };

    void runPost();
  }, [finalizationStage, handlePostProperty]);

  const goToHomePage = () => {
    // Clear form data when user navigates away
    dispatch(clearFormData());
    router.push("/");
  };

  return (
    <>
      {/* Mobile stepper is now handled inside ListPropertyStepper */}
      <ListPropertyMobileStepper
        currentStep={currentStep}
        propertyCategory={propertyCategory}
        onClose={goToHomePage}
      />
      <div className="flex w-full h-full top-14">
        {/* Background SVG behind left section only */}
        <aside className="left-0 top-14 bottom-0 w-1/3 fixed  bg-gray-50 max-md:hidden">
          <ImageWithLoader
            src={propertyAddGraphicURL}
            alt="Property Graphic"
            fill
            className="w-full h-full object-cover max-xl:hidden"
          />
          {/* Left side - Steps navigation */}
          <div className="absolute right-8 top-12 flex flex-col z-50">
            <ListPropertyDesktopStepper
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
              disabled={!isFormValid || isAddingProperty}
              onClick={handleSaveAndNext}
            >
              {currentStep === ListPropertyFormStep.ADDITIONAL_INFO ? (
                isAddingProperty ? (
                  <Spinner size="sm" />
                ) : (
                  "List Property"
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
            className="text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50  disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
            onClick={handleBack}
          >
            Back
          </button>

          <button
            type="submit"
            className="text-center px-6 py-3 border border-red-500 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 transition duration-200"
            disabled={!isFormValid || isAddingProperty}
            onClick={handleSaveAndNext}
          >
            {currentStep === ListPropertyFormStep.ADDITIONAL_INFO ? (
              isAddingProperty ? (
                <Spinner size="sm" />
              ) : (
                "List Property"
              )
            ) : (
              "Save & Continue"
            )}
          </button>
        </div>
      </MobileFooter>

      {/* Upload Dialog */}
      {isDialogOpen(UPLOAD_PHOTOS_DIALOG_ID) && (
        <UploadPhotosDialog id={UPLOAD_PHOTOS_DIALOG_ID} />
      )}

      {/* Success Dialog */}
      {isDialogOpen(LIST_PROPERTY_SUCCESS_DIALOG_ID) && (
        <ListPropertySuccessDialog
          id={LIST_PROPERTY_SUCCESS_DIALOG_ID}
          propertyID={propertyID}
          propertyCategory={propertyCategory}
        />
      )}
    </>
  );
}
