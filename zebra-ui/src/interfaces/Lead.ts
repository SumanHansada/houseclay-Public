export enum LeadStatusEnum {
  NEW = "NEW",
  FOLLOW_UP = "FOLLOW_UP",
  RESOLVED = "RESOLVED",
}

export enum LeadActionsEnum {
  FOLLOW_UP = `"FOLLOW_UP"`,
  RESOLVED = `"RESOLVED"`,
}

export type LeadType = "property" | "support";

// export type LeadParamType = "PROPERTY_LISTING" | "SEARCH_SUPPORT";

export enum LeadQueryParamEnum {
  property = "PROPERTY_LISTING",
  support = "SEARCH_SUPPORT",
}

export interface Lead {
  leadId: number;
  name: string;
  email: string;
  avatar?: string;
  phoneNo: string;
  status: LeadStatusEnum;
}

export interface GetAllLeadsResponse {
  content: Lead[];
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

export interface LeadComment {
  comment: string;
  date: string;
  author: string;
}

export interface LeadByIdResponse {
  leadId: number;
  phoneNo: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  status: LeadStatusEnum;
  comments: LeadComment[];
}
