import { PropertyCategory } from "@/common/enums";

import RentalDetailsClient from "./RentalDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

export default function RentalDetailsPage() {
  return <RentalDetailsClient />;
}
