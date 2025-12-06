import { PropertyCategory } from "@/common/enums";

import ListPropertyCategoryRedirect from "./ListPropertyCategoryRedirect";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

// Server Component
async function ListPropertyCategoryRootPage({
  params,
}: {
  params: Promise<{ propertyCategory: string }>;
}) {
  const { propertyCategory } = await params;

  return <ListPropertyCategoryRedirect propertyCategory={propertyCategory} />;
}

export default ListPropertyCategoryRootPage;
