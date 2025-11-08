export interface PropertySearch {
  propertyID: string;
  propertyType: string;
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
}
