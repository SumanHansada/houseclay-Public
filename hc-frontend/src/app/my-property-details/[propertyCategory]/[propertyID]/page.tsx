import { PropertyCategory } from "@/common/enums";

import { MyPropertyDetailsClient } from "./MyPropertyDetailsClient";

export const fetchCache = "force-no-store";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

// Server Component
async function MyPropertyDetails({
  params,
}: {
  params: Promise<{ propertyCategory: string; propertyID: string }>;
}) {
  // Await the params before using them
  const { propertyCategory, propertyID } = await params;

  return (
    <MyPropertyDetailsClient
      propertyCategory={propertyCategory}
      propertyID={propertyID}
    />
  );
}

export default MyPropertyDetails;
