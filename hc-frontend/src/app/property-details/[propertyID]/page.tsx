import { ServerAPIService } from "@/services/serverAPIService";

import { PropertyDetailsClient } from "./PropertyDetailsClient";

// Server Component
async function PropertyDetails({
  params,
}: {
  params: Promise<{ propertyID: string }>;
}) {
  // Await the params before using them
  const { propertyID } = await params;

  try {
    const propertyData =
      await ServerAPIService.getPublicPropertyByID(propertyID);
    console.log("Property Data", propertyData);
    return (
      <PropertyDetailsClient
        propertyID={propertyID}
        initialData={propertyData}
      />
    );
  } catch (error) {
    throw new Error("Failed to fetch property data", { cause: error });
  }
}

export default PropertyDetails;
