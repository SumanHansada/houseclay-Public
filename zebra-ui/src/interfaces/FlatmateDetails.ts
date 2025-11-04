import { BaseRentalDetails } from "./RentalDetails";

// Flatmate-specific details that extend base rental details
export interface FlatmateDetails extends BaseRentalDetails {
  depositCharges: number;
  tenantType: string;
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  drinkingPreference: string;
}
