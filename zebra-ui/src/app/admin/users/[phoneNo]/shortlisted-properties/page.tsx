import { Metadata } from "next";

import { safeUrlDecode } from "@/utils/core";

import { ShortlistedPropertiesView } from "./ShortlistedPropertiesView";

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shortlisted Properties | User Management",
  };
}

export default async function ShortlistedPropertiesPage({ params }: PageProps) {
  const { phoneNo } = await params;
  const decodedPhone = safeUrlDecode(phoneNo);

  return <ShortlistedPropertiesView userPhoneNo={decodedPhone} />;
}
