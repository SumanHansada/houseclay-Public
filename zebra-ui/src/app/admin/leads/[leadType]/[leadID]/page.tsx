import { Metadata } from "next";
import { notFound } from "next/navigation";

import { LEAD_TYPE_MAP, LeadType } from "@/interfaces/Lead";

import { LeadDetailsView } from "./LeadDetailsView";

interface PageProps {
  params: Promise<{
    leadType: string;
    leadID: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { leadType, leadID } = await params;
  const isValid = Object.keys(LEAD_TYPE_MAP).includes(leadType);

  if (!isValid) return { title: "Lead Details" };

  const typeName = leadType.charAt(0).toUpperCase() + leadType.slice(1);

  return {
    title: `${typeName} Leads - Lead #${leadID}`,
  };
}

export default async function LeadDetailsPage({ params }: PageProps) {
  const { leadType, leadID } = await params;
  if (!Object.keys(LEAD_TYPE_MAP).includes(leadType)) {
    return notFound();
  }

  const validLeadID = Number(leadID);
  if (isNaN(validLeadID)) {
    return notFound();
  }
  const validLeadType = leadType as LeadType;

  return <LeadDetailsView leadType={validLeadType} leadID={validLeadID} />;
}
