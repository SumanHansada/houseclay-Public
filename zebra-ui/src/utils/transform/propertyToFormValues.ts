import { AdditionalInfo } from "@/interfaces/AdditionalInfo";
import { GetPropertyByIdResponse } from "@/interfaces/api";
import { FlatmatesDetails } from "@/interfaces/FlatmateDetails";
import { FormValues } from "@/interfaces/FormValues";
import { LocalityDetails } from "@/interfaces/LocalityDetails";
import { PropertyDetails } from "@/interfaces/PropertyDetails";
import { PropertyImage } from "@/interfaces/PropertyImage";
import { RentalDetails } from "@/interfaces/RentalDetails";
import { ResaleDetails } from "@/interfaces/ResaleDetails";
import { isFlatmate, isRent, isResale } from "@/utils/typeGuard";

import { fileDataFromUrl } from "../core";

export function apiToForm(api: GetPropertyByIdResponse): FormValues {
  /* ---------- common blocks ---------- */
  const propertyDetails: PropertyDetails = {
    propertyCategory: api.propertyCategory,
    propertyType: api.propertyType,
    builtUpArea: api.builtUpArea,
    facing: api.facing ?? "",
    bhkType: api.bhkType,
    ownershipType: isResale(api) ? api.ownershipType : "",
    propertyAge: api.propertyAge ?? "",
    floor: api.floor,
    totalFloors: api.totalFloors,
    floorType: api.floorType ?? "",
    description: api.description,
  };

  const localityDetails: LocalityDetails = {
    city: api.city,
    locationOrSocietyName: api.locationOrSocietyName,
    landmark: api.landmark,
    latitude: api.latitude,
    longitude: api.longitude,
  };

  const additionalInfo: AdditionalInfo = {
    whoWillShowProperty: "",
    secondaryPhoneNumber: "",
    khataCertificate: isResale(api) ? api.khataCertificate : "",
    saleDeed: isResale(api) ? api.saleDeed : false,
    propertyTax: isResale(api) ? api.propertyTax : false,
  };

  /* ---------- category‑specific blocks ---------- */
  let rentalDetails: RentalDetails | undefined;
  let flatmatesDetails: FlatmatesDetails | undefined;
  let resaleDetails: ResaleDetails | undefined;

  if (isRent(api)) {
    rentalDetails = {
      rent: api.rent,
      rentNegotiable: api.rentNegotiable,
      maintenanceCharges: api.maintenanceCharges,
      deposit: api.deposit,
      availableFrom: api.availableFrom,
      furnishing: api.furnishing ?? "",
      preferredTenants: api.preferredTenants,
      waterSupply: api.waterSupply,
      powerBackup: api.powerBackup,
      parking: api.parking,
      nonVegAllowed: api.nonVegAllowed ?? false,
      amenities: api.amenities,
    };
  } else if (isFlatmate(api)) {
    flatmatesDetails = {
      rent: api.rent,
      maintenanceCharges: api.maintenanceCharges,
      depositCharges: api.depositCharges,
      availableFrom: api.availableFrom,
      furnishing: api.furnishing ?? "",
      waterSupply: api.waterSupply,
      powerBackup: api.powerBackup,
      parking: api.parking,
      nonVegAllowed: api.nonVegAllowed ?? false,
      amenities: api.amenities,
      tenantType: api.tenantType,
      attachedBathroom: api.attachedBathroom,
      attachedBalcony: api.attachedBalcony,
      smokingPreference: api.smokingPreference,
      drinkingPreference: api.drinkingPreference,
    };
  } else {
    resaleDetails = {
      price: api.price,
      availableFrom: api.availableFrom,
      bathrooms: api.bathrooms,
      balcony: api.balcony,
      priceNegotiable: api.priceNegotiable,
      underLoan: api.underLoan,
      waterSupply: api.waterSupply,
      powerBackup: api.powerBackup,
      furnishing: api.furnishing ?? "",
      parking: api.parking,
      amenities: api.amenities,
    };
  }

  /* ---------- images ---------- */
  const images: PropertyImage[] = api.images.map((url, i) => ({
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file: fileDataFromUrl(url),
    url,
    isCover: i === 0,
  }));

  return {
    propertyDetails,
    localityDetails,
    rentalDetails,
    flatmatesDetails,
    resaleDetails,
    additionalInfo,
    images,
  };
}
