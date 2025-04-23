"use client";

import { Form, Formik, FormikProvider } from "formik";
import { motion } from "framer-motion";
import Image from "next/image";
import { redirect, useParams, useRouter } from "next/navigation";
import ListPropertySuccessSvg from "public/icons/list-property-success.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Dialog, DialogContent } from "@/components/Dialog";
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { useDialog } from "@/providers/DialogContextProvider";
import { usePresignedUrlsMutation } from "@/store/apiSlice";
import {
  PropertyPhoto,
  setFileURLMap,
  setPropertyID,
} from "@/store/listPropertySlice";
import { RootState } from "@/store/store";

import FlatmatesStepper from "../components/FlatmatesStepper";
import RentStepper from "../components/RentStepper";
import ResaleStepper from "../components/ResaleStepper";
import { FormStep } from "../components/StepNavigationButton";

const ListPropertySuccess = ListPropertySuccessSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

export enum RouteStep {
  GETTING_STARTED = "getting-started",
  PROPERTY_DETAILS = "property-details",
  LOCALITY_DETAILS = "locality-details",
  RENTAL_DETAILS = "rental-details",
  RESALE_DETAILS = "resale-details",
  GALLERY = "gallery",
  ADDITIONAL_INFO = "additional-info",
  NONE = "none",
}

export interface FormValues {
  propertyDetails: {
    propertyCategory: string;
    propertyType: string;
    builtUpArea: number;
    facing: string;
    bhkType: string;
    ownershipType: string;
    propertyAge: string;
    floor: string;
    totalFloor: string;
    floorType: string;
    description: string;
  };
  localityDetails: {
    city: string;
    location: string;
    landmark: string;
    latitude: number;
    longitude: number;
  };
  rentalDetails: {
    rent: number;
    rentNegotiable: boolean;
    maintenanceCharges: number;
    deposit: number;
    availableFrom: string;
    furnishing: string;
    preferredTenant: string;
    waterSupply: string;
    powerBackup: string;
    parking: boolean;
    nonVegAllowed: boolean;
    amenities: string[];
    tenantType: string;
    attachedBathroom: boolean;
    bathroomType: string;
    smokingPreference: boolean;
    drinkingPreference: boolean;
  };
  resaleDetails: {
    price: number;
    availableFrom: string;
    bathrooms: number;
    balcony: number;
    priceNegotiable: boolean;
    underLoan: boolean;
    waterSupply: string;
    powerBackup: string;
    furnishing: string;
    parking: boolean;
  };
  images: PropertyPhoto[];
  additionalInfo: {
    whoWillShowProperty: string;
    secondaryPhoneNumber: string;
    khataCertificate: string;
    saleDeed: boolean;
    propertyTax: boolean;
  };
}

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
  const params = useParams();
  const dispatch = useDispatch();
  const uploadFiles = useS3Uploader();
  const type = params?.type as string; // Optional: add type assertion
  const router = useRouter();
  const { openDialog, isDialogOpen, closeDialog } = useDialog();

  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.PROPERTY_DETAILS,
  );
  const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(
    new Set(),
  );
  const formKey = `${type}Form` as "rentForm" | "resaleForm" | "flatmatesForm";
  const formState = useSelector(
    (state: RootState) => state.listProperty[formKey],
  );
  const isFormValid = formState?.isValid;
  const initialValues = formState?.data || {};

  // Update the markStepAsCompleted function to manage step completion state
  const markStepAsCompleted = (step: FormStep) => {
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
      const photosToUpload = photos.map((photo) => {
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
      photos.forEach((f) => {
        fileMap[encodeURIComponent(f.file.name)] = f.file.type;
      });
      console.log(fileMap);
      const presignedUrlsResponse = await getPresignedUrls({
        fileMap,
      })
        .unwrap()
        .catch((error) => {
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
      if (currentStep === FormStep.LOCALITY_DETAILS) {
        updatedSteps.delete(FormStep.PROPERTY_DETAILS);
        setCurrentStep(FormStep.PROPERTY_DETAILS);
        setRoute(RouteStep.PROPERTY_DETAILS);
      } else if (currentStep === FormStep.RENTAL_DETAILS) {
        updatedSteps.delete(FormStep.LOCALITY_DETAILS);
        setCurrentStep(FormStep.LOCALITY_DETAILS);
        setRoute(RouteStep.LOCALITY_DETAILS);
      } else if (currentStep === FormStep.RESALE_DETAILS) {
        updatedSteps.delete(FormStep.LOCALITY_DETAILS);
        setCurrentStep(FormStep.LOCALITY_DETAILS);
        setRoute(RouteStep.LOCALITY_DETAILS);
      } else if (currentStep === FormStep.GALLERY) {
        if (type === "resale") {
          updatedSteps.delete(FormStep.RESALE_DETAILS);
          setCurrentStep(FormStep.RESALE_DETAILS);
          setRoute(RouteStep.RESALE_DETAILS);
        } else {
          updatedSteps.delete(FormStep.RENTAL_DETAILS);
          setCurrentStep(FormStep.RENTAL_DETAILS);
          setRoute(RouteStep.RENTAL_DETAILS);
        }
      } else if (currentStep === FormStep.ADDITIONAL_INFO) {
        updatedSteps.delete(FormStep.GALLERY);
        setCurrentStep(FormStep.GALLERY);
        setRoute(RouteStep.GALLERY);
      } else if (currentStep === FormStep.DONE) {
        updatedSteps.delete(FormStep.ADDITIONAL_INFO);
        setCurrentStep(FormStep.ADDITIONAL_INFO);
      }
      return updatedSteps;
    });
  };

  const handleSaveAndNext = async () => {
    markStepAsCompleted(currentStep);
    if (currentStep === FormStep.PROPERTY_DETAILS) {
      setCurrentStep(FormStep.LOCALITY_DETAILS);
      setRoute(RouteStep.LOCALITY_DETAILS);
    } else if (currentStep === FormStep.LOCALITY_DETAILS) {
      if (type === "resale") {
        setCurrentStep(FormStep.RESALE_DETAILS);
        setRoute(RouteStep.RESALE_DETAILS);
      } else {
        setCurrentStep(FormStep.RENTAL_DETAILS);
        setRoute(RouteStep.RENTAL_DETAILS);
      }
    } else if (
      currentStep === FormStep.RENTAL_DETAILS ||
      currentStep === FormStep.RESALE_DETAILS
    ) {
      setCurrentStep(FormStep.GALLERY);
      setRoute(RouteStep.GALLERY);
    } else if (currentStep === FormStep.GALLERY) {
      // Make API call to get presigned-urls
      await getPresignedPhotoUrls();
      setCurrentStep(FormStep.ADDITIONAL_INFO);
      setRoute(RouteStep.ADDITIONAL_INFO);
    } else if (currentStep === FormStep.ADDITIONAL_INFO) {
      uploadFilesToS3();
      setCurrentStep(FormStep.DONE);
      openDialog("list-property-success-dialog");
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

  const slideVariants = {
    initial: { x: 300, opacity: 0 }, // Slide in from the right
    animate: { x: 0, opacity: 1 }, // Centered and visible
    exit: { x: -300, opacity: 0 }, // Slide out to the left
  };

  return (
    <div className="flex w-full h-full top-14">
      {/* Background SVG behind left section only */}
      <div className="left-0 top-14 bottom-0 z-40 w-[33.33%] fixed  bg-gray-50">
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
      <div className="container right-0 ml-[33.33%] pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
        <motion.div
          key={`${type}-${currentStep}`} // Key the animation to the route
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
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
        </motion.div>
        <div className="fixed bottom-0 left-0 ml-[33.33%] right-0 flex justify-between py-2 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 border-t border-t-gray-300 bg-white">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
            onClick={handleBack}
          >
            Back
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                  //   onClick={onPreview}
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
  );
}
