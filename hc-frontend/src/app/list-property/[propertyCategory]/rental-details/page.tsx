import RentalDetailsWrapper from "./RentalDetailsWrapper";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

export default function RentalDetailsPage() {
  return <RentalDetailsWrapper />;
}
