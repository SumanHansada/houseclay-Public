interface TableActionButtonsProps {
  viewLeadDetails: () => void;
  viewUserProfile: () => void;
  leadId: number;
}

export const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  viewLeadDetails,
  viewUserProfile,
  leadId,
}) => {
  return (
    <div className="flex gap-3 w-fit">
      <button
        data-testid={`view-user-${leadId}`}
        onClick={viewUserProfile}
        className="group flex items-center cursor-pointer bg-teal-600 rounded-lg px-[8px] py-[4px] gap-2 text-white"
      >
        View User
      </button>
      <button
        data-testid={`view-lead-${leadId}`}
        onClick={viewLeadDetails}
        className="flex items-center cursor-pointer bg-red-600 rounded-lg px-[8px] py-[4px] gap-2 text-white"
      >
        View Lead
      </button>
    </div>
  );
};
