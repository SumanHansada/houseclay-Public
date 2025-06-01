"use client";
import { Eye } from "lucide-react";

interface ActionMenuProps {
  viewProfile: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ viewProfile }) => {
  return (
    <button
      onClick={viewProfile}
      className="px-3 py-2 rounded-full cursor-pointer hover:bg-gray-300"
    >
      <Eye />
    </button>
  );
};
