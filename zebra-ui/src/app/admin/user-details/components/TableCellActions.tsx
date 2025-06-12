import { Eye, Pencil } from "lucide-react";

interface TableCellActionsProps {
  viewDetails: () => void;
}

export const TableCellActions: React.FC<TableCellActionsProps> = ({
  viewDetails,
}) => {
  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={() => console.log("Edit Property")}
        className="relative group flex items-center cursor-pointer"
      >
        <Pencil className="text-gray-600 size-5" />

        {/* Tooltip bubble: hidden by default */}
        <div className="absolute bottom-full left-1/2 mb-px hidden w-max -translate-x-1/2 rounded-xl bg-gray-300 px-3 py-2 text-sm group-hover:block">
          Edit details
        </div>
      </button>
      <button
        onClick={viewDetails}
        className="relative group flex items-center cursor-pointer"
      >
        <Eye className="text-gray-600 size-6" />

        {/* Tooltip bubble: hidden by default */}
        <div className="absolute bottom-full left-1/2 mb-px hidden w-max -translate-x-1/2 rounded-xl bg-gray-300 px-3 py-2 text-sm group-hover:block">
          View details
        </div>
      </button>
    </div>
  );
};
