import { PropertyCategoryEnum, PropertyStatusEnum } from "@/common/enums";

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

// interface PropertyBase {
//   propertyID: string;
//   title: string | null;
//   propertyType: string;
//   builtUpArea: number;
//   facing: string | null;
//   bhkType: string;
//   floor: number;
//   totalFloors: number;
//   floorType: string | null;
//   description: string;
//   city: string;
//   locationOrSocietyName: string;
//   landmark: string;
//   latitude: number;
//   longitude: number;
//   furnishing: string | null;
//   propertyAge: string | null;
//   waterSupply: string;
//   powerBackup: string;
//   parking: boolean;
//   availableFrom: string;
//   propertyState: string;
//   images: string[];
//   amenities: string[];
//   preferredTenants: string[];
//   propertyCategory: PropertyCategoryEnum;
//   propertyUpdates: PropertyUpdate[];
//   premium: boolean;
//   managed: boolean;
// }

// export interface RentProperty extends PropertyBase {
//   propertyCategory: PropertyCategoryEnum.RENT;
//   rent: number;
//   deposit: number;
//   maintenanceCharges: number;
//   rentNegotiable: boolean;
//   petsAllowed: boolean | null;
//   nonVegAllowed: boolean | null;
// }

// export interface FlatmateProperty extends PropertyBase {
//   propertyCategory: PropertyCategoryEnum.FLATMATE;
//   rent: number;
//   depositCharges: number;
//   maintenanceCharges: number;
//   tenantType: "Male" | "Female" | "Any";
//   attachedBathroom: boolean;
//   attachedBalcony: boolean;
//   smokingPreference: string;
//   nonVegAllowed: boolean | null;
//   drinkingPreference: string;
// }

// export interface ResaleProperty extends PropertyBase {
//   propertyCategory: PropertyCategoryEnum.RESALE;
//   price: number;
//   priceNegotiable: boolean;
//   ownershipType: string;
//   underLoan: boolean;
//   bathrooms: number;
//   balcony: number;
//   khataCertificate: string;
//   saleDeed: boolean;
//   propertyTax: boolean;
// }

// export type AnyProperty = RentProperty | FlatmateProperty | ResaleProperty;
