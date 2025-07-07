import { PropertyCategoryEnum } from "@/common/enums";
import { redirect } from "next/navigation";
import { use } from "react";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ userPhoneNo: string; propertyCategory: string }>;
}

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategoryEnum.RENT.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.FLATMATE.toLowerCase() },
  ];
}

export default function AddPropertyTypeRootPage({ params }: TParams) {
  const { propertyCategory, userPhoneNo } = use(params);
  console.log(propertyCategory);
  redirect(
    `/admin/add-property/${userPhoneNo}/${propertyCategory}/property-details`,
  );
}
