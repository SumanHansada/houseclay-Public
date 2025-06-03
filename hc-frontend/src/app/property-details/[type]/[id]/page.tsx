import { ServerAPIService } from "@/services/serverAPIService";

import { PropertyDetailsClient } from "./PropertyDetailsClient";

// Server Component
async function PropertyDetails({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  // Await the params before using them
  const { type, id } = await params;

  try {
    const propertyData = await ServerAPIService.getPropertyById(id);
    return (
      <PropertyDetailsClient type={type} id={id} initialData={propertyData} />
    );
  } catch (error) {
    throw new Error("Failed to fetch property data", { cause: error });
  }
}

export default PropertyDetails;
