"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  Check,
  FileImage,
  FileText,
  Home,
  IndianRupee,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import * as Yup from "yup";

import FormDropdown from "@/components/FormDropdown";
import FormPlacesAutocomplete from "@/components/FormPlacesAutoCompletes";
import GoogleMaps from "@/components/GoogleMaps";
import useGoogleMapsAPI from "@/hooks/useGoogleMapsAPI";

// Define our step enum
enum FormStep {
  PROPERTY_DETAILS = "Property Details",
  LOCALITY_DETAILS = "Locality Details",
  RESALE_DETAILS = "Resale Details",
  GALLERY = "Gallery",
  ADDITIONAL_INFO = "Additional Information",
  NONE = "None",
}

// Form validation schema
const PropertyDetailsSchema = Yup.object().shape({
  propertyType: Yup.string().required("Property type is required"),
  builtUpArea: Yup.number()
    .required("Built up area is required")
    .positive("Area must be positive"),
  facing: Yup.string().required("Facing is required"),
  bhkType: Yup.string().required("BHK type is required"),
  ownershipType: Yup.string().required("Ownership type is required"),
  propertyAge: Yup.string().required("Property age is required"),
  floor: Yup.string().required("Floor is required"),
  totalFloor: Yup.string().required("Total floor is required"),
  floorType: Yup.string().required("Floor type is required"),
  description: Yup.string()
    .min(30, "Description should be at least 30 characters")
    .required("Description is required"),
  city: Yup.string().required("City is required"),
  location: Yup.string().required("Location is required"),
  landmark: Yup.string().required("Landmark is required"),
  latitude: Yup.number()
    .required("Latitude is required")
    .min(-90, "Latitude must be greater than or equal to -90")
    .max(90, "Latitude must be less than or equal to 90"),
  longitude: Yup.number()
    .required("Longitude is required")
    .min(-180, "Longitude must be greater than or equal to -180")
    .max(180, "Longitude must be less than or equal to 180"),
});

// Initial form values
const initialValues = {
  propertyCategory: "Rent",
  propertyType: "Apartment",
  builtUpArea: 2500,
  facing: "East",
  bhkType: "3BHK",
  ownershipType: "Self Owned",
  propertyAge: "More than 10 year",
  floor: "Ground",
  totalFloor: "2",
  floorType: "Mosaic",
  description:
    "Top floor nicely placed. This lovely three bedroom for sale is only 1.95 Crores rupees without any extra brokerage & could be your new home. This West facing home is over 1536 sqft. & is in a convenient location. Situated on the 29th floor this home can comfortably serve your space for car and bike parking needs.",
  city: "Bengaluru",
  location: "Marathalli",
  landmark: "Rainbow Children's Hospital",
  latitude: 12.9716,
  longitude: 77.5946,
};

const StepNavigationButton: React.FC<{
  step: FormStep;
  currentStep: FormStep;
  completedSteps: Set<FormStep>;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isLast?: boolean;
}> = ({ step, currentStep, completedSteps, Icon, isLast }) => {
  const isActive = currentStep === step;
  const isCompleted = completedSteps.has(step);

  return (
    <div className="relative flex flex-col items-start">
      <div className="flex flex-row items-start">
        {/* Icon + line column */}
        <div className="relative flex flex-col items-center">
          <div
            className={`p-2 rounded-full border flex items-center justify-center 
                    ${isCompleted ? "border-green-500" : isActive ? "border-red-500" : "border-black"}`}
          >
            {isCompleted ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Icon
                className={`w-5 h-5 ${isActive ? "text-red-500" : "text-black"}`}
              />
            )}
          </div>
          {/* Vertical line below the circle */}
          {!isLast && (
            <div
              className={`w-px h-8  ${isCompleted ? "bg-black" : "bg-gray-300"}`}
            />
          )}
        </div>

        {/* Step label */}
        <div className="pl-2 pt-2">
          <span className={`${isActive ? "text-red-500" : "text-gray-600"}`}>
            {step}
          </span>
        </div>
      </div>
    </div>
  );
};

const ListPropertyPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.PROPERTY_DETAILS,
  );
  const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(
    new Set(),
  );
  console.log("currentStep", currentStep);
  console.log("completedSteps", completedSteps);

  // Update the markStepAsCompleted function to manage step completion state
  const markStepAsCompleted = (step: FormStep) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  };

  // Update the handleBack function to remove the previous step from completedSteps
  const handleBack = () => {
    setCompletedSteps((prev) => {
      const updatedSteps = new Set(prev);
      if (currentStep === FormStep.LOCALITY_DETAILS) {
        updatedSteps.delete(FormStep.PROPERTY_DETAILS);
        setCurrentStep(FormStep.PROPERTY_DETAILS);
      } else if (currentStep === FormStep.RESALE_DETAILS) {
        updatedSteps.delete(FormStep.LOCALITY_DETAILS);
        setCurrentStep(FormStep.LOCALITY_DETAILS);
      } else if (currentStep === FormStep.GALLERY) {
        updatedSteps.delete(FormStep.RESALE_DETAILS);
        setCurrentStep(FormStep.RESALE_DETAILS);
      } else if (currentStep === FormStep.ADDITIONAL_INFO) {
        updatedSteps.delete(FormStep.GALLERY);
        setCurrentStep(FormStep.GALLERY);
      }
      return updatedSteps;
    });
  };

  const handleSaveAndNext = () => {
    markStepAsCompleted(currentStep);
    if (currentStep === FormStep.PROPERTY_DETAILS) {
      setCurrentStep(FormStep.LOCALITY_DETAILS);
    } else if (currentStep === FormStep.LOCALITY_DETAILS) {
      setCurrentStep(FormStep.RESALE_DETAILS);
    } else if (currentStep === FormStep.RESALE_DETAILS) {
      setCurrentStep(FormStep.GALLERY);
    } else if (currentStep === FormStep.GALLERY) {
      setCurrentStep(FormStep.ADDITIONAL_INFO);
    } else {
      setCurrentStep(FormStep.NONE);
    }
  };

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useGoogleMapsAPI(API_KEY);
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="flex w-full h-full top-14">
      {/* Background SVG behind left section only */}
      <div className="left-0 z-40 w-[33.33%] fixed ">
        <Image
          src="/images/property-add-graphic.svg"
          alt="Property Graphic"
          width={500}
          height={500}
          className="w-full h-full object-cover max-xl:hidden"
        />
        {/* Left side - Steps navigation */}
        <div className="absolute right-8 top-12 flex flex-col z-50">
          {[
            { step: FormStep.PROPERTY_DETAILS, Icon: Home },
            { step: FormStep.LOCALITY_DETAILS, Icon: MapPin },
            { step: FormStep.RESALE_DETAILS, Icon: IndianRupee },
            { step: FormStep.GALLERY, Icon: FileImage },
            { step: FormStep.ADDITIONAL_INFO, Icon: FileText },
          ].map((item, idx, arr) => (
            <StepNavigationButton
              key={item.step}
              step={item.step}
              currentStep={currentStep}
              completedSteps={completedSteps}
              Icon={item.Icon}
              isLast={idx === arr.length - 1}
            />
          ))}
        </div>
      </div>
      <div className="container right-0 ml-[33.33%] py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
        <div className="flex flex-col">
          {/* Right side - Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={PropertyDetailsSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
              // Handle form submission here
            }}
          >
            {({ values, errors, touched, isValid }) => (
              <Form>
                {currentStep === FormStep.PROPERTY_DETAILS && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-3xl text-gray-800">
                        Tell Us About Your Property
                      </h1>
                      <p className="text-gray-500 mt-2">
                        Share key property details to create an accurate,
                        appealing listing.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="mb-6">
                        <FormDropdown
                          label="Property Type"
                          name="propertyType"
                          id="propertyType"
                          options={[
                            { value: "Apartment", label: "Apartment" },
                            { value: "Villa", label: "Villa" },
                            { value: "House", label: "House" },
                            { value: "Plot", label: "Plot" },
                            { value: "Commercial", label: "Commercial" },
                          ]}
                          required={true}
                          placeholder="Select property type"
                          aria-describedby={
                            errors.propertyType && touched.propertyType
                              ? "propertyType-error"
                              : undefined
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label
                            htmlFor="builtUpArea"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Built Up Area<span className="text-red-500">*</span>
                          </label>
                          <div className="flex">
                            <Field
                              type="number"
                              id="builtUpArea"
                              name="builtUpArea"
                              className="w-full p-3 border border-gray-300 rounded-l-xl focus:ring-red-500 focus:border-red-500"
                            />
                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl">
                              Sq.ft
                            </span>
                          </div>
                          <ErrorMessage
                            name="builtUpArea"
                            component="div"
                            className="mt-1 text-sm text-red-500"
                          />
                        </div>

                        <div>
                          <FormDropdown
                            label="Facing"
                            name="facing"
                            id="facing"
                            options={[
                              { value: "East", label: "East" },
                              { value: "West", label: "West" },
                              { value: "North", label: "North" },
                              { value: "South", label: "South" },
                              { value: "North-East", label: "North-East" },
                              { value: "North-West", label: "North-West" },
                              { value: "South-East", label: "South-East" },
                              { value: "South-West", label: "South-West" },
                            ]}
                            required={true}
                            placeholder="Select facing direction"
                            aria-describedby={
                              errors.facing && touched.facing
                                ? "facing-error"
                                : undefined
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <FormDropdown
                            label="BHK Type"
                            name="bhkType"
                            id="bhkType"
                            options={[
                              { value: "1BHK", label: "1 BHK" },
                              { value: "2BHK", label: "2 BHK" },
                              { value: "3BHK", label: "3 BHK" },
                              { value: "4BHK", label: "4 BHK" },
                              { value: "5+BHK", label: "5+ BHK" },
                            ]}
                            required={true}
                            placeholder="Select BHK Type"
                            aria-describedby={
                              errors.bhkType && touched.bhkType
                                ? "bhkType-error"
                                : undefined
                            }
                          />
                        </div>

                        <div>
                          <FormDropdown
                            label="Ownership Type"
                            name="ownershipType"
                            id="ownershipType"
                            options={[
                              { value: "Self Owned", label: "Self Owned" },
                              { value: "Rented", label: "Rented" },
                              {
                                value: "Co-operative Society",
                                label: "Co-operative Society",
                              },
                              {
                                value: "Power of Attorney",
                                label: "Power of Attorney",
                              },
                            ]}
                            required={true}
                            placeholder="Select ownership type"
                            aria-describedby={
                              errors.ownershipType && touched.ownershipType
                                ? "ownershipType-error"
                                : undefined
                            }
                          />
                        </div>
                        <div>
                          <FormDropdown
                            label="Property Age"
                            name="propertyAge"
                            id="propertyAge"
                            options={[
                              {
                                value: "Under Construction",
                                label: "Under Construction",
                              },
                              {
                                value: "Less than 1 year",
                                label: "Less than 1 year",
                              },
                              { value: "1-5 years", label: "1-5 years" },
                              { value: "5-10 years", label: "5-10 years" },
                              {
                                value: "More than 10 year",
                                label: "More than 10 year",
                              },
                            ]}
                            required={true}
                            placeholder="Select property age"
                            aria-describedby={
                              errors.propertyAge && touched.propertyAge
                                ? "propertyAge-error"
                                : undefined
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <FormDropdown
                            label="Floor"
                            name="floor"
                            id="floor"
                            options={[
                              { value: "Ground", label: "Ground" },
                              { value: "1", label: "1" },
                              { value: "2", label: "2" },
                              { value: "3", label: "3" },
                              { value: "4+", label: "4+" },
                            ]}
                            required={true}
                            placeholder="Select floor"
                            aria-describedby={
                              errors.floor && touched.floor
                                ? "floor-error"
                                : undefined
                            }
                          />
                        </div>

                        <div>
                          <FormDropdown
                            label="Total Floor"
                            name="totalFloor"
                            id="totalFloor"
                            options={[
                              { value: "1", label: "1" },
                              { value: "2", label: "2" },
                              { value: "3", label: "3" },
                              { value: "4", label: "4" },
                              { value: "5+", label: "5+" },
                            ]}
                            required={true}
                            placeholder="Select total floors"
                            aria-describedby={
                              errors.totalFloor && touched.totalFloor
                                ? "totalFloor-error"
                                : undefined
                            }
                          />
                        </div>

                        <div>
                          <FormDropdown
                            label="Floor Type"
                            name="floorType"
                            id="floorType"
                            options={[
                              { value: "Mosaic", label: "Mosaic" },
                              { value: "Marble", label: "Marble" },
                              { value: "Granite", label: "Granite" },
                              { value: "Vitrified", label: "Vitrified" },
                              { value: "Wooden", label: "Wooden" },
                            ]}
                            required={true}
                            placeholder="Select floor type"
                            aria-describedby={
                              errors.floorType && touched.floorType
                                ? "floorType-error"
                                : undefined
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={5}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Placeholder for other steps */}
                {currentStep === FormStep.LOCALITY_DETAILS && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-3xl text-gray-800">
                        Provide location details
                      </h1>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="col-span-1">
                          <FormDropdown
                            label="City"
                            name="city"
                            id="city"
                            options={[
                              { value: "Bengaluru", label: "Bengaluru" },
                              { value: "Delhi", label: "Delhi" },
                              { value: "Mumbai", label: "Mumbai" },
                              { value: "Chennai", label: "Chennai" },
                              { value: "Kolkata", label: "Kolkata" },
                              { value: "Hyderabad", label: "Hyderabad" },
                              { value: "Pune", label: "Pune" },
                            ]}
                            required={true}
                            placeholder="Select city"
                            aria-describedby={
                              errors.city && touched.city
                                ? "city-error"
                                : undefined
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <FormPlacesAutocomplete
                            label="Location / Society Name"
                            name="location"
                            id="location"
                            placeholder="Location / Society Name"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-6">
                        <FormPlacesAutocomplete
                          label="Landmark / Street"
                          name="landmark"
                          id="landmark"
                          placeholder="Landmark / Street"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-2xl text-gray-800">
                        Pin your location on the Map
                      </h3>
                      <p className="text-gray-400 mt-2 flex gap-2">
                        <MapPin />{" "}
                        <span>
                          Set property location by using search box and move the
                          map
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 h-96">
                      <GoogleMaps
                        mapId="houseclay-googlemaps"
                        apiKey={API_KEY}
                        center={{ lat: values.latitude, lng: values.longitude }} // Bengaluru
                        zoom={12}
                        className="h-full w-full rounded-lg shadow-lg"
                      />
                    </div>
                  </>
                )}

                {currentStep === FormStep.RESALE_DETAILS && (
                  <div className="py-10 text-center text-gray-500">
                    <p>Resale Details form will be implemented here</p>
                  </div>
                )}

                {currentStep === FormStep.GALLERY && (
                  <div className="py-10 text-center text-gray-500">
                    <p>Gallery upload form will be implemented here</p>
                  </div>
                )}

                {currentStep === FormStep.ADDITIONAL_INFO && (
                  <div className="py-10 text-center text-gray-500">
                    <p>Additional Information form will be implemented here</p>
                  </div>
                )}

                <div className="flex justify-between mt-10 pt-4  border-t border-t-gray-300">
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
                    disabled={!isValid}
                    onClick={handleSaveAndNext}
                  >
                    Save & Continue
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ListPropertyPage;
