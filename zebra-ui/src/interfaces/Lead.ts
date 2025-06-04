// export type LeadStatus = "NEW" | "FOLLOW_UP" | "RESOLVED";

// export type LeadActions = "FOLLOW_UP" | "RESOLVED";

export enum LeadStatus {
  NEW = "NEW",
  FOLLOW_UP = "FOLLOW_UP",
  RESOLVED = "RESOLVED",
}

// export enum LeadActions {
//   NEW,
//   FOLLOW_UP,
//   RESOLVED,
// }

export enum LeadActions {
  FOLLOW_UP = "FOLLOW_UP",
  RESOLVED = "RESOLVED",
}

export type LeadType = "property" | "support";

export type LeadParamType = "PROPERTY_LISTING" | "SEARCH_SUPPORT";

export enum LeadQueryParam {
  property = "PROPERTY_LISTING",
  support = "SEARCH_SUPPORT",
}

export interface TLead {
  leadId: number;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  status: LeadStatus;
}

export interface TLeadsResponse {
  content: TLead[];
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

export interface TLeadByIdResponse {
  leadId: number;
  phone: string;
  email: string;
  name: string;
  avatar?: string;
  status: LeadStatus;
  comments: LeadComment[];
}
