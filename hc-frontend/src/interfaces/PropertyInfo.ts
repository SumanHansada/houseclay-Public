import { PropertyCategory, PropertyStatus } from "@/common/enums";

export interface PropertyInfo {
  propertyID: string;
  propertyCategory: PropertyCategory;
  price: string | null;
  location: string;
  bhkType: string;
  propertyState: PropertyStatus;
  createdOn: string;
  updatedOn: string | null;
  availableFrom: string;
}
