import { LucideIcon } from "lucide-react";

export const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number | null | undefined;
}) => {
  if (!value || value === "N/A") return null;

  return (
    <div className="flex gap-3 items-center">
      <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full">
        <Icon size={20} className="text-gray-600" />
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
};
