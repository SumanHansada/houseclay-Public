"use client";

import React, { useState } from "react";

import MastheadDesktop from "./MastheadDesktop";

const MastheadDesktopClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"rent" | "sale">("rent");

  return <MastheadDesktop activeTab={activeTab} setActiveTab={setActiveTab} />;
};

export default MastheadDesktopClient;
