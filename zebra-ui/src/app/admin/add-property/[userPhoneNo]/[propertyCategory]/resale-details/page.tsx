import { Suspense } from "react";

import ResaleDetailsLoading from "./loading";
import ResaleDetailsClient from "./ResaleDetailsClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

// Error boundary component
function ResaleDetailsErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function ResaleDetailsPage() {
  return (
    <ResaleDetailsErrorBoundary>
      <Suspense fallback={<ResaleDetailsLoading />}>
        <ResaleDetailsClient />
      </Suspense>
    </ResaleDetailsErrorBoundary>
  );
}
