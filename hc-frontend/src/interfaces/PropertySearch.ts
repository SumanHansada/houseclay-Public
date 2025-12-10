import { PropertyCategory } from "@/common/enums";

export interface PropertySearch {
  propertyID: string;
  propertyType: string;
  propertyCategory: PropertyCategory;
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
  images: string[];
  badges: string | null;
}
