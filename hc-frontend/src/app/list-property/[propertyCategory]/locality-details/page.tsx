import LocalityDetailsClient from "./LocalityDetailsClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

export default function LocalityDetailsPage() {
  return <LocalityDetailsClient />;
}
