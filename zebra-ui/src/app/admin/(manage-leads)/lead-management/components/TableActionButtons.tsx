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
        className="cursor-pointer bg-gray-500 rounded-lg px-2 py-0.5 text-white text-base"
      >
        View User
      </button>
      <button
        data-testid={`view-lead-${leadId}`}
        onClick={viewLeadDetails}
        className="cursor-pointer bg-red-500 rounded-lg px-2 py-0.5 text-white text-base"
      >
        View Lead
      </button>
    </div>
  );
};
