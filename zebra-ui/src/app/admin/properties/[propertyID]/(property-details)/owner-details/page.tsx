import { Metadata } from "next";

import { OwnerDetailsView } from "./OwnerDetailsView";

interface PageProps {
  params: Promise<{ propertyID: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Owner Details | Property Management",
  };
}

export default async function OwnerDetailsPage({ params }: PageProps) {
  const { propertyID } = await params;

  return <OwnerDetailsView propertyID={propertyID} />;
}
