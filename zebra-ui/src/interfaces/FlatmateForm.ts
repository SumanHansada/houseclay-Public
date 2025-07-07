import { FlatmateDetails } from "./FlatmateDetails";
import { PropertyBase } from "./PropertyBase";

export interface FlatmateForm extends PropertyBase {
  flatmateDetails: FlatmateDetails;
}
