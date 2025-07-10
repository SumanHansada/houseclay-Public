"use client";

import { Form, Formik, FormikProvider } from "formik";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ListPropertyFormStep,
  ListPropertyRouteStep,
  PropertyCategory,
} from "@/common/enums";
import { extractS3KeyFromUrl } from "@/common/utils";
import { ListPropertySuccessDialog } from "@/dialogs/list-property-success-dialog";
import { UploadDialog } from "@/dialogs/upload-dialog";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { FlatmateForm } from "@/interfaces/FlatmateForm";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { RentForm } from "@/interfaces/RentForm";
import { ResaleForm } from "@/interfaces/ResaleForm";
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

import ListPropertyStepper from "../components/ListPropertyStepper";

export default function ListPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();

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
  const initialValues = formState?.data || {};

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
    const route = `/list-property/${propertyCategory.toLowerCase()}/${stepSlug}`;
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
      // Make API call to post property
      await handlePostProperty();
    }
  };

  const handlePostProperty = async () => {
    try {
      const propertyDetails = formState.data?.propertyDetails;
      const localityDetails = formState.data?.localityDetails;
      const additionalInfo = formState.data?.additionalInfo;
      const rentalDetails = (formState.data as RentForm)?.rentalDetails;
      const resaleDetails = (formState.data as ResaleForm)?.resaleDetails;
      const flatmateDetails = (formState.data as FlatmateForm).flatmateDetails;
      const imagesS3Keys =
        Object.values(propertyImagesS3Url).length > 0
          ? Object.values(propertyImagesS3Url).map(
              (url) => extractS3KeyFromUrl(url) || "",
            )
          : [];
      const coverImage = propertyImages.filter((image) => image.isCover);
      const coverImageName =
        coverImage.length > 0 ? coverImage[0].file.name : "";
      const coverImageS3Key = imagesS3Keys.find((key) =>
        key.endsWith(coverImageName),
      );
      let propertyData = {
        propertyID,
        propertyCategory,
        images: imagesS3Keys,
        coverImage: coverImageS3Key,
        ...propertyDetails,
        ...localityDetails,
        ...additionalInfo,
      };

      if (propertyCategory === PropertyCategory.RESALE) {
        propertyData = { ...propertyData, ...resaleDetails };
      } else if (propertyCategory === PropertyCategory.RENT) {
        propertyData = { ...propertyData, ...rentalDetails };
      } else if (propertyCategory === PropertyCategory.FLATMATE) {
        propertyData = { ...propertyData, ...flatmateDetails };
      }

      await addProperty({
        ...propertyData,
      });

      // Don't open success dialog here anymore - it will be opened automatically after upload completes
    } catch (error) {
      // openDialog("list-property-success-dialog");
      setRoute(ListPropertyRouteStep.ADDITIONAL_INFO);
      console.error("Error posting property:", error);
    }
  };

  const renderStepper = () => {
    return (
      <ListPropertyStepper
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
      {isMobile && renderStepper()}
      <div className="flex w-full h-full top-14">
        {/* Background SVG behind left section only */}
        <div className="left-0 top-14 bottom-0 z-40 w-[33.33%] fixed  bg-gray-50 max-md:hidden">
          <Image
            src="/images/property-add-graphic.svg"
            alt="Property Graphic"
            width={500}
            height={500}
            className="w-full h-full object-cover max-xl:hidden"
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
                ? "List Property"
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
