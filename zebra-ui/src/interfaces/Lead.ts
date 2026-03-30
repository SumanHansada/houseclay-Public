import { LeadStatusEnum } from "@/common/enums";

export const LEAD_TYPE_MAP = {
  property: "PROPERTY_LISTING",
  support: "SEARCH_SUPPORT",
  upgrade: "UPGRADE_PROPERTY",
} as const;

export type LeadType = keyof typeof LEAD_TYPE_MAP;

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  property: "Property Listing Leads",
  support: "Search Support Leads",
  upgrade: "Upgrade Property Leads",
};

export type LeadQueryParam = (typeof LEAD_TYPE_MAP)[LeadType];

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
