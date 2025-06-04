"use client";

import { LeadType, TLead } from "@/interfaces/Lead";
import { LeadDetails } from "../../../components/LeadDetails";
import { use } from "react";

interface TParams {
  params: Promise<{ type: LeadType; id: number }>;
}

export const dynamicParams = true;

export default function LeadManagementIdRootPage({ params }: TParams) {
  const { type, id } = use(params);
  return <LeadDetails leadType={type} leadId={id} />;
}
