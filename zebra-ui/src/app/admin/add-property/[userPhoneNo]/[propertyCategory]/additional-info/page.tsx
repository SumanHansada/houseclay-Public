import { Suspense } from "react";

import AdditionalInfoClient from "./AdditionalInfoClient";
import AdditionalInfoLoading from "./loading";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

// Error boundary component
function AdditionalInfoErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function AdditionalInfoPage() {
  return (
    <AdditionalInfoErrorBoundary>
      <Suspense fallback={<AdditionalInfoLoading />}>
        <AdditionalInfoClient />
      </Suspense>
    </AdditionalInfoErrorBoundary>
  );
}
