"use client";

import { LeadType, TLead } from "@/common/Types";
import { LeadDetails } from "../../../components/LeadDetails";
import { default as LeadData } from "@/mock/dummyData.json";
import { notFound } from "next/navigation";
import { use } from "react";

interface TParams {
  params: Promise<{ type: LeadType; id: string }>;
}

export const dynamicParams = true;

export default function LeadManagementIdRootPage({ params }: TParams) {
  const { type, id } = use(params);
  const leads: TLead[] = LeadData;
  const currentLead = leads.find((lead) => lead?.id === id);

  if (!currentLead || currentLead.type !== type) {
    return notFound();
  }
  return <LeadDetails lead={currentLead} />;
}
