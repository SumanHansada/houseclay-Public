import { CDN_BASE_URL } from "@/common/constants";
import { PropertyCategory } from "@/common/enums";
import { fileDataFromUrl, processPropertyImages } from "@/common/utils";

import {
  FlatmateAdditionalInfo,
  RentAdditionalInfo,
  ResaleAdditionalInfo,
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
  RentPropertyDetails,
  ResalePropertyDetails,
} from "./PropertyDetails";
import {
  isFlatmateForm,
  isRentForm,
  isResaleForm,
  PropertyForm,
} from "./PropertyForm";
import { PropertyImage } from "./PropertyImage";
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
  const rentAdditionalInfo = additionalInfo as RentAdditionalInfo;

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
    bathrooms: rentalDetails.bathrooms,
    balcony: rentalDetails.balcony,
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
      hasAdditionalInfo(values) && rentAdditionalInfo
        ? rentAdditionalInfo.whoWillShowProperty
        : undefined,
    secondaryPhoneNumber: rentAdditionalInfo?.secondaryPhoneNumber,
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
  const resaleAdditionalInfo = additionalInfo as ResaleAdditionalInfo;

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
      hasAdditionalInfo(values) && resaleAdditionalInfo
        ? resaleAdditionalInfo.khataCertificate
        : "",
    saleDeed:
      hasAdditionalInfo(values) && resaleAdditionalInfo
        ? resaleAdditionalInfo.saleDeed
        : false,
    propertyTax:
      hasAdditionalInfo(values) && resaleAdditionalInfo
        ? resaleAdditionalInfo.propertyTax
        : false,
    secondaryPhoneNumber: resaleAdditionalInfo?.secondaryPhoneNumber,
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
  const flatmateAdditionalInfo = additionalInfo as FlatmateAdditionalInfo;

  return {
    propertyID,
    propertyCategory: PropertyCategory.FLATMATE,
    // Property details (simplified)
    propertyType: propertyDetails.propertyType,
    builtUpArea: propertyDetails.builtUpArea,
    facing: propertyDetails.facing,
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
    roomType: flatmateDetails.roomType,
    furnishing: flatmateDetails.furnishing,
    waterSupply: flatmateDetails.waterSupply,
    powerBackup: flatmateDetails.powerBackup,
    parking: flatmateDetails.parking,
    nonVegAllowed: flatmateDetails.nonVegAllowed,
    amenities: flatmateDetails.amenities,
    tenantType: flatmateDetails.tenantType,
    bathroomType: flatmateDetails.bathroomType,
    balconyType: flatmateDetails.balconyType,
    smokingPreference: flatmateDetails.smokingPreference,
    drinkingPreference: flatmateDetails.drinkingPreference,
    // Images
    images: images.map((img) => img.url),
    // Additional info
    whoWillShowProperty:
      hasAdditionalInfo(values) && flatmateAdditionalInfo
        ? flatmateAdditionalInfo.whoWillShowProperty
        : undefined,
    secondaryPhoneNumber: flatmateAdditionalInfo?.secondaryPhoneNumber,
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

// ============================================================================
// Reverse Transformers: PropertyForm (API response) -> FormValues
// ============================================================================

/**
 * Transform PropertyForm (API response) to FormValues
 * This is the reverse of transformFormValuesToPropertyForm
 */
export const transformPropertyFormToFormValues = (
  apiData: PropertyForm,
): FormValues => {
  // Determine the property category from the form
  // const propertyCategory = apiData.propertyCategory;

  // Extract property details based on category
  const propertyDetails = isFlatmateForm(apiData)
    ? {
        propertyType: apiData.propertyType,
        builtUpArea: apiData.builtUpArea,
        facing: apiData.facing,
        bhkType: apiData.bhkType,
        floor: apiData.floor,
        totalFloors: apiData.totalFloors,
        description: apiData.description,
      }
    : ({
        propertyType: apiData.propertyType,
        builtUpArea: apiData.builtUpArea,
        facing: apiData.facing,
        bhkType: apiData.bhkType,
        bathrooms: apiData.bathrooms,
        floor: apiData.floor,
        totalFloors: apiData.totalFloors,
        description: apiData.description,
        ownershipType: (apiData as RentForm | ResaleForm).ownershipType,
        propertyAge: (apiData as RentForm | ResaleForm).propertyAge,
        floorType: (apiData as RentForm | ResaleForm).floorType,
      } as RentPropertyDetails | ResalePropertyDetails);

  // Extract locality details
  const localityDetails = {
    city: apiData.city,
    locationOrSocietyName: apiData.locationOrSocietyName,
    landmark: apiData.landmark,
    latitude: apiData.latitude,
    longitude: apiData.longitude,
  };

  // Extract images with cover flag
  const propertyImages =
    apiData.images.length > 0 ? processPropertyImages(apiData.images) : [];
  const coverImage =
    apiData.images.length > 0 ? `${CDN_BASE_URL}/${apiData.coverImage}` : "";
  const images: PropertyImage[] = propertyImages.map((url: string) => ({
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file: fileDataFromUrl(url),
    url: url,
    isCover: url === coverImage,
  }));

  // Extract category-specific details
  let rentalDetails, resaleDetails, flatmateDetails, additionalInfo;

  if (isRentForm(apiData)) {
    rentalDetails = {
      rent: apiData.rent,
      deposit: apiData.deposit,
      maintenanceCharges: apiData.maintenanceCharges,
      rentNegotiable: apiData.rentNegotiable,
      availableFrom: apiData.availableFrom,
      preferredTenants: apiData.preferredTenants,
      bathrooms: apiData.bathrooms,
      balcony: apiData.balcony,
      waterSupply: apiData.waterSupply,
      powerBackup: apiData.powerBackup,
      furnishing: apiData.furnishing,
      parking: apiData.parking,
      nonVegAllowed: apiData.nonVegAllowed,
      amenities: apiData.amenities,
    };
    additionalInfo = {
      whoWillShowProperty: apiData.whoWillShowProperty,
      secondaryPhoneNumber: apiData.secondaryPhoneNumber ?? undefined,
    };
  } else if (isFlatmateForm(apiData)) {
    flatmateDetails = {
      rent: apiData.rent,
      maintenanceCharges: apiData.maintenanceCharges,
      depositCharges: apiData.depositCharges,
      availableFrom: apiData.availableFrom,
      roomType: apiData.roomType,
      furnishing: apiData.furnishing,
      waterSupply: apiData.waterSupply,
      powerBackup: apiData.powerBackup,
      parking: apiData.parking,
      nonVegAllowed: apiData.nonVegAllowed,
      amenities: apiData.amenities,
      tenantType: apiData.tenantType,
      bathroomType: apiData.bathroomType,
      balconyType: apiData.balconyType,
      smokingPreference: apiData.smokingPreference,
      drinkingPreference: apiData.drinkingPreference,
    };
    additionalInfo = {
      whoWillShowProperty: apiData.whoWillShowProperty,
      secondaryPhoneNumber: apiData.secondaryPhoneNumber ?? undefined,
    };
  } else if (isResaleForm(apiData)) {
    resaleDetails = {
      price: apiData.price,
      availableFrom: apiData.availableFrom,
      bathrooms: apiData.bathrooms,
      balcony: apiData.balcony,
      priceNegotiable: apiData.priceNegotiable,
      underLoan: apiData.underLoan,
      waterSupply: apiData.waterSupply,
      powerBackup: apiData.powerBackup,
      furnishing: apiData.furnishing,
      parking: apiData.parking,
      amenities: apiData.amenities,
    };
    additionalInfo = {
      khataCertificate: apiData.khataCertificate,
      saleDeed: apiData.saleDeed,
      propertyTax: apiData.propertyTax,
      secondaryPhoneNumber: apiData.secondaryPhoneNumber ?? undefined,
    };
  }

  return {
    propertyDetails,
    localityDetails,
    images,
    rentalDetails,
    resaleDetails,
    flatmateDetails,
    additionalInfo,
  };
};
