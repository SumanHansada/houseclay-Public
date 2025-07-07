import { PropertyCategoryEnum, PropertyListingType } from "@/common/enums";

import { FlatmateForm } from "./FlatmateForm";
import { PropertyImage } from "./PropertyImage";
import { RentForm } from "./RentForm";
import { ResaleForm } from "./ResaleForm";

export interface ListPropertyState {
  propertyID: string;
  propertyImagesS3Url: Record<string, string>;
  propertyCategory: PropertyCategoryEnum;
  listingType: PropertyListingType;
  propertyImages: PropertyImage[];
  form: {
    isValid: boolean;
    data?: Partial<RentForm | ResaleForm | FlatmateForm>;
  };
}
