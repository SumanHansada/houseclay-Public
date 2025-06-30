import { PaymentStatusEnum } from "@/common/enums";
import { PropertyInfo } from "./Property";

export interface User {
  name: string;
  email: string;
  avatar?: string;
  phoneNo: string;
  blacklisted: boolean;
  createdAt: string;
}

export interface GetAllUsersResponse {
  content: User[];
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

export interface UserUpdatedInfo {
  updateType: string;
  updateTime: string;
  updateBy: string;
  comment: string;
}

export interface UserExternalPayment {
  paymentId: string;
  amount: number;
  status: PaymentStatusEnum;
  signature: string;
  razorPaymentId: string;
  createdAt: string;
  completedAt: string | null;
}

export interface UserConnectTransaction {
  transactionId: string;
  connectQuantity: number;
  transactionTime: string;
}

export interface UserReportProperty {
  reportId: number;
  reportType: string;
  reportTime: string;
  userProperty: PropertyInfo;
}

export interface UserDetails {
  phoneNo: string;
  email: string;
  name: string;
  createdAt: string;
  blacklistedAt: string;
  userUpdates: UserUpdatedInfo[];
  ownedProperties: PropertyInfo[];
  shortlistedProperties: PropertyInfo[];
  viewedProperties: PropertyInfo[];
  contactedProperties: PropertyInfo[];
  externalPayments: UserExternalPayment[];
  connectTransactions: UserConnectTransaction[];
  reportProperties: UserReportProperty[];
  blacklisted: boolean;
}

export interface GetUserByPhoneNoResponse {
  user: UserDetails;
}
