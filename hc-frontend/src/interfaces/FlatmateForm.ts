import { FlatmateDetails } from "./FlatmatesDetails";
import { PropertyBase } from "./PropertyBase";

export interface FlatmateForm extends PropertyBase {
  flatmateDetails: FlatmateDetails;
}
