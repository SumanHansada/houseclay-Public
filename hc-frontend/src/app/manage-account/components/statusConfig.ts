import { CircleCheck, CircleX, Clock, HelpCircle } from "lucide-react";

import { PaymentFilterStatus } from "@/common/enums";

export const statusConfig = {
  [PaymentFilterStatus.COMPLETED]: {
    icon: CircleCheck,
    iconSize: 25,
    iconClassName: "text-white fill-green-600",
    label: "Completed",
    textClassName: "",
  },
  [PaymentFilterStatus.FAILED]: {
    icon: CircleX,
    iconSize: 25,
    iconClassName: "text-white fill-red-500",
    label: "Failed",
    textClassName: "",
  },
  [PaymentFilterStatus.IN_PROGRESS]: {
    icon: Clock,
    iconSize: 20,
    iconClassName: "text-orange-500",
    label: "In Progress",
    textClassName: "",
  },
  default: {
    icon: HelpCircle,
    iconSize: 22,
    iconClassName: "",
    label: "Unknown",
    textClassName: "text-gray-500",
  },
} as const;

// Helper function to get status config
export const getStatusConfig = (status: PaymentFilterStatus | string) => {
  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.default
  );
};
