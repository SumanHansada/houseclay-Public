import { PropertyCategory } from "@/common/enums";

// FLATMATE form payload - derived from the transformer structure
export interface FlatmateForm {
  propertyID: string;
  propertyCategory: PropertyCategory.FLATMATE;
  // Property details (simplified for FLATMATE)
  propertyType: string;
  builtUpArea: number;
  facing: string;
  bhkType: string;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  description: string;
  // Locality details
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  // Flatmate details
  rent: number;
  maintenanceCharges: number;
  depositCharges: number;
  availableFrom: string;
  furnishing: string;
  waterSupply: string;
  powerBackup: string;
  parking: string;
  nonVegAllowed: boolean;
  amenities: string[];
  tenantType: string;
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  drinkingPreference: string;
  // Images
  images: string[];
  // Additional info (FLATMATE specific)
  whoWillShowProperty?: string;
  secondaryPhoneNumber?: string;
}

// Type guard to ensure it's a FLATMATE form
export const isFlatmateForm = (form: unknown): form is FlatmateForm => {
  return (
    typeof form === "object" &&
    form !== null &&
    "propertyCategory" in form &&
    (form as { propertyCategory: unknown }).propertyCategory ===
      PropertyCategory.FLATMATE
  );
};
