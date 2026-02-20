import { Metadata } from "next";

import { VerificationDetailsView } from "./VerificationDetailsView";

interface PageProps {
  params: Promise<{ status: string; propertyID: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { propertyID, status } = await params;
  return { title: `Property ${status} - ${propertyID}` };
}

export default async function VerificationDetailsPage({ params }: PageProps) {
  const { propertyID, status } = await params;

  return <VerificationDetailsView propertyID={propertyID} status={status} />;
}
