import { Metadata } from "next";

import { DetailsView } from "./DetailsView";

interface PageProps {
  params: Promise<{ propertyID: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Property Details | Property Management",
  };
}

export default async function DetailsPage({ params }: PageProps) {
  const { propertyID } = await params;

  return <DetailsView propertyID={propertyID} />;
}
