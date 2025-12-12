// Base rental details common to RENT and FLATMATE
export interface BaseRentalDetails {
  rent?: number;
  maintenanceCharges?: number;
  availableFrom: string;
  furnishing: string;
  waterSupply: string;
  powerBackup: string;
  parking: string;
  nonVegAllowed: boolean;
  amenities: string[];
}

// Extended rental details specific to RENT
export interface RentalDetails extends BaseRentalDetails {
  bathrooms?: number;
  balcony?: number;
  rentNegotiable: boolean;
  deposit?: number;
  preferredTenants: string[];
}

// Type guard for rental details
export const isRentalDetails = (
  details: BaseRentalDetails,
): details is RentalDetails => {
  return (
    "rentNegotiable" in details &&
    "deposit" in details &&
    "preferredTenants" in details
  );
};
