"use client";

import { Form, Formik, FormikProvider } from "formik";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ListPropertySuccessSvg from "public/icons/list-property-success.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ListPropertyFormStep,
  ListPropertyRouteStep,
  PropertyType,
} from "@/common/enums";
import { extractS3KeyFromUrl } from "@/common/utils";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useS3Uploader } from "@/hooks/useS3Uploader";
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

export default function ListPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const params = useParams();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const type = params?.type as string; // Optional: add type assertion
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();

  const [currentStep, setCurrentStep] = useState<ListPropertyFormStep>(
    ListPropertyFormStep.PROPERTY_DETAILS,
  );
  const [completedSteps, setCompletedSteps] = useState<
    Set<ListPropertyFormStep>
  >(new Set());
  const formKey = `${type}Form` as "rentForm" | "resaleForm" | "flatmatesForm";
  const [addRentProperty] = usePropertyAddRentMutation();
  const [addResaleProperty] = usePropertyAddResaleMutation();
  const [addFlatmatesProperty] = usePropertyAddFlatmatesMutation();

  const propertyId = useSelector(
    (state: RootState) => state.listProperty.propertyID,
  );
  const imagesS3Url = useSelector(
    (state: RootState) => state.listProperty.imagesS3Url,
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

  // Update the markStepAsCompleted function to manage step completion state
  const markStepAsCompleted = (step: ListPropertyFormStep) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  };

  const setRoute = (stepSlug: string) => {
    const route = `/list-property/${type}/${stepSlug}`;
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
          type: photo.file.type,
          S3Url: imagesS3Url[photo.file.name],
        };
      });
      uploadFiles(photosToUpload);
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
          type === "resale"
            ? ListPropertyFormStep.RESALE_DETAILS
            : ListPropertyFormStep.RENTAL_DETAILS,
        route:
          type === "resale"
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
    if (currentStep === ListPropertyFormStep.PROPERTY_DETAILS) {
      setCurrentStep(ListPropertyFormStep.LOCALITY_DETAILS);
      setRoute(ListPropertyRouteStep.LOCALITY_DETAILS);
    } else if (currentStep === ListPropertyFormStep.LOCALITY_DETAILS) {
      if (type === "resale") {
        setCurrentStep(ListPropertyFormStep.RESALE_DETAILS);
        setRoute(ListPropertyRouteStep.RESALE_DETAILS);
      } else {
        setCurrentStep(ListPropertyFormStep.RENTAL_DETAILS);
        setRoute(ListPropertyRouteStep.RENTAL_DETAILS);
      }
    } else if (
      currentStep === ListPropertyFormStep.RENTAL_DETAILS ||
      currentStep === ListPropertyFormStep.RESALE_DETAILS
    ) {
      setCurrentStep(ListPropertyFormStep.GALLERY);
      setRoute(ListPropertyRouteStep.GALLERY);
    } else if (currentStep === ListPropertyFormStep.GALLERY) {
      // Make API call to get presigned-urls
      await getPresignedPhotoUrls();
      setCurrentStep(ListPropertyFormStep.ADDITIONAL_INFO);
      setRoute(ListPropertyRouteStep.ADDITIONAL_INFO);
    } else if (currentStep === ListPropertyFormStep.ADDITIONAL_INFO) {
      uploadFilesToS3();
      setCurrentStep(ListPropertyFormStep.DONE);
      // Make API call to post property
      await handlePostProperty();
    }
  };

  const handlePreviewListing = async () => {
    closeDialog("list-property-success-dialog");
    router.push(`/property-details/${type}/${propertyId}`);
  };

  const handlePostProperty = async () => {
    try {
      const propertyDetails = formState.data!.propertyDetails;
      const localityDetails = formState.data!.localityDetails;
      const additionalInfo = formState.data!.additionalInfo;
      const imagesS3Keys =
        Object.values(imagesS3Url).length > 0
          ? Object.values(imagesS3Url).map(
              (url) => extractS3KeyFromUrl(url) || "",
            )
          : [];

      const basePropertyData = {
        propertyID: propertyId,
        ...localityDetails,
        images: imagesS3Keys,
      };

      switch (type) {
        case "rent": {
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
          break;
        }
        case "resale": {
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
          break;
        }
        case "flatmates": {
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
          break;
        }
      }
      openDialog("list-property-success-dialog");
    } catch (error) {
      // openDialog("list-property-success-dialog");
      setCurrentStep(ListPropertyFormStep.ADDITIONAL_INFO);
      setRoute(ListPropertyRouteStep.ADDITIONAL_INFO);
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
      ListPropertyFormStep.PROPERTY_DETAILS,
      ListPropertyFormStep.LOCALITY_DETAILS,
      ListPropertyFormStep.GALLERY,
      ListPropertyFormStep.ADDITIONAL_INFO,
      ListPropertyFormStep.DONE,
    ];

    if (
      type.toUpperCase() === PropertyType.RENT ||
      type.toUpperCase() === PropertyType.FLATMATES
    ) {
      return [
        ...baseSteps.slice(0, 2),
        ListPropertyFormStep.RENTAL_DETAILS,
        ...baseSteps.slice(2),
      ];
    } else if (type.toUpperCase() === PropertyType.RESALE) {
      return [
        ...baseSteps.slice(0, 2),
        ListPropertyFormStep.RESALE_DETAILS,
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
        : currentStep === ListPropertyFormStep.DONE
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
            {renderStepper()}
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
        {isDialogOpen("list-property-success-dialog") && (
          <Dialog
            id="list-property-success-dialog"
            type={isMobile ? "bottom-sheet" : "card"}
            onClose={() => {
              closeDialog("list-property-success-dialog");
              dispatch(setHideStickyNavBar(false));
            }}
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
                      Woohoo! It&apos;s all done.
                    </h1>
                    <button className="absolute top-4 right-4 rounded-full">
                      <X
                        onClick={() => {
                          closeDialog("list-property-success-dialog");
                          dispatch(setHideStickyNavBar(false));
                        }}
                        size={25}
                      />
                    </button>
                  </>
                )}
              </div>
            </DialogHeader>
            <DialogContent>
              <div className="flex flex-col items-center justify-center text-center px-6 pb-2 pt-6 gap-4">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
                  <ListPropertySuccess />
                </div>
                {!isMobile && (
                  <h2 className="text-3xl text-gray-800">Congratulations!</h2>
                )}
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
