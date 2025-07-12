export interface FlatmateDetails {
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
}
