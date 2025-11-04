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

// Type guards
export const isRentAdditionalInfo = (
  info: AdditionalInfo,
): info is RentAdditionalInfo => {
  return !("khataCertificate" in info) && !("flatmateDetails" in info);
};

export const isFlatmateAdditionalInfo = (
  info: AdditionalInfo,
): info is FlatmateAdditionalInfo => {
  return !("khataCertificate" in info) && "flatmateDetails" in info;
};

export const isResaleAdditionalInfo = (
  info: AdditionalInfo,
): info is ResaleAdditionalInfo => {
  return (
    "khataCertificate" in info && "saleDeed" in info && "propertyTax" in info
  );
};

// Legacy type guard for backward compatibility
export const isRentFlatmateAdditionalInfo = (
  info: AdditionalInfo,
): info is RentAdditionalInfo | FlatmateAdditionalInfo => {
  return !("khataCertificate" in info);
};
