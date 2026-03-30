import { PropertyCategory, PropertyState } from "@/common/enums";

export interface PropertySearch {
  propertyID: string;
  propertyType: string;
  propertyState: PropertyState;
  propertyCategory: PropertyCategory;
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
  images: string[];
  badges: string | null;
  createdOn: number;
  availableFrom: number | null;
  updatedOn: number | null;
}
