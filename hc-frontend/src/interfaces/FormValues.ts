import { AdditionalInfo } from "./AdditionalInfo";
import { FlatmateDetails } from "./FlatmatesDetails";
import { LocalityDetails } from "./LocalityDetails";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyImage } from "./PropertyImage";
import { RentalDetails } from "./RentalDetails";
import { ResaleDetails } from "./ResaleDetails";

export interface FormValues {
  propertyDetails: PropertyDetails;
  localityDetails: LocalityDetails;
  rentalDetails: RentalDetails;
  flatmateDetails: FlatmateDetails;
  resaleDetails: ResaleDetails;
  additionalInfo: AdditionalInfo;
  images: PropertyImage[];
}
