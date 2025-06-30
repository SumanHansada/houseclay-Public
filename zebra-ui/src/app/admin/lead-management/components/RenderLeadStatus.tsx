import { JSX } from "react";

import Pill from "@/components/Pill";
import { LeadStatusEnum } from "@/interfaces/Lead";

interface RenderLeadStatusProps {
  status: string;
}

function isValidStatus(status: string): status is LeadStatusEnum {
  return Object.values(LeadStatusEnum).includes(status as LeadStatusEnum);
}

const statusMap: Record<LeadStatusEnum, JSX.Element> = {
  [LeadStatusEnum.NEW]: <Pill color="blue">New Lead</Pill>,
  [LeadStatusEnum.FOLLOW_UP]: <Pill color="red">Follow Up</Pill>,
  [LeadStatusEnum.RESOLVED]: <Pill color="green">Resolved</Pill>,
};

export const RenderLeadStatus: React.FC<RenderLeadStatusProps> = ({
  status,
}) => {
  if (!isValidStatus(status)) {
    console.warn(`[RenderLeadStatus] Invalid status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }

  return statusMap[status];
};
