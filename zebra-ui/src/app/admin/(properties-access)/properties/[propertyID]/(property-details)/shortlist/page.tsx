import { Metadata } from "next";

import { ShortlistedUsersView } from "./ShortlistedUsersView";

interface PageProps {
  params: Promise<{ propertyID: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shortlisted Users | Property Management",
  };
}

export default async function ShortlistedUsersPage({ params }: PageProps) {
  const { propertyID } = await params;

  return <ShortlistedUsersView propertyID={propertyID} />;
}
