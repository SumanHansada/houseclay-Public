import React, { JSX } from "react";

import { PropertyStatusEnum } from "@/common/enums";
import { Pill } from "@/components/Pill";
import { isEnumValue } from "@/utils/core";

interface RenderPropertyStatusProps {
  status: string;
}

const statusMap: Record<PropertyStatusEnum, JSX.Element> = {
  [PropertyStatusEnum.PENDING]: <Pill color="blue">Pending</Pill>,
  [PropertyStatusEnum.VERIFIED]: <Pill color="green">Verified</Pill>,
  [PropertyStatusEnum.REPORT]: <Pill color="red">Reported</Pill>,
};

export const RenderPropertyStatus: React.FC<RenderPropertyStatusProps> = ({
  status,
}) => {
  if (!isEnumValue(PropertyStatusEnum, status)) {
    console.warn(`[RenderPropertyStatus] Invalid status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }

  return statusMap[status];
};
