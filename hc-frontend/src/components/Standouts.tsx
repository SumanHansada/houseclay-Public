import { Property } from "@/interfaces/Property";

import StandoutsClient from "./StandoutsClient";

interface StandoutsProps {
  properties: Property[];
  listingType: string;
  setActiveTab: (tab: "rent" | "sale") => void;
}

const Standouts = (props: StandoutsProps) => {
  return <StandoutsClient {...props} />;
};

export default Standouts;
