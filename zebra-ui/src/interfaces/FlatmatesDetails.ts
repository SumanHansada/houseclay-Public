export interface FlatmatesDetails {
  rent: number;
  maintenanceCharges: number;
  depositCharges: number;
  availableFrom: string;
  furnishing: string;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  nonVegAllowed: boolean;
  amenities: string[];
  tenantType: string;
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  drinkingPreference: string;
}

export interface AddFlatmatesPropertyRequest {
  propertyID: string;
  propertyCategory: string;
  builtUpArea: number;
  bhkType: string;
  floor: number;
  totalFloors: number;
  description: string;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  rent: number;
  maintenanceCharges: number;
  depositCharges: number;
  availableFrom: string;
  furnishing: string;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  nonVegAllowed: boolean;
  amenities: string[];
  tenantType: string;
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  drinkingPreference: string;
  images: string[];
  whoWillShowProperty?: string;
  secondaryPhoneNumber?: string;
}
