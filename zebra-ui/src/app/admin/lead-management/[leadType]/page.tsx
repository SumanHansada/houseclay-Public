import { redirect } from "next/navigation";
import { use } from "react";

import { LeadType } from "@/interfaces/Lead";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ leadType: LeadType }>;
}

export default function LeadManagementTypeRootPage({ params }: TParams) {
  const { leadType } = use(params);
  redirect(`/admin/lead-management/${leadType}/table-view`);
}
