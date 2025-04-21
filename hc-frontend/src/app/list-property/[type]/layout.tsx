"use client";

import { Form, Formik, FormikProvider } from "formik";
import Image from "next/image";
import { redirect, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

import FlatmatesStepper from "../components/FlatmatesStepper";
import RentStepper from "../components/RentStepper";
import ResaleStepper from "../components/ResaleStepper";
import { FormStep } from "../components/StepNavigationButton";

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
    parking: string;
    nonVegAllowed: boolean;
    amenities: string[];
  };
}

export default function ListPropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    redirect("/");
  }
  const params = useParams();
  const type = params?.type as string; // Optional: add type assertion
  const router = useRouter();
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
          setRoute(RouteStep.RENTAL_DETAILS);
        } else {
          updatedSteps.delete(FormStep.RENTAL_DETAILS);
          setCurrentStep(FormStep.RENTAL_DETAILS);
          setRoute(RouteStep.RENTAL_DETAILS);
        }
      } else if (currentStep === FormStep.ADDITIONAL_INFO) {
        updatedSteps.delete(FormStep.GALLERY);
        setCurrentStep(FormStep.GALLERY);
        setRoute(RouteStep.GALLERY);
      }
      return updatedSteps;
    });
  };

  const handleSaveAndNext = () => {
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
      setCurrentStep(FormStep.ADDITIONAL_INFO);
      setRoute(RouteStep.ADDITIONAL_INFO);
    } else if (currentStep === FormStep.ADDITIONAL_INFO) {
      setCurrentStep(FormStep.NONE);
      setRoute(RouteStep.NONE);
      //   openDialog("list-property-success-dialog");
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
    </div>
  );
}
