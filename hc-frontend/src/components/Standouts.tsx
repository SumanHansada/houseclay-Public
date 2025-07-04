import { PropertyCategory } from "@/common/enums";
import { PropertySearch } from "@/interfaces/PropertySearch";

import StandoutsClient from "./StandoutsClient";

interface StandoutsProps {
  properties: PropertySearch[];
  listingType: string;
  setActiveTab: (tab: PropertyCategory) => void;
}

const Standouts = (props: StandoutsProps) => {
  return <StandoutsClient {...props} />;
};

export default Standouts;
