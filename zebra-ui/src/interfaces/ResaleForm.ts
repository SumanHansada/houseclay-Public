import { PropertyCategory } from "@/common/enums";

// Complete RESALE form payload
export interface ResaleForm {
  propertyID: string;
  propertyCategory: PropertyCategory.RESALE;
  // Property details (extended for RESALE)
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
  // Resale details
  price?: number;
  availableFrom: string;
  bathrooms?: number;
  balcony: number;
  priceNegotiable: boolean;
  underLoan: boolean;
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: string;
  amenities: string[];
  // Images
  images: string[];
  coverImage?: string;
  // Additional info (RESALE specific)
  khataCertificate: string;
  saleDeed: boolean;
  propertyTax: boolean;
  secondaryPhoneNumber?: string;
}

// Type guard to ensure it's a RESALE form
export const isResaleForm = (form: unknown): form is ResaleForm => {
  return (
    typeof form === "object" &&
    form !== null &&
    "propertyCategory" in form &&
    (form as { propertyCategory: unknown }).propertyCategory ===
      PropertyCategory.RESALE
  );
};
