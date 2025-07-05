import { PropertyCategoryEnum, PropertyStatusEnum } from "@/common/enum";

export interface PropertyInfo {
  propertyID: string;
  propertyCategory: PropertyCategoryEnum;
  price: string | null;
  location: string;
  bhkType: string;
  propertyState: PropertyStatusEnum;
  createdOn: string;
  updatedOn: string | null;
  availableFrom: string;
}

export interface PropertyUpdate {
  updateType: string;
  updateTime: string;
  updateBy: string;
  userType: string;
}

export interface PropertyBase {
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
  furnishing: string | null;
  propertyAge: string | null;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  availableFrom: string;
  propertyState: string;
  images: string[];
  amenities: string[];
  preferredTenants: string[];
  propertyCategory: PropertyCategoryEnum;
  propertyUpdates: PropertyUpdate[];
  premium: boolean;
  managed: boolean;
}

export interface RentProperty extends PropertyBase {
  propertyCategory: PropertyCategoryEnum.RENT;
  rent: number;
  deposit: number;
  maintenanceCharges: number;
  rentNegotiable: boolean;
  petsAllowed: boolean | null;
  nonVegAllowed: boolean | null;
}

export interface FlatmateProperty extends PropertyBase {
  propertyCategory: PropertyCategoryEnum.FLATMATE;
  rent: number;
  depositCharges: number;
  maintenanceCharges: number;
  tenantType: "Male" | "Female" | "Any";
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  nonVegAllowed: boolean | null;
  drinkingPreference: string;
}

export interface ResaleProperty extends PropertyBase {
  propertyCategory: PropertyCategoryEnum.RESALE;
  price: number;
  priceNegotiable: boolean;
  ownershipType: string;
  underLoan: boolean;
  bathrooms: number;
  balcony: number;
  khataCertificate: string;
  saleDeed: boolean;
  propertyTax: boolean;
}

export type AnyProperty = RentProperty | FlatmateProperty | ResaleProperty;

// export interface PropertyDetailsFormValues {
//   propertyDetails: {
//     propertyType: string;
//     bhkType: string;
//     builtUpArea: number | "";
//     floor: number | "";
//     totalFloors: number | "";
//     propertyAge: string;
//     facing: string;
//     floorType: string;
//     description: string;
//     bathrooms: number | "";
//     balcony: number | "";
//   };
//   localityDetails: {
//     city: string;
//     locationOrSocietyName: string;
//     landmark: string;
//     latitude: number;
//     longitude: number;
//   };
//   rentalDetails?: {
//     // Only for Rent/Flatmate
//     rent: number | "";
//     deposit: number | "";
//     maintenanceCharges: number | "";
//     rentNegotiable: boolean;
//     preferredTenants: string[];
//     petsAllowed: boolean;
//     nonVegAllowed: boolean;
//     // Flatmate specific
//     tenantType: string;
//     attachedBathroom: boolean;
//     attachedBalcony: boolean;
//     smokingPreference: string;
//     drinkingPreference: string;
//   };
//   resaleDetails?: {
//     // Only for Resale
//     price: number | "";
//     priceNegotiable: boolean;
//     ownershipType: string;
//     underLoan: boolean;
//   };
//   additionalInfo: {
//     furnishing: string;
//     parking: boolean;
//     waterSupply: string;
//     powerBackup: string;
//     availableFrom: Date | null;
//     // Resale specific
//     khataCertificate: string;
//     saleDeed: boolean;
//     propertyTax: boolean;
//   };
//   images: PropertyPhoto[];
// }
