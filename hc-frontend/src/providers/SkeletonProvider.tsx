import "react-loading-skeleton/dist/skeleton.css";

import React, { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

interface SkeletonProviderProps {
  children: ReactNode;
  baseColor?: string;
  highlightColor?: string;
}

export const SkeletonProvider: React.FC<SkeletonProviderProps> = ({
  children,
  baseColor = "#e5e7eb", // Tailwind gray-200
  highlightColor = "#f3f4f6", // Tailwind gray-100
}) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      {children}
    </SkeletonTheme>
  );
};
