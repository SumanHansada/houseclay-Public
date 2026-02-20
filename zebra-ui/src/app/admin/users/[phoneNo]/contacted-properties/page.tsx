import { Metadata } from "next";

import { safeUrlDecode } from "@/utils/core";

import { ContactedPropertiesView } from "./ContactedPropertiesView";

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contacted Properties | User Management",
  };
}

export default async function ContactedPropertiesPage({ params }: PageProps) {
  const { phoneNo } = await params;
  const decodedPhone = safeUrlDecode(phoneNo);

  return <ContactedPropertiesView userPhoneNo={decodedPhone} />;
}
