import { PropertyBase } from "./PropertyBase";
import { ResaleDetails } from "./ResaleDetails";

export interface ResaleForm extends PropertyBase {
  resaleDetails: ResaleDetails;
}
