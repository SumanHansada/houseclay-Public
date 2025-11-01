import { PropertyCategory, PropertyStatus } from "@/common/enums";

export interface UserOwnedProperties {
  propertyID: string;
  propertyCategory: PropertyCategory; // pending
  propertyType: string;
  bhkType: string;
  rent: number | null; // pending
  builtUpArea: number; // pending
  price: number | null;
  locationOrSocietyName: string;
  propertyState: PropertyStatus;
  createdOn: string;
  updatedOn: string | null;
  availableFrom: string;
}

export interface PropertyCardWithImages {
  propertyID: string;
  propertyCategory: PropertyCategory;
  propertyState: PropertyStatus;
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

export interface UserExternalPayment {
  paymentType:
    | "Basic Blue Bundle"
    | "Premium Gold Bundle"
    | "Elite Purple Bundle"
    | "Custom Connects"
    | string; // pending
  paymentId: string;
  amount: number;
  connects: number;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS" | string;
  createdAt: string;
  completedAt: string | null;
  invoice: boolean;
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
