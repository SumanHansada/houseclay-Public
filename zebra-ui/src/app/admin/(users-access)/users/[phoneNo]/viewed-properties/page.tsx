import { Metadata } from "next";

import { safeUrlDecode } from "@/utils/core";

import { ViewedPropertiesView } from "./ViewedPropertiesView";

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Viewed Properties | User Management",
  };
}

export default async function ViewedPropertiesPage({ params }: PageProps) {
  const { phoneNo } = await params;
  const decodedPhone = safeUrlDecode(phoneNo);

  return <ViewedPropertiesView userPhoneNo={decodedPhone} />;
}
