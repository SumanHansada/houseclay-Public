import { Metadata } from "next";

import { safeUrlDecode } from "@/utils/core";

import { OwnedPropertiesView } from "./OwnedPropertiesView";

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Owned Properties | User Management",
  };
}

export default async function OwnedPropertiesPage({ params }: PageProps) {
  const { phoneNo } = await params;
  const decodedPhone = safeUrlDecode(phoneNo);

  return <OwnedPropertiesView userPhoneNo={decodedPhone} />;
}
