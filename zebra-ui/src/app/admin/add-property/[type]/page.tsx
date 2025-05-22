"use client";

import { redirect, useParams } from "next/navigation";

export const dynamicParams = true;

export default function ListPropertyTypeRootPage() {
  const params = useParams();
  const type = params?.type as string; // Optional: add type assertion
  redirect(`/add-property/${type}/property-details`);
}
