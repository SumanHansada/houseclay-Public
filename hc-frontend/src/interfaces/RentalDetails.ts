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
