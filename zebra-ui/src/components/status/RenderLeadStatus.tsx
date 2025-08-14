import { JSX } from "react";

import { LeadStatusEnum } from "@/common/enums";
import { Pill } from "@/components/Pill";
import { isEnumValue } from "@/utils/core";

interface RenderLeadStatusProps {
  status: string;
}

const statusMap: Record<LeadStatusEnum, JSX.Element> = {
  [LeadStatusEnum.NEW]: (
    <Pill color="blue" testId={`status-pill-${LeadStatusEnum.NEW}`}>
      New Lead
    </Pill>
  ),
  [LeadStatusEnum.FOLLOW_UP]: (
    <Pill color="red" testId={`status-pill-${LeadStatusEnum.FOLLOW_UP}`}>
      Follow Up
    </Pill>
  ),
  [LeadStatusEnum.RESOLVED]: (
    <Pill color="green" testId={`status-pill-${LeadStatusEnum.RESOLVED}`}>
      Resolved
    </Pill>
  ),
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
