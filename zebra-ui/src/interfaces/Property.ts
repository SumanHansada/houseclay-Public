import { PropertyCategory, PropertyStatusEnum } from "@/common/enums";

import { AdditionalInfo } from "./AdditionalInfo";
import { FlatmateDetails } from "./FlatmateDetails";
import { LocalityDetails } from "./LocalityDetails";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyImage } from "./PropertyImage";
import { RentalDetails } from "./RentalDetails";
import { ResaleDetails } from "./ResaleDetails";

export interface PropertyInfo {
  propertyID: string;
  propertyCategory: PropertyCategory;
  price: string | null;
  location: string;
  bhkType: string;
  propertyState: PropertyStatusEnum;
  createdOn: string;
  updatedOn: string | null;
  availableFrom: string;
}

export interface PropertyUpdate {
  updateType: string;
  updateTime: string;
  updateBy: string;
  userType: string;
}

export interface PropertyResponseFormValues {
  propertyCategory: PropertyCategory;
  propertyDetails: PropertyDetails;
  localityDetails: LocalityDetails;
  additionalInfo: AdditionalInfo;
  rentalDetails?: RentalDetails;
  flatmateDetails?: FlatmateDetails;
  resaleDetails?: ResaleDetails;
  images: PropertyImage[];
}
