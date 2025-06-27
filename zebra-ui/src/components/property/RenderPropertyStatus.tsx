import React, { JSX } from "react";

import Pill from "@/components/Pill";
import { PropertyStatusEnum } from "@/interfaces/Property";

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
  const key = status as PropertyStatusEnum;
  const pill = statusMap[key];

  if (!pill) {
    console.warn(`[RenderPropertyStatus] Unknown status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }

  return pill;
};
