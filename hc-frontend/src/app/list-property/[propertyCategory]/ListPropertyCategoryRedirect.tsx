"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PropertyCategory } from "@/common/enums";

import PropertyCategoryLoading from "./loading";

export default function ListPropertyCategoryRedirect({
  propertyCategory,
}: {
  propertyCategory: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const categoryUpper = propertyCategory.toUpperCase();
    // Validate property category
    if (
      categoryUpper &&
      Object.values(PropertyCategory).includes(
        categoryUpper as PropertyCategory,
      )
    ) {
      router.replace(
        `/list-property/${propertyCategory.toLowerCase()}/property-details`,
      );
    } else {
      // Redirect to home if invalid category
      router.replace("/");
    }
  }, [propertyCategory, router]);

  // Show loading while redirecting
  return <PropertyCategoryLoading />;
}
