import { PropertyCategory } from "@/common/enums";

import AdditionalInfoClient from "./AdditionalInfoClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

export default function AdditionalInfoPage() {
  return <AdditionalInfoClient />;
}
