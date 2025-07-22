import { PropertyCategory } from "@/common/enums";

import {
  isFlatmateAdditionalInfo,
  isRentAdditionalInfo,
  isResaleAdditionalInfo,
} from "./AdditionalInfo";
import { FlatmateForm } from "./FlatmateForm";
import {
  FormValues,
  hasAdditionalInfo,
  hasFlatmateDetails,
  hasLocalityDetails,
  hasPropertyDetails,
  hasRentalDetails,
  hasResaleDetails,
} from "./FormValues";
import {
  isRentPropertyDetails,
  isResalePropertyDetails,
} from "./PropertyDetails";
import { PropertyForm } from "./PropertyForm";
import { RentForm } from "./RentForm";
import { ResaleForm } from "./ResaleForm";

// Transform FormValues to RentForm
export const transformToRentForm = (
  values: FormValues,
  propertyID: string,
  propertyCategory: PropertyCategory,
): RentForm => {
  if (!hasPropertyDetails(values)) {
    throw new Error("Property details are required for RENT properties");
  }

  if (!hasRentalDetails(values, propertyCategory)) {
    throw new Error("Rental details are required for RENT properties");
  }

  if (!hasLocalityDetails(values)) {
    throw new Error("Locality details are required for RENT properties");
  }

  if (!isRentPropertyDetails(values.propertyDetails)) {
    throw new Error(
      "Extended property details are required for RENT properties",
    );
  }

  const {
    propertyDetails,
    localityDetails,
    rentalDetails,
    additionalInfo,
    images,
  } = values;

  // At this point, we know localityDetails exists due to hasLocalityDetails check
  const locality = localityDetails!;

  return {
    propertyID,
    propertyCategory: PropertyCategory.RENT,
    // Property details
    propertyType: propertyDetails.propertyType,
    builtUpArea: propertyDetails.builtUpArea,
    facing: propertyDetails.facing,
    bhkType: propertyDetails.bhkType,
    ownershipType: propertyDetails.ownershipType,
    propertyAge: propertyDetails.propertyAge,
    floor: propertyDetails.floor,
    totalFloors: propertyDetails.totalFloors,
    floorType: propertyDetails.floorType,
    description: propertyDetails.description,
    // Locality details
    city: locality.city,
    locationOrSocietyName: locality.locationOrSocietyName,
    landmark: locality.landmark,
    latitude: locality.latitude,
    longitude: locality.longitude,
    // Rental details
    rent: rentalDetails.rent,
    deposit: rentalDetails.deposit,
    maintenanceCharges: rentalDetails.maintenanceCharges,
    rentNegotiable: rentalDetails.rentNegotiable,
    availableFrom: rentalDetails.availableFrom,
    preferredTenants: rentalDetails.preferredTenants,
    waterSupply: rentalDetails.waterSupply,
    powerBackup: rentalDetails.powerBackup,
    furnishing: rentalDetails.furnishing,
    parking: rentalDetails.parking,
    nonVegAllowed: rentalDetails.nonVegAllowed,
    amenities: rentalDetails.amenities,
    // Images
    images: images.map((img) => img.url),
    // Additional info
    whoWillShowProperty:
      hasAdditionalInfo(values) &&
      additionalInfo &&
      isRentAdditionalInfo(additionalInfo)
        ? additionalInfo.whoWillShowProperty
        : undefined,
    secondaryPhoneNumber: additionalInfo?.secondaryPhoneNumber,
  };
};

// Transform FormValues to ResaleForm
export const transformToResaleForm = (
  values: FormValues,
  propertyID: string,
  propertyCategory: PropertyCategory,
): ResaleForm => {
  if (!hasPropertyDetails(values)) {
    throw new Error("Property details are required for RESALE properties");
  }

  if (!hasResaleDetails(values, propertyCategory)) {
    throw new Error("Resale details are required for RESALE properties");
  }

  if (!hasLocalityDetails(values)) {
    throw new Error("Locality details are required for RESALE properties");
  }

  if (!isResalePropertyDetails(values.propertyDetails)) {
    throw new Error(
      "Extended property details are required for RESALE properties",
    );
  }

  const {
    propertyDetails,
    localityDetails,
    resaleDetails,
    additionalInfo,
    images,
  } = values;

  // At this point, we know localityDetails exists due to hasLocalityDetails check
  const locality = localityDetails!;

  return {
    propertyID,
    propertyCategory: PropertyCategory.RESALE,
    // Property details
    propertyType: propertyDetails.propertyType,
    builtUpArea: propertyDetails.builtUpArea,
    facing: propertyDetails.facing,
    bhkType: propertyDetails.bhkType,
    ownershipType: propertyDetails.ownershipType,
    propertyAge: propertyDetails.propertyAge,
    floor: propertyDetails.floor,
    totalFloors: propertyDetails.totalFloors,
    floorType: propertyDetails.floorType,
    description: propertyDetails.description,
    // Locality details
    city: locality.city,
    locationOrSocietyName: locality.locationOrSocietyName,
    landmark: locality.landmark,
    latitude: locality.latitude,
    longitude: locality.longitude,
    // Resale details
    price: resaleDetails.price,
    availableFrom: resaleDetails.availableFrom,
    bathrooms: resaleDetails.bathrooms,
    balcony: resaleDetails.balcony,
    priceNegotiable: resaleDetails.priceNegotiable,
    underLoan: resaleDetails.underLoan,
    waterSupply: resaleDetails.waterSupply,
    powerBackup: resaleDetails.powerBackup,
    furnishing: resaleDetails.furnishing,
    parking: resaleDetails.parking,
    amenities: resaleDetails.amenities,
    // Images
    images: images.map((img) => img.url),
    // Additional info
    khataCertificate:
      hasAdditionalInfo(values) &&
      additionalInfo &&
      isResaleAdditionalInfo(additionalInfo)
        ? additionalInfo.khataCertificate
        : "",
    saleDeed:
      hasAdditionalInfo(values) &&
      additionalInfo &&
      isResaleAdditionalInfo(additionalInfo)
        ? additionalInfo.saleDeed
        : false,
    propertyTax:
      hasAdditionalInfo(values) &&
      additionalInfo &&
      isResaleAdditionalInfo(additionalInfo)
        ? additionalInfo.propertyTax
        : false,
    secondaryPhoneNumber: additionalInfo?.secondaryPhoneNumber,
  };
};

// Transform FormValues to FlatmateForm
export const transformToFlatmateForm = (
  values: FormValues,
  propertyID: string,
  propertyCategory: PropertyCategory,
): FlatmateForm => {
  if (!hasPropertyDetails(values)) {
    throw new Error("Property details are required for FLATMATE properties");
  }

  if (!hasFlatmateDetails(values, propertyCategory)) {
    throw new Error("Flatmate details are required for FLATMATE properties");
  }

  if (!hasLocalityDetails(values)) {
    throw new Error("Locality details are required for FLATMATE properties");
  }

  const {
    propertyDetails,
    localityDetails,
    flatmateDetails,
    additionalInfo,
    images,
  } = values;

  // At this point, we know localityDetails exists due to hasLocalityDetails check
  const locality = localityDetails!;

  return {
    propertyID,
    propertyCategory: PropertyCategory.FLATMATE,
    // Property details (simplified)
    propertyType: propertyDetails.propertyType,
    builtUpArea: propertyDetails.builtUpArea,
    bhkType: propertyDetails.bhkType,
    floor: propertyDetails.floor,
    totalFloors: propertyDetails.totalFloors,
    description: propertyDetails.description,
    // Locality details
    city: locality.city,
    locationOrSocietyName: locality.locationOrSocietyName,
    landmark: locality.landmark,
    latitude: locality.latitude,
    longitude: locality.longitude,
    // Flatmate details
    rent: flatmateDetails.rent,
    maintenanceCharges: flatmateDetails.maintenanceCharges,
    depositCharges: flatmateDetails.depositCharges,
    availableFrom: flatmateDetails.availableFrom,
    furnishing: flatmateDetails.furnishing,
    waterSupply: flatmateDetails.waterSupply,
    powerBackup: flatmateDetails.powerBackup,
    parking: flatmateDetails.parking,
    nonVegAllowed: flatmateDetails.nonVegAllowed,
    amenities: flatmateDetails.amenities,
    tenantType: flatmateDetails.tenantType,
    attachedBathroom: flatmateDetails.attachedBathroom,
    attachedBalcony: flatmateDetails.attachedBalcony,
    smokingPreference: flatmateDetails.smokingPreference,
    drinkingPreference: flatmateDetails.drinkingPreference,
    // Images
    images: images.map((img) => img.url),
    // Additional info
    whoWillShowProperty:
      hasAdditionalInfo(values) &&
      additionalInfo &&
      isFlatmateAdditionalInfo(additionalInfo)
        ? additionalInfo.whoWillShowProperty
        : undefined,
    secondaryPhoneNumber: additionalInfo?.secondaryPhoneNumber,
  };
};

// Generic transformer function
export const transformFormValuesToPropertyForm = (
  values: FormValues,
  propertyID: string,
  propertyCategory: PropertyCategory,
): PropertyForm => {
  switch (propertyCategory) {
    case PropertyCategory.RENT:
      return transformToRentForm(values, propertyID, propertyCategory);
    case PropertyCategory.RESALE:
      return transformToResaleForm(values, propertyID, propertyCategory);
    case PropertyCategory.FLATMATE:
      return transformToFlatmateForm(values, propertyID, propertyCategory);
    default:
      throw new Error(`Unsupported property category: ${propertyCategory}`);
  }
};
