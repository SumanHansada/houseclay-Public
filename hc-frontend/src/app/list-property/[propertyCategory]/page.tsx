import { redirect } from "next/navigation";

import { PropertyCategory } from "@/common/enums";

interface PropertyCategoryRootPageProps {
  params: Promise<{ propertyCategory: string }>;
}

export default async function PropertyCategoryRootPage({
  params,
}: PropertyCategoryRootPageProps) {
  const { propertyCategory } = await params;
  const category = propertyCategory.toUpperCase();

  // Validate property category
  if (
    category &&
    Object.values(PropertyCategory).includes(category as PropertyCategory)
  ) {
    redirect(`/list-property/${category.toLowerCase()}/property-details`);
  } else {
    // Redirect to home if invalid category
    redirect("/");
  }
}
