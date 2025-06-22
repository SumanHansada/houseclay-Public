import React from "react";

export interface PillProps {
  color: string;
  children: React.ReactNode;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ color, children, className = "" }) => {
  const base = "px-2 py-1 rounded-full inline-block";
  const bg = `bg-${color}-200`;
  const border = `border border-${color}-900`;
  const text = `text-${color}-900`;

  return (
    <span className={`${base} ${bg} ${border} ${text} ${className}`.trim()}>
      {children}
    </span>
  );
};

export default Pill;
