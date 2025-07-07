import { LeadStatusEnum } from "@/common/enums";
import { Lead, LeadComment } from "@/interfaces/Lead";

// useGetLeadsQuery()
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

// useGetLeadByIdQuery()
export interface GetLeadByIdResponse {
  leadId: number;
  phoneNo: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  status: LeadStatusEnum;
  comments: LeadComment[];
}
