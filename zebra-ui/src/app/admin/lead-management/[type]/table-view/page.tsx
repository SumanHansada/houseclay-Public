import { LeadType } from "@/interfaces/Lead";
import { LeadTableView } from "../../components/LeadTableView";
import { use } from "react";

interface TParams {
  params: Promise<{ type: LeadType }>;
}

export default function TableViewPage({ params }: TParams) {
  const { type } = use(params);
  return <LeadTableView leadType={type} />;
}
