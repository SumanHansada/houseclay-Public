"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { PropertyCategory } from "@/common/enums";

import { default as PropertyFormSetupLoading } from "./PropertyFormSetupLoading";

export default function EditPropertyCategoryRootPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const propertyCategory = (params.propertyCategory as string).toUpperCase();
    const propertyID = params.propertyID as string;
    console.log("propertyCategory", propertyCategory);
    console.log("propertyID", propertyID);
    // Validate property category
    if (
      propertyCategory &&
      Object.values(PropertyCategory).includes(
        propertyCategory as PropertyCategory,
      ) &&
      propertyID
    ) {
      router.replace(
        `/edit-property/${propertyCategory.toLowerCase()}/${propertyID}/property-details`,
      );
    } else {
      // Redirect to home if invalid category or missing propertyID
      router.replace("/");
    }
  }, [params.propertyCategory, params.propertyID, router]);

  // Show loading while redirecting
  return <PropertyFormSetupLoading />;
}
