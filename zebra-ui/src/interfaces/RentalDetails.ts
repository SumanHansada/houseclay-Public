export interface RentalDetails {
  rent: number;
  rentNegotiable: boolean;
  maintenanceCharges: number;
  deposit: number;
  availableFrom: string;
  furnishing: string;
  preferredTenants: string[];
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  nonVegAllowed: boolean;
  amenities: string[];
}

export interface TAddRentPropertyResponse {
  propertyID: string;
  propertyCategory: string;
  propertyType: string;
  builtUpArea: number;
  facing: string;
  bhkType: string;
  propertyAge: string;
  ownershipType: string;
  floor: number;
  totalFloors: number;
  floorType: string;
  description: string;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  rent: number;
  deposit: number;
  maintenanceCharges: number;
  rentNegotiable: boolean;
  availableFrom: string;
  preferredTenants: string[];
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: boolean;
  nonVegAllowed: boolean;
  amenities: string[];
  images: string[];
  whoWillShowProperty?: string;
  secondaryPhoneNumber?: string;
}
