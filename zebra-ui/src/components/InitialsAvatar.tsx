"use client";

import clsx from "clsx";
import React from "react";

import { getInitials } from "@/utils/core";

export interface InitialsAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  colour?: "gray" | "red" | "blue" | "green" | "neutral";
}

const SIZE_MAP = {
  xs: { box: "w-10 h-10", font: "text-lg" },
  sm: { box: "w-16 h-16", font: "text-3xl" },
  md: { box: "w-24 h-24", font: "text-5xl" },
  lg: { box: "w-32 h-32", font: "text-[60px]" },
  xl: { box: "w-40 h-40", font: "text-[90px]" },
} as const;

const COLOUR_MAP = {
  gray: "bg-gray-900",
  red: "bg-red-900",
  blue: "bg-blue-900",
  green: "bg-green-900",
  neutral: "bg-neutral-900",
} as const;

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = "md",
  colour = "neutral",
}) => {
  const { box, font } = SIZE_MAP[size];
  const initials = getInitials(name);

  return (
    <div
      className={clsx(
        box,
        COLOUR_MAP[colour],
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
