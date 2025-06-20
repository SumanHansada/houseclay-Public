import { GetPropertyByIDResponse, AnyProperty } from "@/interfaces/Property";
import { PropertyDetailsFormValues } from "@/interfaces/Property";

const getEmptyFormValues = (): PropertyDetailsFormValues => ({
  propertyDetails: {
    propertyType: "",
    bhkType: "",
    builtUpArea: "",
    floor: "",
    totalFloors: "",
    propertyAge: "",
    facing: "",
    floorType: "",
    description: "",
    bathrooms: "",
    balcony: "",
  },
  localityDetails: {
    city: "Bengaluru",
    locationOrSocietyName: "",
    landmark: "",
    latitude: 0,
    longitude: 0,
  },
  rentalDetails: {
    rent: "",
    deposit: "",
    maintenanceCharges: "",
    rentNegotiable: false,
    preferredTenants: [],
    petsAllowed: false,
    nonVegAllowed: false,
    tenantType: "",
    attachedBathroom: false,
    attachedBalcony: false,
    smokingPreference: "",
    drinkingPreference: "",
  },
  resaleDetails: {
    price: "",
    priceNegotiable: false,
    ownershipType: "",
    underLoan: false,
  },
  additionalInfo: {
    furnishing: "",
    parking: false,
    waterSupply: "",
    powerBackup: "",
    availableFrom: null,
    khataCertificate: "",
    saleDeed: false,
    propertyTax: false,
  },
  images: [],
});

export const transformApiToFormValues = (
  apiData: GetPropertyByIDResponse | null,
): PropertyDetailsFormValues => {
  const formValues = getEmptyFormValues();

  if (!apiData?.propertyDetails) {
    return formValues;
  }

  const { propertyDetails } = apiData;

  formValues.propertyDetails = {
    propertyType: propertyDetails.propertyType || "",
    bhkType: propertyDetails.bhkType || "",
    builtUpArea: propertyDetails.builtUpArea || "",
    floor: propertyDetails.floor ?? "", // Use nullish coalescing for 0
    totalFloors: propertyDetails.totalFloors || "",
    propertyAge: propertyDetails.propertyAge || "",
    facing: propertyDetails.facing || "",
    floorType: propertyDetails.floorType || "",
    description: propertyDetails.description || "",
    // Sale-specific, default to empty
    bathrooms: "bathrooms" in propertyDetails ? propertyDetails.bathrooms : "",
    balcony: "balcony" in propertyDetails ? propertyDetails.balcony : "",
  };
  formValues.localityDetails = {
    city: propertyDetails.city || "Bengaluru",
    locationOrSocietyName: propertyDetails.locationOrSocietyName || "",
    landmark: propertyDetails.landmark || "",
    latitude: propertyDetails.latitude || 0,
    longitude: propertyDetails.longitude || 0,
  };
  formValues.additionalInfo = {
    furnishing: propertyDetails.furnishing || "",
    parking: propertyDetails.parking || false,
    waterSupply: propertyDetails.waterSupply || "",
    powerBackup: propertyDetails.powerBackup || "",
    availableFrom: propertyDetails.availableFrom
      ? new Date(propertyDetails.availableFrom)
      : null,
    // Sale-specific
    khataCertificate:
      "khataCertificate" in propertyDetails
        ? propertyDetails.khataCertificate
        : "",
    saleDeed: "saleDeed" in propertyDetails ? propertyDetails.saleDeed : false,
    propertyTax:
      "propertyTax" in propertyDetails ? propertyDetails.propertyTax : false,
  };
  formValues.images = [];

  if (propertyDetails.propertyCategory === "Rent") {
    formValues.rentalDetails = {
      rent: propertyDetails.rent || "",
      deposit: propertyDetails.deposit || "",
      maintenanceCharges: propertyDetails.maintenanceCharges || "",
      rentNegotiable: propertyDetails.rentNegotiable || false,
      preferredTenants: propertyDetails.preferredTenants || [],
      petsAllowed: propertyDetails.petsAllowed ?? false,
      nonVegAllowed: propertyDetails.nonVegAllowed ?? false,
      tenantType: "",
      attachedBathroom: false,
      attachedBalcony: false,
      smokingPreference: "",
      drinkingPreference: "",
    };
  }

  if (propertyDetails.propertyCategory === "Flatmate") {
    formValues.rentalDetails = {
      rent: propertyDetails.rent || "",
      deposit: propertyDetails.depositCharges || "", // Note the field name difference
      maintenanceCharges: propertyDetails.maintenanceCharges || "",
      tenantType: propertyDetails.tenantType || "",
      attachedBathroom: propertyDetails.attachedBathroom || false,
      attachedBalcony: propertyDetails.attachedBalcony || false,
      smokingPreference: propertyDetails.smokingPreference || "",
      drinkingPreference: propertyDetails.drinkingPreference || "",
      // Default rent fields
      rentNegotiable: false,
      preferredTenants: [],
      petsAllowed: false,
      nonVegAllowed: false,
    };
  }

  if (propertyDetails.propertyCategory === "Resale") {
    formValues.resaleDetails = {
      price: propertyDetails.price || "",
      priceNegotiable: propertyDetails.priceNegotiable || false,
      ownershipType: propertyDetails.ownershipType || "",
      underLoan: propertyDetails.underLoan || false,
    };
  }

  return formValues;
};
