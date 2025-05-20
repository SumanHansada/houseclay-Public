export interface FlatmatesDetails {
  rent: number;
  maintenanceCharges: number;
  deposit: number;
  availableFrom: string;
  furnishing: string;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  nonVegAllowed: boolean;
  amenities: string[];
  tenantType: string;
  attachedBathroom: boolean;
  bathroomType: string;
  smokingPreference: string;
  drinkingPreference: string;
}
