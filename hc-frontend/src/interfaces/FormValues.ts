import { PropertyCategory } from "@/common/enums";

import { AdditionalInfo } from "./AdditionalInfo";
import { FlatmateDetails } from "./FlatmateDetails";
import { LocalityDetails } from "./LocalityDetails";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyImage } from "./PropertyImage";
import { RentalDetails } from "./RentalDetails";
import { ResaleDetails } from "./ResaleDetails";

// Form values for the multi-step form
export interface FormValues {
  // Common fields across all property categories
  localityDetails?: LocalityDetails;
  images: PropertyImage[];
  noPhotos?: boolean;

  // Category-specific details (only one will be populated based on propertyCategory)
  propertyDetails?: PropertyDetails;
  rentalDetails?: RentalDetails;
  resaleDetails?: ResaleDetails;
  flatmateDetails?: FlatmateDetails;
  additionalInfo?: AdditionalInfo;
}

// Type guards for form validation
export const hasRentalDetails = (
  values: FormValues,
  propertyCategory: PropertyCategory,
): values is FormValues & { rentalDetails: RentalDetails } => {
  return propertyCategory === PropertyCategory.RENT && !!values.rentalDetails;
};

export const hasResaleDetails = (
  values: FormValues,
  propertyCategory: PropertyCategory,
): values is FormValues & { resaleDetails: ResaleDetails } => {
  return propertyCategory === PropertyCategory.RESALE && !!values.resaleDetails;
};

export const hasFlatmateDetails = (
  values: FormValues,
  propertyCategory: PropertyCategory,
): values is FormValues & { flatmateDetails: FlatmateDetails } => {
  return (
    propertyCategory === PropertyCategory.FLATMATE && !!values.flatmateDetails
  );
};

export const hasPropertyDetails = (
  values: FormValues,
): values is FormValues & { propertyDetails: PropertyDetails } => {
  return !!values.propertyDetails;
};

export const hasAdditionalInfo = (
  values: FormValues,
): values is FormValues & { additionalInfo: AdditionalInfo } => {
  return !!values.additionalInfo;
};

export const hasLocalityDetails = (
  values: FormValues,
): values is FormValues & { localityDetails: LocalityDetails } => {
  return !!values.localityDetails;
};
