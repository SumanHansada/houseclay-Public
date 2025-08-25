export enum AuthStep {
  PHONE = "phone",
  OTP = "otp",
  CREATE_USER = "createUser",
  EMPTY = "",
}

export enum PropertyListingType {
  NONE = "",
  DIY = "DIY",
  CALL = "CALL",
}

export enum PropertyCategory {
  NONE = "",
  RENT = "RENT",
  RESALE = "RESALE",
  FLATMATE = "FLATMATE",
}

export enum ListPropertyRouteStep {
  PROPERTY_DETAILS = "property-details",
  LOCALITY_DETAILS = "locality-details",
  RENTAL_DETAILS = "rental-details",
  RESALE_DETAILS = "resale-details",
  GALLERY = "gallery",
  ADDITIONAL_INFO = "additional-info",
  NONE = "none",
}

export enum ListPropertyFormStep {
  PROPERTY_DETAILS = "Property Details",
  LOCALITY_DETAILS = "Locality Details",
  RENTAL_DETAILS = "Rental Details",
  RESALE_DETAILS = "Resale Details",
  GALLERY = "Gallery",
  ADDITIONAL_INFO = "Additional Information",
  DONE = "Done",
}

export enum BadgeType {
  Featured = "Featured",
  Exclusive = "Exclusive",
}

export enum ListPropertyMobileStep {
  GET_STARTED = "GET_STARTED",
  LISTING_OPTIONS = "LISTING_OPTIONS",
  PROPERTY_TYPE = "PROPERTY_TYPE",
}

export enum ListPropertyDesktopStep {
  LISTING_OPTIONS = "LISTING_OPTIONS",
  PROPERTY_TYPE = "PROPERTY_TYPE",
}

export enum LeadCategory {
  PROPERTY_LISTING = "PROPERTY_LISTING",
  SEARCH_SUPPORT = "SEARCH_SUPPORT",
  UPGRADE_PROPERTY = "UPGRADE_PROPERTY",
}
export enum PaymentFilterStatus {
  ALL = "ALL",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
