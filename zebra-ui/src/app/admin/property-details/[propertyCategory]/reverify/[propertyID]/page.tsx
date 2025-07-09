import { redirect } from "next/navigation";
import { use } from "react";

import { PropertyCategoryEnum, ReverifyPropertyTabEnum } from "@/common/enums";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ propertyID: string; propertyCategory: string }>;
}

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategoryEnum.RENT.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.FLATMATE.toLowerCase() },
  ];
}

export default function VerifyPropertyRedirectPage({ params }: TParams) {
  const { propertyID, propertyCategory } = use(params);
  redirect(
    `/admin/property-details/${propertyCategory}/reverify/${propertyID}/${ReverifyPropertyTabEnum.DETAILS}`,
  );
}
