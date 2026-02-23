import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LEAD_TYPE_MAP, LeadType } from "@/interfaces/Lead";

import { LeadsTableView } from "./LeadsTableView";

interface PageProps {
  params: Promise<{
    leadType: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(LEAD_TYPE_MAP).map((key) => ({
    leadType: key,
  }));
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

export default async function LeadsPage({ params, searchParams }: PageProps) {
  const { leadType } = await params;
  const { page } = await searchParams;

  if (!Object.keys(LEAD_TYPE_MAP).includes(leadType)) {
    return notFound();
  }
  const validLeadType = leadType as LeadType;

  const parsedPage = Number(page);

  if (page !== undefined && (isNaN(parsedPage) || parsedPage < 1)) {
    redirect(`/admin/leads/${validLeadType}?page=1`);
  }

  const currentPage = parsedPage || 1;

  return <LeadsTableView leadType={validLeadType} currentPage={currentPage} />;
}
