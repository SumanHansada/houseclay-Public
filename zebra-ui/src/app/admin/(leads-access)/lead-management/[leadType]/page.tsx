import { Metadata } from "next";
import { notFound } from "next/navigation";

import { LEAD_TYPE_MAP, LeadType } from "@/interfaces/Lead";

import { LeadTableView } from "./LeadTableView";

interface PageProps {
  params: Promise<{
    leadType: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { leadType } = await params;
  const isValid = Object.keys(LEAD_TYPE_MAP).includes(leadType);
  if (!isValid) return { title: "Lead Management" };
  const title = leadType.charAt(0).toUpperCase() + leadType.slice(1);
  return {
    title: `Leads Management - ${title}`,
  };
}

export default async function LeadsPage({ params }: PageProps) {
  const { leadType } = await params;
  if (!Object.keys(LEAD_TYPE_MAP).includes(leadType)) {
    return notFound();
  }
  const validLeadType = leadType as LeadType;

  return <LeadTableView leadType={validLeadType} />;
}
