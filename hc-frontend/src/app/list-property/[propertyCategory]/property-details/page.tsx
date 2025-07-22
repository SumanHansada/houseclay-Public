import PropertyDetailsClient from "./PropertyDetailsClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

export default function PropertyDetailsPage() {
  return <PropertyDetailsClient />;
}
