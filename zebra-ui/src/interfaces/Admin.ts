import { AdminRole } from "./AdminAuth";

export interface AdminInfo {
  name: string;
  username: string;
  phoneNo: string;
  role: AdminRole;
  dateOfJoining: string;
  active: boolean;
}

export interface AdminDetails extends AdminInfo {
  secondaryPhoneNo?: string;
  personalEmail: string;
  address: string;
  dateOfBirth: string;
}
