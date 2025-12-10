import { LucideIcon } from "lucide-react";

interface PropertyDetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null | undefined;
}

export const PropertyDetailItem = ({
  icon: Icon,
  label,
  value,
}: PropertyDetailItemProps) => {
  // Return null if no value, keeping the UI clean
  if (!value || value === "N/A") return null;

  return (
    <div className="flex w-full items-center gap-2 md:gap-3">
      <div className="flex-shrink-0 flex items-center justify-center md:w-8 md:h-8 md:bg-gray-50 md:rounded-full">
        <Icon size={20} className="text-gray-600" />
      </div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-nunito">{label}</span>
        <span className="text-sm font-semibold text-gray-900 font-nunito md:text-base md:font-medium">
          {value}
        </span>
      </div>
    </div>
  );
};
