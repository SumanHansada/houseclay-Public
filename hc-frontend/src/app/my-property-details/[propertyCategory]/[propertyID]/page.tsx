import { PropertyCategory } from "@/common/enums";
import { ServerAPIService } from "@/services/serverAPIService";

import { MyPropertyDetailsClient } from "./MyPropertyDetailsClient";

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

  try {
    const propertyData = await ServerAPIService.getPropertyByID(propertyID);
    return (
      <MyPropertyDetailsClient
        propertyCategory={propertyCategory}
        propertyID={propertyID}
        initialData={propertyData}
      />
    );
  } catch (error) {
    throw new Error("Failed to fetch property data", { cause: error });
  }
}

export default MyPropertyDetails;
