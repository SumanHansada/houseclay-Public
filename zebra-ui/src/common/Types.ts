export interface TUser {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  avatar: string;
  blacklisted: boolean;
  connectBalance: number;
}

export type LeadType = "property" | "support";

export type LeadStatus = "new" | "follow" | "resolved";

export interface TLead {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  avatar: string;
  status: string;
  type: string;
}
