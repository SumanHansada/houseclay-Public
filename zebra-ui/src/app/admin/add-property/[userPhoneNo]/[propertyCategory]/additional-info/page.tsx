import { PropertyCategoryEnum } from "@/common/enums";

import AdditionalInfoClient from "./AdditionalInfoClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategoryEnum.RENT.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.FLATMATE.toLowerCase() },
  ];
}

export default function AdditionalInfoPage() {
  return <AdditionalInfoClient />;
}
