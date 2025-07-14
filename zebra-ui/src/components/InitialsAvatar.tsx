"use client";

import clsx from "clsx";
import React from "react";

import { getInitials } from "@/utils/core";

export interface InitialsAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  colour?: "gray-900" | "red-600" | "blue-600" | "green-600";
}

const SIZE_MAP = {
  xs: { box: "w-10 h-10", font: "text-lg" },
  sm: { box: "w-16 h-16", font: "text-3xl" },
  md: { box: "w-24 h-24", font: "text-5xl" },
  lg: { box: "w-32 h-32", font: "text-[60px]" },
  xl: { box: "w-40 h-40", font: "text-[90px]" },
} as const;

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = "md",
  colour = "gray-900",
}) => {
  const { box, font } = SIZE_MAP[size];
  const initials = getInitials(name);

  return (
    <div
      className={clsx(
        box,
        `bg-${colour}`,
        "rounded-full flex items-center justify-center select-none",
      )}
      aria-label={`Avatar for ${name}`}
    >
      <span className={clsx("text-white font-medium leading-none", font)}>
        {initials}
      </span>
    </div>
  );
};
