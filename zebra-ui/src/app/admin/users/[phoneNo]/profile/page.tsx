import { Metadata } from "next";

import { safeUrlDecode } from "@/utils/core";

import { ProfileView } from "./ProfileView";

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Profile Details | User Management",
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { phoneNo } = await params;
  const decodedPhone = safeUrlDecode(phoneNo);

  return <ProfileView userPhoneNo={decodedPhone} />;
}
