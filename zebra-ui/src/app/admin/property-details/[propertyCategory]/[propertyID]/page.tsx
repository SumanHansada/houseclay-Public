import { PropertyCategoryEnum } from "@/common/enums";
import { redirect } from "next/navigation";
import { use } from "react";

import { PropertyDetailsTabEnum } from "@/common/enums";

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

export default function PropertyDetailsRedirectPage({ params }: TParams) {
  const { propertyID, propertyCategory } = use(params);
  redirect(
    `/admin/property-details/${propertyCategory}/${propertyID}/${PropertyDetailsTabEnum.DETAILS}`,
  );
}
