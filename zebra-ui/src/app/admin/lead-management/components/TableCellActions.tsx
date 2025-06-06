import { ChevronsRight, Eye } from "lucide-react";

interface TableCellActionsProps {
  viewLeadDetails: () => void;
  viewUserProfile: () => void;
}

export const TableCellActions: React.FC<TableCellActionsProps> = ({
  viewLeadDetails,
  viewUserProfile,
}) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={viewUserProfile}
        className="relative group flex items-center cursor-pointer"
      >
        <Eye className="text-gray-600" />

        <div className="absolute bottom-full left-1/2 mb-px hidden w-max -translate-x-1/2 rounded-xl bg-gray-300 px-3 py-2 text-sm group-hover:block">
          View user profile
        </div>
      </button>
      <button
        onClick={viewLeadDetails}
        className="relative group flex items-center cursor-pointer"
      >
        <ChevronsRight className="text-gray-600" />
        {/* <CircleArrowRight /> */}

        <div className="absolute bottom-full left-1/2 mb-px hidden w-max -translate-x-1/2 rounded-xl bg-gray-300 px-3 py-2 text-sm group-hover:block">
          View lead details
        </div>
      </button>
    </div>
  );
};
