import { Eye } from "lucide-react";

interface ActionMenuProps {
  viewProfile: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ viewProfile }) => {
  return (
    <button
      onClick={viewProfile}
      className="cursor-pointer ml-5 flex items-center"
    >
      <Eye />
    </button>
  );
};
