"use client";

import { redirect, useParams } from "next/navigation";
import { LeadType } from "../components/Types";

export const dynamicParams = true;

export default function LeadManagementTypeRootPage() {
  const params = useParams();
  const type = params?.type as LeadType;
  redirect(`/admin/lead-management/${type}/table-view`);
}
