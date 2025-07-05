import { JSX } from "react";

import { LeadStatusEnum } from "@/common/enum";
import { Pill } from "@/components/Pill";
import { isEnumValue } from "@/utils/enum";

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
  if (!isEnumValue(LeadStatusEnum, status)) {
    console.warn(`[RenderLeadStatus] Invalid status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }

  return statusMap[status];
};
