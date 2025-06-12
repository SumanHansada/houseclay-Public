import { PropertyStatusEnum } from "@/interfaces/Property";

interface RenderPropertyStatusProps {
  status: PropertyStatusEnum;
}

export const RenderPropertyStatus: React.FC<RenderPropertyStatusProps> = ({
  status,
}) => {
  const renderStatus = (status: PropertyStatusEnum) => {
    switch (status) {
      case PropertyStatusEnum.PENDING:
        return (
          <div className="px-[8px] py-[4px] bg-blue-200 border border-blue-900 text-blue-900 rounded-full w-fit">
            Pending
          </div>
        );
      case PropertyStatusEnum.VERIFIED:
        return (
          <div className="px-[8px] py-[4px] bg-green-200 border border-green-900 text-green-900 rounded-full w-fit">
            Verified
          </div>
        );
      case PropertyStatusEnum.REPORTED:
        return (
          <div className="px-[8px] py-[4px] bg-red-200 border border-red-900 text-red-900 rounded-full w-fit">
            Reported
          </div>
        );
      default:
        return null;
    }
  };

  return renderStatus(status);
};
