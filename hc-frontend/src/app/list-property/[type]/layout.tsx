"use client";

import { Form, Formik, FormikProvider } from "formik";
import { X } from "lucide-react";
import Image from "next/image";
import { redirect, useParams, useRouter } from "next/navigation";
import ListPropertySuccessSvg from "public/icons/list-property-success.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ListPropertyRouteStep } from "@/common/enums";
import { ListPropertyFormStep } from "@/common/enums";
import { Dialog, DialogContent } from "@/components/Dialog";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { PropertyPhoto } from "@/interfaces/PropertyPhoto";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  usePresignedUrlsMutation,
  usePropertyAddMutation,
} from "@/store/apiSlice";
import { setFileURLMap, setPropertyID } from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

import FlatmatesStepper from "../components/FlatmatesStepper";
import RentStepper from "../components/RentStepper";
import ResaleStepper from "../components/ResaleStepper";

const ListPropertySuccess = ListPropertySuccessSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

export const dynamicParams = true;

export default function ListPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    redirect("/");
  }
  const [getPresignedUrls] = usePresignedUrlsMutation();
  const [postProperty] = usePropertyAddMutation();
  const params = useParams();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const type = params?.type as string; // Optional: add type assertion
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();

  const [currentStep, setCurrentStep] = useState<ListPropertyFormStep>(
    ListPropertyFormStep.PROPERTY_DETAILS,
  );
  const [completedSteps, setCompletedSteps] = useState<
    Set<ListPropertyFormStep>
  >(new Set());
  const formKey = `${type}Form` as "rentForm" | "resaleForm" | "flatmatesForm";
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const initialValues = formState?.data || {};

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
          S3url: photo.S3Url,
          type: photo.file.type,
        };
      });
      uploadFiles(photosToUpload);
    }
  };

  const getPresignedPhotoUrls = async () => {
    const photos = formState?.data?.images || [];
    if (photos.length > 0) {
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
    }
  };

  // Update the handleBack function to remove the previous step from completedSteps
  const handleBack = () => {
    setCompletedSteps((prev) => {
      const updatedSteps = new Set(prev);
      if (currentStep === ListPropertyFormStep.PROPERTY_DETAILS) {
        router.back();
      } else if (currentStep === ListPropertyFormStep.LOCALITY_DETAILS) {
        updatedSteps.delete(ListPropertyFormStep.PROPERTY_DETAILS);
        setCurrentStep(ListPropertyFormStep.PROPERTY_DETAILS);
        setRoute(ListPropertyRouteStep.PROPERTY_DETAILS);
      } else if (currentStep === ListPropertyFormStep.RENTAL_DETAILS) {
        updatedSteps.delete(ListPropertyFormStep.LOCALITY_DETAILS);
        setCurrentStep(ListPropertyFormStep.LOCALITY_DETAILS);
        setRoute(ListPropertyRouteStep.LOCALITY_DETAILS);
      } else if (currentStep === ListPropertyFormStep.RESALE_DETAILS) {
        updatedSteps.delete(ListPropertyFormStep.LOCALITY_DETAILS);
        setCurrentStep(ListPropertyFormStep.LOCALITY_DETAILS);
        setRoute(ListPropertyRouteStep.LOCALITY_DETAILS);
      } else if (currentStep === ListPropertyFormStep.GALLERY) {
        if (type === "resale") {
          updatedSteps.delete(ListPropertyFormStep.RESALE_DETAILS);
          setCurrentStep(ListPropertyFormStep.RESALE_DETAILS);
          setRoute(ListPropertyRouteStep.RESALE_DETAILS);
        } else {
          updatedSteps.delete(ListPropertyFormStep.RENTAL_DETAILS);
          setCurrentStep(ListPropertyFormStep.RENTAL_DETAILS);
          setRoute(ListPropertyRouteStep.RENTAL_DETAILS);
        }
      } else if (currentStep === ListPropertyFormStep.ADDITIONAL_INFO) {
        updatedSteps.delete(ListPropertyFormStep.GALLERY);
        setCurrentStep(ListPropertyFormStep.GALLERY);
        setRoute(ListPropertyRouteStep.GALLERY);
      } else if (currentStep === ListPropertyFormStep.DONE) {
        updatedSteps.delete(ListPropertyFormStep.ADDITIONAL_INFO);
        setCurrentStep(ListPropertyFormStep.ADDITIONAL_INFO);
      }
      return updatedSteps;
    });
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
      openDialog("list-property-success-dialog");
    }
  };

  const handlePreviewListing = async () => {
    console.log("Preview Listing");
    const propertyDetails = formState.data!.propertyDetails;
    const localityDetails = formState.data!.localityDetails;
    const rentalOrResaleDetails =
      formKey === "resaleForm"
        ? formState.data!.resaleDetails
        : formState.data!.rentalDetails;
    const images = formState.data!.images.map(
      (image: PropertyPhoto) => image.url,
    );
    const additionalInfo = formState.data!.additionalInfo;

    const postPropertyResponse = await postProperty({
      propertyID: "1",
      ...propertyDetails,
      ...localityDetails,
      ...rentalOrResaleDetails,
      images,
      ...additionalInfo,
    })
      .unwrap()
      .catch((error: Error) => {
        console.error("Error posting property:", error);
      });
    if (postPropertyResponse) {
      console.log("Property posted successfully");
    }
  };

  const renderStepper = () => {
    switch (type) {
      case "rent":
        return (
          <RentStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        );
      case "resale":
        return (
          <ResaleStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        );
      case "flatmates":
        return (
          <FlatmatesStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        );
      default:
        return null;
    }
  };

  const goToHomePage = () => {
    router.push("/");
  };

  const renderStepperMobile = () => {
    // Define steps based on type
    let steps: string[] = [];
    if (type === "rent" || type === "flatmates") {
      steps = [
        "Property Details",
        "Locality Details",
        "Rental Details",
        "Gallery",
        "Additional Information",
      ];
    } else if (type === "resale") {
      steps = [
        "Property Details",
        "Locality Details",
        "Resale Details",
        "Gallery",
        "Additional Information",
      ];
    }

    // Find current step index
    const currentIndex = steps.findIndex((step) => step === currentStep);

    // Fallback for enum value vs string
    const displayStep =
      typeof currentStep === "string"
        ? currentStep
        : steps[currentIndex] || steps[0];

    // Progress calculation
    const progressPercent = ((currentIndex + 1) / steps.length) * 100;

    return (
      <>
        <div className="flex justify-center items-center align-middle w-full md:hidden">
          <h1 className="text-lg my-auto text-black ml-auto">{displayStep}</h1>
          <button className="border border-gray-200 rounded-full md:border-none ml-auto">
            <X onClick={goToHomePage} size={25} />
          </button>
        </div>
        <div className="w-full h-1 rounded-full bg-gray-200 relative mt-auto">
          <div
            className="h-1 rounded-full bg-red-500 absolute top-0 left-0 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <section
        className={`py-2 px-4 fixed top-0 left-0 right-0 z-50 border-b h-[55px] border-gray-200 bg-white flex flex-col justify-center items-center w-full md:hidden`}
      >
        {renderStepperMobile()}
      </section>
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
        <div className="container right-0 ml-[33.33%] max-md:ml-auto pt-8 md:pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
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
          <div className="fixed bottom-0 left-0 ml-[33.33%] max-md:ml-auto right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 border-t border-t-gray-300 bg-white">
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
              Save & Continue
            </button>
          </div>
        </div>
        {isDialogOpen("list-property-success-dialog") && (
          <Dialog
            id="list-property-success-dialog"
            type="card"
            onClose={() => closeDialog("list-property-success-dialog")}
            entryAnimation="animate-fade-in"
            exitAnimation="animate-fade-out"
          >
            <DialogContent>
              <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 shadow-[inset_0_0_25px_25px_rgba(255,255,255,0.8)] z-20"></div>
                  <ListPropertySuccess />
                </div>
                <h2 className="text-3xl text-gray-800">Congratulations!</h2>
                <p className="text-gray-600 text-lg">
                  You have successfully posted your property,
                  <br />
                  it will be live within 2 Hrs.
                </p>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      closeDialog("list-property-success-dialog");
                    }}
                    className="px-24 py-3 text-black border font-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handlePreviewListing}
                    className="px-24 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Preview Listing
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
