export interface ResaleDetails {
  price: number;
  availableFrom: string;
  bathrooms: number;
  balcony: number;
  priceNegotiable: boolean;
  underLoan: boolean;
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: boolean;
  amenities: string[];
}

export interface TAddResalePropertyResponse {
  propertyID: string;
  propertyCategory: string;
  builtUpArea: number;
  facing: string;
  bhkType: string;
  ownershipType: string;
  propertyAge: string;
  floor: number;
  totalFloors: number;
  floorType: string;
  description: string;
  city: string;
  locationOrSocietyName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  price: number;
  availableFrom: string;
  bathrooms: number;
  balcony: number;
  priceNegotiable: boolean;
  underLoan: boolean;
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: boolean;
  amenities: string[];
  images: string[];
  khataCertificate?: string;
  saleDeed?: boolean;
  propertyTax?: boolean;
  secondaryPhoneNumber?: string;
}
