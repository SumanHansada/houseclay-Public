export enum PropertyStatusEnum {
  PENDING = "PENDING_VERIFICATION",
  VERIFIED = "VERIFIED",
  REPORTED = "REPORT",
}

interface PropertyBase {
  propertyID: string;
  title: string | null;
  propertyType: string;
  builtUpArea: number;
  facing: string | null;
  bhkType: string;
  floor: number;
  totalFloors: number;
  floorType: string | null;
  description: string;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  furnishing: string;
  propertyAge: string | null;
  waterSupply: string;
  powerBackup: string;
  parking: boolean;
  availableFrom: string;
  propertyState: string;
  images: string[];
  amenities: string[];
  preferredTenants: string[];
  propertyUpdates: Array<{
    updateType: string;
    updateTime: string;
    updateBy: string;
    userType: string;
  }>;
  premium: boolean;
  managed: boolean;
}

export interface RentProperty extends PropertyBase {
  propertyCategory: "Rent";
  rent: string;
  deposit: string;
  maintenanceCharges: string;
  rentNegotiable: boolean;
}

export interface FlatmateProperty extends PropertyBase {
  propertyCategory: "Flatmate";
  rent: string;
  maintenanceCharges: string;
  depositCharges: string;
  tenantType: string;
  attachedBathroom: boolean;
  attachedBalcony: boolean;
  smokingPreference: string;
  drinkingPreference: string;
}

export interface SaleProperty extends PropertyBase {
  propertyCategory: "Sale";
  ownershipType: string;
  priceNegotiable: boolean;
  underLoan: boolean;
  //   price: string;
  price: number;
  bathrooms: number;
  balcony: number;
  khataCertificate: string;
  saleDeed: boolean;
  propertyTax: boolean;
}

export type GetPropertyByIdResponse =
  | RentProperty
  | FlatmateProperty
  | SaleProperty;
