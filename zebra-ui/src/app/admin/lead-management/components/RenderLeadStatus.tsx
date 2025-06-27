import { JSX } from "react";

import Pill from "@/components/Pill";
import { LeadStatusEnum } from "@/interfaces/Lead";

interface RenderLeadStatusProps {
  status: string;
}

const statusMap: Record<LeadStatusEnum, JSX.Element> = {
  [LeadStatusEnum.NEW]: <Pill color="blue">New Lead</Pill>,
  [LeadStatusEnum.FOLLOW_UP]: <Pill color="red">Follow Up</Pill>,
  [LeadStatusEnum.RESOLVED]: <Pill color="green">Resolved</Pill>,
};

export const RenderLeadStatus: React.FC<RenderLeadStatusProps> = ({
  status,
}) => {
  const key = status as LeadStatusEnum;
  const pill = statusMap[key];

  if (!pill) {
    console.warn(`[RenderPropertyStatus] Unknown status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }

  return pill;
};
