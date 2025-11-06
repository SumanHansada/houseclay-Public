import { PaymentStatusEnum } from "@/common/enums";
import { PropertyInfo } from "./PropertyInfo";

export interface UserInfo {
  name: string;
  email: string;
  phoneNo: string;
  blacklisted: boolean;
}

export interface UserUpdate {
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

export interface UserDetails extends UserInfo {
  createdAt: string;
  blacklistedAt: string;
  broker: boolean;
  userUpdates: UserUpdate[];
  ownedProperties: PropertyInfo[];
  shortlistedProperties: PropertyInfo[];
  viewedProperties: PropertyInfo[];
  contactedProperties: PropertyInfo[];
  externalPayments: UserExternalPayment[];
  connectTransactions: UserConnectTransaction[];
  reportProperties: UserReportProperty[];
}
