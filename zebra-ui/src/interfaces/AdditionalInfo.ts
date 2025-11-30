// Base additional info common to all property categories
export interface BaseAdditionalInfo {
  secondaryPhoneNumber?: string;
}

// Additional info for RENT
export interface RentAdditionalInfo extends BaseAdditionalInfo {
  whoWillShowProperty?: string;
}

// Additional info for FLATMATE
export interface FlatmateAdditionalInfo extends BaseAdditionalInfo {
  whoWillShowProperty?: string;
}

// Additional info for RESALE with specific required fields
export interface ResaleAdditionalInfo extends BaseAdditionalInfo {
  khataCertificate: string;
  saleDeed: boolean;
  propertyTax: boolean;
}

// Union type for all additional info
export type AdditionalInfo =
  | RentAdditionalInfo
  | FlatmateAdditionalInfo
  | ResaleAdditionalInfo;
