import { PropertyCategory, PropertyListingType } from "@/common/enums";

import { FormValues } from "./FormValues";
import { PropertyImage } from "./PropertyImage";

export interface ListPropertyState {
  propertyID: string;
  propertyImagesS3Url: Record<string, string>;
  propertyCategory: PropertyCategory;
  listingType: PropertyListingType;
  propertyImages: PropertyImage[];
  form: {
    isValid: boolean;
    data?: Partial<FormValues>;
  };
}
