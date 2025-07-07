import { PropertyCategoryEnum } from "@/common/enums";

import PropertyDetailsClient from "./PropertyDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategoryEnum.RENT.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.FLATMATE.toLowerCase() },
  ];
}

export default function PropertyDetailsPage() {
  return <PropertyDetailsClient />;
}
