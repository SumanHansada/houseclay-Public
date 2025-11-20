import { PropertyCategory } from "@/common/enums";
import { Location } from "@/interfaces/Location";

export interface PropertySearchFilter {
  // Basic Filters
  location: Location | null;
  propertyType: string | number | boolean;
  propertyCategory: PropertyCategory;
  tenantType: string | number | boolean;
  bhkType: string;
  // propertyBhk: string | number | boolean;  // not using - repeated
  // tenant: string;                          // not using - repeated
  availability: string;
  // New filter states
  lookingFor: string;
  propertyTypeFilter: string;
  foodPref: string;
  bathroomType: string;
  furnishing: string;
  amenities: string[];
  parking: string;
  priceRangeForRent: [number, number];
  priceRangeForBuy: [number, number];
  exclusive: boolean;
  sortFields: string;
  sortOrder: string;
}
