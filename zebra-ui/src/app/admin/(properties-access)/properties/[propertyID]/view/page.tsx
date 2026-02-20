import { Metadata } from "next";

import { ViewedUsersView } from "./ViewedUsersView";

interface PageProps {
  params: Promise<{ propertyID: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Viewed Users | Property Management",
  };
}

export default async function ViewedUsersPage({ params }: PageProps) {
  const { propertyID } = await params;

  return <ViewedUsersView propertyID={propertyID} />;
}
