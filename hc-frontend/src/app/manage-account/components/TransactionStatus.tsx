import { CircleCheck, CircleX, Clock, HelpCircle } from "lucide-react";

import { PaymentFilterStatus } from "@/common/enums";

type AnyStatus = PaymentFilterStatus | string;

export const TransactionStatus = (status: AnyStatus) => {
  switch (status) {
    case PaymentFilterStatus.COMPLETED:
      return (
        <div className="inline-flex items-center gap-2">
          <CircleCheck size={25} className="text-white fill-green-600" />
          <span>Completed</span>
        </div>
      );
    case PaymentFilterStatus.FAILED:
      return (
        <div className="inline-flex items-center gap-2">
          <CircleX size={25} className="text-white fill-red-500" />
          <span>Failed</span>
        </div>
      );
    case PaymentFilterStatus.IN_PROGRESS:
      return (
        <div className="inline-flex items-center gap-2">
          <Clock size={20} className="text-orange-500" />
          <span>In Progress</span>
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-2 text-gray-500">
          <HelpCircle size={22} />
          <span>Unknown</span>
        </div>
      );
  }
};
