import { PropertyCategory, PropertyStatus } from "@/common/enums";

export interface AuthUserDetail {
  name: string;
  emailID: string;
  phoneNo: string;
  connectBal: number;
  avatarUrl: string | null;
}

export interface UserOwnedProperties {
  propertyID: string;
  propertyCategory: PropertyCategory;
  propertyType: string;
  bhkType: string;
  rent: number | null;
  builtUpArea: number;
  price: number | null;
  locationOrSocietyName: string;
  propertyState: PropertyStatus;
  createdOn: string;
  updatedOn: string;
  availableFrom: string;
}

export interface PropertyCardWithImages {
  propertyID: string;
  propertyCategory: PropertyCategory;
  propertyState: PropertyStatus;
  propertyType: string;
  builtUpArea: number;
  bhkType: string;
  bathrooms: number | null;
  tenantType: string | null;
  roomType: string | null;
  bathroomType: string | null;
  balconyType: string | null;
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

export interface UserExternalPayment {
  bundle:
    | "BASIC_BLUE_BUNDLE"
    | "PREMIUM_GOLD_BUNDLE"
    | "ELITE_PURPLE_BUNDLE"
    | "CUSTOM_CONNECTS"
    | string;
  paymentId: string;
  amount: number;
  connectQty: number;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS" | string;
  createdAt: string;
  completedAt: string | null;
  // invoice: boolean;
}

export interface UserDetailsDTO {
  name: string;
  phoneNo: string;
  email: string;
  onWhatsApp: boolean;
  emailVerified: boolean;
  connectBal: number;

  ownedProperties: UserOwnedProperties[];
  externalPayments: UserExternalPayment[];
  shortlistedProperties: PropertyCardWithImages[];
  contactedProperties: PropertyCardWithImages[];
}

export interface GetUserDetailResponse {
  user: UserDetailsDTO;
}
