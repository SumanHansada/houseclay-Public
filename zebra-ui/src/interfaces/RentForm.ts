import { PropertyBase } from "./PropertyBase";
import { RentalDetails } from "./RentalDetails";

export interface RentForm extends PropertyBase {
  rentalDetails: RentalDetails;
}
