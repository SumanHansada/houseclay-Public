"use client";

import { redirect, useParams } from "next/navigation";

export default function ListPropertyTypeRootPage() {
  const params = useParams();
  const type = params?.type as string; // Optional: add type assertion
  redirect(`/list-property/${type}/property-details`);
}
