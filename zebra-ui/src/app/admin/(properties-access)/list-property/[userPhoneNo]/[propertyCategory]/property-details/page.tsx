import { Suspense } from "react";

import PropertyDetailsLoading from "./loading";
import PropertyDetailsClient from "./PropertyDetailsClient";

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

// Error boundary component
function PropertyDetailsErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function PropertyDetailsPage() {
  return (
    <PropertyDetailsErrorBoundary>
      <Suspense fallback={<PropertyDetailsLoading />}>
        <PropertyDetailsClient />
      </Suspense>
    </PropertyDetailsErrorBoundary>
  );
}
