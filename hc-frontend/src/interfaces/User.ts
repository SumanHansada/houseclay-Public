import { PropertyStatus } from "@/common/enums";
import type { UserDetailState } from "@/store/userSlice";

interface UserOwnedProperties {
  propertyID: string;
  // propertyCategory: PropertyCategory;    // pending
  propertyType: string;
  bhkType: string;
  // rent: number | null;   // pending
  price: number;
  locationOrSocietyName: string;
  propertyState: PropertyStatus;
  createdOn: string | null;
  updatedOn: string | null;
  availableFrom: string;
}

export interface PropertyCardWithImages {
  propertyID: string;
  propertyType: string;
  builtUpArea: number;
  bhkType: string;
  bathrooms?: number;
  rent: number | null;
  furnishing: string;
  price: number | null;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  image: string;
  images: string[];
  badges: string | null;
}

interface UserExternalPayment {
  paymentId: string;
  amount: number;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS" | string;
  signature: string | null;
  razorPaymentId: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface UserDetailsDTO {
  name: string;
  phoneNo: string;
  onWhatsApp: boolean;
  email: string;
  emailVerified: boolean;
  // connectBal: number;    //pending

  ownedProperties: UserOwnedProperties[];
  externalPayments: UserExternalPayment[];
  shortlistedProperties: PropertyCardWithImages[];
  contactedProperties: PropertyCardWithImages[];
}

export interface GetUserDetailResponse {
  user: UserDetailsDTO;
}

export function mapUserDTOToDetail(user: UserDetailsDTO): UserDetailState {
  return {
    onWhatsApp: user.onWhatsApp,
    emailVerified: user.emailVerified,

    ownedProperties: user.ownedProperties,
    shortlistedProperties: user.shortlistedProperties,
    contactedProperties: user.contactedProperties,
    externalPayments: user.externalPayments,
  };
}
