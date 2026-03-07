import { PropertyCategory, PropertyState } from "@/common/enums";

export interface PropertyInfo {
  propertyID: string;
  propertyCategory: PropertyCategory;
  price: string | null;
  location: string;
  bhkType: string;
  propertyState: PropertyState;
  createdOn: string;
  updatedOn: string | null;
  availableFrom: string;
}
