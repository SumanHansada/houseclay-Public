import { redirect } from "next/navigation";

import { PropertyCategory } from "@/common/enums";

interface AddPropertyRootPageProps {
  params: Promise<{ userPhoneNo: string; propertyCategory: string }>;
}

export default async function AddPropertyRootPage({
  params,
}: AddPropertyRootPageProps) {
  const { propertyCategory, userPhoneNo } = await params;
  const category = propertyCategory.toUpperCase();

  if (
    category &&
    Object.values(PropertyCategory).includes(category as PropertyCategory)
  ) {
    redirect(`/admin/add-property/${userPhoneNo}/${category}/property-details`);
  } else {
    redirect("/");
  }
}
