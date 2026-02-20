import { Metadata } from "next";

import { ReportUsersView } from "./ReportUsersView";

interface PageProps {
  params: Promise<{ propertyID: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contacted Users | Property Management",
  };
}

export default async function ReportUsersPage({ params }: PageProps) {
  const { propertyID } = await params;

  return <ReportUsersView propertyID={propertyID} />;
}
