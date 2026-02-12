import { LucideIcon } from "lucide-react";
import React from "react";

import { Popover } from "@/utility-components";

interface IconButtonWithTooltipProps {
  icon: LucideIcon;
  tooltip: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  testId?: string;
  className?: string;
  iconClassName?: string;
}

const IconButtonWithTooltip: React.FC<IconButtonWithTooltipProps> = ({
  icon: Icon,
  tooltip,
  onClick,
  testId,
  className = "",
  iconClassName = "size-5 text-gray-600",
}) => {
  return (
    <Popover
      id={`tooltip-${Math.random()}`}
      trigger="hover"
      align="center"
      offset={0}
      portal={true}
      zIndex={50}
      className="inline-flex"
      panelClassName="bg-gray-500 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap"
      content={tooltip}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        aria-label={tooltip}
        data-testid={testId}
        className={`relative flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-100 rounded-full p-1.5 ${className}`}
      >
        <Icon className={iconClassName} />
      </button>
    </Popover>
  );
};

export default IconButtonWithTooltip;
