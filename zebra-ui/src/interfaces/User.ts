import { PaymentStatusEnum } from "@/common/enum";
import { PropertyInfo } from "./Property";

export interface User {
  name: string;
  email: string;
  phoneNo: string;
  blacklisted: boolean;
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

export interface UserDetails extends User {
  // phoneNo: string;
  // email: string;
  // name: string;
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
  // blacklisted: boolean;
}
