"use client";

import { Form, Formik, FormikProvider } from "formik";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ListPropertyFormStep as AddPropertyFormStep,
  ListPropertyRouteStep as AddPropertyRouteStep,
  PropertyCategory,
} from "@/common/enums";
import { extractS3KeyFromUrl } from "@/common/utils";
import { ListPropertySuccessDialog } from "@/dialogs/list-property-success-dialog";
import { UploadDialog } from "@/dialogs/upload-dialog";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  usePresignedUrlsMutation,
  usePropertyAddMutation,
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

import DesktopStepper from "../components/DesktopStepper";
import { FormValues } from "@/interfaces/FormValues";
import { transformFormValuesToPropertyForm } from "@/interfaces/FormTransformers";

export default function AddPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();

  // Get upload state to monitor completion
  const uploadState = useSelector((state: RootState) => state.uploadToS3);

  // Function to derive current step from URL path
  const getCurrentStepFromPath = (): AddPropertyFormStep => {
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    switch (lastSegment) {
      case AddPropertyRouteStep.PROPERTY_DETAILS:
        return AddPropertyFormStep.PROPERTY_DETAILS;
      case AddPropertyRouteStep.LOCALITY_DETAILS:
        return AddPropertyFormStep.LOCALITY_DETAILS;
      case AddPropertyRouteStep.RENTAL_DETAILS:
        return AddPropertyFormStep.RENTAL_DETAILS;
      case AddPropertyRouteStep.RESALE_DETAILS:
        return AddPropertyFormStep.RESALE_DETAILS;
      case AddPropertyRouteStep.GALLERY:
        return AddPropertyFormStep.GALLERY;
      case AddPropertyRouteStep.ADDITIONAL_INFO:
        return AddPropertyFormStep.ADDITIONAL_INFO;
      default:
        return AddPropertyFormStep.PROPERTY_DETAILS;
    }
  };

  // Function to get completed steps based on current step
  const getCompletedSteps = (): Set<AddPropertyFormStep> => {
    const currentStep = getCurrentStepFromPath();
    const completedSteps = new Set<AddPropertyFormStep>();

    const allSteps = [
      AddPropertyFormStep.PROPERTY_DETAILS,
      AddPropertyFormStep.LOCALITY_DETAILS,
      propertyCategory === PropertyCategory.RESALE
        ? AddPropertyFormStep.RESALE_DETAILS
        : AddPropertyFormStep.RENTAL_DETAILS,
      AddPropertyFormStep.GALLERY,
      AddPropertyFormStep.ADDITIONAL_INFO,
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

  const [addProperty] = usePropertyAddMutation();

  const propertyID = useSelector(
    (state: RootState) => state.listProperty.propertyID,
  );
  const propertyImagesS3Url = useSelector(
    (state: RootState) => state.listProperty.propertyImagesS3Url,
  );
  const propertyImages = useSelector(
    (state: RootState) => state.listProperty.propertyImages,
  );
  const formState = useSelector((state: RootState) => state.listProperty.form);

  const isFormValid = formState?.isValid;

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

  // Effect to handle upload completion and dialog transitions
  useEffect(() => {
    console.log("uploadState.status: ", uploadState.status);
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
    const route = `/admin/add-property//${userPhoneNo}/${propertyCategory.toLowerCase()}/${stepSlug}`;
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
    // console.log(fileMap);
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
    if (currentStep === AddPropertyFormStep.PROPERTY_DETAILS) {
      router.back();
      return;
    }

    const stepMap = {
      [AddPropertyFormStep.LOCALITY_DETAILS]: {
        prevStep: AddPropertyFormStep.PROPERTY_DETAILS,
        route: AddPropertyRouteStep.PROPERTY_DETAILS,
      },
      [AddPropertyFormStep.RENTAL_DETAILS]: {
        prevStep: AddPropertyFormStep.LOCALITY_DETAILS,
        route: AddPropertyRouteStep.LOCALITY_DETAILS,
      },
      [AddPropertyFormStep.RESALE_DETAILS]: {
        prevStep: AddPropertyFormStep.LOCALITY_DETAILS,
        route: AddPropertyRouteStep.LOCALITY_DETAILS,
      },
      [AddPropertyFormStep.GALLERY]: {
        prevStep:
          propertyCategory === PropertyCategory.RESALE
            ? AddPropertyFormStep.RESALE_DETAILS
            : AddPropertyFormStep.RENTAL_DETAILS,
        route:
          propertyCategory === PropertyCategory.RESALE
            ? AddPropertyRouteStep.RESALE_DETAILS
            : AddPropertyRouteStep.RENTAL_DETAILS,
      },
      [AddPropertyFormStep.ADDITIONAL_INFO]: {
        prevStep: AddPropertyFormStep.GALLERY,
        route: AddPropertyRouteStep.GALLERY,
      },
      [AddPropertyFormStep.DONE]: {
        prevStep: AddPropertyFormStep.ADDITIONAL_INFO,
        route: AddPropertyRouteStep.ADDITIONAL_INFO,
      },
    };

    const currentStepConfig = stepMap[currentStep];
    if (currentStepConfig) {
      // No need to manage completedSteps state since it's derived from route
      setRoute(currentStepConfig.route);
    }
  };

  const handleSaveAndNext = async () => {
    if (currentStep === AddPropertyFormStep.PROPERTY_DETAILS) {
      setRoute(AddPropertyRouteStep.LOCALITY_DETAILS);
    } else if (currentStep === AddPropertyFormStep.LOCALITY_DETAILS) {
      if (propertyCategory === PropertyCategory.RESALE) {
        setRoute(AddPropertyRouteStep.RESALE_DETAILS);
      } else {
        setRoute(AddPropertyRouteStep.RENTAL_DETAILS);
      }
    } else if (
      currentStep === AddPropertyFormStep.RENTAL_DETAILS ||
      currentStep === AddPropertyFormStep.RESALE_DETAILS
    ) {
      setRoute(AddPropertyRouteStep.GALLERY);
    } else if (currentStep === AddPropertyFormStep.GALLERY) {
      // Make API call to get presigned-urls
      await getPresignedPhotoUrls();
      setRoute(AddPropertyRouteStep.ADDITIONAL_INFO);
    } else if (currentStep === AddPropertyFormStep.ADDITIONAL_INFO) {
      uploadFilesToS3();
      // Don't navigate to a route for DONE step, just handle the API call
      // Make API call to post property
      await handlePostProperty();
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

      await addProperty({
        payload: apiPayload,
        phoneNo: userPhoneNo,
      });

      // Don't open success dialog here anymore - it will be opened automatically after upload completes
    } catch (error) {
      // openDialog("list-property-success-dialog");
      setRoute(AddPropertyRouteStep.ADDITIONAL_INFO);
      console.error("Error posting property:", error);
    }
  };

  const renderStepper = () => {
    return (
      <DesktopStepper
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
      {/* Mobile stepper is now handled inside ListPropertyStepper */}
      {/* {isMobile && renderStepper()} */}
      <div className="flex flex-col w-full h-full top-14">
        <div className="p-3 sticky top-16 z-40 bg-white border-b border-b-gray-100 shadow-md xl:px-28 lg:px-14 md:px-8 px-8">
          {/* Steps navigation */}
          {!isMobile && renderStepper()}
        </div>
        <div className="container right-0 max-md:ml-auto pt-4 md:pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-6">
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
          <div className="fixed bottom-0 left-80 right-0 flex justify-between py-2 xl:px-28 lg:px-14 md:px-8 px-8 border-t border-t-gray-300 bg-white">
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
              {currentStep === AddPropertyFormStep.ADDITIONAL_INFO
                ? "Add Property"
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
