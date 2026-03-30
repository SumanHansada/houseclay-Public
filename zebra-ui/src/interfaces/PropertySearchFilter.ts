import { PropertyCategory } from "@/common/enums";
import { Location } from "@/interfaces/Location";

export interface PropertySearchFilter {
  // Quick Filters
  location: Location | null;
  confirmedLocationName: string;
  propertyCategory: PropertyCategory;
  propertyType: string;
  tenantType: string;
  bhkType: string;
  availability: string;

  // Filter Dialog
  nonVegAllowed: boolean | null;
  preferredTenants: string;
  roomType: string;
  bathroomType: string;
  balconyType: string;
  furnishing: string;
  amenities: string[];
  parking: string;
  priceRangeForRent: [number, number] | null;
  priceRangeForFlatmate: [number, number] | null;
  priceRangeForBuy: [number, number] | null;
  exclusive: boolean;

  // Sorting
  sortFields: string;
  sortOrder: string;
}
