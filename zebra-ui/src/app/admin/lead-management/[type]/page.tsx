import { redirect } from "next/navigation";
import { LeadType } from "@/interfaces/Lead";
import { use } from "react";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ type: LeadType }>;
}

export default function LeadManagementTypeRootPage({ params }: TParams) {
  const { type } = use(params);
  redirect(`/admin/lead-management/${type}/table-view`);
}
