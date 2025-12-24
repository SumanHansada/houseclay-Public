export enum AuthStep {
  PHONE = "phone",
  OTP = "otp",
  CREATE_USER = "createUser",
  LOGGED_IN = "loggedIn",
  NONE = "",
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
  FAILED = "FAILED",
  IN_PROGRESS = "IN_PROGRESS",
  DEFAULT = "DEFAULT",
}

export enum ErrorStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  PRECONDITION_FAILED = 412,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  BAD_GATEWAY = 502,
}

export enum PaymentVerificationStatus {
  VERIFYING = "verifying",
  SUCCESS = "success",
  ERROR = "error",
}

export enum PropertyStatus {
  PENDING = "PENDING_VERIFICATION",
  VERIFIED = "ACTIVE",
  REPORT = "PENDING_RE_VERIFICATION",
  INACTIVE = "INACTIVE",
}

export enum ConnectBundleTitle {
  BASIC_BLUE_BUNDLE = "Basic Blue Bundle",
  PREMIUM_GOLD_BUNDLE = "Premium Gold Bundle",
  ELITE_PURPLE_BUNDLE = "Elite Purple Bundle",
  CUSTOM_CONNECTS = "Custom Connects",
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
