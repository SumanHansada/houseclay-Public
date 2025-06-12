import { PaymentStatusEnum } from "@/interfaces/User";

interface RenderPaymentStatusProps {
  status: PaymentStatusEnum;
}

export const RenderPaymentStatus: React.FC<RenderPaymentStatusProps> = ({
  status,
}) => {
  const renderStatus = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.PROGRESS:
        return (
          <div className="px-[8px] py-[4px] bg-blue-200 border border-blue-900 text-blue-900 rounded-full w-fit">
            In Progress
          </div>
        );
      case PaymentStatusEnum.COMPLETED:
        return (
          <div className="px-[8px] py-[4px] bg-green-200 border border-green-900 text-green-900 rounded-full w-fit">
            Completed
          </div>
        );
      case PaymentStatusEnum.FAILED:
        return (
          <div className="px-[8px] py-[4px] bg-red-200 border border-red-900 text-red-900 rounded-full w-fit">
            Failed
          </div>
        );
      default:
        return null;
    }
  };

  return renderStatus(status);
};
