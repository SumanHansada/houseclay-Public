"use client";

import { redirect, useParams } from "next/navigation";

import { PropertyCategory } from "@/common/enums";
import { PropertyDetailsTabEnum } from "@/common/enums";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const dynamicParams = true;

export default function PropertyDetailsRedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const propertyCategory = (params.propertyCategory as string).toUpperCase();
    const propertyID = params.propertyID as string;
    console.log("propertyCategory", propertyCategory);
    console.log("propertyID", propertyID);

    if (
      propertyCategory &&
      Object.values(PropertyCategory).includes(
        propertyCategory as PropertyCategory,
      ) &&
      propertyID
    ) {
      router.replace(
        `/admin/property-details/${propertyCategory}/${propertyID}/${PropertyDetailsTabEnum.DETAILS}`,
      );
    } else {
      router.replace("/admin/dashboard");
    }
  }, [params.propertyCategory, params.propertyID, router]);
}
