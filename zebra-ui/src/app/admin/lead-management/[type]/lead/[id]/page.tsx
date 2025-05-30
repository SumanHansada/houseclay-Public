"use client";
import { useParams } from "next/navigation";

export const dynamicParams = true;

export default function LeadManagementIdRootPage() {
  const params = useParams();
  const id = params?.id as string;
  return <div>Lead Management Page: Lead ID - {id}</div>;
}
