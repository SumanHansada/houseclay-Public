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

export enum PropertyCategory {
  NONE = "",
  RENT = "RENT",
  RESALE = "RESALE",
  FLATMATE = "FLATMATE",
}

export enum BadgeTypeEnum {
  Featured = "Featured",
  Exclusive = "Exclusive",
}

export enum PropertyStatus {
  PENDING = "PENDING_VERIFICATION",
  VERIFIED = "ACTIVE",
  REPORT = "PENDING_RE_VERIFICATION",
  INACTIVE = "INACTIVE",
}

export enum PropertyState {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  PENDING_RE_VERIFICATION = "PENDING_RE_VERIFICATION",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING_ROUTINE_CHECK = "PENDING_ROUTINE_CHECK",
}

export enum VerifyPropertyStatusEnum {
  VERIFY = "pending",
  REVERIFY = "report",
  ROUTINE_CHECK = "routine-check",
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

export enum PropertyTypeValue {
  APARTMENT = "apartment",
  VILLA = "villa",
  HOUSE = "house",
  BUILDING = "building",
}

export enum PreferredTenantValue {
  FAMILY = "family",
  COMPANY = "company",
  BACHELOR = "bachelor",
  COUPLE = "couple",
}

export enum TenantTypeValue {
  MALE = "male",
  FEMALE = "female",
}

export const enum ReportStatus {
  BROKER = "BROKER",
  INCORRECT_INFO = "INCORRECT_INFO",
  RENTED_OUT = "RENTED_OUT",
  OTHER = "OTHER",
}
