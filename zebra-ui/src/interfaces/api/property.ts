import { ReportStatus } from "@/common/enums";
import { PropertyForm } from "../PropertyForm";
import { PropertyInfo } from "../PropertyInfo";
import { PropertyUpdate } from "../PropertyUpdate";
import { UserInfo } from "../User";

interface ResponseMeta {
  title: string | null;
  premium: boolean;
  managed: boolean;
  propertyState: string;
}

export type PropertyResponse = ResponseMeta & PropertyForm;

export interface PropertyReportDetails {
  reportId: number;
  reportType: ReportStatus;
  reportTime: string;
  user: UserInfo;
}

// useGetPropertyByIdQuery()
export interface GetPropertyByIdResponse {
  property: PropertyResponse;
  propertyUpdates: PropertyUpdate[];
  owner: UserInfo;
  viewUsers: UserInfo[];
  shortlistUsers: UserInfo[];
  contactUsers: UserInfo[];
  reportUsers: PropertyReportDetails[];
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
