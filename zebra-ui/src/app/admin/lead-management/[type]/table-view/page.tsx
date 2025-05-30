import { LeadTableView } from "../../components/LeadTableView";
import { LeadType, TLead } from "@/common/Types";

import { default as LeadData } from "@/data/dummyData.json";

export default async function TableViewPage({
  params,
}: {
  params: { type: LeadType };
}) {
  const leads: TLead[] = LeadData;
  const leadType = params.type as LeadType;

  return <LeadTableView leads={leads} leadType={leadType} />;
}
