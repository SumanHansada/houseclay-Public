"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { PropertyCategory } from "@/common/enums";

import PropertyCategoryLoading from "./loading";

export default function PropertyCategoryRootPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const propertyCategory = (params.propertyCategory as string).toUpperCase();
    console.log("propertyCategory", propertyCategory);
    // Validate property category
    if (
      propertyCategory &&
      Object.values(PropertyCategory).includes(
        propertyCategory as PropertyCategory,
      )
    ) {
      router.replace(`/list-property/${propertyCategory}/property-details`);
    } else {
      // Redirect to home if invalid category
      router.replace("/");
    }
  }, [params.propertyCategory, router]);

  // Show loading while redirecting
  return <PropertyCategoryLoading />;
}
