import { Metadata } from "next";

import { VerificationDetailsView } from "./VerificationDetailsView";

interface PageProps {
  params: Promise<{ propertyID: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { propertyID } = await params;
  return { title: `Property Verify - ${propertyID}` };
}

export default async function VerificationDetailsPage({ params }: PageProps) {
  const { propertyID } = await params;

  return <VerificationDetailsView propertyID={propertyID} />;
}
