import ResaleDetailsClient from "./ResaleDetailsClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

export default function ResaleDetailsPage() {
  return <ResaleDetailsClient />;
}
