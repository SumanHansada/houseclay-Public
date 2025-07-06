import { PropertyCategory } from "@/common/enums";

import GalleryClient from "./GalleryClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

export default function GalleryPage() {
  return <GalleryClient />;
}
