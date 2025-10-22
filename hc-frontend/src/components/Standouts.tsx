import StandoutsClient from "./StandoutsClient";
import { PropertyCardWithImages } from "@/interfaces/User";

interface StandoutsProps {
  properties: PropertyCardWithImages[];
}

const Standouts = (props: StandoutsProps) => {
  return <StandoutsClient {...props} />;
};

export default Standouts;
