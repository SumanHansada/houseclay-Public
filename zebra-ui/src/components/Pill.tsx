import clsx from "clsx";

const COLOUR_MAP = {
  red: ["bg-red-200", "border-red-400", "text-red-900"],
  green: ["bg-green-200", "border-green-400", "text-green-900"],
  blue: ["bg-blue-200", "border-blue-400", "text-blue-900"],
  orange: ["bg-orange-200", "border-orange-400", "text-orange-900"],
  yellow: ["bg-yellow-200", "border-yellow-400", "text-yellow-900"],
  gray: ["bg-gray-200", "border-gray-400", "text-gray-900"],
} as const;

type PillColour = keyof typeof COLOUR_MAP;

interface PillProps {
  color: PillColour;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const Pill: React.FC<PillProps> = ({
  color,
  children,
  className,
  testId,
}) => (
  <span
    data-testid={testId}
    className={clsx(
      "px-2 py-1 rounded-full inline-block border",
      COLOUR_MAP[color],
      className,
    )}
  >
    {children}
  </span>
);
