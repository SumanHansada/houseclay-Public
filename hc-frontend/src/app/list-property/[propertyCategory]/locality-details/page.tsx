import { PropertyCategory } from "@/common/enums";

import LocalityDetailsClient from "./LocalityDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

export default function LocalityDetailsPage() {
  return <LocalityDetailsClient />;
}
