// Base property details that are common across all property categories
export interface BasePropertyDetails {
  propertyType: string;
  builtUpArea: number;
  bhkType: string;
  floor: number;
  totalFloors: number;
  description: string;
}

// Extended property details for RENT
export interface RentPropertyDetails extends BasePropertyDetails {
  facing: string;
  ownershipType: string;
  propertyAge: string;
  floorType: string;
}

// Extended property details for RESALE
export interface ResalePropertyDetails extends BasePropertyDetails {
  facing: string;
  ownershipType: string;
  propertyAge: string;
  floorType: string;
}

// Property details for FLATMATE (simplified)
export type FlatmatePropertyDetails = BasePropertyDetails;

// Union type for all property details
export type PropertyDetails =
  | FlatmatePropertyDetails
  | RentPropertyDetails
  | ResalePropertyDetails;

// Type guards to check property details type
export const isFlatmatePropertyDetails = (
  details: PropertyDetails,
): details is FlatmatePropertyDetails => {
  return !("facing" in details);
};

export const isRentPropertyDetails = (
  details: PropertyDetails,
): details is RentPropertyDetails => {
  return "facing" in details;
};

export const isResalePropertyDetails = (
  details: PropertyDetails,
): details is ResalePropertyDetails => {
  return "facing" in details;
};

// Legacy type guard for backward compatibility
export const isRentResalePropertyDetails = (
  details: PropertyDetails,
): details is RentPropertyDetails | ResalePropertyDetails => {
  return "facing" in details;
};
