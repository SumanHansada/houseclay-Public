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
  NONE = "",
  DIY = "DIY",
  CALL = "CALL",
}

export enum PropertyCategoryEnum {
  NONE = "",
  RENT = "RENT",
  RESALE = "RESALE",
  FLATMATE = "FLATMATE",
}

export enum PropertyStatusEnum {
  PENDING = "PENDING_VERIFICATION",
  VERIFIED = "ACTIVE",
  REPORT = "REPORT",
}

export enum VerifyPropertyStatusEnum {
  VERIFY = "pending",
  REVERIFY = "report",
}

export enum PropertyDetailsTabEnum {
  DETAILS = "details",
  OWNER_DETAILS = "owner-details",
  CONTACT = "contact",
  SHORTLIST = "shortlist",
  VIEW = "view",
  REPORT = "report",
}

export enum VerifyPropertyTabEnum {
  DETAILS = "details",
}
export enum ReverifyPropertyTabEnum {
  DETAILS = "details",
}
