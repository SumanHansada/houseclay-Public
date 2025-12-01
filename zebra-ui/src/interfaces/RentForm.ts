import { PropertyCategory } from "@/common/enums";

// Complete RENT form payload
export interface RentForm {
  propertyID: string;
  propertyCategory: PropertyCategory.RENT;
  // Property details (extended for RENT)
  propertyType: string;
  builtUpArea?: number;
  facing: string;
  bhkType: string;
  ownershipType: string;
  propertyAge: string;
  floor?: number;
  totalFloors?: number;
  floorType: string;
  description: string;
  // Locality details
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  // Rental details
  rent?: number;
  deposit?: number;
  maintenanceCharges?: number;
  rentNegotiable: boolean;
  availableFrom: string;
  preferredTenants: string[];
  bathrooms?: number;
  balcony?: number;
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: string;
  nonVegAllowed: boolean;
  amenities: string[];
  // Images
  images: string[];
  coverImage?: string;
  // Additional info (RENT specific)
  whoWillShowProperty?: string;
  secondaryPhoneNumber?: string;
}

// Type guard to ensure it's a RENT form
export const isRentForm = (form: unknown): form is RentForm => {
  return (
    typeof form === "object" &&
    form !== null &&
    "propertyCategory" in form &&
    (form as { propertyCategory: unknown }).propertyCategory ===
      PropertyCategory.RENT
  );
};
