import { LeadStatusEnum } from "@/interfaces/Lead";

interface RenderLeadStatusProps {
  status: LeadStatusEnum;
}

export const RenderLeadStatus: React.FC<RenderLeadStatusProps> = ({
  status,
}) => {
  const renderStatus = (status: LeadStatusEnum) => {
    switch (status) {
      case LeadStatusEnum.NEW:
        return (
          <div className="px-[10px] py-[6px] bg-blue-200 border border-blue-900 text-blue-900 rounded-full w-fit">
            New Lead
          </div>
        );
      case LeadStatusEnum.FOLLOW_UP:
        return (
          <div className="px-[10px] py-[6px] bg-red-200 border border-red-900 text-red-900 rounded-full w-fit">
            Follow Up
          </div>
        );
      case LeadStatusEnum.RESOLVED:
        return (
          <div className="px-[10px] py-[6px] bg-green-200 border border-green-900 text-green-900 rounded-full w-fit">
            Resolved
          </div>
        );
      default:
        return null;
    }
  };

  return renderStatus(status);
};
