"use client";

import { Form, Formik, FormikProvider } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ListPropertyFormStep,
  ListPropertyRouteStep,
  PropertyCategory,
} from "@/common/enums";
import { extractS3KeyFromUrl } from "@/common/utils";
import { ListPropertySuccessDialog, UploadDialog } from "@/dialogs";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { transformFormValuesToPropertyForm } from "@/interfaces/FormTransformers";
import { FormValues } from "@/interfaces/FormValues";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useGetMyPropertyByIdQuery,
  usePresignedUrlsMutation,
  usePropertyUpdateMutation,
} from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import {
  clearFormData,
  setFileURLMap,
  setPropertyID,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";
import { ImageWithLoader } from "@/utility-components";

import EditPropertyStepper from "../../components/EditPropertyStepper";

export default function EditPropertyTypeLayout({
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
  const { isMobile } = useDeviceContext();

  // Extract propertyCategory and propertyID from URL params
  const pathSegments = pathname.split("/");
  const propertyCategory = pathSegments[2]?.toUpperCase() as PropertyCategory;
  const propertyID = pathSegments[3];

  // Get upload state to monitor completion
  const uploadState = useSelector((state: RootState) => state.uploadToS3);

  // Function to derive current step from URL path
  const getCurrentStepFromPath = (): ListPropertyFormStep => {
    const pathSegments = pathname.split("/");
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

  const [updateProperty] = usePropertyUpdateMutation();

  // Fetch existing property data for editing
  const { data: existingPropertyData, isLoading: isLoadingProperty } =
    useGetMyPropertyByIdQuery(propertyID, {
      skip: !propertyID,
    });

  const propertyImagesS3Url = useSelector(
    (state: RootState) => state.listProperty.propertyImagesS3Url,
  );
  const propertyImages = useSelector(
    (state: RootState) => state.listProperty.propertyImages,
  );
  const formState = useSelector((state: RootState) => state.listProperty.form);

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

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
      dispatch(setHideStickyNavBar(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
      dispatch(setHideStickyNavBar(false));
    }
  }, [dispatch, isMobile]);

  // Set propertyID in Redux state when component mounts
  useEffect(() => {
    if (propertyID) {
      dispatch(setPropertyID(propertyID));
    }
  }, [propertyID, dispatch]);

  // Populate form data when existing property data is loaded
  useEffect(() => {
    if (existingPropertyData && !isLoadingProperty) {
      // TODO: Transform existing property data to form values and populate the form
      console.log("Existing property data loaded:", existingPropertyData);
      // This would involve transforming the API response to FormValues format
      // and dispatching actions to populate the form state
    }
  }, [existingPropertyData, isLoadingProperty]);

  // Effect to handle upload completion and dialog transitions
  useEffect(() => {
    if (
      uploadState.status === "success" &&
      isDialogOpen("upload-photos-dialog")
    ) {
      // Close upload dialog
      closeDialog("upload-photos-dialog");

      // Small delay to ensure smooth transition
      setTimeout(() => {
        // Open success dialog
        openDialog("list-property-success-dialog");
      }, 300);
    }
  }, [uploadState.status, isDialogOpen, closeDialog, openDialog]);

  const setRoute = (stepSlug: string) => {
    const route = `/edit-property/${propertyCategory.toLowerCase()}/${propertyID}/${stepSlug}`;
    router.push(route);
  };

  const uploadFilesToS3 = async () => {
    const photos = propertyImages || [];
    if (photos.length > 0) {
      // create a map of file names to their corresponding Blob URLs
      const photosToUpload = photos.map((photo: PropertyImage) => {
        return {
          name: photo.file.name,
          url: photo.url,
          type: photo.file.type,
          S3Url: propertyImagesS3Url[photo.file.name],
        };
      });

      // Open upload dialog before starting upload
      openDialog("upload-photos-dialog");

      // Start the upload process
      uploadFiles(photosToUpload);
    }
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
    })
      .unwrap()
      .catch((error: Error) => {
        console.error("Error fetching presigned URLs:", error);
      });
    if (!presignedUrlsResponse) {
      console.error("No presigned URLs received");
      return;
    }
    dispatch(setPropertyID(presignedUrlsResponse.propertyID));
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
      uploadFilesToS3();
      // Don't navigate to a route for DONE step, just handle the API call
      // Make API call to update property
      await handleUpdateProperty();
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
        propertyID: propertyID, // Use propertyID from URL for update
        coverImage: coverImageS3Key,
        images: imagesS3Keys,
      };

      await updateProperty(apiPayload);

      // Don't open success dialog here anymore - it will be opened automatically after upload completes
    } catch (error) {
      // openDialog("list-property-success-dialog");
      setRoute(ListPropertyRouteStep.ADDITIONAL_INFO);
      console.error("Error updating property:", error);
    }
  };

  const renderStepper = () => {
    return (
      <EditPropertyStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        propertyCategory={propertyCategory}
        isMobile={isMobile}
        onGoToHome={goToHomePage}
      />
    );
  };

  const goToHomePage = () => {
    // Clear form data when user navigates away
    dispatch(clearFormData());
    router.push("/");
  };

  return (
    <>
      {/* Mobile stepper is now handled inside EditPropertyStepper */}
      {isMobile && renderStepper()}
      <div className="flex w-full h-full top-14">
        {/* Background SVG behind left section only */}
        <div className="left-0 top-14 bottom-0 z-40 w-[33.33%] fixed  bg-gray-50 max-md:hidden">
          <ImageWithLoader
            src="/images/property-add-graphic.svg"
            alt="Property Graphic"
            width={500}
            height={500}
            className="w-full h-full object-cover max-xl:hidden"
            priority
          />
          {/* Left side - Steps navigation */}
          <div className="absolute right-8 top-12 flex flex-col z-50">
            {!isMobile && renderStepper()}
          </div>
        </div>
        <div className="container right-0 ml-[33.33%] max-md:ml-auto pt-4 md:pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-6">
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
          <div className="fixed bottom-0 left-0 ml-[33.33%] max-md:ml-auto right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-6 border-t border-t-gray-300 bg-white">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              type="submit"
              className="px-6 py-3 border border-red-500 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300"
              disabled={!isFormValid}
              onClick={handleSaveAndNext}
            >
              {currentStep === ListPropertyFormStep.ADDITIONAL_INFO
                ? "Update Property"
                : "Save & Continue"}
            </button>
          </div>
        </div>

        {/* Upload Dialog */}
        {isDialogOpen("upload-photos-dialog") && (
          <UploadDialog id="upload-photos-dialog" />
        )}

        {/* Success Dialog */}
        {isDialogOpen("list-property-success-dialog") && (
          <ListPropertySuccessDialog
            id="list-property-success-dialog"
            propertyID={propertyID}
            propertyCategory={propertyCategory}
          />
        )}
      </div>
    </>
  );
}
