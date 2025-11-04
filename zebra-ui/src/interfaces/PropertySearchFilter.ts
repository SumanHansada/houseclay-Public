import { PropertyCategory } from "@/common/enums";

export interface PropertySearchFilter {
  // Basic Filters
  propertyType: string | number | boolean;
  propertyCategory: PropertyCategory;
  propertyBhk: string | number | boolean;
  tenantType: string | number | boolean;
  // New filter states
  lookingFor: string;
  propertyTypeFilter: string;
  tenant: string;
  foodPref: string;
  bathroomType: string;
  furnishing: string;
  availability: string;
  amenities: string[];
  parking: string;
  priceRangeForRent: [number, number];
  priceRangeForBuy: [number, number];
  bhkType: string;
}
