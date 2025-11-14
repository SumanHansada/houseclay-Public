import React, { JSX } from "react";

import { PropertyStatus } from "@/common/enums";
import { isEnumValue } from "@/common/utils";
import { Pill } from "@/components/Pill";

interface RenderPropertyStatusProps {
  status: string;
}

const statusMap: Record<PropertyStatus, JSX.Element> = {
  [PropertyStatus.PENDING]: (
    <Pill color="blue" className="text-lg">
      Pending
    </Pill>
  ),
  [PropertyStatus.VERIFIED]: (
    <Pill color="green" className="text-lg">
      Verified
    </Pill>
  ),
  [PropertyStatus.REPORT]: (
    <Pill color="orange" className="text-lg">
      Reported
    </Pill>
  ),
  [PropertyStatus.INACTIVE]: (
    <Pill color="red" className="text-lg">
      Inactive
    </Pill>
  ),
};

export const RenderPropertyStatus: React.FC<RenderPropertyStatusProps> = ({
  status,
}) => {
  if (!isEnumValue(PropertyStatus, status)) {
    console.warn(`[RenderPropertyStatus] Invalid status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }

  return statusMap[status];
};
