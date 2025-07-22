import AdditionalInfoClient from "./AdditionalInfoClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

export default function AdditionalInfoPage() {
  return <AdditionalInfoClient />;
}
