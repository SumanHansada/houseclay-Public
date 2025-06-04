"use client";

import { LeadType } from "@/interfaces/Lead";
import { redirect, useParams } from "next/navigation";

export const dynamicParams = true;

export default function LeadManagementTypeRootPage() {
  const params = useParams();
  const type = params?.type as LeadType;
  redirect(`/admin/lead-management/${type}/table-view`);
}
