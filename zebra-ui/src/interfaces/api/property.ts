import { PropertyCategory } from "@/common/enums";
import { PropertyInfo, PropertyUpdate } from "@/interfaces/Property";

import { AdditionalInfo } from "../AdditionalInfo";
import { FlatmateDetails } from "../FlatmateDetails";
import { LocalityDetails } from "../LocalityDetails";
import { PropertyDetails } from "../PropertyDetails";
import { RentalDetails } from "../RentalDetails";
import { ResaleDetails } from "../ResaleDetails";
import { UserInfo } from "../User";

interface PropertyCore {
  propertyID: string;
  images: string[];
  coverImage?: string;
  propertyCategory: PropertyCategory;
}

export type FlattenedRentForm = Partial<
  PropertyDetails & LocalityDetails & AdditionalInfo & RentalDetails
>;
export type FlattenedResaleForm = Partial<
  PropertyDetails & LocalityDetails & AdditionalInfo & ResaleDetails
>;
export type FlattenedFlatmateForm = Partial<
  PropertyDetails & LocalityDetails & AdditionalInfo & FlatmateDetails
>;

// usePropertyAddMutation()
export type AddPropertyRequest = PropertyCore &
  (FlattenedRentForm | FlattenedResaleForm | FlattenedFlatmateForm);

interface ResponseMeta extends PropertyCore {
  propertyUpdates: PropertyUpdate[];
  premium: boolean;
  managed: boolean;
  propertyState: string;
}

interface PropertyUserRelations {
  owner: UserInfo;
  viewUsers: UserInfo[];
  shortlistUsers: UserInfo[];
  contactUsers: UserInfo[];
  reportUsers: UserInfo[];
}

export type PropertyResponse = ResponseMeta &
  (FlattenedRentForm | FlattenedResaleForm | FlattenedFlatmateForm);

// useGetPropertyByIdQuery()
export type GetPropertyByIdResponse = PropertyResponse & PropertyUserRelations;

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

// useGetPropertiesToVerifyQuery()
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

// useGetPropertiesToReverifyQuery()
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
