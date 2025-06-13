"use client";

import React, { useState } from "react";

import { useDialog } from "@/providers/DialogContextProvider";

import MastHeadMobile from "./MastheadMobile";

const MastHeadMobileClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"rent" | "buy">("rent");
  const { openDialog } = useDialog();

  return (
    <MastHeadMobile
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      openDialog={openDialog}
    />
  );
};

export default MastHeadMobileClient;
