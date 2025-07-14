import { PropertyCategoryEnum } from "@/common/enums";

import ResaleDetailsClient from "./ResaleDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategoryEnum.RENT.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.FLATMATE.toLowerCase() },
  ];
}

export default function ResaleDetailsPage() {
  return <ResaleDetailsClient />;
}
