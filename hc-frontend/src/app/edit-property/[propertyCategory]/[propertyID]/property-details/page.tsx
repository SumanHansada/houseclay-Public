import { Suspense } from "react";

import { PropertyDetailsStepLoading } from "@/components/loading";

import PropertyDetailsClient from "./PropertyDetailsClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

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
      <Suspense fallback={<PropertyDetailsStepLoading />}>
        <PropertyDetailsClient />
      </Suspense>
    </PropertyDetailsErrorBoundary>
  );
}
