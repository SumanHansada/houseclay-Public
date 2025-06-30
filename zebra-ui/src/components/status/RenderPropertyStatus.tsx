import React, { JSX } from "react";

import Pill from "@/components/Pill";
import { PropertyStatusEnum } from "@/common/enums";

interface RenderPropertyStatusProps {
  status: string;
}

function isValidStatus(status: string): status is PropertyStatusEnum {
  return Object.values(PropertyStatusEnum).includes(
    status as PropertyStatusEnum,
  );
}

const statusMap: Record<PropertyStatusEnum, JSX.Element> = {
  [PropertyStatusEnum.PENDING]: <Pill color="blue">Pending</Pill>,
  [PropertyStatusEnum.VERIFIED]: <Pill color="green">Verified</Pill>,
  [PropertyStatusEnum.REPORT]: <Pill color="red">Reported</Pill>,
};

export const RenderPropertyStatus: React.FC<RenderPropertyStatusProps> = ({
  status,
}) => {
  if (!isValidStatus(status)) {
    console.warn(`[RenderPropertyStatus] Invalid status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }

  return statusMap[status];
};
