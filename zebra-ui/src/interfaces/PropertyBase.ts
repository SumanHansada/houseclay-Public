import { AdditionalInfo } from "./AdditionalInfo";
import { LocalityDetails } from "./LocalityDetails";
import { PropertyDetails } from "./PropertyDetails";

export interface PropertyBase {
  propertyDetails: PropertyDetails;
  localityDetails: LocalityDetails;
  images: string[];
  additionalInfo: AdditionalInfo;
}
