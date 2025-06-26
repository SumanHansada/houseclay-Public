import React from "react";

import Pill from "@/components/Pill";

interface RenderUserStatusProps {
  isBlacklisted: boolean;
}

export const RenderUserStatus: React.FC<RenderUserStatusProps> = ({
  isBlacklisted,
}) => {
  switch (isBlacklisted) {
    case true:
      return <Pill color="red">Blocked</Pill>;
    case false:
      return <Pill color="green">Active</Pill>;
    default:
      return;
  }
};
