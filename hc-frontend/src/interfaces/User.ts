import { PropertyInfo } from "./PropertyInfo";
import type { UserDetailState } from "@/store/userSlice";

export interface UserInfoDTO {
  name: string;
  email: string;
  phoneNo: string;
  blacklisted: boolean;
}

export interface UserUpdateDTO {
  updateType: "BLACKLISTED" | "ACTIVATED" | string;
  updateTime: string;
  updateBy: string;
  comment: string;
}

export interface UserExternalPaymentDTO {
  paymentId: string;
  amount: number;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS" | string;
  signature: string | null;
  razorPaymentId: string | null;
  createdAt: string;
  completedAt: string | null;
}
export interface UserConnectEventDTO {
  type: "CREATED" | string;
  actor: "USER" | "ADMIN" | string;
  eventTime: string;
  notes: string | null;
}

export interface UserConnectTransactionDTO {
  connectId: string | null;
  propertyID: string | null;
  status: "ACTIVE" | "USED" | "EXPIRED" | string;
  sourceType: "EXTERNAL_PAYMENT" | "ADMIN_GRANT" | string;
  connectEvents: UserConnectEventDTO[];
}

export interface UserReportPropertyDTO {
  reportId: number;
  reportType: string;
  reportTime: string;
  userProperty: PropertyInfo;
}

export interface UserDetailsDTO extends UserInfoDTO {
  createdAt: string;
  blacklistedAt: string | null;
  broker: boolean;

  userUpdates: UserUpdateDTO[];

  ownedProperties: PropertyInfo[];
  shortlistedProperties: PropertyInfo[];
  viewedProperties: PropertyInfo[];
  contactedProperties: PropertyInfo[];

  externalPayments: UserExternalPaymentDTO[];
  connectTransactions: UserConnectTransactionDTO[];

  reportProperties: UserReportPropertyDTO[];
}

export interface GetUserDetailResponse {
  user: UserDetailsDTO;
}

export function mapUserDTOToDetail(user: UserDetailsDTO): UserDetailState {
  return {
    createdAt: user.createdAt ?? null,
    blacklistedAt: user.blacklistedAt ?? null,
    blacklisted: user.blacklisted,
    broker: user.broker,

    userUpdates: user.userUpdates,

    ownedProperties: user.ownedProperties,
    shortlistedProperties: user.shortlistedProperties,
    viewedProperties: user.viewedProperties,
    contactedProperties: user.contactedProperties,

    externalPayments: user.externalPayments,
    connectTransactions: user.connectTransactions,
    reportProperties: user.reportProperties,
  };
}
