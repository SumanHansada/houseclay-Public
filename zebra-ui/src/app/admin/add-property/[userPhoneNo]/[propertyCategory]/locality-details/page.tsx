import { Suspense } from "react";

import LocalityDetailsLoading from "./loading";
import LocalityDetailsClient from "./LocalityDetailsClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

// Error boundary component
function LocalityDetailsErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function LocalityDetailsPage() {
  return (
    <LocalityDetailsErrorBoundary>
      <Suspense fallback={<LocalityDetailsLoading />}>
        <LocalityDetailsClient />
      </Suspense>
    </LocalityDetailsErrorBoundary>
  );
}
