import { Metadata } from "next";

import { safeUrlDecode } from "@/utils/core";

import { ReportedPropertiesView } from "./ReportedPropertiesView";

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Reported Properties | User Management",
  };
}

export default async function ReportedPropertiesPage({ params }: PageProps) {
  const { phoneNo } = await params;
  const decodedPhone = safeUrlDecode(phoneNo);

  return <ReportedPropertiesView userPhoneNo={decodedPhone} />;
}
