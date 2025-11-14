import React, { JSX } from "react";

import { PropertyStatus } from "@/common/enums";
import { Pill } from "@/components/Pill";
import { isEnumValue } from "@/utils/core";

interface RenderPropertyStatusProps {
  status: string;
}

const statusMap: Record<PropertyStatus, JSX.Element> = {
  [PropertyStatus.PENDING]: <Pill color="blue">Pending</Pill>,
  [PropertyStatus.VERIFIED]: <Pill color="green">Verified</Pill>,
  [PropertyStatus.REPORT]: <Pill color="orange">Reported</Pill>,
  [PropertyStatus.INACTIVE]: <Pill color="red">Inactive</Pill>,
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
