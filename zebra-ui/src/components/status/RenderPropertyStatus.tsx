import React, { JSX } from "react";

import { PropertyState } from "@/common/enums";
import { Pill } from "@/components/Pill";
import { isEnumValue } from "@/utils/core";

interface RenderPropertyStatusProps {
  status: string;
}

const statusMap: Record<PropertyState, JSX.Element> = {
  [PropertyState.PENDING_VERIFICATION]: (
    <Pill color="blue">Pending Verify</Pill>
  ),
  [PropertyState.PENDING_RE_VERIFICATION]: <Pill color="orange">Reported</Pill>,
  [PropertyState.PENDING_ROUTINE_CHECK]: (
    <Pill color="yellow">Routine Check</Pill>
  ),
  [PropertyState.ACTIVE]: <Pill color="green">Active</Pill>,
  [PropertyState.INACTIVE]: <Pill color="red">Inactive</Pill>,
};

export const RenderPropertyStatus: React.FC<RenderPropertyStatusProps> = ({
  status,
}) => {
  if (!isEnumValue(PropertyState, status)) {
    console.warn(`[RenderPropertyStatus] Invalid status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }

  return (
    statusMap[status as PropertyState] ?? <Pill color="gray">{status}</Pill>
  );
};
