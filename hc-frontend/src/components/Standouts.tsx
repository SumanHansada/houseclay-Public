import { PropertyCardWithImages } from "@/interfaces/User";

import StandoutsClient from "./StandoutsClient";

interface StandoutsProps {
  properties: PropertyCardWithImages[];
}

const Standouts = (props: StandoutsProps) => {
  return <StandoutsClient {...props} />;
};

export default Standouts;
