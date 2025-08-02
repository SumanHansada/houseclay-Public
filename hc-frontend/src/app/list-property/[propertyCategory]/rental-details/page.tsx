import { Suspense } from "react";

import RentalDetailsLoading from "./loading";
import RentalDetailsWrapper from "./RentalDetailsWrapper";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

// Error boundary component
function RentalDetailsErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function RentalDetailsPage() {
  return (
    <RentalDetailsErrorBoundary>
      <Suspense fallback={<RentalDetailsLoading />}>
        <RentalDetailsWrapper />
      </Suspense>
    </RentalDetailsErrorBoundary>
  );
}
