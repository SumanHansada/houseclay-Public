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
import { redirect } from "next/navigation";
import TwentyFourSevenPowerIconSvg from "public/icons/amenities/24x7-power.svg";
import BBQGrillIconSvg from "public/icons/amenities/bbq-grill.svg";
import ClubhouseIconSvg from "public/icons/amenities/clubhouse.svg";
import DedicatedWorkspaceIconSvg from "public/icons/amenities/dedicated-workspace.svg";
import FireExtinguisherIconSvg from "public/icons/amenities/fire-extinguisher.svg";
import FirstAidKitIconSvg from "public/icons/amenities/first-aid-kit.svg";
import GatedSecurityIconSvg from "public/icons/amenities/gated-security.svg";
import GymIconSvg from "public/icons/amenities/gym.svg";
import LiftIconSvg from "public/icons/amenities/lift.svg";
import OutdoorDiningAreaIconSvg from "public/icons/amenities/outdoor-dining-area.svg";
import ParkingSpaceIconSvg from "public/icons/amenities/parking-space.svg";
import PoolIconSvg from "public/icons/amenities/pool.svg";
import PoolTableIconSvg from "public/icons/amenities/pool-table.svg";
import SecurityIconSvg from "public/icons/amenities/security.svg";
import SmokeAlarmIconSvg from "public/icons/amenities/smoke-alarm.svg";
import SwimmingPoolIconSvg from "public/icons/amenities/swimming-pool.svg";
import WifiIconSvg from "public/icons/amenities/wifi.svg";
import ListPropertySuccessSvg from "public/icons/list-property-success.svg";
import BachelorIconSvg from "public/icons/preferred-tenants/bachelor.svg";
import CompanyIconSvg from "public/icons/preferred-tenants/company.svg";
import CoupleIconSvg from "public/icons/preferred-tenants/couple.svg";
import FamilyIconSvg from "public/icons/preferred-tenants/family.svg";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import FormCalendarField from "@/components/common/FormCalendarField";
import FormCheckbox from "@/components/common/FormCheckbox";
import FormDropdown from "@/components/common/FormDropdown";
import FormINRCurrencyField from "@/components/common/FormINRCurrencyField";
import FormPhoneInput from "@/components/common/FormPhoneInput";
import FormPhotoUpload from "@/components/common/FormPhotoUpload";
import FormPlacesAutocomplete from "@/components/common/FormPlacesAutoCompletes";
import FormRadioGroup from "@/components/common/FormRadioGroup";
import GoogleMaps from "@/components/common/GoogleMaps";
import { Dialog, DialogContent } from "@/components/Dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import { RootState } from "@/store/store";

// Define our step enum
enum FormStep {
  PROPERTY_DETAILS = "Property Details",
  LOCALITY_DETAILS = "Locality Details",
  RENTAL_DETAILS = "Rental Details",
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
  propertyType: "",
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
  photos: [],
  whoWillShowProperty: "",
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
  const FamilyIcon = FamilyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const CompanyIcon = CompanyIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const BachelorIcon = BachelorIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const CoupleIcon = CoupleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const LiftIcon = LiftIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const ClubhouseIcon = ClubhouseIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const GymIcon = GymIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const OutdoorDiningAreaIcon = OutdoorDiningAreaIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const GatedSecurityIcon = GatedSecurityIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const PoolIcon = PoolIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const FireExtinguisherIcon = FireExtinguisherIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const SmokeAlarmIcon = SmokeAlarmIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const SwimmingPoolIcon = SwimmingPoolIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const TwentyFourSevenPowerIcon = TwentyFourSevenPowerIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const SecurityIcon = SecurityIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const ParkingSpaceIcon = ParkingSpaceIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const DedicatedWorkspaceIcon = DedicatedWorkspaceIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const WifiIcon = WifiIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const BBQGrillIcon = BBQGrillIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const PoolTableIcon = PoolTableIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const FirstAidKitIcon = FirstAidKitIconSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

  const ListPropertySuccess = ListPropertySuccessSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.PROPERTY_DETAILS,
  );
  const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(
    new Set(),
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const { openDialog, isDialogOpen, closeDialog } = useDialog();

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
      } else if (currentStep === FormStep.RENTAL_DETAILS) {
        updatedSteps.delete(FormStep.LOCALITY_DETAILS);
        setCurrentStep(FormStep.LOCALITY_DETAILS);
      } else if (currentStep === FormStep.GALLERY) {
        updatedSteps.delete(FormStep.RENTAL_DETAILS);
        setCurrentStep(FormStep.RENTAL_DETAILS);
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
      setCurrentStep(FormStep.RENTAL_DETAILS);
    } else if (currentStep === FormStep.RENTAL_DETAILS) {
      setCurrentStep(FormStep.GALLERY);
    } else if (currentStep === FormStep.GALLERY) {
      setCurrentStep(FormStep.ADDITIONAL_INFO);
    } else if (currentStep === FormStep.ADDITIONAL_INFO) {
      //   setCurrentStep(FormStep.NONE);
      openDialog("list-property-success-dialog");
    }
  };

  if (!token) {
    redirect("/");
  }

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
          {[
            { step: FormStep.PROPERTY_DETAILS, Icon: Home },
            { step: FormStep.LOCALITY_DETAILS, Icon: MapPin },
            { step: FormStep.RENTAL_DETAILS, Icon: IndianRupee },
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
      <div className="container right-0 ml-[33.33%] pt-12 pb-20 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
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
                        center={{ lat: values.latitude, lng: values.longitude }} // Bengaluru
                        zoom={12}
                        className="h-full w-full rounded-lg shadow-lg"
                      />
                    </div>
                  </>
                )}

                {currentStep === FormStep.RENTAL_DETAILS && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-3xl text-gray-800">
                        Provide rental details about your property
                      </h1>
                    </div>
                    <div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1">
                          <FormINRCurrencyField
                            name="price"
                            id="price"
                            label="Price"
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <FormRadioGroup
                            name="rentNegotiable"
                            label="Rent Negotiable"
                            options={[
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" },
                            ]}
                            required
                            horizontal
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1">
                          <FormINRCurrencyField
                            name="maintenanceCharges"
                            id="maintenanceCharges"
                            label="Maintenance Charges"
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <FormINRCurrencyField
                            name="deposit"
                            id="deposit"
                            label="Deposit"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1">
                          <FormCalendarField
                            name="availableFrom"
                            label="Available From"
                            dateFormat="yyyy-MM-dd"
                            className="w-full"
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <FormDropdown
                            label="Furnishing"
                            name="furnishing"
                            id="furnishing"
                            options={[
                              {
                                value: "Fully-furnished",
                                label: "Fully Furnished",
                              },
                              {
                                value: "Semi-funnished",
                                label: "Semi Furnished",
                              },
                              { value: "Unfurnished", label: "UnFurnished" },
                            ]}
                            required={true}
                            placeholder="Select furnishing"
                            aria-describedby={
                              errors.city && touched.city
                                ? "furnishing-error"
                                : undefined
                            }
                          />
                        </div>
                      </div>
                      <div className="mb-6">
                        <FormRadioGroup
                          name="preferredTenant"
                          label="Preferred Tenant"
                          options={[
                            {
                              value: "Family",
                              label: "Family",
                              icon: <FamilyIcon />,
                            },
                            {
                              value: "Company",
                              label: "Company",
                              icon: <CompanyIcon />,
                            },
                            {
                              value: "Bachelor",
                              label: "Bachelor",
                              icon: <BachelorIcon />,
                            },
                            {
                              value: "Couple",
                              label: "Couple",
                              icon: <CoupleIcon />,
                            },
                          ]}
                          withIcons={true}
                          required
                          horizontal
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1">
                          <FormDropdown
                            label="Water Supply"
                            name="waterSupply"
                            id="waterSupply"
                            options={[
                              { value: "borewell", label: "Borewell" },
                              {
                                value: "tanker",
                                label: "Tanker",
                              },
                              {
                                value: "Ground-water",
                                label: "Ground Water",
                              },
                            ]}
                            required={true}
                            placeholder="Select Water supply"
                            aria-describedby={
                              errors.city && touched.city
                                ? "waterSupply-error"
                                : undefined
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <FormDropdown
                            label="Power Backup"
                            name="powerBackup"
                            id="powerBackup"
                            options={[
                              { value: "full", label: "Full" },
                              {
                                value: "partial",
                                label: "Partial",
                              },
                              {
                                value: "no",
                                label: "No",
                              },
                            ]}
                            required={true}
                            placeholder="Select Power backup"
                            aria-describedby={
                              errors.city && touched.city
                                ? "powerBackup-error"
                                : undefined
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1">
                          <FormDropdown
                            label="Parking"
                            name="parking"
                            id="parking"
                            options={[
                              { value: "yes", label: "Yes" },
                              {
                                value: "no",
                                label: "No",
                              },
                            ]}
                            required={true}
                            placeholder="Select Parking"
                            aria-describedby={
                              errors.city && touched.city
                                ? "parking-error"
                                : undefined
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <FormRadioGroup
                            name="nonVegAllowed"
                            label="Non Veg Allowed"
                            options={[
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" },
                            ]}
                            required
                            horizontal
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-8">
                      <h1 className="text-2xl text-gray-800">
                        Select the available amenities
                      </h1>
                      <FormCheckbox
                        name="amenities"
                        columns={4}
                        options={[
                          { value: "Lift", label: "Lift", icon: <LiftIcon /> },
                          {
                            value: "Clubhouse",
                            label: "Club house",
                            icon: <ClubhouseIcon />,
                          },
                          { value: "Gym", label: "Gym", icon: <GymIcon /> },
                          {
                            value: "Outdoor Dining Area",
                            label: "Outdoor Dining Area",
                            icon: <OutdoorDiningAreaIcon />,
                          },
                          {
                            value: "Gated Security",
                            label: "Gated Security",
                            icon: <GatedSecurityIcon />,
                          },
                          { value: "Pool", label: "Pool ", icon: <PoolIcon /> },
                          {
                            value: "Fire Extinguisher",
                            label: "Fire Extinguisher",
                            icon: <FireExtinguisherIcon />,
                          },
                          {
                            value: "Smoke Alarm",
                            label: "Smoke Alarm",
                            icon: <SmokeAlarmIcon />,
                          },
                          {
                            value: "Swimming Pool",
                            label: "Swimming Pool",
                            icon: <SwimmingPoolIcon />,
                          },
                          {
                            value: "24/7 Power",
                            label: "24/7 Power",
                            icon: <TwentyFourSevenPowerIcon />,
                          },
                          {
                            value: "Security",
                            label: "Security",
                            icon: <SecurityIcon />,
                          },
                          {
                            value: "Parking Space",
                            label: "Parking Space",
                            icon: <ParkingSpaceIcon />,
                          },
                          {
                            value: "Dedicated Workspace",
                            label: "Dedicated Workspace",
                            icon: <DedicatedWorkspaceIcon />,
                          },
                          { value: "Wifi", label: "Wifi", icon: <WifiIcon /> },
                          {
                            value: "BBQ Grill",
                            label: "BBQ Grill",
                            icon: <BBQGrillIcon />,
                          },
                          {
                            value: "Pool Table",
                            label: "Pool Table",
                            icon: <PoolTableIcon />,
                          },
                          {
                            value: "First Aid Kit",
                            label: "First Aid Kit",
                            icon: <FirstAidKitIcon />,
                          },
                        ]}
                        withIcons={true}
                        alignment="start"
                        required
                      />
                    </div>
                  </>
                )}

                {currentStep === FormStep.GALLERY && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-3xl text-gray-800">
                        Upload Property Photos
                      </h1>
                      <p className="text-gray-500 mt-2">
                        Properties with pictures have higher visibility.
                      </p>
                    </div>
                    <div className="flex justify-between w-full mb-2 items-center">
                      <h1 className="text-2xl text-gray-800">Add Photos</h1>
                      <span className="text-sm bg-red-100 py-1 px-3 rounded-lg">
                        {values.photos.length}/{10}
                      </span>
                    </div>
                    <FormPhotoUpload
                      name="photos"
                      noPhotosName="noPhotos"
                      maxPhotos={10}
                      showPhotoCount={false}
                      showNoPhotosCheckbox={true}
                      className="mb-6"
                    />
                  </>
                )}

                {currentStep === FormStep.ADDITIONAL_INFO && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-3xl text-gray-800">
                        Complete Your Listing with Final Details
                      </h1>
                    </div>
                    <div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1">
                          <FormDropdown
                            name="whoWillShowProperty"
                            id="whoWillShowProperty"
                            label="Who will show the property?"
                            options={[
                              { value: "Owner", label: "I will show" },
                              {
                                value: "Friend/Neighbour",
                                label: "Friend/Neighbour will show",
                              },
                            ]}
                            placeholder="Select"
                            aria-describedby={
                              errors.whoWillShowProperty &&
                              touched.whoWillShowProperty
                                ? "whoWillShowProperty-error"
                                : undefined
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <FormPhoneInput
                            label="Secondary Phone Number"
                            name="secondaryPhoneNumber"
                            id="secondaryPhoneNumber"
                            defaultCountry="in" // Set to India as your default
                            placeholder="Enter phone number"
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

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
                  className="px-24 py-3 text-black border font-medium rounded-lg hover:bg-red-600 transition duration-200"
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
};

export default ListPropertyPage;
