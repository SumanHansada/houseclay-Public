export interface RentalDetails {
  rent: number;
  rentNegotiable: boolean;
  maintenanceCharges: number;
  deposit: number;
  availableFrom: string;
  furnishing: string;
  preferredTenant: string;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  nonVegAllowed: boolean;
  amenities: string[];
  tenantType: string;
  attachedBathroom: boolean;
  bathroomType: string;
  smokingPreference: boolean;
  drinkingPreference: boolean;
}
