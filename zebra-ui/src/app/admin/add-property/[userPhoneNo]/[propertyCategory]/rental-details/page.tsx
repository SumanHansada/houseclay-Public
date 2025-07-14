import { PropertyCategoryEnum } from "@/common/enums";

import RentalDetailsClient from "./RentalDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategoryEnum.RENT.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.FLATMATE.toLowerCase() },
  ];
}

export default function RentalDetailsPage() {
  return <RentalDetailsClient />;
}
