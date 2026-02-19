import { redirect } from "next/navigation";
import { use } from "react";

import { PropertyCategory, VerifyPropertyTabEnum } from "@/common/enums";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ propertyID: string; propertyCategory: string }>;
}

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

export default function VerifyPropertyRedirectPage({ params }: TParams) {
  const { propertyID, propertyCategory } = use(params);
  redirect(
    `/admin/property-details/${propertyCategory}/verify/${propertyID}/${VerifyPropertyTabEnum.DETAILS}`,
  );
}
