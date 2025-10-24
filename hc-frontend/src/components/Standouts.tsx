import { PropertySearch } from "@/interfaces/PropertySearch";
import StandoutsClient from "./StandoutsClient";
import { PropertyCardWithImages } from "@/interfaces/User";

interface StandoutsProps {
  properties: PropertySearch[];
  // properties: PropertyCardWithImages[];
}

const Standouts = (props: StandoutsProps) => {
  return <StandoutsClient {...props} />;
};

export default Standouts;
