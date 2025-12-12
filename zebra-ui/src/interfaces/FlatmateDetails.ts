import { BaseRentalDetails } from "./RentalDetails";

// Flatmate-specific details that extend base rental details
export interface FlatmateDetails extends BaseRentalDetails {
  depositCharges?: number;
  tenantType: string;
  roomType: string;
  bathroomType: string;
  balconyType: string;
  smokingPreference: boolean;
  drinkingPreference: boolean;
}
