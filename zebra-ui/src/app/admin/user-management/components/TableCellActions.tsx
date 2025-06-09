import { Eye } from "lucide-react";

interface TableCellActionsProps {
  viewProfile: () => void;
}

export const TableCellActions: React.FC<TableCellActionsProps> = ({
  viewProfile,
}) => {
  return (
    <button
      onClick={viewProfile}
      className="relative group flex items-center cursor-pointer"
    >
      <Eye className="text-gray-600" />

      {/* Tooltip bubble: hidden by default */}
      <div className="absolute bottom-full left-1/2 mb-px hidden w-max -translate-x-1/2 rounded-xl bg-gray-300 px-3 py-2 text-sm group-hover:block">
        View profile
      </div>
    </button>
  );
};
