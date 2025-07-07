import { AnyProperty, PropertyInfo } from "@/interfaces/Property";

import { UserInfo } from "../User";

// usePropertyAddRentMutation()
export interface PostRentPropertyRequest {
  propertyID: string;
  propertyCategory: string;
  propertyType: string;
  builtUpArea: number;
  facing: string;
  bhkType: string;
  propertyAge: string;
  ownershipType: string;
  floor: number;
  totalFloors: number;
  floorType: string;
  description: string;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  rent: number;
  deposit: number;
  maintenanceCharges: number;
  rentNegotiable: boolean;
  availableFrom: string;
  preferredTenants: string[];
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: boolean;
  nonVegAllowed: boolean;
  amenities: string[];
  images: string[];
  whoWillShowProperty?: string;
  secondaryPhoneNumber?: string;
}

// usePropertyAddResaleMutation()
export interface PostResalePropertyRequest {
  propertyID: string;
  propertyCategory: string;
  builtUpArea: number;
  facing: string;
  bhkType: string;
  ownershipType: string;
  propertyAge: string;
  floor: number;
  totalFloors: number;
  floorType: string;
  description: string;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  price: number;
  availableFrom: string;
  bathrooms: number;
  balcony: number;
  priceNegotiable: boolean;
  underLoan: boolean;
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: boolean;
  amenities: string[];
  images: string[];
  khataCertificate?: string;
  saleDeed?: boolean;
  propertyTax?: boolean;
  secondaryPhoneNumber?: string;
}

// usePropertyAddFlatmatesMutation()
export interface PostFlatmatesPropertyRequest {
  propertyID: string;
  propertyCategory: string;
  builtUpArea: number;
  bhkType: string;
  floor: number;
  totalFloors: number;
  description: string;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  rent: number;
  maintenanceCharges: number;
  depositCharges: number;
  availableFrom: string;
  furnishing: string;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  nonVegAllowed: boolean;
  amenities: string[];
  tenantType: string;
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  drinkingPreference: string;
  images: string[];
  whoWillShowProperty?: string;
  secondaryPhoneNumber?: string;
}

// useGetPropertiesQuery()
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

export interface PropertyUserRelations {
  owner: UserInfo;
  viewUsers: UserInfo[];
  shortlistUsers: UserInfo[];
  contactUsers: UserInfo[];
  reportUsers: UserInfo[];
}

export type GetPropertyByIdResponse = AnyProperty & PropertyUserRelations;

export interface GetPropertiesToVerifyResponse {
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

export interface GetPropertiesToReverifyResponse {
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
