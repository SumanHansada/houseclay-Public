import { PropertyPhoto } from "./PropertyPhoto";
import { User } from "./User";

export enum PropertyStatusEnum {
  PENDING = "PENDING_VERIFICATION",
  VERIFIED = "VERIFIED",
  REPORT = "REPORT",
}

export type PropertyCategory = "Rent" | "Flatmate" | "Resale";

export interface PropertyInfo {
  propertyID: string;
  title: string;
  type: string;
  config: string;
  location: string;
  price: string;
  createdAt: string;
  availableFrom: string;
  lastModified: string | null;
  status: string;
}

export interface GetAllPropertiesResponse {
  content: PropertyInfo[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
}

// interface PropertyBase {
//   propertyID: string;
//   title: string | null;
//   propertyType: "Apartment" | "Villa" | "House" | "Plot" | "Commercial";
//   builtUpArea: number;
//   facing: "East" | "West" | "North" | "South" | "North-East" | "North-West" | "South-East" | "South-West" | null;
//   bhkType: "1BHK" | "2BHK" | "3BHK" | "4BHK" | "5+BHK";
//   floor: number;
//   totalFloors: number;
//   floorType: "Mosaic" | "Marble" | "Granite" | "Vitrified" | "Wooden" | null;
//   description: string;
//   city: string;
//   locationOrSocietyName: string;
//   landmark: string;
//   latitude: number;
//   longitude: number;
//   furnishing: "Unfurnished" | "Semi-funnished" | "Fully-furnished";
//   propertyAge: "Under Construction" | "Less than 1 year" | "1-5 years" | "5-10 years" | "More than 10 year" | null;
//   waterSupply: "borewell" | "tanker" | "municipal";
//   powerBackup: "none" | "partial" | "full";
//   parking: boolean;
//   availableFrom: string; // ISO date string
//   propertyState: "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED" | "INACTIVE";
//   images: string[];
//   amenities: string[];
//   propertyUpdates: Array<{
//     updateType: string;
//     updateTime: string;
//     updateBy: string;
//     userType: string;
//   }>;
//   premium: boolean;
//   managed: boolean;
// }

interface PropertyBase {
  propertyID: string;
  title: string | null;
  propertyType: string;
  builtUpArea: number;
  facing: string | null;
  bhkType: string;
  floor: number;
  totalFloors: number;
  floorType: string | null;
  description: string;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  furnishing: string;
  propertyAge: string | null;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  availableFrom: string;
  propertyState: string;
  images: string[];
  amenities: string[];
  propertyUpdates: Array<{
    updateType: string;
    updateTime: string;
    updateBy: string;
    userType: string;
  }>;
  premium: boolean;
  managed: boolean;
}

export interface RentProperty extends PropertyBase {
  propertyCategory: "Rent";
  rent: number;
  deposit: number;
  maintenanceCharges: number;
  rentNegotiable: boolean;
  preferredTenants: string[];
  petsAllowed: boolean | null;
  nonVegAllowed: boolean;
}

export interface FlatmateProperty extends PropertyBase {
  propertyCategory: "Flatmate";
  rent: number;
  maintenanceCharges: number;
  depositCharges: number;
  tenantType: string;
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  drinkingPreference: string;
}

export interface ResaleProperty extends PropertyBase {
  propertyCategory: "Resale";
  ownershipType: string;
  priceNegotiable: boolean;
  underLoan: boolean;
  price: number;
  bathrooms: number;
  balcony: number;
  khataCertificate: string;
  saleDeed: boolean;
  propertyTax: boolean;
}

export type AnyProperty = RentProperty | FlatmateProperty | ResaleProperty;

export interface GetPropertyByIDResponse {
  propertyDetails: AnyProperty;
  userDetails: User;
  contactedUsers: User[];
  viewedUsers: User[];
  shortlistedUsers: User[];
}

export interface PropertyDetailsFormValues {
  propertyDetails: {
    propertyType: string;
    bhkType: string;
    builtUpArea: number | "";
    floor: number | "";
    totalFloors: number | "";
    propertyAge: string;
    facing: string;
    floorType: string;
    description: string;
    bathrooms: number | "";
    balcony: number | "";
  };
  localityDetails: {
    city: string;
    locationOrSocietyName: string;
    landmark: string;
    latitude: number;
    longitude: number;
  };
  rentalDetails?: {
    // Only for Rent/Flatmate
    rent: number | "";
    deposit: number | "";
    maintenanceCharges: number | "";
    rentNegotiable: boolean;
    preferredTenants: string[];
    petsAllowed: boolean;
    nonVegAllowed: boolean;
    // Flatmate specific
    tenantType: string;
    attachedBathroom: boolean;
    attachedBalcony: boolean;
    smokingPreference: string;
    drinkingPreference: string;
  };
  resaleDetails?: {
    // Only for Resale
    price: number | "";
    priceNegotiable: boolean;
    ownershipType: string;
    underLoan: boolean;
  };
  additionalInfo: {
    furnishing: string;
    parking: boolean;
    waterSupply: string;
    powerBackup: string;
    availableFrom: Date | null;
    // Resale specific
    khataCertificate: string;
    saleDeed: boolean;
    propertyTax: boolean;
  };
  images: PropertyPhoto[];
}
