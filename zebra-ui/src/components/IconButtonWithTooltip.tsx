import { LucideIcon } from "lucide-react";
import React from "react";

interface BaseIconButtonProps {
  onClick: () => void;
  Icon: LucideIcon;
  classNameIconWrapper?: string;
  classNameIconCustomize?: string;
}

interface IconWithTooltip extends BaseIconButtonProps {
  tooltipActive: true;
  tooltip: string;
}

interface IconWithoutTooltip extends BaseIconButtonProps {
  tooltipActive?: false;
  tooltip?: never;
}

type IconButtonWithTooltipProps = IconWithTooltip | IconWithoutTooltip;

const IconButtonWithTooltip: React.FC<IconButtonWithTooltipProps> = ({
  onClick,
  Icon,
  tooltip,
  tooltipActive = false,
  classNameIconWrapper = "",
  classNameIconCustomize = "",
}) => {
  const tooltipClasses = [
    "absolute",
    "bottom-full",
    "left-1/2",
    "mb-1",
    "w-max",
    "-translate-x-1/2",
    "rounded-md",
    "bg-gray-500",
    "px-2",
    "py-1",
    "text-sm",
    "text-white",
    "whitespace-nowrap",
  ];

  const wrapperClasses = [
    "relative",
    "flex",
    "items-center",
    "cursor-pointer",
    classNameIconWrapper,
    tooltipActive ? "group" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} className={wrapperClasses}>
      <Icon className={`${classNameIconCustomize} text-gray-600`} />

      {tooltipActive && (
        <div className={`${tooltipClasses.join(" ")} hidden group-hover:block`}>
          {tooltip}
        </div>
      )}
    </button>
  );
};

export default IconButtonWithTooltip;
