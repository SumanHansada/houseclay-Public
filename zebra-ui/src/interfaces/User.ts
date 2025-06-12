import { PropertyStatusEnum } from "./Property";

export interface User {
  name: string;
  email: string;
  avatar?: string;
  phoneNo: string;
  blacklisted: boolean;
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

export interface UserPropertyInfo {
  propertyID: string;
  title: string;
  type: string;
  config: string;
  location: string;
  price: string;
  status: PropertyStatusEnum;
}

export interface UserExternalPayment {
  paymentId: string;
  amount: number;
  status: string;
  signature: string;
  razorPaymentId: string;
  createdAt: string;
  completedAt: string;
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
  userProperty: UserPropertyInfo;
}

export interface UserDetails {
  phoneNo: string;
  email: string;
  name: string;
  createdAt: string;
  blacklistedAt: string;
  blacklistedBy: string;
  ownedProperties: UserPropertyInfo[];
  shortlistedProperties: UserPropertyInfo[];
  viewedProperties: UserPropertyInfo[];
  contactedProperties: UserPropertyInfo[];
  externalPayments: UserExternalPayment[];
  connectTransactions: UserConnectTransaction[];
  reportProperties: UserReportProperty[];
  blacklisted: boolean;
}

export interface GetUserByPhoneNoResponse {
  user: UserDetails;
}
