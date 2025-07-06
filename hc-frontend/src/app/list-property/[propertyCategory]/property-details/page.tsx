import { PropertyCategory } from "@/common/enums";

import PropertyDetailsClient from "./PropertyDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

export default function PropertyDetailsPage() {
  return <PropertyDetailsClient />;
}
