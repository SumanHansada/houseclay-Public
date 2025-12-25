import { MyPropertyDetailsClient } from "./MyPropertyDetailsClient";

// Cache the page for 1 hour (3600 seconds)
// This enables ISR: first request generates the page, subsequent requests use cache
// The page will be cached per propertyCategory + propertyID combination
export const revalidate = 3600;

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
