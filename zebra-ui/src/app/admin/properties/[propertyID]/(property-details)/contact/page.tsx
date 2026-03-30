import { Metadata } from "next";

import { ContactedUsersView } from "./ContactedUsersView";

interface PageProps {
  params: Promise<{ propertyID: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contacted Users | Property Management",
  };
}

export default async function ContactedUsersPage({ params }: PageProps) {
  const { propertyID } = await params;

  return <ContactedUsersView propertyID={propertyID} />;
}
