import { redirect } from "next/navigation";
import { use } from "react";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ userPhoneNo: string; type: string }>;
}

export default function AddPropertyTypeRootPage({ params }: TParams) {
  const { type, userPhoneNo } = use(params);
  redirect(`/admin/add-property/${userPhoneNo}/${type}/property-details`);
}
