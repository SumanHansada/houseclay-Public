import { LeadStatusEnum } from "@/common/enum";

export type LeadType = "property" | "support";

export interface Lead {
  leadId: number;
  name: string;
  email: string;
  avatar?: string;
  phoneNo: string;
  status: LeadStatusEnum;
}

export interface LeadComment {
  comment: string;
  date: string;
  author: string;
}
