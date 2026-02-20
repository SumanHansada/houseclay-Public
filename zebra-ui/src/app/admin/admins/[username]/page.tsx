import { Metadata } from "next";

import { AdminProfileView } from "./AdminProfileView";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Profile Details | Admin Management",
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  return <AdminProfileView adminUsername={username} />;
}
