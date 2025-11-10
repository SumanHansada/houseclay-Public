export interface ResaleDetails {
  price?: number;
  availableFrom: string;
  bathrooms?: number;
  balcony: number;
  priceNegotiable: boolean;
  underLoan: boolean;
  waterSupply: string;
  powerBackup: string;
  furnishing: string;
  parking: string;
  amenities: string[];
}
