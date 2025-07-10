import { PropertyInfo, PropertyUpdate } from "@/interfaces/Property";

import { UserInfo } from "../User";
import { PropertyCategoryEnum } from "@/common/enums";
import { PropertyDetails } from "../PropertyDetails";
import { LocalityDetails } from "../LocalityDetails";
import { AdditionalInfo } from "../AdditionalInfo";
import { RentalDetails } from "../RentalDetails";
import { ResaleDetails } from "../ResaleDetails";
import { FlatmateDetails } from "../FlatmateDetails";

interface PropertyCore {
  propertyID: string;
  images: string[];
  propertyCategory: PropertyCategoryEnum;
}

type RentForm = Partial<
  PropertyDetails & LocalityDetails & AdditionalInfo & RentalDetails
>;
type ResaleForm = Partial<
  PropertyDetails & LocalityDetails & AdditionalInfo & ResaleDetails
>;
type FlatmateForm = Partial<
  PropertyDetails & LocalityDetails & AdditionalInfo & FlatmateDetails
>;

// usePropertyAddMutation()
export type AddPropertyRequest = PropertyCore &
  (RentForm | ResaleForm | FlatmateForm);

interface ResponseMeta extends PropertyCore {
  propertyUpdates: PropertyUpdate[];
  premium: boolean;
  managed: boolean;
  coverImage: string;
  propertyState: string;
}

interface PropertyUserRelations {
  owner: UserInfo;
  viewUsers: UserInfo[];
  shortlistUsers: UserInfo[];
  contactUsers: UserInfo[];
  reportUsers: UserInfo[];
}

type PropertyResponse = ResponseMeta & (RentForm | ResaleForm | FlatmateForm);

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
