import { PropertyListingType, PropertyType } from "@/common/enums";

import { AdditionalInfo } from "./AdditionalInfo";
import { LocalityDetails } from "./LocalityDetails";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyPhoto } from "./PropertyPhoto";
import { RentalDetails } from "./RentalDetails";
import { ResaleDetails } from "./ResaleDetails";

export interface ListPropertyState {
  propertyID: string;
  propertyType: PropertyType;
  listingType: PropertyListingType;
  rentForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
      rentalDetails: RentalDetails;
      images: PropertyPhoto[];
      additionalInfo: AdditionalInfo;
      resaleDetails: ResaleDetails;
    };
  };
  resaleForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
      rentalDetails: RentalDetails;
      images: PropertyPhoto[];
      additionalInfo: AdditionalInfo;
      resaleDetails: ResaleDetails;
    };
  };
  flatmatesForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
      rentalDetails: RentalDetails;
      images: PropertyPhoto[];
      additionalInfo: AdditionalInfo;
      resaleDetails: ResaleDetails;
    };
  };
}
