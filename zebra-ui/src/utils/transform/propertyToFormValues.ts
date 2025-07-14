import { AdditionalInfo } from "@/interfaces/AdditionalInfo";
import { PropertyResponse } from "@/interfaces/api";
import { FlatmateDetails } from "@/interfaces/FlatmateDetails";
import { LocalityDetails } from "@/interfaces/LocalityDetails";
import { PropertyResponseFormValues } from "@/interfaces/Property";
import { PropertyDetails } from "@/interfaces/PropertyDetails";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { RentalDetails } from "@/interfaces/RentalDetails";
import { ResaleDetails } from "@/interfaces/ResaleDetails";
import { fileDataFromUrl } from "@/utils/core";
import { isFlatmate, isRent, isResale } from "@/utils/typeGuard";

export function apiToForm(api: PropertyResponse): PropertyResponseFormValues {
  /* ---------- propertyDetails ---------- */
  const propertyDetails: PropertyDetails = {
    propertyType: api.propertyType ?? "",
    builtUpArea: api.builtUpArea ?? 0,
    facing: api.facing ?? "",
    bhkType: api.bhkType ?? "",
    ownershipType: isResale(api) ? (api.ownershipType ?? "") : "",
    propertyAge: api.propertyAge ?? "",
    floor: api.floor ?? 0,
    totalFloors: api.totalFloors ?? 0,
    floorType: api.floorType ?? "",
    description: api.description ?? "",
  };

  /* ---------- localityDetails ---------- */
  const localityDetails: LocalityDetails = {
    city: api.city ?? "",
    locationOrSocietyName: api.locationOrSocietyName ?? "",
    landmark: api.landmark ?? "",
    latitude: api.latitude ?? 0,
    longitude: api.longitude ?? 0,
  };

  /* ---------- additionalInfo ---------- */
  const additionalInfo: AdditionalInfo = {
    whoWillShowProperty: api.whoWillShowProperty ?? "",
    secondaryPhoneNumber: api.secondaryPhoneNumber ?? "",
    khataCertificate: isResale(api) ? (api.khataCertificate ?? "") : "",
    saleDeed: isResale(api) ? !!api.saleDeed : false,
    propertyTax: isResale(api) ? !!api.propertyTax : false,
  };

  /* ---------- category blocks ---------- */
  let rentalDetails: RentalDetails | undefined;
  let flatmateDetails: FlatmateDetails | undefined;
  let resaleDetails: ResaleDetails | undefined;

  if (isRent(api)) {
    rentalDetails = {
      rent: api.rent ?? 0,
      rentNegotiable: !!api.rentNegotiable,
      maintenanceCharges: api.maintenanceCharges ?? 0,
      deposit: api.deposit ?? 0,
      availableFrom: api.availableFrom ?? "",
      furnishing: api.furnishing ?? "",
      preferredTenants: api.preferredTenants ?? [],
      waterSupply: api.waterSupply ?? "",
      powerBackup: api.powerBackup ?? "",
      parking: api.parking ?? "",
      nonVegAllowed: !!api.nonVegAllowed,
      amenities: api.amenities ?? [],
    };
  } else if (isFlatmate(api)) {
    flatmateDetails = {
      rent: api.rent ?? 0,
      maintenanceCharges: api.maintenanceCharges ?? 0,
      depositCharges: api.depositCharges ?? 0,
      availableFrom: api.availableFrom ?? "",
      furnishing: api.furnishing ?? "",
      waterSupply: api.waterSupply ?? "",
      powerBackup: api.powerBackup ?? "",
      parking: api.parking ?? "",
      nonVegAllowed: !!api.nonVegAllowed,
      amenities: api.amenities ?? [],
      tenantType: api.tenantType ?? "",
      attachedBathroom: !!api.attachedBathroom,
      attachedBalcony: !!api.attachedBalcony,
      smokingPreference: api.smokingPreference ?? "",
      drinkingPreference: api.drinkingPreference ?? "",
    };
  } else {
    resaleDetails = {
      price: api.price ?? 0,
      availableFrom: api.availableFrom ?? "",
      bathrooms: api.bathrooms ?? 0,
      balcony: api.balcony ?? 0,
      priceNegotiable: !!api.priceNegotiable,
      underLoan: !!api.underLoan,
      waterSupply: api.waterSupply ?? "",
      powerBackup: api.powerBackup ?? "",
      furnishing: api.furnishing ?? "",
      parking: api.parking ?? "",
      amenities: api.amenities ?? [],
    };
  }

  /* ---------- images ---------- */
  const images: PropertyImage[] = api.images.map((url) => ({
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file: fileDataFromUrl(url),
    url,
    isCover: url === api.coverImage,
  }));

  return {
    propertyCategory: api.propertyCategory,
    propertyDetails,
    localityDetails,
    additionalInfo,
    rentalDetails,
    flatmateDetails,
    resaleDetails,
    images,
  };
}

// import { AdditionalInfo } from "@/interfaces/AdditionalInfo";
// import { GetPropertyByIdResponse } from "@/interfaces/api";
// import { FlatmateDetails } from "@/interfaces/FlatmateDetails";
// import { FormValues } from "@/interfaces/FormValues";
// import { LocalityDetails } from "@/interfaces/LocalityDetails";
// import { PropertyDetails } from "@/interfaces/PropertyDetails";
// import { PropertyImage } from "@/interfaces/PropertyImage";
// import { RentalDetails } from "@/interfaces/RentalDetails";
// import { ResaleDetails } from "@/interfaces/ResaleDetails";
// import { isFlatmate, isRent, isResale } from "@/utils/typeGuard";

// import { fileDataFromUrl } from "../core";

// export function apiToForm(api: GetPropertyByIdResponse): FormValues {
//   /* ---------- common blocks ---------- */
//   const propertyDetails: Partial<PropertyDetails> = {
//     propertyCategory: api.propertyCategory,
//     propertyType: api.propertyType,
//     builtUpArea: api.builtUpArea,
//     facing: api.facing ?? "",
//     bhkType: api.bhkType,
//     ownershipType: isResale(api) ? api.ownershipType : "",
//     propertyAge: api.propertyAge ?? "",
//     floor: api.floor,
//     totalFloors: api.totalFloors,
//     floorType: api.floorType ?? "",
//     description: api.description,
//   };

//   const localityDetails: Partial<LocalityDetails> = {
//     city: api.city,
//     locationOrSocietyName: api.locationOrSocietyName,
//     landmark: api.landmark,
//     latitude: api.latitude,
//     longitude: api.longitude,
//   };

//   const additionalInfo: Partial<AdditionalInfo> = {
//     whoWillShowProperty: "",
//     secondaryPhoneNumber: "",
//     khataCertificate: isResale(api) ? api.khataCertificate : "",
//     saleDeed: isResale(api) ? api.saleDeed : false,
//     propertyTax: isResale(api) ? api.propertyTax : false,
//   };

//   /* ---------- category‑specific blocks ---------- */
//   let rentalDetails: RentalDetails | undefined;
//   let flatmateDetails: FlatmateDetails | undefined;
//   let resaleDetails: ResaleDetails | undefined;

//   if (isRent(api)) {
//     rentalDetails = {
//       rent: api?.rent,
//       rentNegotiable: api?.rentNegotiable,
//       maintenanceCharges: api?.maintenanceCharges,
//       deposit: api.deposit,
//       availableFrom: api.availableFrom,
//       furnishing: api.furnishing ?? "",
//       preferredTenants: api.preferredTenants,
//       waterSupply: api.waterSupply,
//       powerBackup: api.powerBackup,
//       parking: api.parking,
//       nonVegAllowed: api.nonVegAllowed ?? false,
//       amenities: api.amenities,
//     };
//   } else if (isFlatmate(api)) {
//     flatmateDetails = {
//       rent: api.rent,
//       maintenanceCharges: api.maintenanceCharges,
//       depositCharges: api.depositCharges,
//       availableFrom: api.availableFrom,
//       furnishing: api.furnishing ?? "",
//       waterSupply: api.waterSupply,
//       powerBackup: api.powerBackup,
//       parking: api.parking,
//       nonVegAllowed: api.nonVegAllowed ?? false,
//       amenities: api.amenities,
//       tenantType: api.tenantType,
//       attachedBathroom: api.attachedBathroom,
//       attachedBalcony: api.attachedBalcony,
//       smokingPreference: api.smokingPreference,
//       drinkingPreference: api.drinkingPreference,
//     };
//   } else {
//     resaleDetails = {
//       price: api.price,
//       availableFrom: api.availableFrom,
//       bathrooms: api.bathrooms,
//       balcony: api.balcony,
//       priceNegotiable: api.priceNegotiable,
//       underLoan: api.underLoan,
//       waterSupply: api.waterSupply,
//       powerBackup: api.powerBackup,
//       furnishing: api.furnishing ?? "",
//       parking: api.parking,
//       amenities: api.amenities,
//     };
//   }

//   /* ---------- images ---------- */
//   const images: PropertyImage[] = api.images.map((url, i) => ({
//     id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
//     file: fileDataFromUrl(url),
//     url,
//     isCover: i === 0,
//   }));

//   return {
//     propertyDetails,
//     localityDetails,
//     rentalDetails,
//     flatmateDetails,
//     resaleDetails,
//     additionalInfo,
//     images,
//   };
// }
