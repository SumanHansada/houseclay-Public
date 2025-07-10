import { redirect } from "next/navigation";

import { PropertyCategory } from "@/common/enums";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

export default async function PropertyCategoryRootPage({
  params,
}: {
  params: { propertyCategory: string };
}) {
  const { propertyCategory } = await params;
  redirect(`/list-property/${propertyCategory}/property-details`);
}
