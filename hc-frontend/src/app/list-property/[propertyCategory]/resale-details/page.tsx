import { PropertyCategory } from "@/common/enums";

import ResaleDetailsClient from "./ResaleDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

export default function ResaleDetailsPage() {
  return <ResaleDetailsClient />;
}
