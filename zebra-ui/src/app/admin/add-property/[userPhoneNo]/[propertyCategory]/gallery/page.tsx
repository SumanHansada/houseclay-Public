import { PropertyCategoryEnum } from "@/common/enums";

import GalleryClient from "./GalleryClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategoryEnum.RENT.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategoryEnum.FLATMATE.toLowerCase() },
  ];
}

export default function GalleryPage() {
  return <GalleryClient />;
}
