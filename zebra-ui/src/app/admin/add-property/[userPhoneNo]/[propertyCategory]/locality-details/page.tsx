import { PropertyCategoryEnum } from "@/common/enums";

import LocalityDetailsClient from "./LocalityDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategoryEnum.RENT.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.FLATMATE.toLowerCase() },
  ];
}

export default function LocalityDetailsPage() {
  return <LocalityDetailsClient />;
}
