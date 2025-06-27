export enum PropertyType {
  RENT = "RENT",
  RESALE = "RESALE",
  FLATMATES = "FLATMATES",
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

export enum PropertyListingType {
  DIY = "DIY",
  CALL = "CALL",
}

export enum UserDetailsTabEnum {
  PROFILE = "profile",
  LISTED = "listed-properties",
  SHORTLISTED = "shortlisted-properties",
  CONNECT = "connect-history",
  PAYMENT = "payment-history",
  CONTACTED = "contacted-properties",
  VIEWED = "viewed-properties",
  REPORT = "reported-properties",
}

export enum VerifyPropertyStatusEnum {
  VERIFY = "pending",
  REVERIFY = "report",
}

export enum PropertyDetailsTabEnum {
  DETAILS = "details",
  OWNER_DETAILS = "owner-details",
  CONTACTED = "contacted",
  SHORTLISTED = "shortlisted",
  VIEWED = "viewed",
}

export enum VerifyPropertyTabEnum {
  DETAILS = "details",
}
export enum ReverifyPropertyTabEnum {
  DETAILS = "details",
}
