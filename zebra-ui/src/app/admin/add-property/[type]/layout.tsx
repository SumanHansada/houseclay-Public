"use client";

import { Form, Formik, FormikProvider } from "formik";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ListPropertySuccessSvg from "public/icons/list-property-success.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ListPropertyFormStep as AddPropertyFormStep,
  ListPropertyRouteStep as AddPropertyRouteStep,
  PropertyType,
} from "@/common/enums";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { PropertyPhoto } from "@/interfaces/PropertyPhoto";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  usePresignedUrlsMutation,
  usePropertyAddFlatmatesMutation,
  usePropertyAddRentMutation,
  usePropertyAddResaleMutation,
} from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { setFileURLMap, setPropertyID } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

import DesktopStepper from "../components/DesktopStepper";

const ListPropertySuccess = ListPropertySuccessSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

export const dynamicParams = true;

export default function AddPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const params = useParams();
  const dispatch = useDispatch();
  const type = params?.type as string; // Optional: add type assertion
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();
  // const uploadFiles = useS3Uploader();
  const { isMobile } = useDeviceContext();

  const [currentStep, setCurrentStep] = useState<AddPropertyFormStep>(
    AddPropertyFormStep.PROPERTY_DETAILS,
  );
  const [completedSteps, setCompletedSteps] = useState<
    Set<AddPropertyFormStep>
  >(new Set());
  const formKey = `${type}Form` as "rentForm" | "resaleForm" | "flatmatesForm";

  const [addRentProperty] = usePropertyAddRentMutation();
  const [addResaleProperty] = usePropertyAddResaleMutation();
  const [addFlatmatesProperty] = usePropertyAddFlatmatesMutation();

  const propertyId = useSelector(
    (state: RootState) => state.listProperty.propertyID,
  );

  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );

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

  const markStepAsCompleted = (step: AddPropertyFormStep) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  };

  const setRoute = (stepSlug: string) => {
    const route = `/admin/add-property/${type}/${stepSlug}`;
    router.push(route);
  };

  const uploadFilesToS3 = async () => {
    const photos = formState?.data?.images || [];
    if (photos.length > 0) {
      // create a map of file names to their corresponding Blob URLs
      const photosToUpload = photos.map((photo: PropertyPhoto) => {
        return {
          name: photo.file.name,
          url: photo.url,
          S3url: photo.S3Url,
          type: photo.file.type,
        };
      });
      console.log("photosToUpload", photosToUpload);
      // uploadFiles(photosToUpload);
    }
  };

  const getPresignedPhotoUrls = async () => {
    // photos not required for presigned urls
    const photos = formState?.data?.images || [];
    // Step 1: Request pre-signed URLs
    const fileMap: Record<string, string> = {};
    photos.forEach((f: PropertyPhoto) => {
      fileMap[encodeURIComponent(f.file.name)] = f.file.type;
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
        type: formKey,
        data: presignedUrlsResponse.fileURLMap,
      }),
    );
  };

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
          type === "resale"
            ? AddPropertyFormStep.RESALE_DETAILS
            : AddPropertyFormStep.RENTAL_DETAILS,
        route:
          type === "resale"
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
      setCompletedSteps((prev) => {
        const updatedSteps = new Set(prev);
        updatedSteps.delete(currentStepConfig.prevStep);
        return updatedSteps;
      });
      setCurrentStep(currentStepConfig.prevStep);
      setRoute(currentStepConfig.route);
    }
  };

  const handleSaveAndNext = async () => {
    markStepAsCompleted(currentStep);
    if (currentStep === AddPropertyFormStep.PROPERTY_DETAILS) {
      setCurrentStep(AddPropertyFormStep.LOCALITY_DETAILS);
      setRoute(AddPropertyRouteStep.LOCALITY_DETAILS);
    } else if (currentStep === AddPropertyFormStep.LOCALITY_DETAILS) {
      if (type === "resale") {
        setCurrentStep(AddPropertyFormStep.RESALE_DETAILS);
        setRoute(AddPropertyRouteStep.RESALE_DETAILS);
      } else {
        setCurrentStep(AddPropertyFormStep.RENTAL_DETAILS);
        setRoute(AddPropertyRouteStep.RENTAL_DETAILS);
      }
    } else if (
      currentStep === AddPropertyFormStep.RENTAL_DETAILS ||
      currentStep === AddPropertyFormStep.RESALE_DETAILS
    ) {
      setCurrentStep(AddPropertyFormStep.GALLERY);
      setRoute(AddPropertyRouteStep.GALLERY);
    } else if (currentStep === AddPropertyFormStep.GALLERY) {
      // Make API call to get presigned-urls
      await getPresignedPhotoUrls();
      setCurrentStep(AddPropertyFormStep.ADDITIONAL_INFO);
      setRoute(AddPropertyRouteStep.ADDITIONAL_INFO);
    } else if (currentStep === AddPropertyFormStep.ADDITIONAL_INFO) {
      uploadFilesToS3();
      setCurrentStep(AddPropertyFormStep.DONE);
      // Make API call to post property
      await handlePostProperty();
      openDialog("list-property-success-dialog");
    }
  };

  const handlePreviewListing = async () => {
    // Make API call to get presigned-urls
    console.log("Preview Listing");
  };

  const handlePostProperty = async () => {
    try {
      const propertyDetails = formState.data!.propertyDetails;
      const localityDetails = formState.data!.localityDetails;
      const images = formState.data!.images.map(
        (image: PropertyPhoto) => image.url,
      );
      const additionalInfo = formState.data!.additionalInfo;

      const basePropertyData = {
        propertyID: propertyId,
        ...localityDetails,
        images,
      };

      if (type === "rent") {
        const rentalDetails = formState.data!.rentalDetails!;

        const {
          khataCertificate: _khataCertificate,
          saleDeed: _saleDeed,
          propertyTax: _propertyTax,
          ...rentalAdditionalInfo
        } = additionalInfo || {};
        await addRentProperty({
          ...basePropertyData,
          ...propertyDetails,
          ...rentalDetails,
          ...rentalAdditionalInfo,
        }).unwrap();
      } else if (type === "resale") {
        const resaleDetails = formState.data!.resaleDetails!;
        const {
          whoWillShowProperty: _whoWillShowProperty,
          ...resaleAdditionalInfo
        } = additionalInfo || {};
        await addResaleProperty({
          ...basePropertyData,
          ...propertyDetails,
          ...resaleDetails,
          ...resaleAdditionalInfo,
        }).unwrap();
      } else if (type === "flatmates") {
        const flatmatesDetails = formState.data!.flatmatesDetails!;

        const {
          ownershipType: _ownershipType,
          propertyAge: _propertyAge,
          floorType: _floorType,
          facing: _facing,
          ...flatmatesPropertyDetails
        } = propertyDetails || {};

        const {
          khataCertificate: _khataCertificate,
          saleDeed: _saleDeed,
          propertyTax: _propertyTax,
          ...flatmatesAdditionalInfo
        } = additionalInfo || {};
        await addFlatmatesProperty({
          ...basePropertyData,
          ...flatmatesPropertyDetails,
          ...flatmatesDetails,
          ...flatmatesAdditionalInfo,
        }).unwrap();
      }
    } catch (error) {
      console.error("Error posting property:", error);
    }
  };

  const renderStepper = () => {
    return (
      <DesktopStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        type={type.toUpperCase() as PropertyType}
      />
    );
  };

  const goToHomePage = () => {
    router.push("/");
  };

  const getStepsForPropertyType = (type: string): string[] => {
    const baseSteps = [
      AddPropertyFormStep.PROPERTY_DETAILS,
      AddPropertyFormStep.LOCALITY_DETAILS,
      AddPropertyFormStep.GALLERY,
      AddPropertyFormStep.ADDITIONAL_INFO,
      AddPropertyFormStep.DONE,
    ];

    if (
      type.toUpperCase() === PropertyType.RENT ||
      type.toUpperCase() === PropertyType.FLATMATES
    ) {
      return [
        ...baseSteps.slice(0, 2),
        AddPropertyFormStep.RENTAL_DETAILS,
        ...baseSteps.slice(2),
      ];
    } else if (type.toUpperCase() === PropertyType.RESALE) {
      return [
        ...baseSteps.slice(0, 2),
        AddPropertyFormStep.RESALE_DETAILS,
        ...baseSteps.slice(2),
      ];
    }
    return baseSteps;
  };

  const calculateProgressPercent = (type: string, currentStep: string) => {
    const steps = getStepsForPropertyType(type);
    const currentIndex = steps.findIndex((step) => step === currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const renderStepperMobile = () => {
    const steps = getStepsForPropertyType(type);
    const currentIndex = steps.findIndex((step) => step === currentStep);

    // Fallback for enum value vs string
    const displayStep =
      typeof currentStep === "string"
        ? currentStep
        : currentStep === AddPropertyFormStep.DONE
          ? steps[steps.length - 1]
          : steps[currentIndex] || steps[0];

    return (
      <>
        <div className="flex justify-center items-center align-middle w-full md:hidden">
          <h1 className="text-lg my-auto text-black ml-auto">{displayStep}</h1>
          <button className="border border-gray-200 rounded-full md:border-none ml-auto">
            <X onClick={goToHomePage} size={25} />
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <section
        className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-gray-200 bg-white flex flex-col justify-center items-center w-full md:hidden`}
      >
        {renderStepperMobile()}
      </section>
      <div className="h-[2px] fixed w-full bg-gray-200 mt-auto z-50">
        <div
          className="h-[2px] bg-red-500 absolute top-0 left-0 transition-all duration-300"
          style={{ width: `${calculateProgressPercent(type, currentStep)}%` }}
        />
      </div>
      <div className="flex flex-col w-full h-full top-14">
        {/* Horizontal - Steps navigation */}
        <div className="p-3 sticky top-16 z-40 bg-white border-b border-b-gray-100 shadow-md dark:bg-gray-900 xl:px-28 lg:px-14 md:px-8 px-8">
          {renderStepper()}
        </div>
        <div className="container right-0 max-md:ml-auto pt-4 md:pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
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
          <div className="fixed bottom-0 left-80 right-0 flex justify-between py-2 xl:px-28 lg:px-14 md:px-8 px-8 border-t border-t-gray-300 bg-white dark:bg-gray-900">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 hover:border-gray-500 text-gray-900 rounded-xl hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed dark:text-gray-300 hover:dark:bg-gray-800"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              type="submit"
              className="px-6 py-3 border border-red-500 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-300"
              disabled={!isFormValid}
              onClick={handleSaveAndNext}
            >
              {currentStep === AddPropertyFormStep.ADDITIONAL_INFO
                ? "Add Property"
                : "Save & Next"}
            </button>
          </div>
        </div>
        {isDialogOpen("list-property-success-dialog") && (
          <Dialog
            id="list-property-success-dialog"
            type={isMobile ? "bottom-sheet" : "card"}
            onClose={() => closeDialog("list-property-success-dialog")}
            entryAnimation="animate-fade-in"
            exitAnimation="animate-fade-out"
          >
            <DialogHeader>
              <div
                className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
              >
                {isMobile && (
                  <>
                    <h1 className="text-xl py-1.5 text-black">
                      Woohoo! It’s all done.
                    </h1>
                    <button className="absolute top-4 right-4 border border-gray-200 rounded-full md:border-none">
                      <X
                        onClick={() =>
                          closeDialog("list-property-success-dialog")
                        }
                        size={25}
                      />
                    </button>
                  </>
                )}
              </div>
            </DialogHeader>
            <DialogContent>
              <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
                  <ListPropertySuccess />
                </div>
                {!isMobile && (
                  <h2 className="text-3xl text-gray-800">Congratulations!</h2>
                )}
                <h2 className="text-3xl text-gray-800">Congratulations!</h2>
                <p className="text-gray-600 text-lg">
                  You have successfully posted your property,
                  <br />
                  it will be live within 2 Hrs.
                </p>
                {/* Action buttons */}
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => {
                      closeDialog("list-property-success-dialog");
                    }}
                    className="w-full py-3 text-black border font-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handlePreviewListing}
                    className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    {isMobile ? "View Listing" : "Preview Listing"}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
