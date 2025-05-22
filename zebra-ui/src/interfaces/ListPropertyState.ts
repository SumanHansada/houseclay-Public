import { PropertyListingType, PropertyType } from "@/common/enums";

import { AdditionalInfo } from "./AdditionalInfo";
import { FlatmatesDetails } from "./FlatmatesDetails";
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
      resaleDetails?: ResaleDetails;
      flatmatesDetails?: FlatmatesDetails;
    };
  };
  resaleForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
      resaleDetails: ResaleDetails;
      images: PropertyPhoto[];
      additionalInfo: AdditionalInfo;
      rentalDetails?: RentalDetails;
      flatmatesDetails?: FlatmatesDetails;
    };
  };
  flatmatesForm: {
    isValid: boolean;
    data?: {
      propertyDetails: PropertyDetails;
      localityDetails: LocalityDetails;
      flatmatesDetails: FlatmatesDetails;
      images: PropertyPhoto[];
      additionalInfo: AdditionalInfo;
      resaleDetails?: ResaleDetails;
      rentalDetails?: RentalDetails;
    };
  };
}
