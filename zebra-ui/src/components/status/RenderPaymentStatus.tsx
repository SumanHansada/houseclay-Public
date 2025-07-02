import { PaymentStatusEnum } from "@/common/enum";
import { Pill } from "@/components/Pill";
import { isEnumValue } from "@/utils/enum";
import { JSX } from "react";

interface RenderPaymentStatusProps {
  status: PaymentStatusEnum;
}

const statusMap: Record<PaymentStatusEnum, JSX.Element> = {
  [PaymentStatusEnum.PROGRESS]: <Pill color="blue">In Progress</Pill>,
  [PaymentStatusEnum.COMPLETED]: <Pill color="green">Completed</Pill>,
  [PaymentStatusEnum.FAILED]: <Pill color="red">Failed</Pill>,
};

export const RenderPaymentStatus: React.FC<RenderPaymentStatusProps> = ({
  status,
}) => {
  if (!isEnumValue(PaymentStatusEnum, status)) {
    console.warn(`[RenderPaymentStatus] Invalid status: "${status}"`);
    return <Pill color="gray">Unknown</Pill>;
  }
  return statusMap[status];
};
