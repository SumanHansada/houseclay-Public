// Re-export shared types from hc-sdk when available
// export type { PropertyDetails, PropertySearch, RentForm, ... } from '@hc-sdk/interfaces';

export interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  locality: string;
  city: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  createdAt: string;
}

export interface PropertySearch {
  query: string;
  locality?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page: number;
  size: number;
}
