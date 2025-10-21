import { PropertySearch } from "@/interfaces/PropertySearch";

import StandoutsClient from "./StandoutsClient";

interface StandoutsProps {
  properties: PropertySearch[];
}

const Standouts = (props: StandoutsProps) => {
  return <StandoutsClient {...props} />;
};

export default Standouts;
