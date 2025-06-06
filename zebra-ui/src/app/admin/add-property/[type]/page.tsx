"use client";

import { redirect, useParams } from "next/navigation";

export const dynamicParams = true;

export default function AddPropertyTypeRootPage() {
  const params = useParams();
  const type = params?.type as string; // Optional: add type assertion
  redirect(`/admin/add-property/${type}/property-details`);
}
