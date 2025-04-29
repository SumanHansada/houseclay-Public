import { AdditionalInfo } from "./AdditionalInfo";
import { LocalityDetails } from "./LocalityDetails";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyPhoto } from "./PropertyPhoto";
import { RentalDetails } from "./RentalDetails";
import { ResaleDetails } from "./ResaleDetails";

export interface FormValues {
  propertyDetails: PropertyDetails;
  localityDetails: LocalityDetails;
  rentalDetails: RentalDetails;
  resaleDetails: ResaleDetails;
  additionalInfo: AdditionalInfo;
  images: PropertyPhoto[];
}
