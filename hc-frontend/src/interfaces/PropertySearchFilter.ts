import { PropertyCategory } from "@/common/enums";
import { Location } from "@/interfaces/Location";

export interface PropertySearchFilter {
  // Basic Filters
  location: Location | null;
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
  exclusive: boolean;
  sortFields: string;
  sortOrder: string;
}
