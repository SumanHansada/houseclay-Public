interface TableCellActionsProps {
  viewLeadDetails: () => void;
  viewUserProfile: () => void;
}

export const TableCellActions: React.FC<TableCellActionsProps> = ({
  viewLeadDetails,
  viewUserProfile,
}) => {
  return (
    <div className="flex gap-3 w-fit">
      <button
        onClick={viewUserProfile}
        className="group flex items-center cursor-pointer bg-teal-600 rounded-lg px-[8px] py-[4px] gap-2 text-white"
      >
        View User
      </button>
      <button
        onClick={viewLeadDetails}
        className="flex items-center cursor-pointer bg-red-600 rounded-lg px-[8px] py-[4px] gap-2 text-white"
      >
        View Lead
      </button>
    </div>
  );
};
