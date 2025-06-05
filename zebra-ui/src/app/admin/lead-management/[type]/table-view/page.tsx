import { use } from "react";
import { LeadType } from "@/interfaces/Lead";
import { LeadTableView } from "../../components/LeadTableView";

interface TParams {
  params: Promise<{ type: LeadType }>;
}

export default function TableViewPage({ params }: TParams) {
  const { type } = use(params);
  return <LeadTableView leadType={type} />;
}
